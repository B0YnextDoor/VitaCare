import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";
import { IMedicationDb } from "../../../types/med";
import { medicationService } from "../../../services/medication.service";

export const useUpdateMedication = (id?: string) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: [`update_medication_${id}`],
    mutationFn: (data: IMedicationDb) =>
      medicationService.update({ ...data, id: Number(id ?? 0) }),
    onSuccess() {
      toast.success("Medication updated");
      navigate(PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Updating medication error!");
    },
  });

  return { update: mutate, isUpdPending: isPending };
};
