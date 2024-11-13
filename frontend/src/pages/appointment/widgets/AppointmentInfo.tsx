import { useCallback, useMemo } from "react";
import { statusToColor, statusToText } from "../../../utils/status";
import styles from "../Appointment.module.css";
import cn from "clsx";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { APP_STATUS, config, ROLES } from "../../../config/config";
import { PAGES } from "../../../config/urls";
import { useUpdateAppointment } from "../hooks/useUpdateAppointment";

interface IProps {
  id: number;
  appointment_date: string;
  status_id: number;
  complaints: string;
  role?: number;
}

export const AppointmentInfo = ({ app }: { app: IProps }) => {
  const color = useMemo(
    () => statusToColor(app.status_id, "app"),
    [app.status_id]
  );
  const isDate =
    new Date().toDateString() === new Date(app.appointment_date).toDateString();

  const navigate = useNavigate();
  useSessionStorage({
    key: config.APP_ID,
    defaultValue: app.id,
    clear: true,
  });

  const { update, isPending } = useUpdateAppointment(
    app.id,
    app.role == ROLES.PATIENT
      ? APP_STATUS.CANCELLED_CLIENT
      : APP_STATUS.CANCELLED_CLINIC
  );

  const onCancel = useCallback(() => {
    update({
      date: app.appointment_date,
      complaints: app.complaints,
      id: app.id,
    });
  }, [app]);

  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Appointment #{app.id} Info</h1>
      <div className={cn(styles.info_card, styles.info, styles.app_card)}>
        <div className="w-[80%]">
          <h3>Appointment Date</h3>
          <p>
            {new Date(app.appointment_date).toString().replace(/[G].+/, "")}
          </p>
        </div>
        <div className="w-[20%]">
          <h3>Status</h3>
          <p
            style={{
              color: color,
              textShadow: "2px 2px 15px #111",
            }}
          >
            {statusToText(app.status_id)}
          </p>
        </div>
      </div>
      <div
        className={cn(
          styles.info_card,
          styles.info,
          styles.app_card,
          "items-center"
        )}
      >
        <div className="w-full">
          <h3>Complaints</h3>
          <p>{app.complaints}</p>
        </div>
      </div>
      {app.status_id == APP_STATUS.ACTIVE && app.role && (
        <div
          className={cn(
            styles.info_card,
            styles.app_card,
            "hover:bg-violet-50"
          )}
        >
          {app.role && (
            <div
              className={cn(
                styles.controls,
                app.role == ROLES.PATIENT ||
                  (app.role == ROLES.DOCTOR && isDate)
                  ? "justify-between"
                  : "justify-end"
              )}
            >
              {app.role == ROLES.PATIENT && (
                <Button
                  onClick={() => navigate(`${PAGES.APPOINTMENT_FORM}/upd`)}
                >
                  Update
                </Button>
              )}
              {app.role == ROLES.DOCTOR && isDate && (
                <Button
                  onClick={() => navigate(`${PAGES.PRESCRIPTION}/`)}
                  disabled={isPending}
                >
                  Hold an Appointment
                </Button>
              )}
              <Button onClick={() => onCancel()} disabled={isPending}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
