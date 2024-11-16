import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/ui/Loader";
import styles from "./Doctor.module.css";
import cn from "clsx";
import { useProfile } from "../../hooks/user/useProfile";
import { DoctorInfo } from "./widgets/DoctorInfo";
import { DoctorSchedule } from "../../components/schedule/DoctorSchedule";
import { Button } from "../../components/ui/Button";
import { PAGES } from "../../config/urls";
import { useSessionStorage } from "../../hooks/global/useSessionStorage";
import { config, ROLES, SCHEDULE_PATTRENS } from "../../config/config";
import { RecordList } from "../../components/record/RecordList";
import { useDoctorSchedule } from "../../hooks/doctor/useDoctorSchedule";
import { useMemo } from "react";

export const Doctor = () => {
  const { id } = useParams();
  const { role, isLoading } = useProfile();

  const navigate = useNavigate();

  useSessionStorage({
    defaultValue: "",
    key: config.APP_ID,
    clear: true,
  });

  useSessionStorage({
    defaultValue: id ?? "",
    key: config.DOC_ID,
    clear: true,
  });

  const schedules = useDoctorSchedule(id);

  const isVacation = useMemo(() => {
    const { data } = schedules;
    return data && data.length == 1 && data[0].pattern === SCHEDULE_PATTRENS.ALL
      ? true
      : false;
  }, [id, schedules]);

  return (
    <div
      className={cn(
        styles.doc_page,
        isLoading && "flex items-center justify-center"
      )}
    >
      {isLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div>
          <div className={styles.doc_info}>
            <DoctorInfo id={id} role={role} />
            <div className={cn(styles.info_card, styles.base)}>
              <DoctorSchedule
                role={role}
                data={schedules.data}
                isLoading={schedules.isLoading}
              />
              {role == ROLES.PATIENT && !isVacation && (
                <Button
                  className="w-1/2 mx-auto mt-2"
                  onClick={() => navigate(PAGES.APPOINTMENT_FORM)}
                >
                  Make an appointment
                </Button>
              )}
              {role == ROLES.ADMIN && (
                <Button
                  className="w-1/2 mx-auto mt-2"
                  onClick={() => navigate(`${PAGES.DOCTOR_FORM}/upd`)}
                >
                  Update
                </Button>
              )}
            </div>
          </div>
          {role == ROLES.ADMIN && (
            <div className="mt-3">
              <h1>Medical records</h1>
              <RecordList role={ROLES.ADMIN} user_id={id} hideDoc />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
