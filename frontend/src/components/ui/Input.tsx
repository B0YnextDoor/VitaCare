import { forwardRef } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  extra?: string;
  placeholder: string;
  type?: string;
  isError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, extra, type, placeholder, isError, ...rest }, ref) => {
    return (
      <div className={`${extra}`}>
        <label htmlFor={id} className={`text-xs text-black ml-1.5 font-medium`}>
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          id={id}
          placeholder={placeholder}
          style={isError ? { border: "1px solid red" } : {}}
          autoComplete="off"
          className={
            "mt-2 flex w-full items-center justify-center rounded-lg border border-gray-400 bg-white/10 p-3 text-base outline-none placeholder:text-black placeholder:font-normal duration-500 transition-colors"
          }
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
