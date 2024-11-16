import { useCreateAppointment } from "./useCreateAppointment";
import { useUpdateAppointment } from "./useUpdateAppointment";

export const useAppointmentAction = (id?: number, status: number = 1) => {
  if (id) {
    const { update, isPending } = useUpdateAppointment(id, status);
    return { action: update, isPending };
  } else {
    const { create, isPending } = useCreateAppointment();
    return { action: create, isPending };
  }
};
