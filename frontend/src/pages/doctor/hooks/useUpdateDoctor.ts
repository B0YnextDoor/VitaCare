import { useMutation } from "@tanstack/react-query";
import { IDoctorUpdate } from "../../../types/doctor";
import { doctorService } from "../../../services/doctor.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";

export const useUpdateDoctor = (id: string) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: [`upd_doctor_${id}`],
    mutationFn: (data: IDoctorUpdate) => doctorService.update(data),
    onSuccess() {
      toast.success("Doctor updated");
      navigate(`${PAGES.DOCTOR}/${id}`);
    },
    onError(e) {
      console.log(e);
      toast.error("Error updating doctor!");
    },
  });

  return { mutate, isPending };
};
