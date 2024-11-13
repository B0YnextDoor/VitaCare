import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "../../services/schedule.service";
import { useSessionStorage } from "../global/useSessionStorage";
import { config } from "../../config/config";

export const useDoctorSchedule = (id?: string, type?: boolean) => {
  const [doc_id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.DOC_ID,
  });
  id ??= doc_id;
  const { data, isLoading } = useQuery({
    queryKey: [`schedule_${id}`],
    queryFn: () => scheduleService.getDoctorSchedule(id, type),
  });

  return { data, isLoading };
};
