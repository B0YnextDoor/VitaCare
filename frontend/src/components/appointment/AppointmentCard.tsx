import { Link } from "react-router-dom";
import { PAGES } from "../../config/urls";
import { IAppointment } from "../../types/appointment";
import { statusToColor, statusToText } from "../../utils/status";
import { useMemo } from "react";
import { ROLES } from "../../config/config";
import "./AppointmentList.css";
import cn from "clsx";

export const AppointmentCard = ({
  app,
  role,
}: {
  app: IAppointment;
  role?: number;
}) => {
  const color = useMemo(() => statusToColor(app.status_id, "app"), [app]);
  return (
    <div className="app-card">
      <Link
        to={`${PAGES.APPOINTMENT}/${app.id}`}
        className={cn("app-info-card", "hover:bg-blue-50")}
      >
        <h3>Appointment</h3>
        <p className="info-content">
          Appointment Date:{" "}
          {new Date(app.appointment_date).toString().replace(/[G].+/, "")}
        </p>
        <p style={{ color: color, textShadow: "2px 2px 15px #111" }}>
          Status: {statusToText(app.status_id)}
        </p>
      </Link>
      <div className="flex flex-col">
        {role != ROLES.DOCTOR && (
          <Link
            to={`${PAGES.DOCTOR}/${app.doctor_id}`}
            className={cn("app-info-card", "hover:bg-red-50")}
          >
            <h3>Doctor</h3>
            <p className="info-content">
              Full name: {app.doctor_surname} {app.doctor_name}
            </p>
            <p className="info-content">Contact: {app.doctor_email}</p>
            <p className="info-content">
              Specialization: {app.doctor_spec_name}
            </p>
          </Link>
        )}
        {role != ROLES.PATIENT && (
          <Link
            to={`${PAGES.PATIENT}/${app.patient_id}`}
            className={cn("app-info-card mt-2", "hover:bg-green-50")}
          >
            <h3>Patient</h3>
            <p>
              Full name: {app.patient_surname} {app.patient_name}
            </p>
            <p>Contact: {app.patient_email}</p>
          </Link>
        )}
      </div>
    </div>
  );
};
