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

SELECT * FROM "users" WHERE "email" = "example@example.com";

SELECT u.email, r.name, ui.name, ui.surname
FROM "roles" as r
JOIN "users" AS u ON r.id = u.role_id
JOIN "user_infos" AS ui ON u.id = ui.user_id;

SELECT u.email, r.name, ui.name, ui.surname
FROM "roles" as r
JOIN "users" AS u ON r.id = u.role_id
JOIN "user_infos" AS ui ON u.id = ui.user_id
WHERE r.id = 1;

SELECT u.email, ui.name, ui.surname
FROM "users" AS u
JOIN "user_infos" AS ui ON u.id = ui.user_id
WHERE u.id = 1;

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

SELECT 
	lat.name AS type_name,
    la.description,
    u.email,
    ui.name,
    ui.surname
FROM "log_actions" AS la
JOIN "log_action_types" AS lat ON la.type_id = lat.id
JOIN "users" AS u ON la.user_id = u.id
JOIN "user_infos" AS ui ON u.id = ui.user_id;

SELECT 
	lat.name AS type_name,
    la.description,
    u.email,
    ui.name,
    ui.surname
FROM "log_actions" AS la
JOIN "log_action_types" AS lat ON la.type_id = lat.id
JOIN "users" AS u ON la.user_id = u.id
JOIN "user_infos" AS ui ON u.id = ui.user_id
WHERE la.user_id = 1;

SELECT 
    lat.name AS type_name,
    la.description,
    u.email,
    ui.name,
    ui.surname
FROM "log_actions" AS la
JOIN "log_action_types" AS lat ON la.type_id = lat.id
JOIN "users" AS u ON la.user_id = u.id
JOIN "user_infos" AS ui ON u.id = ui.user_id
WHERE 
    lat.type_id = 1;

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

SELECT 
    u.email,
    ui.name,
    ui.surname,
    p.birthday,
    p.gender
FROM "patients" AS p
JOIN "users" AS u ON p.user_id = u.id
JOIN "user_infos" AS ui ON u.id = ui.user_id;

SELECT 
    u.email,
    ui.name,
    ui.surname,
    p.birthday,
    p.gender
FROM "patients" AS p
JOIN "users" AS u ON p.user_id = u.id
JOIN "user_infos" AS ui ON u.id = ui.user_id
WHERE p.id = 1;

SELECT
	p.id,
    u.email,
    ui.name,
    ui.surname,
    p.birthday,
    p.gender
FROM "patients" AS p
JOIN "users" AS u ON p.user_id = u.id
JOIN "user_infos" AS ui ON u.id = ui.user_id
WHERE p.user_id = 1;

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

SELECT 
    u.email,
    ui.name,
    ui.surname,
    p.birthday,
    p.gender,
    pa.measurement_date,
    pa.weight,
    pa.height
FROM "patients" p
JOIN "users" u ON p.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
LEFT JOIN "patients_anthropometry" pa ON p.id = pa.patient_id
WHERE p.id = 1;

SELECT 
    p.id AS patient_id,
    u.email,
    ui.name,
    ui.surname,
    p.birthday,
    p.gender,
    pa.measurement_date,
    pa.weight,
    pa.height
FROM "users" u
JOIN "patients" p ON u.id = p.user_id
JOIN "user_infos" ui ON u.id = ui.user_id
LEFT JOIN "patients_anthropometry" pa ON p.id = pa.patient_id
WHERE u.id = 1;

SELECT 
    u.email,
    ui.name,
    ui.surname,
    p.birthday,
    p.gender,
    pa.measurement_date,
    pa.weight,
    pa.height
FROM 
    patients_anthropometry pa
JOIN 
    patients p ON pa.patient_id = p.id
JOIN 
    users u ON p.user_id = u.id
JOIN 
    user_infos ui ON u.id = ui.user_id
WHERE 
    pa.id = 1;

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

SELECT 
    u.email,
    ui.name,
    ui.surname,
    dq.name AS qualification,
    dq.multiplier AS qualification_multiplier,
    ds.name AS specialization,
    ds.description AS specialization_description,
    ds.service_fee
FROM 
    "doctors" d
JOIN 
    "users" u ON d.user_id = u.id
JOIN 
    "user_infos" ui ON u.id = ui.user_id
JOIN 
    "doctor_qualifications" dq ON d.qualification_id = dq.id
JOIN 
    "doctor_specializations" ds ON d.specialization_id = ds.id
WHERE 
    d.id = 1;

