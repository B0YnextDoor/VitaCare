export interface IDiagnosisDb {
  id?: number;
  name: string;
  description: string;
}

export interface IMedicationDb extends IDiagnosisDb {
  price: number;
}

export interface IPrescriptionForm {
  dosage: number;
  medication_id: number;
}

export interface IPrescription extends IPrescriptionForm {
  id: number;
  issue_date: string;
  record_id: number;
  med_name: string;
}

export interface IRecordForm {
  diagnosis_id: number;
  recomendations: string;
  patient_id: number;
  app_id: number;
}

export interface IRecord extends IRecordForm {
  id: number;
  conclusion_date: string;
  diagnosis_name: string;
  doctor_id: number;
  doctor_email: string;
  doctor_name: string;
  doctor_surname: string;
  doc_qual: string;
  doc_spec: string;
  patient_email: string;
  patient_birthday: string;
  patient_gender: string;
  patient_name: string;
  patient_surname: string;
}
