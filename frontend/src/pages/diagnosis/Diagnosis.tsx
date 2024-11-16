import styles from "./Diagnosis.module.css";
import { Input } from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { IDiagnosisDb } from "../../types/med";
import { Button } from "../../components/ui/Button";
import { useInitialData } from "./hooks/useInitialData";

export const Diagnosis = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IDiagnosisDb>({
    mode: "onChange",
  });

  const { isUpdate, action, isPending } = useInitialData(reset);
  return (
    <div className={styles.diagnosis_form}>
      <h1>{isUpdate ? "Update" : "Create"} Diagnosis</h1>
      <form onSubmit={handleSubmit((data) => action(data))}>
        <Input
          id="name"
          label="Diagnosis name:"
          placeholder="Diagnosis name..."
          type="text"
          {...register("name", { required: "Diagnosis name is required!" })}
          extra="mb-2"
          isError={!!errors?.name}
        />
        {errors?.name?.type === "required" && (
          <span>{errors?.name?.message}</span>
        )}
        <label htmlFor="description">Diagnosis description:</label>
        <textarea
          id="description"
          autoComplete="off"
          placeholder="Diagnosis description"
          {...register("description", {
            required: "Diagnosis description is requred!",
          })}
          style={errors?.description ? { border: "1px solid red" } : {}}
        />
        {errors?.description?.type === "required" && (
          <span>{errors?.description?.message}</span>
        )}
        <Button
          className="mt-4 w-1/3 mx-auto"
          type="submit"
          disabled={isPending}
        >
          {isUpdate ? "Save" : "Create"}
        </Button>
      </form>
    </div>
  );
};
