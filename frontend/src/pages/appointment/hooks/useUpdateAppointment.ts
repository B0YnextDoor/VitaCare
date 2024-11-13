import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IAppointmentForm } from "../../../types/appointment";
import { appointmentService } from "../../../services/appointment.service";
import { toast } from "sonner";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config/config";
import { PAGES } from "../../../config/urls";

export const useUpdateAppointment = (id: number, status_id: number = 1) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  useSessionStorage({
    key: config.VIEW_TYPE,
    defaultValue: "appointment",
    clear: true,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: [`update_app_${id}`],
    mutationFn: (data: IAppointmentForm) =>
      appointmentService.update(data, status_id),
    onSuccess(_, form) {
      if (form.id && form.user_id) {
        toast.success("Appointment updated!");
        client.invalidateQueries({ queryKey: [`appointment_${form.id}`] });
        client.invalidateQueries({ queryKey: [`nearest_app_${form.user_id}`] });
      } else if (form.id) {
        toast.info("Appointment cancelled");
        navigate(PAGES.HOME);
      }
    },
    onError(error: any) {
      const message = error?.response.data.error;
      toast.error(message);
    },
  });

  return { update: mutate, isPending };
};
