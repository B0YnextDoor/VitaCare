import styles from "../Record.module.css";
import cn from "clsx";

interface IProps {
  patient_email: string;
  patient_birthday: string;
  patient_gender: string;
  patient_name: string;
  patient_surname: string;
}

export const PatientInfo = (pat: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.pat)}>
      <h3>Patient Info</h3>
      <p>
        Full name: {pat.patient_surname} {pat.patient_name}
      </p>
      <p>Contacts: {pat.patient_email}</p>
      <p>Gender: {pat.patient_gender}</p>
      <p>Birthday: {new Date(pat.patient_birthday).toLocaleDateString()}</p>
    </div>
  );
};
