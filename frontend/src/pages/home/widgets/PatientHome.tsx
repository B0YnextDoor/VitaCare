import { AppointmentsList } from "../../../components/appointment/AppointmentList";
import { BillList } from "../../../components/bill/BillList";
import { DoctorList } from "../../../components/doctor/DoctorsList";
import { RecordList } from "../../../components/record/RecordList";
import { PatientSwitcher } from "../../../components/switcher/PatientSwitcher";
import { Loader } from "../../../components/ui/Loader";
import { config, ROLES } from "../../../config/config";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { PatientView } from "../../../types/switcher";

export const PatientHome = () => {
  const [type, setType, isSwitcherLoading] = useSessionStorage<PatientView>({
    key: config.VIEW_TYPE,
    defaultValue: "appointment",
  });
  return (
    <div className="w-full h-full">
      {isSwitcherLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <PatientSwitcher type={type} setType={setType} />
          {type == "appointment" ? (
            <AppointmentsList role={ROLES.PATIENT} />
          ) : type == "doctors" ? (
            <DoctorList />
          ) : type == "bills" ? (
            <BillList role={ROLES.PATIENT} />
          ) : (
            <RecordList role={ROLES.PATIENT} />
          )}
        </div>
      )}
    </div>
  );
};
