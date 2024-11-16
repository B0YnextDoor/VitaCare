import { AdminView, ISwitcher } from "../../types/switcher";
import { List, HandCoins, BriefcaseMedical, FileClock } from "lucide-react";
import "./Switcher.css";
import cn from "clsx";

export const AdminSwitcher = ({ type, setType }: ISwitcher<AdminView>) => {
  return (
    <div className="switcher">
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
          "opacity-40": type != "medications",
        })}
        onClick={() => setType("medications")}
      >
        <BriefcaseMedical />
        Medications
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
          "opacity-40": type != "logs",
        })}
        onClick={() => setType("logs")}
      >
        <FileClock />
        Logs
      </button>
    </div>
  );
};
