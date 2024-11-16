import { useParams } from "react-router-dom";
import { useProfile } from "../../hooks/user/useProfile";
import styles from "./Appointment.module.css";
import cn from "clsx";
import { Loader } from "../../components/ui/Loader";
import { DoctorInfo } from "./widgets/DoctorInfo";
import { useAppointment } from "./hooks/useAppointment";
import { PatientInfo } from "./widgets/PatientInfo";
import { AppointmentInfo } from "./widgets/AppointmentInfo";
import { ROLES } from "../../config/config";

export const Appointment = () => {
  const { id } = useParams();
  const { role } = useProfile();
  const { data, isLoading } = useAppointment(id);
  return (
    <div
      className={cn(
        styles.app_page,
        isLoading && "flex items-center justify-center"
      )}
    >
      {isLoading || !data ? (
        <Loader size={50} color="black" />
      ) : (
        <div className={styles.app_info}>
          <div className="flex flex-col gap-3">
            {role != ROLES.DOCTOR && <DoctorInfo {...data} />}
            {role != ROLES.PATIENT && <PatientInfo {...data} />}
          </div>
          <div>
            <AppointmentInfo app={{ ...data, role: role }} />
          </div>
        </div>
      )}
    </div>
  );
};
