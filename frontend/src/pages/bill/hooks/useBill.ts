import { useQuery } from "@tanstack/react-query";
import { billService } from "../../../services/bill.service";

export const useBill = (id?: string) => {
  const { data: bill, isLoading } = useQuery({
    queryKey: [`bill_${id}`],
    queryFn: () => billService.getById(id),
  });

  return { bill, isLoading };
};
