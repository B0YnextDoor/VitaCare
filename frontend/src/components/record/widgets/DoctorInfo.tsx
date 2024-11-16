import { PAGES } from "../../../config/urls";
import cn from "clsx";
import "../RecordList.css";
import { Link } from "react-router-dom";

interface IProps {
  doctor_id: number;
  doctor_email: string;
  doctor_name: string;
  doctor_surname: string;
}

export const DoctorInfo = (doc: IProps) => {
  return (
    <Link
      to={`${PAGES.DOCTOR}/${doc.doctor_id}`}
      className={cn("record-card", "hover:bg-red-50")}
    >
      <h3>Doctor Info</h3>
      <p>
        Full name: {doc.doctor_surname} {doc.doctor_name}
      </p>
      <p>Contacts: {doc.doctor_email}</p>
    </Link>
  );
};
