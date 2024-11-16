import { useCallback } from "react";
import { IUserProfile } from "../../../types/user";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";

export const Profile = ({ profile }: { profile: IUserProfile }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(async () => {
    navigate(PAGES.ACCOUNT);
  }, [profile.id]);
  return (
    <button
      className="flex items-center text-white bg-transparent outline-none text-[18px]"
      onClick={() => handleClick()}
    >
      <div className="text-right mr-3 ml-3">
        <div className="font-bold -mb-1">
          <p>
            {profile.name} {profile.surname}
          </p>
        </div>
        <p className="text-sm">{profile.email}</p>
      </div>
      <div className="w-10 h-10 flex justify-center items-center text-2xl text-white bg-white/20 rounded uppercase">
        {profile.name.charAt(0) || "A"}
      </div>
    </button>
  );
};
