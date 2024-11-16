import { useQuery } from "@tanstack/react-query";
import { patientService } from "../../../services/patient.service";

export const usePatient = (id?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [`patient_${id}`],
    queryFn: () => patientService.getById(id),
  });

  return { data, isLoading };
};
