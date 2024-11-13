-- roles table
INSERT INTO "roles" ("name") VALUES ('new_role_name');

SELECT * FROM "roles";
SELECT * FROM "roles" WHERE "id" = 1;

UPDATE "roles" SET "name" = 'new_role_name' WHERE "id" = 1;

DELETE FROM "roles" WHERE "id" = 1;

--- users table
INSERT INTO "users" ("email", "password", "role_id") VALUES ('new_admin@example.com', 'password', 1);
INSERT INTO "users" ("email", "password", "role_id") VALUES ('new_doctor@example.com', 'password', 2);
INSERT INTO "users" ("email", "password", "role_id") VALUES ('new_patient@example.com', 'password', 3);

SELECT "id", "password", "role_id" FROM "users" WHERE "email" = "example@example.com";

UPDATE "users" 
SET 
    "email" = 'new_user_email@example.com',
    "password" = 'new_user_password',
    "role_id" = 1
WHERE "id" = 1;

DELETE FROM "users" WHERE "id" = 1;

--- user_infos table
INSERT INTO "user_infos" ("name", "surname", "user_id") VALUES ('user_name', 'user_surname', 1);

SELECT * FROM "user_infos";
SELECT "name", "surname" FROM "user_infos" WHERE "user_id" = 1;

UPDATE "user_infos" 
SET 
	"name" = 'new_user_name',
	"surname" = 'new_user_surname',
	"user_id" = 1
WHERE "id" = 1;

DELETE FROM "user_infos" WHERE "id" = 1;
DELETE FROM "user_infos" WHERE "user_id" = 1;

--- log_action_types table
INSERT INTO "log_action_types" ("name") VALUES ('new_action_type');

SELECT * FROM "log_action_types";
SELECT * FROM "log_action_types" WHERE "id" = 1;
SELECT * FROM "log_action_types" WHERE "name" = 'account';

UPDATE "log_action_types" SET "name" = 'new_action_name' WHERE "id" = 1;

DELETE FROM "log_action_types" WHERE "id" = 1;
DELETE FROM "log_action_types" WHERE "name" = 'billing';

--- log_actions table
INSERT INTO "log_actions" ("type_id", "description", "user_id") VALUES (1, 'User logged out', 14);

UPDATE "log_actions"
SET
	"type_id" = 1,
	"description" = 'new_description',
	"user_id" = 1,
WHERE "id" = 1;

DELETE FROM "log_actions" WHERE "id" = 1;
DELETE FROM "log_actions" WHERE "user_id" = 1;

--- patients table
INSERT INTO "patients" ("birthday", "gender", "user_id") VALUES ('1990-05-15', 'm', 1);

UPDATE "patients"
SET
	"birthday" = '1990-05-15',
	"gender" = 'm',
	"user_id" = 1,
WHERE "id" = 1;

DELETE FROM "patients" WHERE "id" = 1;
DELETE FROM "patients" WHERE "user_id" = 1;

--- patients_anthropometry table
INSERT INTO "patients_anthropometry" ("measurement_date", "weight", "height", "patient_id") 
VALUES ('2024-05-01', 75.5, 1.80, 1),

SELECT * FROM "patients_anthropometry";

UPDATE "patients_anthropometry"
SET
	"measurement_date" = '2024-09-20',
	"weight" = 90.1,
	"height" = 2.00,
	"patient_id" = 1
WHERE "id" = 1;

DELETE FROM "patients_anthropometry" WHERE "id" = 1;
DELETE FROM "patients_anthropometry" WHERE "patient_id" = 1;

--- doctor_qualifications table
INSERT INTO "doctor_qualifications" ("name", "multiplier") VALUES ('third', 1.10);

SELECT * FROM "doctor_qualifications";
SELECT * FROM "doctor_qualifications" WHERE "id" = 1;

UPDATE "doctor_qualifications"
SET
	"name" = 'new-name',
	"multiplier" = 20.0
WHERE "id" = 1;

DELETE FROM "doctor_qualifications" WHERE "id" = 1;

--- doctor_specializations table
INSERT INTO "doctor_specializations" ("name", "description", "service_fee") 
VALUES ('Gastroenterologist', 'Specializes in the digestive system and its disorders', 155.00);

SELECT * FROM "doctor_specializations";
SELECT * FROM "doctor_specializations" WHERE "id" = 1;

UPDATE "doctor_specializations"
SET
	"name" = 'Oncologist',
	"description" = 'Focuses on the diagnosis and treatment of cancer',
	"service_fee" = 180.00
WHERE "id" = 1;

DELETE FROM "doctor_specializations" WHERE "id" = 1;

--- doctors table
INSERT INTO "doctors" ("qualification_id", "user_id", "specialization_id")  VALUES (2, 2, 1);

UPDATE "doctors"
SET
	"qualification_id" = 1,
	"user_id" = 1,
	"specialization_id" = 1
WHERE "id" = 1;

DELETE FROM "doctors" WHERE "id" = 1;
DELETE FROM "doctors" WHERE "user_id" = 1;

--- medications table
INSERT INTO "medications" ("name", "description", "price") VALUES ('Aspirin', 'Pain reliever and fever reducer', 5.99);

SELECT * FROM "medications";
SELECT * FROM "medications" WHERE "id" = 1;

