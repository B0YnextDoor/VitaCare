import { useParams } from "react-router-dom";
import { usePatient } from "./hooks/usePatient";
import styles from "./Patient.module.css";
import cn from "clsx";
import { Loader } from "../../components/ui/Loader";
import { PatientInfo } from "./widgets/PatientInfo";
import { PatientAnthropometry } from "./widgets/PatientAnthropometry";
import { RecordList } from "../../components/record/RecordList";

export const Patient = () => {
  const { id } = useParams();
  const { data, isLoading } = usePatient(id);

  return (
    <div
      className={cn(
        styles.patient_page,
        isLoading && "flex items-center justify-center"
      )}
    >
      {isLoading || !data ? (
        <Loader size={50} color="black" />
      ) : (
        <div className="flex flex-col gap-3">
          <div className={styles.patient_info}>
            <PatientInfo {...data} />
            <PatientAnthropometry {...data} />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-5">Medical Recodrs</h1>
            <RecordList user_id={id} hidePat />
          </div>
        </div>
      )}
    </div>
  );
};
