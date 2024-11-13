import { NavigateFunction } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { IScheduleForm } from "../../../types/schedule";
import { scheduleService } from "../../../services/schedule.service";
import { toast } from "sonner";
import { PAGES } from "../../../config/urls";

export const useCreateSchedule = (
  doc_id: string,
  navigate: NavigateFunction
) => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_schedule"],
    mutationFn: (data: IScheduleForm) =>
      scheduleService.create({ ...data, doctor_id: Number(doc_id) }),
    onSuccess() {
      toast.success("New schedule created");
      navigate(doc_id ? `${PAGES.DOCTOR}/${doc_id}` : PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Creating schedule error!");
    },
  });

  return { create: mutate, isPending };
};
