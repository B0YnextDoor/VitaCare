--- users table
SELECT * FROM UsersView;

SELECT * FROM UsersView
WHERE role_id = 1;

SELECT * FROM UsersView
WHERE user_id = 1;

--- log_actions table
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
WHERE lat.type_id = 1;

--- patients table
SELECT * FROM PatientsView;

SELECT * FROM PatientsView
WHERE birthday < '2000-01-10' AND gender = 'Male';

SELECT * FROM PatientsView
WHERE patient_id = 1;

SELECT * FROM PatientsView
WHERE user_id = 13;

--- patients_anthropometry table
SELECT 
    pv.user_id, pv.email, pv.name, pv.surname, pv.patient_id, pv.birthday, pv.gender, pa.measurement_date, pa.weight, pa.height
FROM PatientsView
LEFT JOIN "patients_anthropometry" pa ON pv.patient_id = pa.patient_id
WHERE pv.patient_id = 1;

SELECT 
    pv.user_id, pv.email, pv.name, pv.surname, pv.patient_id, pv.birthday, pv.gender, pa.measurement_date, pa.weight, pa.height
FROM PatientsView
LEFT JOIN "patients_anthropometry" pa ON pv.patient_id = pa.patient_id
WHERE pv.user_id = 13;

SELECT 
    pv.user_id, pv.email, pv.name, pv.surname, pv.patient_id, pv.birthday, pv.gender, pa.measurement_date, pa.weight, pa.height
FROM "patients_anthropometry" pa
JOIN PatientsView pv ON pa.patient_id = pv.patient_id
WHERE pa.id = 1;

--- doctors table
SELECT * FROM DoctorsView
WHERE q_id = 1;

SELECT * FROM DoctorsView
WHERE spec_id = 1;

SELECT * FROM DoctorsView
WHERE doctor_id = 1;

SELECT * FROM DoctorsView
WHERE user_id = 3;

--- medications table
SELECT 
    m.id AS medication_id,
    m.name AS medication_name,
	m.price AS medication_price,
    COUNT(p.id) AS prescription_count
FROM "medications" m
LEFT JOIN "prescriptions" p ON m.id = p.medication_id
GROUP BY m.id, m.name, m.price
ORDER BY prescription_count DESC

--- medical_records table
SELECT 
    mr.id AS record_id,
    mr.conclusion_date,
    d.name AS diagnosis_name,
    dv.user_id AS doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.user_id AS patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname,
    pv.birthday AS patient_birthday,
    pv.gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN DoctorsView dv ON mr.doctor_id = dv.doctor_id
JOIN PatientsView pv ON mr.patient_id = pv.patient_id;

SELECT 
    mr.id AS record_id,
    mr.conclusion_date,
    d.name AS diagnosis_name,
    dv.user_id AS doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.user_id AS patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname,
    pv.birthday AS patient_birthday,
    pv.gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN DoctorsView dv ON mr.doctor_id = dv.doctor_id
JOIN PatientsView pv ON mr.patient_id = pv.patient_id
WHERE mr.id = 1;

SELECT
    mr.id AS record_id,
    mr.conclusion_date,
    d.name AS diagnosis_name,
    dv.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname,
    pv.birthday AS patient_birthday,
    pv.gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN DoctorsView dv ON mr.doctor_id = dv.doctor_id
JOIN PatientsView pv ON mr.patient_id = pv.patient_id
WHERE mr.doctor_id = 2
ORDER BY mr.conclusion_date DESC;

SELECT
    mr.id AS record_id,
    mr.conclusion_date,
    d.name AS diagnosis_name,
    dv.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname,
    pv.birthday AS patient_birthday,
    pv.gender
FROM "medical_records" mr
JOIN "diagnosis" d ON mr.diagnosis_id = d.id
JOIN DoctorsView dv ON mr.doctor_id = dv.doctor_id
JOIN PatientsView pv ON mr.patient_id = pv.patient_id
WHERE mr.patient_id = 2
ORDER BY mr.conclusion_date DESC;

--- prescriptions table
SELECT 
    p.id AS prescription_id,
    p.dosage,
    p.issue_date,
    m.id AS medication_id,
    m.name AS medication_name,
    m.description AS medication_description,
    m.price AS medication_price,
    p.medical_record_id
FROM "prescriptions" p
LEFT JOIN "medications" m ON p.medication_id = m.id;
	
SELECT 
    p.id AS prescription_id,
    p.dosage,
    p.issue_date,
    m.id AS medication_id,
    m.name AS medication_name,
    m.description AS medication_description,
    m.price AS medication_price
