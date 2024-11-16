import { useNavigate } from "react-router-dom";
import { IDiagnosisDb } from "../../types/med";
import { Trash, ClipboardPenLine } from "lucide-react";
import { PAGES } from "../../config/urls";
import { useDeleteDiagnosis } from "./hooks/useDeleteDiagnosis";

export const DiagnosisCard = (data: IDiagnosisDb) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteDiagnosis(data.id ?? 0);

  return (
    <div className="diagnosis-card">
      <div>
        <h3>{data.name}</h3>
        <p>Symptoms: {data.description}</p>
      </div>
      <div className="upd-diagnosis-btns">
        <button
          onClick={() => navigate(`${PAGES.DIAGNOSIS}/${data.id}`)}
          disabled={isPending}
        >
          <ClipboardPenLine />
        </button>
        <button onClick={() => mutate()} disabled={isPending}>
          <Trash />
        </button>
      </div>
    </div>
  );
};
