import { useNavigate } from "react-router-dom";
import { BillList } from "../../../components/bill/BillList";
import { DoctorList } from "../../../components/doctor/DoctorsList";
import { LogsList } from "../../../components/logs/LogsList";
import { MedicationList } from "../../../components/medication/MedicationList";
import { AdminSwitcher } from "../../../components/switcher/AdminSwitcher";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { config, ROLES } from "../../../config/config";
import { useSessionStorage } from "../../../hooks/global/useSessionStorage";
import { AdminView } from "../../../types/switcher";
import { PAGES } from "../../../config/urls";

export const AdminHome = () => {
  const [type, setType, isSwitcherLoading] = useSessionStorage<AdminView>({
    key: config.VIEW_TYPE,
    defaultValue: "doctors",
  });
  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      {isSwitcherLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <AdminSwitcher type={type} setType={setType} />
          {type === "doctors" ? (
            <div className="w-full h-full">
              <div className="w-full flex justify-end mb-3 pr-3">
                <Button onClick={() => navigate(PAGES.DOCTOR_FORM)}>
                  Add Doctor
                </Button>
              </div>
              <DoctorList />
            </div>
          ) : type === "medications" ? (
            <MedicationList role={ROLES.ADMIN} />
          ) : type === "bills" ? (
            <BillList role={ROLES.ADMIN} />
          ) : (
            <LogsList />
          )}
        </div>
      )}
    </div>
  );
};
