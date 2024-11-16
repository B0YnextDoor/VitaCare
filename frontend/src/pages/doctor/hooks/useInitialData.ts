import { UseFormReset } from "react-hook-form";
import { IDoctorUpdate } from "../../../types/doctor";
import { useDoctor } from "./useDoctor";
import { useEffect } from "react";

export const useInitialData = (
  id: string,
  reset: UseFormReset<IDoctorUpdate>
) => {
  const { data, isLoading, isSuccess } = useDoctor(id);

  useEffect(() => {
    if (data && isSuccess)
      reset({
        qualification_id: data.qualification.id,
        specialization_id: data.specialization.id,
        id: id,
      });
  }, [id, data, isSuccess]);

  return { isLoading };
};
