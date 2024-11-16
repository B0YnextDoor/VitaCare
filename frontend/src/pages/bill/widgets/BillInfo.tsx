import { useCallback, useMemo } from "react";
import { BILL_STATUS, ROLES } from "../../../config/config";
import styles from "../Bill.module.css";
import cn from "clsx";
import { statusToColor } from "../../../utils/status";
import { useUpdateBill } from "../hooks/useUpdateBill";
import { Button } from "../../../components/ui/Button";

interface IProps {
  id: number;
  invoice_date: string;
  amount: number;
  status_id: number;
  status_name: string;
  role?: number;
}

export const BillInfo = (bill: IProps) => {
  const color = useMemo(
    () => statusToColor(bill?.status_id ?? BILL_STATUS.PAID, "bill"),
    [bill]
  );

  const { update, isPending } = useUpdateBill(bill.role, String(bill.id));

  const onClick = useCallback(() => {
    if (!bill.id || !bill.role) return;
    update();
  }, [bill]);

  return (
    <div
      className={cn(
        styles.bill_card,
        bill.role != ROLES.PATIENT ? "w-full" : "w-1/2"
      )}
    >
      <h3>Bill Info</h3>
      <p>Invoice Date: {new Date(bill.invoice_date).toDateString()}</p>
      <p>Amount: {bill.amount}$</p>
      <div className="flex items-center justify-between w-full">
        <p
          className="capitalize"
          style={{ color: color, textShadow: "2px 2px 15px #111" }}
        >
          Status: {bill.status_name}
        </p>
        {bill.status_id != BILL_STATUS.PAID && (
          <div>
            {bill.status_id == BILL_STATUS.NOT_PAID &&
              bill.role == ROLES.PATIENT && (
                <Button onClick={() => onClick()} disabled={isPending}>
                  Pay
                </Button>
              )}
            {bill.status_id == BILL_STATUS.PENDING &&
              bill.role == ROLES.ADMIN && (
                <Button onClick={() => onClick()} disabled={isPending}>
                  Approve
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
