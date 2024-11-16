export interface IAppointment {
  id: number;
  appointment_date: string;
  status_id: number;
  doctor_id: number;
  doctor_email: string;
  doctor_name: string;
  doctor_surname: string;
  doctor_spec_name: string;
  patient_id: number;
  patient_email: string;
  patient_name: string;
  patient_surname: string;
}

export interface IAppointmentId extends IAppointment {
  complaints: string;
  doctor_q_name: string;
}

export interface IAppointmentCheck {
  date: string;
  user_id?: number | null;
}

export interface IAppointmentForm extends IAppointmentCheck {
  id?: number;
  complaints: string;
  status_id?: number | null;
}
