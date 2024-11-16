import { Link } from "react-router-dom";
import { PAGES } from "../../../config/urls";
import "../RecordList.css";
import cn from "clsx";

interface IProps {
  patient_id: number;
  patient_email: string;
  patient_name: string;
  patient_surname: string;
}

export const PatientInfo = (pat: IProps) => {
  return (
    <Link
      to={`${PAGES.PATIENT}/${pat.patient_id}`}
      className={cn("record-card", "hover:bg-blue-50")}
    >
      <h3>Patient Info</h3>
      <p>
        Full name: {pat.patient_surname} {pat.patient_name}
      </p>
      <p>Contacts: {pat.patient_email}</p>
    </Link>
  );
};
