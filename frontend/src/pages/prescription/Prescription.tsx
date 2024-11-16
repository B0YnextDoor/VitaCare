import styles from "./Prescription.module.css";
import { AppointmentInfo } from "./widgets/AppointmentInfo";
import { Form } from "./widgets/Form";

export const Prescription = () => {
  return (
    <div className={styles.prescription_page}>
      <AppointmentInfo />
      <Form />
    </div>
  );
};
