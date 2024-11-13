import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BILL_STATUS, ROLES } from "../../../config/config";
import { billService } from "../../../services/bill.service";
import { toast } from "sonner";

export const useUpdateBill = (role?: number, id?: string) => {
  const isPatient = role === ROLES.PATIENT;
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: [`upd_bill_${id}`],
    mutationFn: () =>
      billService.updateBillStatus(
        isPatient ? BILL_STATUS.PENDING : BILL_STATUS.PAID,
        id
      ),
    onSuccess() {
      toast.success(isPatient ? "Bill paid" : "Payment approved");
      client.invalidateQueries({ queryKey: [`bill_${id}`] });
    },
    onError(e) {
      console.log(e);
      toast.error("Update error!");
    },
  });

  return { update: mutate, isPending };
};
