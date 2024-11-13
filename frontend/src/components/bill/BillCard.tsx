import { Link } from "react-router-dom";
import { IBill } from "../../types/bills";
import { statusToColor } from "../../utils/status";
import { useMemo } from "react";
import cn from "clsx";
import { PAGES } from "../../config/urls";
import { ROLES } from "../../config/config";

interface IProps {
  bill: IBill;
  idx: number;
  role?: number;
}

export const BillCard = ({ bill, idx, role }: IProps) => {
  const color = useMemo(() => statusToColor(bill.status_id, "bill"), [bill]);
  return (
    <div className="bill-card base-bill">
      <h1>Bill #{idx + 1}</h1>
      <div className="bill-card-container">
        {role != ROLES.PATIENT && (
          <Link
            to={`${PAGES.PATIENT}/${bill.user_id}`}
            className={cn("bill-card", "hover:bg-blue-50")}
          >
            <h3>User</h3>
            <p>
              Full name: {bill.user_surname} {bill.user_name}
            </p>
            <p>Contact: {bill.user_email}</p>
          </Link>
        )}
        <Link
          to={`${PAGES.BILL}/${bill.id}`}
          className={cn("bill-card hover:bg-blue-50")}
        >
          <h3>Bill Info</h3>
          <p>Amount: {bill.amount}$</p>
          <p
            className="capitalize"
            style={{ color: color, textShadow: "2px 2px 15px #111" }}
          >
            Status: {bill.status_name}
          </p>
        </Link>
      </div>
    </div>
  );
};
