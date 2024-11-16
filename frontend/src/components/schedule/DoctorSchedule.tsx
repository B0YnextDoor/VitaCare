import styles from "./Schedule.module.css";
import cn from "clsx";
import { workDays } from "../../utils/schedule";
import { ROLES, SCHEDULE_PATTRENS } from "../../config/config";
import { Button } from "../ui/Button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../config/urls";
import { ISchedule } from "../../types/schedule";

interface IProps {
  data?: ISchedule[];
  isLoading: boolean;
  role?: number;
}

export const DoctorSchedule = ({ data, isLoading, role }: IProps) => {
  const navigate = useNavigate();
  if (!data || isLoading)
    return (
      <div className="text-3xl font-black mb-5">Schedule is fetching...</div>
    );
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Work Schedule</h1>
      {data.map((sch, id) => (
        <div
          key={id}
          className={cn(styles.info_card, styles.name, styles.description)}
        >
          {sch.pattern === SCHEDULE_PATTRENS.ALL ? (
            <h4>On Vacation...</h4>
          ) : (
            <h4>
              {workDays(sch.pattern)} : {sch.start_time} - {sch.end_time}
            </h4>
          )}
          {role == ROLES.ADMIN && (
            <button
              className="absolute top-1 right-2"
              onClick={() => navigate(`${PAGES.SCHEDULE}/${sch.id}`)}
            >
              <Pencil />
            </button>
          )}
        </div>
      ))}
      {role === ROLES.ADMIN && data.length != 4 && (
        <div className="w-full flex justify-end">
          <Button
            className="w-1/4 my-2"
            onClick={() => navigate(PAGES.SCHEDULE)}
          >
            Add schedule
          </Button>
        </div>
      )}
    </div>
  );
};
