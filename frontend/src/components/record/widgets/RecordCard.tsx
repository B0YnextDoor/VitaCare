import { Link } from "react-router-dom";
import { IRecord } from "../../../types/med";
import { PAGES } from "../../../config/urls";
import { DoctorInfo } from "./DoctorInfo";
import { PatientInfo } from "./PatientInfo";
import cn from "clsx";

interface IProps {
  rec: IRecord;
  user?: number;
  idx: number;
  hideDoc?: boolean;
  hidePat?: boolean;
}

export const RecordCard = ({ rec, user, idx, hideDoc, hidePat }: IProps) => {
  return (
    <div className="record-card base-record">
      <Link
        to={`${PAGES.RECORD}/${rec.id}`}
        className={cn("record-card", "hover:bg-green-50")}
      >
        <h3>Medical record #{idx + 1}</h3>
        <p>Conclusion date: {new Date(rec.conclusion_date).toDateString()}</p>
        <p>Diagnosis: {rec.diagnosis_name}</p>
      </Link>
      <div className="flex gap-3">
        {user != rec.doctor_id && !hideDoc && <DoctorInfo {...rec} />}
        {user != rec.patient_id && !hidePat && <PatientInfo {...rec} />}
      </div>
    </div>
  );
};
