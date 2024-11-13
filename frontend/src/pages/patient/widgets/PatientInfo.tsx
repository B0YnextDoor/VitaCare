import styles from "../Patient.module.css";
import cn from "clsx";

interface IProps {
  name: string;
  surname: string;
  email: string;
  gender: string;
  birthday: Date;
}

export const PatientInfo = (patient: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Patient Info</h1>
      <div className={cn(styles.info_card, styles.name)}>
        <h3>Full name</h3>
        <p>
          {patient.surname} {patient.name}
        </p>
      </div>
      <div className={cn(styles.info_card, "hover:bg-blue-50")}>
        <h3>Contacts</h3>
        <p>{patient.email}</p>
      </div>
      <div className={cn(styles.info_card, "hover:bg-green-50")}>
        <h3>Birthday/Gender</h3>
        <p>Birthday: {new Date(patient.birthday).toLocaleDateString()}</p>
        <p>Gender: {patient.gender}</p>
      </div>
    </div>
  );
};
