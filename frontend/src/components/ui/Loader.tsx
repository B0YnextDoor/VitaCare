import { Loader as LoaderIcon } from "lucide-react";

export const Loader = ({ size, color }: { size: number; color: string }) => {
  return (
    <div className="flex justify-center items-center">
      <LoaderIcon
        className={`animate-spin w-[${size}] h-[${size}]`}
        color={color}
      />
    </div>
  );
};
