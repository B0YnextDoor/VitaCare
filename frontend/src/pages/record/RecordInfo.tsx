import { Loader } from "../../components/ui/Loader";
import { useRecord } from "./hooks/useRecord";
import styles from "./Record.module.css";
import cn from "clsx";
import { Info } from "./widgets/Info";
import { DoctorInfo } from "./widgets/DoctorInfo";
import { PatientInfo } from "./widgets/PatientInfo";
import { useProfile } from "../../hooks/user/useProfile";
import { ROLES } from "../../config/config";
import { Prescriptions } from "./widgets/Prescriptions";

export const RecordInfo = ({ id }: { id: string }) => {
  const { record, isLoading } = useRecord(id);
  const { data } = useProfile();
  return (
    <div
      className={cn(
        "w-full h-full",
        isLoading && "flex items-center justify-center"
      )}
    >
      {isLoading || !record ? (
        <Loader size={20} color="black" />
      ) : (
        <div className={styles.record_page}>
          <h1>Medical Record Info</h1>
          <Info {...record} />
          <div className="flex gap-3">
            {data?.id != record.doctor_id && <DoctorInfo {...record} />}
            {data?.role != ROLES.PATIENT && <PatientInfo {...record} />}
          </div>
          <Prescriptions record={id} />
        </div>
      )}
    </div>
  );
};
