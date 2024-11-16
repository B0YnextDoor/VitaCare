import { IDoctorProfile, IPatientProfile, Profile } from "../types/user";

export function isDoctorProfile(profile: Profile): profile is IDoctorProfile {
  return profile.role === 2;
}

export function isPatientProfile(profile: Profile): profile is IPatientProfile {
  return profile.role === 3;
}
