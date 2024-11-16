import { useMutation } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import { IRecordForm } from "../../../types/med";
import { recordService } from "../../../services/record.service";
import { toast } from "sonner";
import { PAGES } from "../../../config/urls";

export const useCreateRecord = (navigate: NavigateFunction) => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_record"],
    mutationFn: (data: IRecordForm) => recordService.create(data),
    onSuccess() {
      toast.success("Medical record created!");
      navigate(PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Creating record error!");
    },
  });

  return { create: mutate, isPending };
};
