import { useParams } from "react-router-dom";
import styles from "./Bill.module.css";
import { Loader } from "../../components/ui/Loader";
import { useBill } from "./hooks/useBill";
import { useProfile } from "../../hooks/user/useProfile";
import { ROLES } from "../../config/config";
import { PatientInfo } from "./widgets/PatientInfo";
import { BillInfo } from "./widgets/BillInfo";

export const Bill = () => {
  const { id } = useParams();
  const { bill, isLoading } = useBill(id);
  const { role } = useProfile();

  return isLoading || !bill ? (
    <div className={styles.base}>
      <Loader size={50} color="black" />
    </div>
  ) : (
    <div className="w-full h-full">
      <div className="text-3xl font-black mb-5">
        <h1>Bill #{bill.id}</h1>
        <div className={styles.bill_container}>
          {role != ROLES.PATIENT && <PatientInfo {...bill} />}
          <BillInfo {...{ ...bill, role: role }} />
        </div>
      </div>
    </div>
  );
};
