import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "../../../services/schedule.service";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { config } from "../../../config/config";

export const useAvailableTime = (id?: string) => {
  const [doc_id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.DOC_ID,
  });
  if (!id) id = doc_id;

  const { data } = useQuery({
    queryKey: [`nearest_app_${id ?? ""}`],
    queryFn: () => scheduleService.getAvailableTime(id),
  });

  return { freeTime: data };
};
