import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "../../../services/schedule.service";

export const useSchedule = (id?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [`schedule_${id}`],
    queryFn: () => scheduleService.getById(id),
  });

  return { data, isLoading };
};
