import { useQuery } from "@tanstack/react-query";
import { recordService } from "../../../services/record.service";

export const useRecord = (id?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [`med_record_${id}`],
    queryFn: () => recordService.getById(id),
  });

  return { record: data, isLoading };
};
