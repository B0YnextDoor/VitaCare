import { IQualificationDb, ISpecializationDb } from "../../../types/doctor";

interface IProps {
  qual: IQualificationDb;
  spec: ISpecializationDb;
}

export const DoctorInfo = ({ qual, spec }: IProps) => {
  return (
    <div className="doctor-info">
      <div className="info-card qualification">
        <h3 className="info-title">Qualification</h3>
        <p className="info-content capitalize">{qual.q_name} category</p>
      </div>

      <div className="info-card specialization">
        <h3 className="info-title">Specialization</h3>
        <p className="info-content">{spec.spec_name}</p>
        <div className="description">
          <h4 className="description-title">Description</h4>
          <p className="description-content">{spec.spec_descr}</p>
        </div>
      </div>
    </div>
  );
};
