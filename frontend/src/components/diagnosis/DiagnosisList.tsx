import { useDiagnosis } from "../../hooks/doctor/useDiagnosis";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { DiagnosisCard } from "./DiagnosisCard";
import "./DiagnosisList.css";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../config/urls";

export const DiagnosisList = () => {
  const { diagnosis, isLoading } = useDiagnosis();
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
        <div className="diagnosis-list">
          {diagnosis ? (
            diagnosis.map((d, idx) => <DiagnosisCard key={idx} {...d} />)
          ) : (
            <div className="text-2xl font-bold text-gray-800">
              No diagnosis...
            </div>
          )}
          <div className="diagnosis-add">
            <Button onClick={() => navigate(`${PAGES.DIAGNOSIS}/`)}>
              Add Diagnosis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
