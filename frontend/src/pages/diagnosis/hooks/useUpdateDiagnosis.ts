import { useMutation } from "@tanstack/react-query";
import { IDiagnosisDb } from "../../../types/med";
import { diagnosisService } from "../../../services/diagnosis.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";

export const useUpdateDiagnosis = (id?: string) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: [`update_diagnosis_${id}`],
    mutationFn: (data: IDiagnosisDb) =>
      diagnosisService.update({ ...data, id: Number(id ?? 0) }),
    onSuccess() {
      toast.success("Diagnosis updated");
      navigate(PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Updating diagnosis error!");
    },
  });

  return { update: mutate, isUpdPending: isPending };
};
