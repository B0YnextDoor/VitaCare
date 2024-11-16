import { useMutation } from "@tanstack/react-query";
import { IPrescriptionForm } from "../../../types/med";
import { prescriptionService } from "../../../services/prescription.service";
import { toast } from "sonner";
import { UseFormReset } from "react-hook-form";

export const useCreatePrecription = (
  reset: UseFormReset<IPrescriptionForm>
) => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_prescription"],
    mutationFn: (data: IPrescriptionForm) => prescriptionService.create(data),
    onSuccess() {
      toast.success("Prescription created");
      reset();
    },
    onError() {
      toast.error("Creating prescription error!");
    },
  });

  return { create: mutate, isPending };
};
