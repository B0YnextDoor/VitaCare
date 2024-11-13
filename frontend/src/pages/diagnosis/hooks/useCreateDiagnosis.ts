import { useMutation } from "@tanstack/react-query";
import { IDiagnosisDb } from "../../../types/med";
import { diagnosisService } from "../../../services/diagnosis.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";

export const useCreateDiagnosis = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_diagnosis"],
    mutationFn: (data: IDiagnosisDb) => diagnosisService.create(data),
    onSuccess() {
      toast.success("Diagnosis created");
      navigate(PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Creating diagnosis error!");
    },
  });

  return { create: mutate, isPending };
};
