import { Loader } from "../ui/Loader";
import { useDoctors } from "../../hooks/doctor/useDoctors";
import "./DoctorList.css";
import { DoctorCard } from "./DoctorCard";

export const DoctorList = () => {
  const { data, isLoading } = useDoctors();
  return (
    <div className="doctor-list">
      {isLoading ? (
        <Loader size={30} color="black" />
      ) : (
        <div
          className={`${
            data ? "grid grid-cols-2 gap-2" : "flex justify-center"
          }`}
        >
          {data && data.length ? (
            data.map((doc, id) => <DoctorCard key={id} {...doc} />)
          ) : (
            <h3 className="text-2xl font-bold text-gray-800">No Doctors...</h3>
          )}
        </div>
      )}
    </div>
  );
};
