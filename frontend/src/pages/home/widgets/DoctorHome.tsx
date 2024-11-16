import { AppointmentsList } from "../../../components/appointment/AppointmentList";
import { DiagnosisList } from "../../../components/diagnosis/DiagnosisList";
import { MedicationList } from "../../../components/medication/MedicationList";
import { RecordList } from "../../../components/record/RecordList";
import { DoctorSwitcher } from "../../../components/switcher/DoctorSwitcher";
import { Loader } from "../../../components/ui/Loader";
import { config, ROLES } from "../../../config/config";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { DoctorView } from "../../../types/switcher";

export const DoctorHome = () => {
  const [type, setType, isSwitcherLoading] = useSessionStorage<DoctorView>({
    key: config.VIEW_TYPE,
    defaultValue: "appointment",
  });

  return (
    <div className="w-full h-full">
      {isSwitcherLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <DoctorSwitcher type={type} setType={setType} />
          {type == "appointment" ? (
            <AppointmentsList role={ROLES.DOCTOR} />
          ) : type == "diagnosis" ? (
            <DiagnosisList />
          ) : type == "medications" ? (
            <MedicationList role={ROLES.DOCTOR} />
          ) : (
            <RecordList role={ROLES.DOCTOR} />
          )}
        </div>
      )}
    </div>
  );
};
