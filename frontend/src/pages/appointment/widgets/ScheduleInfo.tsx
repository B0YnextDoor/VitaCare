import { IAvailableDate } from "../../../types/schedule";
import styles from "../Appointment.module.css";
import cn from "clsx";

interface IProps {
  freeTime?: IAvailableDate;
}

export const ScheduleInfo = ({ freeTime }: IProps) => {
  return (
    <div className="w-full">
      {!freeTime || !freeTime.schedule.length ? (
        <div>No available appointment date...</div>
      ) : (
        <div className={cn(styles.info_card, styles.base)}>
          <h1>Nearest Available Appointments</h1>
          <h3>Date: {new Date(freeTime.day).toDateString()}</h3>
          <h3>Time:</h3>
          <div className="grid grid-cols-3 gap-2">
            {freeTime.schedule.map((val, idx) => (
              <p key={idx}>{val}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
