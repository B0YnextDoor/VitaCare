import { useQuery } from "@tanstack/react-query";
import { medicationService } from "../../services/medication.service";

export const useMedications = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["medications"],
    queryFn: () => medicationService.getAll(),
  });

  return { medications: data, isLoading };
};
