import styles from "../Appointment.module.css";
import cn from "clsx";

interface IProps {
  doctor_email: string;
  doctor_name: string;
  doctor_surname: string;
  doctor_spec_name: string;
  doctor_q_name: string;
}

export const DoctorInfo = (doc: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Doctor Info</h1>
      <div className={cn(styles.info_card, styles.name)}>
        <div>
          <h3>Full name</h3>
          <p>
            {doc.doctor_surname} {doc.doctor_name}
          </p>
        </div>
        <div>
          <h3>Contacts</h3>
          <p>{doc.doctor_email}</p>
        </div>
      </div>
      <div className={cn(styles.info_card, styles.info)}>
        <div>
          <h3>Qualification</h3>
          <p className="capitalize">{doc.doctor_q_name} category</p>
        </div>
        <div>
          <h3>Specialization</h3>
          <p>{doc.doctor_spec_name}</p>
        </div>
      </div>
    </div>
  );
};
