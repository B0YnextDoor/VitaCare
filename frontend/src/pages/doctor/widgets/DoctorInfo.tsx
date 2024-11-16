import styles from "../Doctor.module.css";
import cn from "clsx";
import { useDoctor } from "../hooks/useDoctor";
import { ROLES } from "../../../config/config";

export const DoctorInfo = ({ id, role }: { id?: string; role?: number }) => {
  const { data, isLoading } = useDoctor(id);
  if (!data || isLoading) return <div>Info is fetching...</div>;
  return (
    <div className={cn(styles.info_card, styles.base)}>
      <h1>Info</h1>
      <div className={cn(styles.info_card, styles.name)}>
        <h3>Full name</h3>
        <p>
          {data.surname} {data.name}
        </p>
      </div>
      <div className={cn(styles.info_card, styles.qualification)}>
        <h3>Qualification</h3>
        <p className="capitalize">{data.qualification.q_name} category</p>
        {role == ROLES.ADMIN && (
          <p>Bill multiplier: {data.qualification.q_mult}</p>
        )}
      </div>
      <div className={cn(styles.info_card, styles.specialization)}>
        <h3>Specialization</h3>
        <p>{data.specialization.spec_name}</p>
        <div className={styles.description}>
          <h4>Description</h4>
          <p>{data.specialization.spec_descr}</p>
          <p>Service fee: {data.specialization.service_fee}$</p>
        </div>
      </div>
    </div>
  );
};
