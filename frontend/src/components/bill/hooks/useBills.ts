import { useQuery, useQueryClient } from "@tanstack/react-query";
import { billService } from "../../../services/bill.service";
import { ROLES } from "../../../config/config";
import { useEffect } from "react";

export const useBills = (role?: number) => {
  const client = useQueryClient();
  const { data: bills, isLoading } = useQuery({
    queryKey: ["bills"],
    queryFn: () =>
      role == ROLES.ADMIN ? billService.getAll() : billService.getUserBills(),
    retry: 1,
  });

  useEffect(() => {
    if (role && !bills) client.invalidateQueries({ queryKey: ["bills"] });
  }, [role]);

  return { bills, isLoading };
};