SELECT 
    d.id AS doctor_id,
    u.email,
    ui.name,
    ui.surname,
    dq.name AS qualification,
    dq.multiplier AS qualification_multiplier,
    ds.name AS specialization,
    ds.description AS specialization_description,
    ds.service_fee
FROM 
    "users" u
JOIN 
    "doctors" d ON u.id = d.user_id
JOIN 
    "user_infos" ui ON u.id = ui.user_id
JOIN 
    "doctor_qualifications" dq ON d.qualification_id = dq.id
JOIN 
    "doctor_specializations" ds ON d.specialization_id = ds.id
WHERE 
    u.id = 1;

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
SELECT 
    m.id AS medication_id,
    m.name AS medication_name,
	m.price AS medication_price,
    COUNT(p.id) AS prescription_count
FROM "medications" m
LEFT JOIN "prescriptions" p ON m.id = p.medication_id
GROUP BY m.id, m.name, m.price
ORDER BY prescription_count DESC

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
INSERT INTO "medical_records" ("diagnosis_id", "conclusion_date", "doctor_id", "patient_id") 
VALUES (1, '2024-01-15', 10, 12);

SELECT 
    mr.conclusion_date,
    d.name AS diagnosis_name,
    d.description AS diagnosis_description,
    doc.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    dq.name AS doctor_qualification,
    ds.name AS doctor_specialization,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN "doctors" doc ON mr.doctor_id = doc.id
JOIN "users" du ON doc.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "doctor_qualifications" dq ON doc.qualification_id = dq.id
JOIN "doctor_specializations" ds ON doc.specialization_id = ds.id
JOIN "patients" p ON mr.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos" pui ON pu.id = pui.user_id;

SELECT 
    mr.conclusion_date,
    d.name AS diagnosis_name,
    d.description AS diagnosis_description,
    doc.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    dq.name AS doctor_qualification,
    ds.name AS doctor_specialization,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN "doctors" doc ON mr.doctor_id = doc.id
JOIN "users" du ON doc.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "doctor_qualifications" dq ON doc.qualification_id = dq.id
JOIN "doctor_specializations" ds ON doc.specialization_id = ds.id
JOIN "patients" p ON mr.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos" pui ON pu.id = pui.user_id
WHERE mr.id = 1;

SELECT 
    mr.id AS medical_record_id,
    mr.conclusion_date,
    d.name AS diagnosis_name,
    d.description AS diagnosis_description,
    doc.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    dq.name AS doctor_qualification,
    ds.name AS doctor_specialization,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN "doctors doc" ON mr.doctor_id = doc.id
JOIN "users" du ON doc.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "doctor_qualifications" dq ON doc.qualification_id = dq.id
JOIN "doctor_specializations" ds ON doc.specialization_id = ds.id
JOIN "patients" p ON mr.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos" pui ON pu.id = pui.user_id
WHERE doc.id = 1;

SELECT 
    mr.id AS medical_record_id,
    mr.conclusion_date,
    d.name AS diagnosis_name,
    d.description AS diagnosis_description,
    doc.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    dq.name AS doctor_qualification,
    ds.name AS doctor_specialization,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN "doctors" doc ON mr.doctor_id = doc.id
JOIN "users" du ON doc.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "doctor_qualifications" dq ON doc.qualification_id = dq.id
JOIN "doctor_specializations" ds ON doc.specialization_id = ds.id
JOIN "patients" p ON mr.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos" pui ON pu.id = pui.user_id
WHERE p.id = 1;

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

SELECT 
    p.id AS prescription_id,
    p.dosage,
    p.issue_date,
    m.id AS medication_id,
    m.name AS medication_name,
    m.description AS medication_description,
    m.price AS medication_price
FROM "prescriptions" p
JOIN "medications" m ON p.medication_id = m.id;
	
SELECT 
    p.id AS prescription_id,
    p.dosage,
    p.issue_date,
    m.id AS medication_id,
    m.name AS medication_name,
    m.description AS medication_description,
    m.price AS medication_price
FROM "prescriptions" p
JOIN "medications" m ON p.medication_id = m.id
WHERE p.medical_record_id = 1;

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

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    d.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN "doctors" d ON a.doctor_id = d.id
JOIN "users" du ON d.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "patients" p ON a.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos "pui ON pu.id = pui.user_id
WHERE a.id = 1;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    d.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN "doctors" d ON a.doctor_id = d.id
JOIN "users" du ON d.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "patients" p ON a.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos "pui ON pu.id = pui.user_id
WHERE a.doctor_id = 1;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    d.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN "doctors" d ON a.doctor_id = d.id
JOIN "users" du ON d.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "patients" p ON a.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos "pui ON pu.id = pui.user_id
WHERE a.patient_id = 1;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    d.id AS doctor_id,
    du.email AS doctor_email,
    dui.name AS doctor_name,
    dui.surname AS doctor_surname,
    p.id AS patient_id,
    pu.email AS patient_email,
    pui.name AS patient_name,
    pui.surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN "doctors" d ON a.doctor_id = d.id
