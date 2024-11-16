import { Loader } from "../../../components/ui/Loader";
import { useAppointment } from "../../../hooks/doctor/useAppointment";
import styles from "../Prescription.module.css";
import cn from "clsx";

export const AppointmentInfo = () => {
  const { app, isLoading } = useAppointment();

  if (!app || isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size={20} color="black" />
      </div>
    );

  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Appointment #{app.id} Info</h1>
      <div className={cn(styles.info_card, styles.info)}>
        <h3>Complaints</h3>
        <p>{app.complaints}</p>
      </div>
    </div>
  );
};