FROM "prescriptions" p
LEFT JOIN "medications" m ON p.medication_id = m.id
WHERE p.medical_record_id = 1;

--- appointments table
SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    dv.user_id AS doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.user_id AS patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
JOIN PatientsView pv ON a.patient_id = pv.patient_id
ORDER BY a.date DESC;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    dv.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
JOIN PatientsView pv ON a.patient_id = pv.patient_id
WHERE a.id = 1;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    dv.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
JOIN PatientsView pv ON a.patient_id = pv.patient_id
WHERE a.doctor_id = 1
ORDER BY a.date DESC;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    dv.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
JOIN PatientsView pv ON a.patient_id = pv.patient_id
WHERE a.patient_id = 1
ORDER BY a.date DESC;

SELECT 
    a.id AS appointment_id,
    a.date AS appointment_date,
    a.complaints,
    ast.id AS status_id,
    ast.name AS status_name,
    dv.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS doctor_qualification,
    dv.spec_name AS doctor_specialization,
    pv.patient_id,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "appointments" a
JOIN "appointment_statuses" ast ON a.status_id = ast.id
JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
JOIN PatientsView pv ON a.patient_id = pv.patient_id
WHERE a.status_id = 1
ORDER BY a.date DESC;

--- doctors_schedules table
SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS qualification,
    dv.spec_name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN DoctorsView dv ON ds.doctor_id = dv.doctor_id;

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS qualification,
    dv.spec_name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN DoctorsView dv ON ds.doctor_id = dv.doctor_id
WHERE ds.id = 1;

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS qualification,
    dv.spec_name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN DoctorsView dv ON ds.doctor_id = dv.doctor_id
WHERE ds.doctor_id = 1;

SELECT 
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.id AS skip_days_pattern_id,
    sdp.pattern AS skip_days_pattern,
    d.doctor_id,
    dv.user_email AS doctor_email,
    dv.user_name AS doctor_name,
    dv.user_surname AS doctor_surname,
    dv.q_name AS qualification,
    dv.spec_name AS specialization
FROM "doctors_schedules" ds
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
JOIN DoctorsView dv ON ds.doctor_id = dv.doctor_id
WHERE ds.skip_days_pattern_id = 1;

SELECT
    dv.user_id,
    dv.user_email,
    dv.user_name,
    dv.user_surname,
    dv.doctor_id,
    dv.q_name,
    dv.q_mult,
    dv.spec_name,
    dv.spec_desc,
    dv.service_fee,
    ds.id AS schedule_id,
    ds.start_time,
    ds.end_time,
    sdp.pattern AS skip_pattern
FROM DoctorsView dv
JOIN "doctor_schedules" ds ON ds.doctor_id = dv.doctor_id
JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
WHERE dv.user_id = 3;

--- bills table
SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.id AS payment_status_id,
    ps.name AS payment_status,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "bills" b
JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
JOIN PatientsView pv ON b.patient_id = pv.patient_id;

SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.name AS payment_status,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "bills" b
JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
JOIN PatientsView pv ON b.patient_id = pv.patient_id
WHERE b.id = 1;

SELECT 
    b.patient_id,
    COUNT(*) as bills_count,
    SUM(b.value) as total_debt
FROM "bills" b
JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
JOIN PatientsView pv ON b.patient_id = pv.patient_id
WHERE b.patient_id = 1 AND ps.id = 1
GROUP BY b.patient_id
HAVING COUNT(*) > 3 OR SUM(b.value) > 500.0;

SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.name AS payment_status,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "payment_statuses" ps
LEFT JOIN "bills" b ON b.payment_status_id = ps.id
LEFT JOIN PatientsView pv ON b.patient_id = pv.patient_id
WHERE ps.id = 1;

SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.name AS payment_status,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM PatientsView pv
RIGHT JOIN "bills" b ON pv.patient_id = b.patient_id
RIGHT JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
WHERE pv.patient_id = 1;

SELECT 
    b.id AS bill_id,
    b.value AS bill_amount,
    b.invoice_date,
    ps.name AS payment_status,
    pv.user_email AS patient_email,
    pv.user_name AS patient_name,
    pv.user_surname AS patient_surname
FROM "payment_statuses" ps
LEFT JOIN "bills" b ON b.payment_status_id = ps.id
LEFT JOIN PatientsView pv ON b.patient_id = pv.patient_id
WHERE ps.id = 1 AND b.patient_id = 1;