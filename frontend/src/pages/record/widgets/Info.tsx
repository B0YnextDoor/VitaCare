import styles from "../Record.module.css";
import cn from "clsx";

interface IProps {
  id: number;
  conclusion_date: string;
  diagnosis_name: string;
  recomendations: string;
}

export const Info = (rec: IProps) => {
  return (
    <div className={cn(styles.info_card, styles.info)}>
      <h3>Medical record #{rec.id}</h3>
      <p>Conclusion date: {new Date(rec.conclusion_date).toDateString()}</p>
      <p>Diagnosis: {rec.diagnosis_name}</p>
      <h3 className="mt-2">Recomendations</h3>
      <p>{rec.recomendations}</p>
    </div>
  );
};
