import { SubmitHandler, useForm } from "react-hook-form";
import { IRecordForm } from "../../../types/med";
import styles from "../Record.module.css";
import cn from "clsx";
import { useDiagnosis } from "../../../hooks/doctor/useDiagnosis";
import { Loader } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useCreateRecord } from "../hooks/useCreateRecord";

interface IProps {
  app?: number;
  patient?: number;
}

export const Form = ({ app, patient }: IProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRecordForm>({
    mode: "onChange",
  });

  const { diagnosis, isLoading } = useDiagnosis();

  const { create, isPending } = useCreateRecord(navigate);

  if (!diagnosis || isLoading || !patient || !app)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size={20} color="black" />
      </div>
    );

  const onSubmit: SubmitHandler<IRecordForm> = (data) =>
    create({ ...data, patient_id: patient, app_id: app });

  return (
    <form
      className={cn(styles.info_card, styles.base, styles.form)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>New medical record</h1>
      <label htmlFor="diagnosis">Medication</label>
      <select
        id="diagnosis"
        {...register("diagnosis_id", {
          validate: (x) => x > 0 || "Choose the diagnosis!",
        })}
        defaultValue={-1}
      >
        <option value={-1}>
          --- Choose possible diagnosis or 'Observation' ---
        </option>
        {diagnosis.map((d, idx) => (
          <option key={idx} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      {errors?.diagnosis_id?.type == "validate" && (
        <span>{errors?.diagnosis_id?.message}</span>
      )}
      <label htmlFor="recomendations">Recomendations for patient:</label>
      <textarea
        id="description"
        autoComplete="off"
        placeholder="Recomendations for patient..."
        {...register("recomendations", {
          required: "Recomendations are required requred!",
        })}
        style={errors?.recomendations ? { border: "1px solid red" } : {}}
      />
      {errors?.recomendations?.type === "required" && (
        <span>{errors?.recomendations?.message}</span>
      )}
      <Button className="w-1/2 mx-auto" type="submit" disabled={isPending}>
        Save Medical Record
      </Button>
    </form>
  );
};
