import { useNavigate, useParams } from "react-router-dom";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { config } from "../../../config/config";
import { useCreateSchedule } from "./useCreateSchedule";
import { useUpdateSchedule } from "./useUpdateSchedule";
import { IScheduleForm } from "../../../types/schedule";
import { UseFormReset } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSchedule } from "./useSchedule";

interface IInitialData {
  isUpdate?: boolean;
  action: any;
  isPending: boolean;
}

export const useInitialData = (reset: UseFormReset<IScheduleForm>) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc_id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.DOC_ID,
  });
  const { create, isPending } = useCreateSchedule(doc_id, navigate);
  const { update, isUpdPending } = useUpdateSchedule(doc_id, navigate, id);
  const { data } = useSchedule(id);

  const [initData, setData] = useState<IInitialData>({
    action: create,
    isPending,
  });

  useEffect(() => {
    if (id && data) {
      setData({
        isUpdate: true,
        action: update,
        isPending: isUpdPending,
      });
      reset({
        id: data.id,
        start_time: data.start_time,
        end_time: data.end_time,
        pattern: data.pattern,
        doctor_id: null,
      });
    } else reset({ start_time: "08:00", end_time: "16:00" });
  }, [data, id]);

  return { ...initData };
};
