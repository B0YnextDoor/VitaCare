import { useParams } from "react-router-dom";
import { useCreateDiagnosis } from "./useCreateDiagnosis";
import { useDiagnosis } from "./useDiagnosis";
import { useUpdateDiagnosis } from "./useUpdateDiagnosis";
import { useEffect, useState } from "react";
import { IDiagnosisDb } from "../../../types/med";
import { UseMutateFunction } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";

interface IInitialData {
  isUpdate?: boolean;
  action: UseMutateFunction<void, Error, IDiagnosisDb, unknown>;
  isPending: boolean;
}

export const useInitialData = (reset: UseFormReset<IDiagnosisDb>) => {
  const { id } = useParams();

  const { create, isPending } = useCreateDiagnosis();
  const { update, isUpdPending } = useUpdateDiagnosis(id);
  const { data, isSuccess } = useDiagnosis(id);

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
