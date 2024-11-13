import { useQuery } from "@tanstack/react-query";
import { prescriptionService } from "../../../services/prescription.service";

export const usePrescriptions = (id?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [`prescriptions_${id}`],
    queryFn: () => prescriptionService.getByRecord(id),
  });

  return { data, isLoading };
};
