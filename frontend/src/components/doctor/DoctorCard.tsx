import { Link } from "react-router-dom";
import { PAGES } from "../../config/urls";
import { IDoctor } from "../../types/doctor";

export const DoctorCard = (doc: IDoctor) => {
  return (
    <Link to={`${PAGES.DOCTOR}/${doc.id}`} className="doctor-card">
      <h3>
        {doc.name} {doc.surname}
      </h3>
      <h3>
        Qualification: <p className="capitalize">{doc.q_name} category</p>
      </h3>
      <h3>
        Specialization: <p>{doc.spec_name}</p>
      </h3>
    </Link>
  );
};
