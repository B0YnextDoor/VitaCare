import { useQuery } from "@tanstack/react-query";
import { diagnosisService } from "../../../services/diagnosis.service";

export const useDiagnosis = (id?: string) => {
  const { data, isSuccess } = useQuery({
    queryKey: [`diagnosis_${id}`],
    queryFn: () => diagnosisService.getById(id),
  });

  return { data, isSuccess };
};
