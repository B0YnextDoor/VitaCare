import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "../../../components/ui/Input";
import { IPatientProfileForm } from "../../../types/user";

interface IProps {
  date: string | null;
  register: UseFormRegister<IPatientProfileForm | any>;
  errors: FieldErrors<IPatientProfileForm>;
}

export const PatientInfo = ({ date, register, errors }: IProps) => {
  return (
    <div className="mt-5">
      <h3 className="info-title">Anthropometry</h3>
      {!!date && (
        <p className="info-content">
          Measurment date: {new Date(date).toDateString()}
        </p>
      )}
      <Input
        id="weight"
        label="Weight (kg): "
        placeholder="Enter weight..."
        type="text"
        {...register("weight", {
          required: "Weight is required!",
          pattern: /[0-9]*[.,]?[0-9]*/,
          min: 1,
          max: 150,
        })}
        extra="mb-4"
        isError={!!errors?.weight}
      />
      {errors.weight?.type === "required" && (
        <span>{errors.weight?.message}</span>
      )}
      {errors.weight?.type === "pattern" && <span>Weight must be number!</span>}
      {errors.weight?.type === "min" && (
        <span>Weight must be bigger 1 kg!</span>
      )}
      {errors.weight?.type === "max" && <span>Max weight is 150 kg!</span>}
      <Input
        id="height"
        label="Height (m): "
        placeholder="Enter height..."
        type="text"
        {...register("height", {
          required: "Height is required!",
          pattern: /[0-9]*[.,]?[0-9]*/,
          min: 0.4,
          max: 2.5,
        })}
        extra="mb-4"
        isError={!!errors?.height}
      />
      {errors.height?.type === "required" && (
        <span>{errors.height?.message}</span>
      )}
      {errors.height?.type === "pattern" && <span>height must be number!</span>}
      {errors.height?.type === "min" && <span>Min height is 0.4 m!</span>}
      {errors.height?.type === "max" && <span>Max height is 2.5 m!</span>}
    </div>
  );
};
