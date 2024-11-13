import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../../services/appointment.service";

export const useAppointments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentService.getByUser(),
    retry: 1,
  });

  return { data, isLoading };
};
