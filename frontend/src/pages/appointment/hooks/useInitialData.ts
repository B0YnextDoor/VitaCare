import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { IAppointmentForm, IAppointmentId } from "../../../types/appointment";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { config } from "../../../config/config";

export const useInitialData = (data?: IAppointmentId): IAppointmentForm => {
  const { upd } = useParams();
  const [id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.DOC_ID,
  });
  const isUpdate = useMemo(() => upd != undefined, [data, upd]);
  return isUpdate && data
    ? {
        id: data.id,
        date: data.appointment_date,
        complaints: data.complaints,
        user_id: data.doctor_id,
      }
    : { date: "", complaints: "", user_id: Number(id) };
};
