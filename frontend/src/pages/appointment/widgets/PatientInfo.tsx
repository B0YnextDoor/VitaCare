import cn from "clsx";
import styles from "../Appointment.module.css";

interface IProps {
  patient_email: string;
  patient_name: string;
  patient_surname: string;
}

export const PatientInfo = (patient: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Patient Info</h1>
      <div className={cn(styles.info_card, styles.name)}>
        <div>
          <h3>Full name</h3>
          <p>
            {patient.patient_surname} {patient.patient_name}
          </p>
        </div>
        <div>
          <h3>Contacts</h3>
          <p>{patient.patient_email}</p>
        </div>
      </div>
    </div>
  );
};
