import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicationService } from "../../../services/medication.service";

export const useDeleteMedication = (id?: number) => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: [`delete_diagnosis_${id}`],
    mutationFn: () => medicationService.delete(id),
    onSuccess() {
      toast.info("Medication deleted");
      client.invalidateQueries({ queryKey: ["medications"] });
    },
    onError(e) {
      console.log(e);
      toast.error("Delete error!");
    },
  });

  return { mutate, isPending };
};
