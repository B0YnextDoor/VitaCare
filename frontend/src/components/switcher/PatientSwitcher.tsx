import { ISwitcher, PatientView } from "../../types/switcher";
import { Stethoscope, List, HandCoins, Library } from "lucide-react";
import "./Switcher.css";
import cn from "clsx";

export const PatientSwitcher = ({ type, setType }: ISwitcher<PatientView>) => {
  return (
    <div className="switcher">
      <button
        className={cn({ "opacity-40": type != "appointment" })}
        onClick={() => setType("appointment")}
      >
        <Stethoscope />
        Appointments
      </button>
      <button
        className={cn({
          "opacity-40": type != "doctors",
        })}
        onClick={() => setType("doctors")}
      >
        <List />
        Doctors
      </button>
      <button
        className={cn({
          "opacity-40": type != "bills",
        })}
        onClick={() => setType("bills")}
      >
        <HandCoins />
        Bills
      </button>
      <button
        className={cn({
          "opacity-40": type != "records",
        })}
        onClick={() => setType("records")}
      >
        <Library />
        Medical Records
      </button>
    </div>
  );
};
