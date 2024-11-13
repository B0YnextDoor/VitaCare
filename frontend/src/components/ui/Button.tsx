import cn from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  ...rest
}: PropsWithChildren<TypeButton>) {
  return (
    <button
      className={cn(
        "linear rounded-lg bg-transparent border-[2px] border-[#7551ff] py-2 px-7 text-base font-medium text-black transition hover:bg-[#7551ff] hover:text-white active:bg-[#2111a5]",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
