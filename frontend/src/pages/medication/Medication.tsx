import styles from "./Medication.module.css";
import { Input } from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { IMedicationDb } from "../../types/med";
import { Button } from "../../components/ui/Button";
import { useInitialData } from "./hooks/useInitialData";

export const Medication = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMedicationDb>({
    mode: "onChange",
  });
  const { isUpdate, action, isPending } = useInitialData(reset);

  return (
    <div className={styles.med_form}>
      <h1>{isUpdate ? "Update" : "Create"} Medication</h1>
      <form onSubmit={handleSubmit((data) => action(data))}>
        <Input
          id="name"
          label="Medication name:"
          placeholder="Medication name..."
          type="text"
          {...register("name", { required: "Medication name is required!" })}
          extra="mb-2"
          isError={!!errors?.name}
        />
        {errors?.name?.type === "required" && (
          <span>{errors?.name?.message}</span>
        )}
        <label htmlFor="description">Medication description:</label>
        <textarea
          id="description"
          autoComplete="off"
          placeholder="Medication description"
          {...register("description", {
            required: "Medication description is requred!",
          })}
          style={errors?.description ? { border: "1px solid red" } : {}}
        />
        {errors?.description?.type === "required" && (
          <span>{errors?.description?.message}</span>
        )}
        <Input
          id="price"
          label="Medication price:"
          placeholder="Medication price..."
          type="text"
          extra="mb-2"
          isError={!!errors?.price}
          {...register("price", {
            required: "Medication price is required!",
            min: 5,
            pattern: /[0-9]*[.,]?[0-9]*/,
          })}
        />
        {errors?.price?.type === "required" && (
          <span>{errors?.price?.message}</span>
        )}
        {errors?.price?.type === "min" && (
          <span>Minimal medication price is 5$!</span>
        )}
        {errors?.price?.type === "pattern" && (
          <span>Medication price must be a number!</span>
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
