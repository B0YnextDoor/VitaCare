import { SubmitHandler, useForm } from "react-hook-form";
import { IPrescriptionForm } from "../../../types/med";
import styles from "../Prescription.module.css";
import cn from "clsx";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useMedications } from "../../../hooks/doctor/useMedications";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";
import { useCreatePrecription } from "../hooks/useCreatePrescription";

export const Form = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPrescriptionForm>({
    mode: "onChange",
  });

  const { medications, isLoading } = useMedications();

  const { create, isPending } = useCreatePrecription(reset);

  const onSubmit: SubmitHandler<IPrescriptionForm> = (data) => {
    create(data);
  };

  if (isLoading || !medications)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size={20} color="black" />
      </div>
    );

  return (
    <div className={cn(styles.info_card, styles.base)}>
      <form
        className={cn(styles.info_card, styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mx-auto">New prescription</h1>
        <label>Medication:</label>
        <select
          {...register("medication_id", {
            validate: (x) => x > 0 || "Choose the medication!",
          })}
          defaultValue={-1}
        >
          <option value={-1}>--- Choose the medication ---</option>
          {medications.map((med, idx) => (
            <option key={idx} value={med.id}>
              {med.name}
            </option>
          ))}
        </select>
        {errors?.medication_id?.type == "validate" && (
          <span>{errors?.medication_id?.message}</span>
        )}
        <Input
          id="dosage"
          label="Medication dosage:"
          placeholder="Medication dosage..."
          type="text"
          extra="mb-2"
          isError={!!errors?.dosage}
          {...register("dosage", {
            required: "Medication dosage is required!",
            min: 100,
            pattern: /[0-9]*[.,]?[0-9]*/,
          })}
        />
        {errors?.dosage?.type === "required" && (
          <span>{errors?.dosage?.message}</span>
        )}
        {errors?.dosage?.type === "min" && (
          <span>Minimal medication dosage is 100mg!</span>
        )}
        {errors?.dosage?.type === "pattern" && (
          <span>Medication dosage must be a number!</span>
        )}
        <Button
          type="submit"
          className="w-1/2 mx-auto mt-2"
          disabled={isPending}
        >
          Save
        </Button>
      </form>
      <div className="w-full flex justify-end mt-[40%]">
        <Button
          onClick={() => navigate(`${PAGES.RECORD}/`)}
          disabled={isPending}
        >
          Formalize a Medical Record
        </Button>
      </div>
    </div>
  );
};
