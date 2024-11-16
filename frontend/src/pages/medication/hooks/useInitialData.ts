import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMedicationDb } from "../../../types/med";
import { UseMutateFunction } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import { useCreateMedication } from "./useCreateMedication";
import { useUpdateMedication } from "./useUpdateMedication";
import { useMediation } from "./useMedication";

interface IInitialData {
  isUpdate?: boolean;
  action: UseMutateFunction<void, Error, IMedicationDb, unknown>;
  isPending: boolean;
}

export const useInitialData = (reset: UseFormReset<IMedicationDb>) => {
  const { id } = useParams();

  const { create, isPending } = useCreateMedication();
  const { update, isUpdPending } = useUpdateMedication(id);
  const { data, isSuccess } = useMediation(id);

  const [initData, setData] = useState<IInitialData>({
    action: create,
    isPending,
  });

  useEffect(() => {
    if (id && data && isSuccess) {
      reset({ ...data });
      setData({ isUpdate: true, action: update, isPending: isUpdPending });
    }
  }, [id, data]);

  return { ...initData };
};
