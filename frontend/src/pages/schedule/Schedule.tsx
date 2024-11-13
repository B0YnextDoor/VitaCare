import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/config";
import { PAGES } from "../../config/urls";
import { useProfile } from "../../hooks/user/useProfile";
import { useDoctorSchedule } from "../../hooks/doctor/useDoctorSchedule";
import { Loader } from "lucide-react";
import styles from "./Schedule.module.css";
import { ScheduleList } from "./widgets/ScheduleList";
import { useSkipPatterns } from "./hooks/useSkipPatterns";
import { IScheduleForm } from "../../types/schedule";
import { SubmitHandler, useForm } from "react-hook-form";
import { useInitialData } from "./hooks/useInitialData";
import { workDays } from "../../utils/schedule";
import { Input } from "../../components/ui/Input";
import { validateWorkDay } from "../../utils/validators";
import { Button } from "../../components/ui/Button";

export const Schedule = () => {
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<IScheduleForm>({
    mode: "onChange",
  });
  const { role } = useProfile();
  useEffect(() => {
    if (role && role != ROLES.ADMIN) navigate(PAGES.HOME);
  }, [role]);
  const { isUpdate, action, isPending } = useInitialData(reset);
  const { data, isLoading } = useDoctorSchedule(undefined, true);
  const patterns = useSkipPatterns(data, isUpdate);
  const onSubmit: SubmitHandler<IScheduleForm> = (data) => {
    const checkError = validateWorkDay(data.start_time, data.end_time);
    if (checkError) setError("root", { message: checkError });
    else action(data);
  };
  return (
    <div className={styles.sch_form_page}>
      {isLoading || !data || !patterns ? (
        <Loader size={30} color="black" />
      ) : (
        <div className="w-full grid grid-cols-2 gap-3">
          <ScheduleList schedules={data} />
          <div>
            <h1>{isUpdate ? "Update" : "Add"} doctor schedule</h1>
            <form className={styles.sch_form} onSubmit={handleSubmit(onSubmit)}>
              <label>Work days:</label>
              <select
                {...register("pattern", {
                  validate: (x) => x > 0 || "Choose work days!",
                })}
                value={watch("pattern") ?? -1}
              >
                <option value={-1}>--- Choose work days ---</option>
                {patterns.map((p, idx) => (
                  <option key={idx} value={p.id}>
                    {workDays(p.pattern)}
                  </option>
                ))}
              </select>
              {errors?.pattern?.type == "validate" && (
                <span>{errors?.pattern?.message}</span>
              )}
              <Input
                id="start_time"
                label="Start time"
                placeholder="Work day starts at..."
                type="time"
                extra="mb-2"
                isError={!!errors?.start_time}
                {...register("start_time", {
                  required: "Start time is required!",
                  validate: (x) => {
                    const time = x.split(":");
                    if (+time[0] < 7) return "Work day begins after 7 AM!";
                    if (![0, 30].includes(+time[1]))
                      return "Work day must begin at hh:00 or hh:30!";
                    return true;
                  },
                })}
              />
              {errors?.start_time?.type === "required" && (
                <span>{errors?.start_time?.message}</span>
              )}
              {errors?.start_time?.type === "validate" && (
                <span>{errors?.start_time?.message}</span>
              )}
              <Input
                id="end_time"
                label="End time"
                placeholder="Work day ends at..."
                type="time"
                extra="mb-2"
                isError={!!errors?.end_time}
                {...register("end_time", {
                  required: "End time is required!",
                  validate: (x) => {
                    const time = x.split(":");
                    if (+time[0] > 22) return "Work day ends after 10 PM!";
                    if (![0, 30].includes(+time[1]))
                      return "Work day must end at hh:00 or hh:30!";
                    return true;
                  },
                })}
              />
              {errors?.end_time?.type === "required" && (
                <span>{errors?.end_time?.message}</span>
              )}
              {errors?.end_time?.type === "validate" && (
                <span>{errors?.end_time?.message}</span>
              )}
              {errors.root?.message && <span>{errors.root?.message}</span>}
              <Button
                className="w-1/2 mx-auto mt-2"
                type="submit"
                disabled={isPending}
              >
                {isUpdate ? "Save" : "Add"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
