import styles from "../Patient.module.css";
import cn from "clsx";

interface IProps {
  measurment_date: string | null;
  weight: number | null;
  height: number | null;
}

export const PatientAnthropometry = (data: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Patient Anthropometry Info</h1>
      {!data.measurment_date || !data.height || !data.weight ? (
        <div className={styles.info_card}>
          <p>No patient anthropometry info yet...</p>
        </div>
      ) : (
        <div className={cn(styles.info_card, "hover:bg-blue-50")}>
          <h3>Anthropometry</h3>
          <p>
            Measurment Date: {new Date(data.measurment_date).toDateString()}
          </p>
          <p>Height: {data.height} (m)</p>
          <p>Weight: {data.weight} (kg)</p>
        </div>
      )}
    </div>
  );
};
