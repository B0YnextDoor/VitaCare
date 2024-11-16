import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diagnosisService } from "../../../services/diagnosis.service";
import { toast } from "sonner";

export const useDeleteDiagnosis = (id?: number) => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: [`delete_diagnosis_${id}`],
    mutationFn: () => diagnosisService.delete(id),
    onSuccess() {
      toast.info("Diagnosis deleted");
      client.invalidateQueries({ queryKey: ["diagnosis"] });
    },
    onError(e) {
      console.log(e);
      toast.error("Delete error!");
    },
  });

  return { mutate, isPending };
};
