import { DoctorSchedule } from "../../components/schedule/DoctorSchedule";
import { Loader } from "../../components/ui/Loader";
import { config } from "../../config/config";
import { useSessionStorage } from "../../hooks/global/useSessionStorage";
import styles from "./Appointment.module.css";
import { useAppointment } from "./hooks/useAppointment";
import { DoctorInfo } from "./widgets/DoctorInfo";
import { Form } from "./widgets/Form";
import { useInitialData } from "./hooks/useInitialData";
import { ScheduleInfo } from "./widgets/ScheduleInfo";

export const AppointmentForm = () => {
  const [id, _, __] = useSessionStorage({
    defaultValue: "",
    key: config.APP_ID,
  });
  const { data, isLoading, schedules, freeTime } = useAppointment(id);
  const initialData = useInitialData(data);
  return (
    <div className={`w-full h-full flex ${isLoading ? "justify-center" : ""}`}>
      {isLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div className={styles.form_cont}>
          <div className="flex flex-col gap-2">
            {data && <DoctorInfo {...data} />}
            <DoctorSchedule id={String(data?.doctor_id ?? "")} />
            <ScheduleInfo freeTime={freeTime} />
          </div>
          {!freeTime || !freeTime.schedule.length ? (
            <div className="text-2xl font-bold text-gray-800">
              Doctor is on Vacation!
            </div>
          ) : (
            <Form initialData={initialData} schedules={schedules} />
          )}
        </div>
      )}
    </div>
  );
};
