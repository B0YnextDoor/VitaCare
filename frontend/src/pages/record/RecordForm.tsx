import { useAppointment } from "../../hooks/doctor/useAppointment";
import styles from "./Record.module.css";
import { AppointmentInfo } from "./widgets/AppointmentInfo";
import { Form } from "./widgets/Form";

export const RecordForm = () => {
  const { app, isLoading } = useAppointment();

  return (
    <div className={styles.record_form_page}>
      <AppointmentInfo app={app} isLoading={isLoading} />
      <Form app={app?.id} patient={app?.patient_id} />
    </div>
  );
};
