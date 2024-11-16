import { useEffect, useState } from "react";
import { ISchedule, ISkipPattern } from "../../../types/schedule";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "../../../services/schedule.service";
import { reformPatterns } from "../../../utils/schedule";

export const useSkipPatterns = (
  schedules?: ISchedule[],
  isUpdate?: boolean
) => {
  const client = useQueryClient();
  const { data, isSuccess } = useQuery({
    queryKey: ["skip_patterns"],
    queryFn: () => scheduleService.getSkipPatterns(),
    retry: 1,
  });
  const [patterns, setPatterns] = useState<ISkipPattern[] | undefined>(
    !isUpdate ? reformPatterns(data, schedules) : data
  );

  useEffect(() => {
    if (!data) client.invalidateQueries({ queryKey: ["skip_patterns"] });
    else if (data && isSuccess && schedules)
      setPatterns(!isUpdate ? reformPatterns(data, schedules) : data);
  }, [schedules, data, isSuccess, isUpdate]);

  return patterns;
};
