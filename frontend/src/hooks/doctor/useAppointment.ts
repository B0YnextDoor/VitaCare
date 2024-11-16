import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointment.service";
import { useSessionStorage } from "../global/useSessionStorage";
import { config } from "../../config/config";
import { useEffect, useState } from "react";
import { IAppointmentId } from "../../types/appointment";

export const useAppointment = () => {
  const [id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.APP_ID,
  });

  const [app, setApp] = useState<IAppointmentId>();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`appointment_${id}`],
    queryFn: () => appointmentService.getById(id),
  });

  useEffect(() => {
    if (data && isSuccess) setApp(data);
  }, [data, isSuccess]);

  return { app, isLoading };
};
