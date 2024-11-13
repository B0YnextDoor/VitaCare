import { SCHEDULE_PATTRENS } from "../../../config/config";
import { ISchedule } from "../../../types/schedule";
import { workDays } from "../../../utils/schedule";
import styles from "../Schedule.module.css";
import cn from "clsx";

export const ScheduleList = ({ schedules }: { schedules?: ISchedule[] }) => {
  return !schedules || !schedules.length ? (
    <div className="text-2xl font-bold text-gray-800">
      Doctor has no schedules...
    </div>
  ) : (
    <div className="flexx flex-col">
      {schedules.map((sch, idx) => (
        <div key={idx} className={cn(styles.sch_card, styles.description)}>
          {sch.pattern === SCHEDULE_PATTRENS.ALL ? (
            <h4>On Vacation...</h4>
          ) : (
            <h4>
              {workDays(sch.pattern)} : {sch.start_time} - {sch.end_time}
            </h4>
          )}
        </div>
      ))}
    </div>
  );
};
