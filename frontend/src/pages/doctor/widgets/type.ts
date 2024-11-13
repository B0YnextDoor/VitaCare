import { IQualificationDb, ISpecializationDb } from "../../../types/doctor";

export interface IFormProps {
  quals?: IQualificationDb[];
  specs?: ISpecializationDb[];
}
