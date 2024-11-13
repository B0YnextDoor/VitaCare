import { SubmitHandler, useForm } from "react-hook-form";
import type { ISignUpForm } from "../../../types/auth";
import { validateDate } from "../../../utils/validators";

export const SignUp: React.FC<any> = ({
  mutate,
  setLogin,
  isError,
  handleError,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<ISignUpForm> = async (data) => {
    await mutate(data);
  };
  return (
    <div className="form-container sign-up">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Account</h1>
        <input
          style={errors?.name ? { border: "1px solid red" } : {}}
          type="text"
          placeholder="Name"
          autoComplete="off"
          {...register("name", {
            required: "Name is required!",
          })}
        />
        {errors?.name?.type === "required" && (
          <span className="self-start">{errors.name?.message}</span>
        )}
        <input
          style={errors?.surname ? { border: "1px solid red" } : {}}
          type="text"
          placeholder="Surname"
          autoComplete="off"
          {...register("surname", {
            required: "Surname is required!",
          })}
        />
        {errors?.surname?.type === "required" && (
          <span className="self-start">{errors.surname?.message}</span>
        )}
        <input
          style={isError || errors?.email ? { border: "1px solid red" } : {}}
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required!",
            pattern: /\S+@\S+\.\S+/,
          })}
          onClick={handleError}
        />
        {errors?.email?.type === "required" && (
          <span className="self-start">{errors.email?.message}</span>
        )}
        {errors?.email?.type === "pattern" && (
          <span className="self-start">Wrong email pattern</span>
        )}
        <input
          style={errors?.password ? { border: "1px solid red" } : {}}
          type="password"
          placeholder="Password"
          autoComplete="off"
          {...register("password", {
            required: "Password is required!",
            minLength: 8,
            pattern: /^(?=.*[A-Z])(?=.*\d).+$/,
          })}
          onClick={handleError}
        />
        {errors?.password?.type === "required" && (
          <span className="self-start">{errors.password?.message}</span>
        )}
        {errors?.password?.type === "minLength" && (
          <span>Min password length is 8!</span>
        )}
        {errors?.password?.type === "pattern" && (
          <div className="flex flex-col gap-1 mb-2">
            {!/\d/.test(watch("password")) && (
              <span>Password must contain at least 1 digit</span>
            )}
            {!/[A-Z]/.test(watch("password")) && (
              <span>Password must contain at least 1 upper letter</span>
            )}
          </div>
        )}
        <input
          style={errors?.birthday ? { border: "1px solid red" } : {}}
          type="date"
          placeholder="Birthday"
          autoComplete="off"
          {...register("birthday", {
            required: "Birthday is required!",
            validate: (value) => validateDate(value),
          })}
        />
        {errors?.birthday?.type === "required" && (
          <span className="self-start">{errors.birthday?.message}</span>
        )}
        {errors?.birthday?.type === "validate" && (
          <span className="self-start">{errors.birthday?.message}</span>
        )}
        <select
          {...register("gender", {
            validate: (value) => value != "" || "Choose 'Male' or 'Female'!",
          })}
          defaultValue=""
        >
          <option value="">--- Choose your gender ---</option>
          <option value="m">Male</option>
          <option value="f">Female</option>
        </select>
        {errors?.gender?.type === "validate" && (
          <span className="self-start">{errors.gender.message}</span>
        )}
        <button onClick={() => setLogin(false)}>Sign Up</button>
      </form>
    </div>
  );
};
