import { useQuery } from "@tanstack/react-query";
import { diagnosisService } from "../../services/diagnosis.service";

export const useDiagnosis = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["diagnosis"],
    queryFn: () => diagnosisService.getAll(),
  });

  return { diagnosis: data, isLoading };
};
