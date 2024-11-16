import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../config/urls";
import { useMedications } from "../../hooks/doctor/useMedications";
import "./MedicationList.css";
import { MedicationCard } from "./MedicationCard";

export const MedicationList = ({ role }: { role?: number }) => {
  const { medications, isLoading } = useMedications();
  const navigate = useNavigate();
  return (
    <div
      className={`w-full h-full text-black relative ${
        isLoading ? "flex justify-center" : ""
      }`}
    >
      {isLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div className="med-list">
          {medications ? (
            medications.map((med, idx) => (
              <MedicationCard key={idx} data={med} role={role} />
            ))
          ) : (
            <div className="text-2xl font-bold text-gray-800">
              No medications...
            </div>
          )}
          {role == 1 && (
            <div className="med-add">
              <Button onClick={() => navigate(`${PAGES.MEDICATION}/`)}>
                Add Medication
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
