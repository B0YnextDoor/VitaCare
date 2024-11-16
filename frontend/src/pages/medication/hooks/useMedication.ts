import { useQuery } from "@tanstack/react-query";
import { medicationService } from "../../../services/medication.service";

export const useMediation = (id?: string) => {
  const { data, isSuccess } = useQuery({
    queryKey: [`medication_${id}`],
    queryFn: () => medicationService.getById(id),
  });

  return { data, isSuccess };
};
