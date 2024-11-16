import { SubmitHandler, useForm } from "react-hook-form";
import type { ISignInForm } from "../../../types/auth";

export const SignIn: React.FC<any> = ({
  mutate,
  setLogin,
  isError,
  handleError,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInForm>({
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<ISignInForm> = (data) => {
    mutate(data);
  };
  return (
    <div className="form-container sign-in">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign In</h1>
        <input
          style={isError || errors?.email ? { border: "1px solid red" } : {}}
          type="email"
          placeholder="Email"
          autoComplete="off"
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
          style={isError || errors?.password ? { border: "1px solid red" } : {}}
          type="password"
          autoComplete="off"
          placeholder="Password"
          {...register("password", {
            required: "Password is required!",
          })}
          onClick={handleError}
        />
        {errors?.password?.type === "required" && (
          <span className="self-start">{errors.password?.message}</span>
        )}
        <button
          onClick={() => {
            setLogin(true);
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
