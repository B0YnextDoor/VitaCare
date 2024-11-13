import { useEffect } from "react";
import { ROLES } from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import { PAGES } from "../../config/urls";
import { useProfile } from "../../hooks/user/useProfile";
import { UpdateForm } from "./widgets/UpdateForm";
import { CreateForm } from "./widgets/CreateForm";
import { useQualifications } from "../../hooks/doctor/useQualifications";
import { useSpecializations } from "../../hooks/doctor/useSpecializations";

export const DoctorForm = () => {
  const navigate = useNavigate();
  const { upd } = useParams();
  const { role } = useProfile();
  useEffect(() => {
    if (role && role != ROLES.ADMIN) navigate(PAGES.HOME);
  }, [role]);
  const { quals } = useQualifications();
  const { specs } = useSpecializations();
  return (
    <div className="w-full h-full flex justify-center">
      {upd ? (
        <UpdateForm quals={quals} specs={specs} />
      ) : (
        <CreateForm quals={quals} specs={specs} />
      )}
    </div>
  );
};
