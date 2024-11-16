import { config } from "../../../config/config";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import styles from "../Doctor.module.css";
import cn from "clsx";
import { Loader } from "../../../components/ui/Loader";
import { IDoctorUpdate } from "../../../types/doctor";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { useInitialData } from "../hooks/useInitialData";
import { useUpdateDoctor } from "../hooks/useUpdateDoctor";
import { IFormProps } from "./type";

export const UpdateForm = ({ quals, specs }: IFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IDoctorUpdate>({
    mode: "onChange",
  });
  const [id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.DOC_ID,
  });
  const { isLoading } = useInitialData(id, reset);
  const { mutate, isPending } = useUpdateDoctor(id);

  const onSubmit: SubmitHandler<IDoctorUpdate> = (data) => mutate(data);
  return isLoading || !quals || !specs ? (
    <Loader size={30} color="black" />
  ) : (
    <form
      className={cn(styles.form, styles.upd_form, "mt-[10%]")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Update Doctor</h1>
      <label>Doctor qualification:</label>
      <select
        {...register("qualification_id", {
          validate: (x) => x > 0 || "Choose the qualification category!",
        })}
        defaultValue={-1}
      >
        <option value={-1}>--- Choose the qualification ---</option>
        {quals.map((q, idx) => (
          <option key={idx} value={q.id} className="capitalize">
            {q.q_name} category
          </option>
        ))}
      </select>
      {errors?.qualification_id?.type === "validate" && (
        <span>{errors?.qualification_id?.message}</span>
      )}
      <label>Doctor specialization:</label>
      <select
        {...register("specialization_id", {
          validate: (x) => x > 0 || "Choose the specialization!",
        })}
        defaultValue={-1}
      >
        <option value={-1}>--- Choose the specialization ---</option>
        {specs.map((s, idx) => (
          <option key={idx} value={s.id}>
            {s.spec_name}
          </option>
        ))}
      </select>
      {errors?.specialization_id?.type === "validate" && (
        <span>{errors?.specialization_id?.message}</span>
      )}
      <Button className="mx-auto w-1/2 mt-2" type="submit" disabled={isPending}>
        Save
      </Button>
    </form>
  );
};
