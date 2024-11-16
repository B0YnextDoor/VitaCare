import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";
import { IMedicationDb } from "../../../types/med";
import { medicationService } from "../../../services/medication.service";

export const useCreateMedication = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_medication"],
    mutationFn: (data: IMedicationDb) => medicationService.create(data),
    onSuccess() {
      toast.success("Medication created");
      navigate(PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Creating medication error!");
    },
  });

  return { create: mutate, isPending };
};
