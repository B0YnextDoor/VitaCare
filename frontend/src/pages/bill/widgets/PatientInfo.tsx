import styles from "../Bill.module.css";
import cn from "clsx";

interface IProps {
  user_id: number;
  user_name: string;
  user_surname: string;
  user_email: string;
}

export const PatientInfo = (bill: IProps) => {
  return (
    <div className={cn(styles.bill_card, "w-full")}>
      <h3>User</h3>
      <p>
        Full name: {bill.user_surname} {bill.user_name}
      </p>
      <p>Contact: {bill.user_email}</p>
    </div>
  );
};
