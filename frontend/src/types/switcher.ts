export interface ISwitcher<T> {
  type: T;
  setType: (x: T) => void;
}

export type PatientView = "appointment" | "doctors" | "bills" | "records";

export type DoctorView =
  | "appointment"
  | "diagnosis"
  | "medications"
  | "records";

export type AdminView = "doctors" | "medications" | "bills" | "logs";
