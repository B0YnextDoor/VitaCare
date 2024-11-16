import { useNavigate } from "react-router-dom";
import { Trash, ClipboardPenLine } from "lucide-react";
import { PAGES } from "../../config/urls";
import { IMedicationDb } from "../../types/med";
import { useDeleteMedication } from "./hooks/useDeleteMedication";

interface IProps {
  data: IMedicationDb;
  role?: number;
}

export const MedicationCard = ({ data, role }: IProps) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteMedication(data.id ?? 0);

  return (
    <div className="med-card">
      <div>
        <h3>{data.name}</h3>
        <p className="mb-2">Price: {data.price}$</p>
        <p>Description: {data.description}</p>
      </div>
      {role == 1 ? (
        <div className="upd-med-btns">
          <button
            onClick={() => navigate(`${PAGES.MEDICATION}/${data.id}`)}
            disabled={isPending}
          >
            <ClipboardPenLine />
          </button>
          <button onClick={() => mutate()} disabled={isPending}>
            <Trash />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
