import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IDoctorCreate } from "../../../types/doctor";
import { doctorService } from "../../../services/doctor.service";
import { toast } from "sonner";
import { PAGES } from "../../../config/urls";

export const useCreateDoctor = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_doctor"],
    mutationFn: (data: IDoctorCreate) => doctorService.create(data),
    onSuccess() {
      toast.success("Doctor created");
      navigate(PAGES.HOME);
    },
    onError(e) {
      console.log(e);
      toast.error("Creating doctor error!");
    },
  });

  return { mutate, isPending };
};
