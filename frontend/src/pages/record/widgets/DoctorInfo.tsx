import styles from "../Record.module.css";
import cn from "clsx";

interface IProps {
  doctor_email: string;
  doctor_name: string;
  doctor_surname: string;
  doc_qual: string;
  doc_spec: string;
}

export const DoctorInfo = (doc: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.doc)}>
      <h3>Doctor Info</h3>
      <p>
        Full name: {doc.doctor_surname} {doc.doctor_name}
      </p>
      <p>Contacts: {doc.doctor_email}</p>
      <div className={styles.description}>
        <h4>Qualification: {doc.doc_qual} category</h4>
        <h4>Specialization: {doc.doc_spec}</h4>
      </div>
    </div>
  );
};
