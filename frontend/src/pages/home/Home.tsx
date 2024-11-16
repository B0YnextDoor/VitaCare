import { Loader } from "../../components/ui/Loader";
import { ROLES } from "../../config/config";
import { useProfile } from "../../hooks/user/useProfile";
import { AdminHome } from "./widgets/AdminHome";
import { DoctorHome } from "./widgets/DoctorHome";
import { PatientHome } from "./widgets/PatientHome";

export default function Home() {
  const { role, isLoading } = useProfile();
  return (
    <div
      className={`h-full w-full ${
        isLoading ? "flex items-center justify-center" : ""
      }`}
    >
      {isLoading || !role ? (
        <Loader size={50} color="black" />
      ) : role == ROLES.PATIENT ? (
        <PatientHome />
      ) : role == ROLES.DOCTOR ? (
        <DoctorHome />
      ) : (
        <AdminHome />
      )}
    </div>
  );
}
