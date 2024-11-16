import { SubmitHandler, useForm } from "react-hook-form";
import type { TProfileForm, Profile } from "../../../types/user";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import cn from "clsx";
import { useMemo } from "react";
import { useInitialData } from "../hooks/useInitialData";
import { PatientInfo } from "./PatientInfo";
import { isPatientProfile } from "../../../utils/profile";
import { validateDate } from "../../../utils/validators";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export const ProfileForm = ({
  profile,
  isClient,
}: {
  profile: Profile;
  isClient: boolean;
}) => {
  const initialData = useMemo(() => useInitialData(profile), [profile]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TProfileForm>({
    mode: "onChange",
    defaultValues: initialData,
  });

  const { update, isPending } = useUpdateProfile();

  const onSubmit: SubmitHandler<TProfileForm> = (data) => {
    const birthday = watch("birthday");
    if (birthday) {
      data = { ...data, birthday: birthday.toString() };
    }
    update(data);
  };
  return (
    <form className={"profile-form"} onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-black uppercase text-4xl font-bold font-mono my-0 mx-auto">
        User Info
      </h1>
      <div className={cn(isClient && "grid grid-cols-2 gap-3")}>
        <div>
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
          {errors?.email?.type === "pattern" && (
            <span>Wrong email pattern</span>
          )}
          <Input
            id="password"
            label="Password: "
            placeholder="Enter password..."
            type="password"
            {...register("password", {
              required: "Password is required!",
              minLength: 8,
              pattern: /^(?=.*[A-Z])(?=.*\d).+$/,
            })}
            extra="mb-4"
            isError={!!errors?.password}
          />
          {errors?.password?.type === "required" && (
            <span>{errors.password?.message}</span>
          )}
          {errors?.password?.type === "minLength" && (
            <span>Min password length is 8!</span>
          )}
          {errors?.password?.type === "pattern" && (
            <div className="flex flex-col gap-1 mb-2">
              {!/\d/.test(watch("password") ?? "") && (
                <span>Password must contain at least 1 digit</span>
              )}
              {!/[A-Z]/.test(watch("password") ?? "") && (
                <span>Password must contain at least 1 upper letter</span>
              )}
            </div>
          )}
          {isClient && watch("birthday") && (
            <div>
              <label
                htmlFor="birthday"
                className="text-xs text-black ml-1.5 font-medium"
              >
                Birthday:{" "}
              </label>
              <input
                id="birthday"
                style={
                  "birthday" in errors && errors?.birthday
                    ? { border: "1px solid red" }
                    : {}
                }
                type="date"
                placeholder="Birthday"
                autoComplete="off"
                {...register("birthday", {
                  required: "Birthday is required!",
                  validate: (value) => validateDate(new Date(value)),
                })}
              />
              {"birthday" in errors &&
                errors?.birthday?.type === "required" && (
                  <span className="self-start">{errors.birthday?.message}</span>
                )}
              {"birthday" in errors &&
                errors?.birthday?.type === "validate" && (
                  <span className="self-start">{errors.birthday?.message}</span>
                )}
              <label
                htmlFor="gender"
                className="text-xs text-black ml-1.5 font-medium"
              >
                Gender:{" "}
              </label>
              <select
                id="gender"
                {...register("gender", {
                  validate: (value) =>
                    value != "" || "Choose 'Male' or 'Female'!",
                })}
                className="mb-10"
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
              {"gender" in errors && errors?.gender?.type === "validate" && (
                <span className="self-start">{errors.gender.message}</span>
              )}
            </div>
          )}
        </div>
        {isClient && isPatientProfile(profile) && (
          <PatientInfo
            date={profile.measurment_date}
            register={register}
            errors={errors}
          />
        )}
      </div>
      <Button className="w-1/3 my-0 mx-auto" disabled={isPending}>
        Save
      </Button>
    </form>
  );
};
