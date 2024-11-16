import { useForm, SubmitHandler } from "react-hook-form";
import { IAppointmentForm } from "../../../types/appointment";
import styles from "../Appointment.module.css";
import { Button } from "../../../components/ui/Button";
import { checkScheduleDate } from "../../../utils/schedule";
import { ISchedule } from "../../../types/schedule";
import { useAppointmentAction } from "../hooks/useAppointmentAction";
import cn from "clsx";

interface IProps {
  initialData?: IAppointmentForm;
  schedules?: ISchedule[];
}

export const Form = ({ initialData, schedules }: IProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAppointmentForm>({
    mode: "onChange",
    defaultValues: initialData,
  });

  const { action, isPending } = useAppointmentAction(initialData?.id);

  const onSubmit: SubmitHandler<IAppointmentForm> = (data) => action(data);

  return (
    <form className={cn(styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <h1>Appointment Form</h1>
      <label htmlFor="complaints">Complaints:</label>
      <textarea
        id="complaints"
        autoComplete="off"
        placeholder="Complaints"
        {...register("complaints", {
          required: "Complaints text is requred!",
        })}
        style={errors?.complaints ? { border: "1px solid red" } : {}}
      />
      {errors?.complaints?.type === "required" && (
        <span>{errors.complaints.message}</span>
      )}
      <label htmlFor="app-date">Appointment Date:</label>
      <input
        id="app-date"
        style={errors?.date ? { border: "1px solid red" } : {}}
        type="datetime-local"
        placeholder="Appointment Date"
        autoComplete="off"
        {...register("date", {
          required: "Appointment Date is required!",
          validate: (value) => checkScheduleDate(value, schedules),
        })}
      />
      {errors?.date?.type === "required" && <span>{errors.date.message}</span>}
      {errors?.date?.type === "validate" && <span>{errors.date.message}</span>}
      <Button className="mt-4 w-1/3 mx-auto" type="submit" disabled={isPending}>
        {initialData?.id ? "Update" : "Create"}
      </Button>
    </form>
  );
};
