import { useMutation } from "@tanstack/react-query";
import { IAppointmentForm } from "../../../types/appointment";
import { appointmentService } from "../../../services/appointment.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { config } from "../../../config/config";

export const useCreateAppointment = () => {
  const navigate = useNavigate();
  useSessionStorage({
    key: config.VIEW_TYPE,
    defaultValue: "appointment",
    clear: true,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["create_app"],
    mutationFn: (data: IAppointmentForm) => appointmentService.create(data),
    onSuccess(_, form) {
      if (form.user_id) {
        toast.success("Appointment created!");
        navigate(PAGES.HOME);
      }
    },
    onError(error: any) {
      const message = error?.response.data.error;
      toast.error(message);
    },
  });

  return { create: mutate, isPending };
};
