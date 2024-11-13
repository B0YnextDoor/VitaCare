import { IQualificationDb, ISpecializationDb } from "./doctor";

export interface IUserProfile {
  id: number;
  role: number;
  email: string;
  name: string;
  surname: string;
}

export interface IDoctorProfile extends IUserProfile {
  doctor_id: number;
  qualification: IQualificationDb;
  specialization: ISpecializationDb;
}

export interface IPatientProfile extends IUserProfile {
  birthday: Date;
  gender: string;
  measurment_date: string | null;
  weight: number | null;
  height: number | null;
}

export type Profile = IUserProfile | IDoctorProfile | IPatientProfile;

export interface IProfileForm extends Omit<IUserProfile, "id" | "role"> {
  password: string;
}

export interface IPatientProfileForm extends IProfileForm {
  birthday: string;
  gender: string;
  weight: number | null;
  height: number | null;
}

export type TProfileForm = IProfileForm | IPatientProfileForm;
