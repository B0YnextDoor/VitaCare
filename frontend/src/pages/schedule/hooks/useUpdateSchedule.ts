import { useMutation } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import { IScheduleForm } from "../../../types/schedule";
import { scheduleService } from "../../../services/schedule.service";
import { toast } from "sonner";
import { PAGES } from "../../../config/urls";

export const useUpdateSchedule = (
  doc_id: string,
  navigate: NavigateFunction,
  id?: string
) => {
  const { mutate, isPending } = useMutation({
    mutationKey: [`upd_schedule_${id ?? ""}`],
    mutationFn: (data: IScheduleForm) =>
      scheduleService.update({ ...data, id: Number(id ?? 0) }),
    onSuccess() {
      toast.success("Schedule updated");
      navigate(doc_id ? `${PAGES.DOCTOR}/${doc_id}` : PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Updating schedule error!");
    },
  });

  return { update: mutate, isUpdPending: isPending };
};
