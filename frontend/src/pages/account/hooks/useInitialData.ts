import { Profile } from "../../../types/user";
import { isPatientProfile } from "../../../utils/profile";

export const useInitialData = (data: Profile) => {
  const profile = {
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: "",
  };
  if (isPatientProfile(data))
    return {
      ...profile,
      birthday: data.birthday,
      gender: data.gender.charAt(0).toLowerCase(),
      weight: data.weight || null,
      height: data.height || null,
    };
  return profile;
};
