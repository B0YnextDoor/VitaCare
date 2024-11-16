import { Loader } from "../../../components/ui/Loader";
import { IAppointmentId } from "../../../types/appointment";
import styles from "../Record.module.css";
import cn from "clsx";

interface IProps {
  app: IAppointmentId | undefined;
  isLoading: boolean;
}

export const AppointmentInfo = ({ app, isLoading }: IProps) => {
  if (!app || isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size={20} color="black" />
      </div>
    );
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Appointment Info</h1>
      <div className={cn(styles.info_card, styles.info)}>
        <h3>Patient</h3>
        <p>
          Full name: {app.patient_surname} {app.patient_name}
        </p>
        <p>Contacts: {app.patient_email}</p>
      </div>
      <div className={cn(styles.info_card, styles.info)}>
        <h3>Complaints</h3>
        <p>{app.complaints}</p>
      </div>
    </div>
  );
};
