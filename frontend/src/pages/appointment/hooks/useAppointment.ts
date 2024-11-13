import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../../services/appointment.service";
import { useDoctorSchedule } from "../../../hooks/doctor/useDoctorSchedule";
import { useAvailableTime } from "./useAvailableTime";
import { useEffect, useState } from "react";

export const useAppointment = (id?: string) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`appointment_${id ?? ""}`],
    queryFn: () => appointmentService.getById(id),
  });

  const [docId, setDocId] = useState<string>("");

  useEffect(() => {
    if (data && isSuccess) setDocId(String(data.doctor_id));
  }, [data]);

  const { data: schedules } = useDoctorSchedule(docId);

  const { freeTime } = useAvailableTime(docId);

  return { data, isLoading, schedules, freeTime };
};
