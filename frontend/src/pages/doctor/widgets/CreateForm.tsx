import { SubmitHandler, useForm } from "react-hook-form";
import { IDoctorCreate } from "../../../types/doctor";
import { IFormProps } from "./type";
import { Loader } from "../../../components/ui/Loader";
import styles from "../Doctor.module.css";
import cn from "clsx";
import { Button } from "../../../components/ui/Button";
import { useCreateDoctor } from "../hooks/useCreateDoctor";
import { Input } from "../../../components/ui/Input";

export const CreateForm = ({ quals, specs }: IFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDoctorCreate>({
    mode: "onChange",
  });
  const { mutate, isPending } = useCreateDoctor();
  const onSubmit: SubmitHandler<IDoctorCreate> = (data) => mutate(data);
  return !quals || !specs ? (
    <Loader size={30} color="black" />
  ) : (
    <form
      className={cn(styles.form, styles.create_form)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h1>Create Doctor</h1>
        <Input
          id="name"
          label="Name: "
          placeholder="Enter name..."
          type="text"
          {...register("name", {
            required: "Name is required!",
            pattern: /^[A-Za-z]+$/,
          })}
          extra="mb-4"
          isError={!!errors?.name}
        />
        {errors?.name?.type === "required" && (
          <span>{errors.name?.message}</span>
        )}
        {errors?.name?.type === "pattern" && (
          <span>Name must containt only alphabetic letters!</span>
        )}
        <Input
          id="surname"
          label="Surname: "
          placeholder="Enter surname..."
          type="text"
          {...register("surname", {
            required: "Surname is required!",
            pattern: /^[A-Za-z]+$/,
          })}
          extra="mb-4"
          isError={!!errors?.surname}
        />
        {errors?.surname?.type === "required" && (
          <span>{errors.surname?.message}</span>
        )}
        {errors?.surname?.type === "pattern" && (
          <span>Surname must containt only alphabetic letters!</span>
        )}
        <Input
          id="email"
          label="Email: "
          placeholder="Enter email..."
          type="email"
          {...register("email", {
            required: "Email is required!",
            pattern: /\S+@\S+\.\S+/,
          })}
          extra="mb-4"
          isError={!!errors?.email}
        />
        {errors?.email?.type === "required" && (
          <span>{errors.email?.message}</span>
        )}
        {errors?.email?.type === "pattern" && <span>Wrong email pattern</span>}
      </div>
      <div className="mt-[9%]">
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
        <Button
          className="mx-auto w-1/2 mt-2"
          type="submit"
          disabled={isPending}
        >
          Create
        </Button>
      </div>
    </form>
  );
};
