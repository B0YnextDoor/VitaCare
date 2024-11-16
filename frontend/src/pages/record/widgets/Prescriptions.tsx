import { Loader } from "../../../components/ui/Loader";
import { usePrescriptions } from "../hooks/usePrescriptions";
import styles from "../Record.module.css";
import cn from "clsx";

export const Prescriptions = ({ record }: { record?: string }) => {
  const { data, isLoading } = usePrescriptions(record);

  return (
    <div className={"w-full h-full"}>
      <h1 className="mt-3">Prescriptions</h1>
      {isLoading || !data ? (
        <Loader size={20} color="black" />
      ) : (
        <div className="w-full grid grid-cols-2 gap-2">
          {data.map((pr, idx) => (
            <div key={idx} className={cn(styles.info_card, "hover:bg-blue-50")}>
              <h3>Prescription #{pr.id} Info</h3>
              <p>Medication: {pr.med_name}</p>
              <p>Dosage: {pr.dosage}mg</p>
              <p>Issue Date: {new Date(pr.issue_date).toDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
