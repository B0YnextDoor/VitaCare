import { useProfile } from "../../hooks/user/useProfile";
import { Loader } from "../../components/ui/Loader";
import cn from "clsx";
import "./Account.css";
import { ProfileForm } from "./widgets/ProfileForm";
import { DoctorInfo } from "./widgets/DoctorInfo";
import { isDoctorProfile } from "../../utils/profile";

export const Account = () => {
  const { isLoading, data, isClient } = useProfile();
  return (
    <div
      className={cn(
        "w-full h-full p-4",
        isLoading && "flex items-center justify-center"
      )}
    >
      {isLoading || !data ? (
        <Loader size={40} color="black" />
      ) : (
        <div className={isClient ? "w-full h-full" : "grid grid-cols-2 gap-3"}>
          <ProfileForm profile={data} isClient={isClient} />
          {isDoctorProfile(data) ? (
            <DoctorInfo spec={data.specialization} qual={data.qualification} />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};