UPDATE "medications"
SET
	"name" = 'vitamin C',
	"description" = 'healthy vitamin for your skin',
	"price" = 5.99
WHERE "id" = 1;

DELETE FROM "medications" WHERE "id" = 1;

--- diagnosis table
INSERT INTO "diagnosis" ("name", "description") 
VALUES ('Influenza', 'Sudden onset of fever, chills, headache, muscle pain, and fatigue. Often accompanied by cough, sore throat, and runny nose.');

SELECT * FROM "diagnosis";
SELECT * FROM "diagnosis" WHERE "id" = 1;

UPDATE "diagnosis"
SET
	"name" = 'Gastroesophageal Reflux Disease',
	"description" = 'Frequent heartburn, chest pain, difficulty swallowing, and regurgitation of food or sour liquid. May cause chronic cough or throat irritation.'
WHERE "id" = 1;

DELETE FROM "diagnosis" WHERE "id" = 1;

--- medical_records table
INSERT INTO "medical_records" ("diagnosis_id", "conclusion_date", "recomendations", "doctor_id", "patient_id") 
VALUES (1, '2024-01-15', 10, 12);

UPDATE "medical_records"
SET
	"diagnosis_id" = 1,
	"conclusion_date" = '2024-09-20',
	"doctor_id" = 1,
	"patient_id" = 1
WHERE "id" = 1;

DELETE FROM "medical_records" WHERE "id" = 1;
DELETE FROM "medical_records" WHERE "doctor_id" = 1;
DELETE FROM "medical_records" WHERE "patient_id" = 1;

--- prescriptions table
INSERT INTO "prescriptions" ("dosage", "issue_date", "medication_id", "medical_record_id") 
VALUES (100.00, '2024-01-16', 1, 1);

SELECT * FROM "prescriptions" WHERE "id" = 1;
SELECT * FROM "prescriptions" WHERE "medication_id" = 1;

UPDATE "prescriptions"
SET
	"dosage" = 10.0,
	"issue_date" = '2024-09-20',
	"medication_id" = 2,
	"medical_record_id" = 3
WHERE "id" = 1;

DELETE FROM "prescriptions" WHERE "id" = 1;
DELETE FROM "prescriptions" WHERE "medication_id" = 1;
DELETE FROM "prescriptions" WHERE "medical_record_id" = 1;

--- appointment_statuses table
INSERT INTO "appointment_statuses" (name) VALUES ('active');

SELECT * FROM "appointment_statuses";
SELECT * FROM "appointment_statuses" WHERE "id" = 1;

UPDATE "appointment_statuses"
SET
	"name" = 'status'
WHERE "id" = 1;

DELETE FROM "appointment_statuses" WHERE "id" = 1;

--- appointments table
INSERT INTO "appointments" ("date", "complaints", "status_id", "doctor_id", "patient_id") 
VALUES ('2024-10-01 10:00:00', 'Routine checkup', 2, 10, 12);

SELECT * FROM "appointments";

UPDATE "appointments"
SET
	"date" = '2024-09-20',
	"complaints" = 'Headache',
	"status_id" = 3,
	"doctor_id" = 11,
	"patient_id" = 12
WHERE "id" = 1;

DELETE FROM "appointments" WHERE "id" = 1;
DELETE FROM "appointments" WHERE "doctor_id" = 1;
DELETE FROM "appointments" WHERE "patient_id" = 1;

--- skip_days_patterns table
INSERT INTO "skip_days_patterns" ("pattern") VALUES ('start');

SELECT * FROM "skip_days_patterns";
SELECT * FROM "skip_days_patterns" WHERE "id" = 1;

UPDATE "skip_days_patterns"
SET "pattern" = 'pattern' WHERE "id" = 1;

DELETE FROM "skip_days_patterns" WHERE "id" = 1;

--- doctors_schedules table
INSERT INTO "doctors_schedules" ("start_time", "end_time", "skip_days_pattern_id", "doctor_id") 
VALUES ('08:00', '16:00', 1, 2);

UPDATE "doctors_schedules"
SET
	"start_time" = '14:00',
	"end_time" = '20:00',
	"skip_days_pattern_id" = 2,
	"doctor_id" = 1
WHERE "id" = 1;

DELETE FROM "doctors_schedules" WHERE "id" = 1;
DELETE FROM "doctors_schedules" WHERE "doctor_id" = 1;

--- payment_statuses table
INSERT INTO "payment_statuses" ("name") VALUES ('not paid');

SELECT * FROM "payment_statuses";
SELECT * FROM "payment_statuses" WHERE "id" = 1;

UPDATE "payment_statuses"
SET "name" = 'status' WHERE "id" = 1;

DELETE FROM "payment_statuses" WHERE "id" = 1;

--- bills table
INSERT INTO "bills" ("value", "invoice_date", "payment_status_id", "patient_id") 
VALUES (250.50, '2024-10-26', 3, 12);

SELECT * FROM "bills";

UPDATE "bills"
SET
	"value" = 123.20,
	"invoice_date" = '2024-09-20',
	"payment_status_id" = 1,
	"patient_id" = 1
WHERE "id" = 1;

DELETE FROM "bills" WHERE "id" = 1;
DELETE FROM "bills" WHERE "patient_id" = 1;