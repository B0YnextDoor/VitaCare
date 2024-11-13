import { IUserProfile } from "./user";

export interface IQualification {
  q_name: string;
  q_mult: number;
}

export interface IQualificationDb extends IQualification {
  id: number;
}

export interface ISpecialization {
  spec_name: string;
  spec_descr: string;
  service_fee: number;
}

export interface ISpecializationDb extends ISpecialization {
  id: number;
}

export interface IDoctor extends Omit<IUserProfile, "role" | "email"> {
  q_name: string;
  spec_name: string;
}

export interface IDoctorUpdate {
  qualification_id: number;
  specialization_id: number;
  id: string;
}

export type IDoctorCreate = Omit<IUserProfile, "id" | "role"> &
  Omit<IDoctorUpdate, "id">;
