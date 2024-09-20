CREATE TABLE "roles" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(20) UNIQUE NOT NULL
);

COMMENT ON COLUMN "roles"."name" IS 'Role name: admin/doctor/patient';

CREATE TABLE "users" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "email" varchar(100) UNIQUE NOT NULL,
  "password" text NOT NULL,
  "role_id" integer NOT NULL CONSTRAINT positive_role_id CHECK (role_id > 0) REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "user_infos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(64) NOT NULL,
  "surname" varchar(64) NOT NULL,
  "user_id" integer NOT NULL CONSTRAINT positive_user_id CHECK (user_id > 0) REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "log_action_types" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(20) NOT NULL
);

COMMENT ON COLUMN "log_action_types"."name" IS 'Type of action: account/appointment/billing/prescription/diagnosis/medical history';

CREATE TABLE "log_actions" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "type_id" integer NOT NULL REFERENCES "log_action_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "description" text NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_log_ids CHECK (type_id > 0 AND user_id > 0)
);

CREATE TABLE "patients" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "birthday" date NOT NULL,
  "gender" varchar(1) NOT NULL CONSTRAINT check_patients_gender CHECK (gender IN ('m', 'f')),
  "user_id" integer NOT NULL CONSTRAINT positive_user_id CHECK (user_id > 0) REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "patients_anthropometry" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "measurement_date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "weight" DECIMAL(4,1) NOT NULL,
  "height" DECIMAL(3,2) NOT NULL,
  "patient_id" INTEGER NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT positive_anthropometry CHECK (patient_id > 0 AND weight > 0 AND height > 0)
);

CREATE TABLE "doctor_qualifications" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(10) NOT NULL DEFAULT 'second',
  "multiplier" decimal(3,2) NOT NULL DEFAULT 1.2 CONSTRAINT positive_multiplier CHECK (multiplier > 0)
);

COMMENT ON COLUMN "doctor_qualifications"."multiplier" IS 'second category - x1.2/first category - x1.5/the highest category - x2';

CREATE TABLE "doctor_specializations" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "service_fee" decimal(19,2) NOT NULL CONSTRAINT positive_fee CHECK (service_fee > 0)
);

COMMENT ON COLUMN "doctor_specializations"."name" IS 'Specialization name';

CREATE TABLE "doctors" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "qualification_id" integer NOT NULL REFERENCES "doctor_qualifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "user_id" integer NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "specialization_id" integer NOT NULL REFERENCES "doctor_specializations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  CONSTRAINT positive_doctor_ids CHECK (qualification_id > 0 AND user_id > 0 AND specialization_id > 0)
);

CREATE TABLE "medications" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "price" decimal(19,2) NOT NULL CONSTRAINT positive_price CHECK (price > 0)
);

COMMENT ON COLUMN "medications"."name" IS 'Medication name';

CREATE TABLE "diagnosis" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text NOT NULL
);

CREATE TABLE "medical_records" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "diagnosis_id" integer NOT NULL REFERENCES "diagnosis" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "conclusion_date" date NOT NULL DEFAULT CURRENT_DATE,
  "doctor_id" integer NOT NULL DEFAULT 0 REFERENCES "doctors" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
  "patient_id" integer NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_medical_records_ids CHECK (diagnosis_id > 0 AND doctor_id >= 0 AND patient_id > 0)
);

CREATE TABLE "prescriptions" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "dosage" decimal(6,2) NOT NULL,
  "issue_date" date NOT NULL DEFAULT CURRENT_DATE,
  "medication_id" integer NOT NULL DEFAULT 0 REFERENCES "medications" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
  "medical_record_id" integer NOT NULL REFERENCES "medical_records" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_prescriptions_ids CHECK (medication_id >= 0 AND medical_record_id > 0) 
);

COMMENT ON COLUMN "prescriptions"."dosage" IS 'Dosage in mg';

CREATE TABLE "appointment_statuses" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(20) NOT NULL DEFAULT 'active'
);

COMMENT ON COLUMN "appointment_statuses"."name" IS 'active/passed/canceled by client/canceled by clinic';

CREATE TABLE "appointments" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "complaints" text NOT NULL DEFAULT 'scheduled appointment',
  "status_id" integer NOT NULL REFERENCES "appointment_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "doctor_id" integer NOT NULL REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "patient_id" integer NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_appointments_ids CHECK (status_id > 0 AND doctor_id > 0 AND patient_id > 0) 
);

CREATE TABLE "skip_days_patterns" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pattern" varchar(10) NOT NULL DEFAULT 'ends'
);

COMMENT ON COLUMN "skip_days_patterns"."pattern" IS 'ends - Sat, Sun/odd - Mon, Wen, Fri, Sun/even - Tue, Thu, Sat/all - vacation';

CREATE TABLE "doctors_schedules" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "start_time" TIME NOT NULL DEFAULT '08:00',
  "end_time" TIME NOT NULL DEFAULT '16:00',
  "skip_days_pattern_id" INTEGER NOT NULL REFERENCES "skip_days_patterns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "doctor_id" INTEGER NOT NULL REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT positive_schedules_id CHECK (doctor_id > 0 AND skip_days_pattern_id > 0)
);

CREATE TABLE "payment_statuses" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(10) NOT NULL DEFAULT 'not paid'
);

COMMENT ON COLUMN "payment_statuses"."name" IS 'not paid/pending/paid';

CREATE TABLE "bills" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "value" decimal(19,2) NOT NULL,
  "invoice_date" date NOT NULL DEFAULT CURRENT_DATE,
  "payment_status_id" integer NOT NULL REFERENCES "payment_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "patient_id" integer NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_bills_ids CHECK (payment_status_id > 0 AND patient_id > 0) 
);