JOIN "users" du ON d.user_id = du.id
JOIN "user_infos" dui ON du.id = dui.user_id
JOIN "patients" p ON a.patient_id = p.id
JOIN "users" pu ON p.user_id = pu.id
JOIN "user_infos "pui ON pu.id = pui.user_id
WHERE a.status_id = 1;

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

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.id AS doctor_id,
    u.email AS doctor_email,
    ui.name AS doctor_name,
    ui.surname AS doctor_surname,
    dq.name AS qualification,
    dsp.name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN "doctors" d ON ds.doctor_id = d.id
JOIN "users" u ON d.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
JOIN "doctor_qualifications" dq ON d.qualification_id = dq.id
JOIN "doctor_specializations" dsp ON d.specialization_id = dsp.id;

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.id AS doctor_id,
    u.email AS doctor_email,
    ui.name AS doctor_name,
    ui.surname AS doctor_surname,
    dq.name AS qualification,
    dsp.name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN "doctors" d ON ds.doctor_id = d.id
JOIN "users" u ON d.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
JOIN "doctor_qualifications" dq ON d.qualification_id = dq.id
JOIN "doctor_specializations" dsp ON d.specialization_id = dsp.id
WHERE ds.id = 1;

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.id AS doctor_id,
    u.email AS doctor_email,
    ui.name AS doctor_name,
    ui.surname AS doctor_surname,
    dq.name AS qualification,
    dsp.name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN "doctors" d ON ds.doctor_id = d.id
JOIN "users" u ON d.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
JOIN "doctor_qualifications" dq ON d.qualification_id = dq.id
JOIN "doctor_specializations" dsp ON d.specialization_id = dsp.id
WHERE ds.doctor_id = 1;

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.id AS doctor_id,
    u.email AS doctor_email,
    ui.name AS doctor_name,
    ui.surname AS doctor_surname,
    dq.name AS qualification,
    dsp.name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN "doctors" d ON ds.doctor_id = d.id
JOIN "users" u ON d.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
JOIN "doctor_qualifications" dq ON d.qualification_id = dq.id
JOIN "doctor_specializations" dsp ON d.specialization_id = dsp.id
WHERE ds.skip_days_pattern_id = 1;

UPDATE "doctors_schedules"
SET
	"start_time" = '14:00',
	"end_time" = '20:00',
	"skip_days_pattern_id" = 'odd',
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

SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.id AS payment_status_id,
    ps.name AS payment_status,
    p.id AS patient_id,
    u.email AS patient_email,
    ui.name AS patient_name,
    ui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender
FROM "bills" b
JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
JOIN "patients" p ON b.patient_id = p.id
JOIN "users" u ON p.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
WHERE b.id = 1;

SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.id AS payment_status_id,
    ps.name AS payment_status,
    p.id AS patient_id,
    u.email AS patient_email,
    ui.name AS patient_name,
    ui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender
FROM "payment_statuses" ps
LEFT JOIN "bills" b ON b.payment_status_id = ps.id
LEFT JOIN "patients" p ON b.patient_id = p.id
LEFT JOIN "users" u ON p.user_id = u.id
LEFT JOIN "user_infos" ui ON u.id = ui.user_id
WHERE ps.id = 1;

SELECT 
    p.id AS patient_id,
    u.email AS patient_email,
    ui.name AS patient_name,
    ui.surname AS patient_surname,
    p.birthday AS patient_birthday,
    p.gender AS patient_gender,
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.id AS payment_status_id,
    ps.name AS payment_status
FROM "patients" p
JOIN "users" u ON p.user_id = u.id
JOIN "user_infos" ui ON u.id = ui.user_id
LEFT JOIN "bills" b ON p.id = b.patient_id
LEFT JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
WHERE p.id = 1;

UPDATE "bills"
SET
	"value" = 123.20,
	"invoice_date" = '2024-09-20',
	"payment_status_id" = 1,
	"patient_id" = 1
WHERE "id" = 1;

DELETE FROM "bills" WHERE "id" = 1;
DELETE FROM "bills" WHERE "patient_id" = 1;