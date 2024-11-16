import { useQuery, useQueryClient } from "@tanstack/react-query";
import { recordService } from "../../services/record.service";
import { useEffect, useState } from "react";
import { IRecord } from "../../types/med";

export const useRecords = (role?: number, user_id?: string, type?: boolean) => {
  const [records, setRecords] = useState<IRecord[]>([]);
  const client = useQueryClient();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["medical_records"],
    queryFn: () => recordService.getAll(role, user_id, type),
  });

  useEffect(() => {
    if (!data) client.invalidateQueries({ queryKey: ["medical_records"] });
    if (data && isSuccess) {
      setRecords(data);
    }
  }, [role, user_id, data]);

  return { records, isLoading };
};
