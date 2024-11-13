import { ISwitcher, DoctorView } from "../../types/switcher";
import {
  Stethoscope,
  ClipboardPlus,
  BriefcaseMedical,
  Library,
} from "lucide-react";
import "./Switcher.css";
import cn from "clsx";

export const DoctorSwitcher = ({ type, setType }: ISwitcher<DoctorView>) => {
  return (
    <div className="switcher">
      <button
        className={cn({
          "opacity-40": type != "appointment",
        })}
        onClick={() => setType("appointment")}
      >
        <Stethoscope />
        Appointments
      </button>
      <button
        className={cn({
          "opacity-40": type != "diagnosis",
        })}
        onClick={() => setType("diagnosis")}
      >
        <ClipboardPlus />
        Diagnosis
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
