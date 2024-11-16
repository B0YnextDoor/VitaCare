--- log account actions function
CREATE OR REPLACE FUNCTION log_account_action()
RETURNS TRIGGER AS $$
DECLARE
    d_user_id INTEGER;
    d_patient_id INTEGER;
    d_action_type_id INTEGER;
    d_action_description TEXT;
    d_qualification_name TEXT;
    d_specialization_name TEXT;
BEGIN
    d_action_type_id := (SELECT "id" FROM "log_action_types" WHERE name = 'account');
    IF d_action_type_id IS NULL THEN
        RAISE EXCEPTION 'Action type "account" does not exist in log_action_types table'; 
    END IF;
    CASE TG_TABLE_NAME
        WHEN 'users' THEN
            d_user_id := COALESCE(NEW.id, OLD.id);
            d_action_description := CASE TG_OP
                WHEN 'INSERT' THEN 'New user account created: (' || NEW.email || ')'
                WHEN 'UPDATE' THEN 'User account updated: (' || NEW.email || ')'
                WHEN 'DELETE' THEN 'User account deleted: (' || OLD.email || ')'
                ELSE NULL
            END;
        WHEN 'user_infos' THEN
            d_user_id := COALESCE(NEW.user_id, OLD.user_id);
            d_action_description := CASE TG_OP
                WHEN 'INSERT' THEN 'New user info created: (' || NEW.name || ') (' || NEW.surname || ')'
                WHEN 'UPDATE' THEN 'User info updated: (' || NEW.name || ') (' || NEW.surname || ')'
                WHEN 'DELETE' THEN 'User info deleted: (' || OLD.name || ') (' || OLD.surname || ')'
                ELSE NULL
            END;
        WHEN 'doctors' THEN
            d_user_id := COALESCE(NEW.user_id, OLD.user_id);
            d_qualification_name := (SELECT "name" FROM "doctor_qualifications" WHERE "id" = COALESCE(NEW.qualification_id, OLD.qualification_id));
            if d_qualification_name is NULL THEN
                RAISE EXCEPTION 'Qualification not found';
            END IF; 
            d_specialization_name := (SELECT "name" FROM "doctor_specializations" WHERE "id" = COALESCE(NEW.specialization_id, OLD.specialization_id));
            if d_specialization_name is NULL THEN
                RAISE EXCEPTION 'Specialization not found';
            END IF; 
            d_action_description := CASE TG_OP
                WHEN 'INSERT' THEN 'New doctor created: (' || d_qualification_name || ') (' || d_specialization_name || ')'
                WHEN 'UPDATE' THEN 'Doctor info updated: (' || d_qualification_name || ') (' || d_specialization_name || ')'
                WHEN 'DELETE' THEN 'Doctor deleted: (' || d_qualification_name || ') (' || d_specialization_name || ')'
                ELSE NULL
            END;
        WHEN 'patients' THEN
            d_user_id := COALESCE(NEW.user_id, OLD.user_id);
            d_action_description := CASE TG_OP
                WHEN 'INSERT' THEN 'New patient created: (' || NEW.birthday::text || ') (' || NEW.gender || ')'
                WHEN 'UPDATE' THEN 'Patient info updated: (' || NEW.birthday::text || ') (' || NEW.gender || ')'
                WHEN 'DELETE' THEN 'Patient deleted: (' || OLD.birthday::text || ') (' || OLD.gender || ')'
                ELSE NULL
            END;
        WHEN 'patients_anthropometry' THEN
            d_patient_id := (SELECT "patient_id" FROM "patients_anthropometry" WHERE "id" = COALESCE(NEW.id, OLD.id));
            if d_patient_id IS NULL THEN
                RAISE EXCEPTION 'Patient not found'; 
            END IF;
            d_user_id := (SELECT "user_id" FROM "patients" WHERE "id" = d_patient_id);
            d_action_description := CASE TG_OP
                WHEN 'INSERT' THEN 'New patient anthropometry created: (' || NEW.measurement_date::text || ') (' || NEW.weight::text || ') (' || NEW.height::text || ')'
                WHEN 'UPDATE' THEN 'Patient anthropometry updated: (' || NEW.measurement_date::text || ') (' || NEW.weight::text || ') (' || NEW.height::text || ')'
                WHEN 'DELETE' THEN 'Patient anthropometry deleted: (' || OLD.measurement_date::text || ') (' || OLD.weight::text || ') (' || OLD.height::text || ')'
                ELSE NULL
            END;
        ELSE
            RAISE EXCEPTION 'Unsupported table name: %', TG_TABLE_NAME;
    END CASE;
    if d_user_id is NULL THEN
        RAISE EXCEPTION 'User not found'; 
    END IF;
    IF d_action_description IS NOT NULL THEN
        INSERT INTO "log_actions" ("type_id", "description", "user_id")
        VALUES (d_action_type_id, d_action_description, d_user_id);
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--- log appointment actions function
CREATE OR REPLACE FUNCTION log_appointment_action()
RETURNS TRIGGER AS $$
DECLARE
    action_type_id INTEGER;
    action_description TEXT;
    status_name TEXT;
    log_user_id INTEGER;
BEGIN
    action_type_id := (SELECT id FROM "log_action_types" WHERE "name" = 'appointment');
    IF action_type_id IS NULL THEN
        RAISE EXCEPTION 'Action type "appointment" does not exist in log_action_types table'; 
    END IF;
    status_name := (SELECT "name" FROM "appointment_statuses" WHERE "id" = COALESCE(NEW.status_id, OLD.status_id));
    if status_name is NULL THEN
        RAISE EXCEPTION 'Status not found';
    END IF;
    IF status_name IN ('active', 'canceled by client') THEN
        log_user_id := COALESCE(
            (SELECT user_id FROM "patients" WHERE id = NEW.patient_id),
            (SELECT user_id FROM "patients" WHERE id = OLD.patient_id));
    ELSE
        log_user_id := COALESCE(
            (SELECT user_id FROM "doctors" WHERE id = NEW.doctor_id),
            (SELECT user_id FROM "doctors" WHERE id = OLD.doctor_id));
    END IF;
    IF (TG_OP = 'INSERT') THEN
        action_description := 'New appointment created: (' || NEW.date::text || ') (' || NEW.complaints || ') (' || status_name || ')';
    ELSIF (TG_OP = 'UPDATE') THEN
        IF status_name = 'canceled by clinic' THEN
            log_user_id := COALESCE(
                (SELECT user_id FROM "doctors" WHERE id = NEW.doctor_id),
                (SELECT user_id FROM "doctors" WHERE id = OLD.doctor_id)
            );
        END IF;
        action_description := 'Appointment updated: (' || NEW.date::text || ') (' || NEW.complaints || ') (' ||         status_name || ')';
    ELSIF (TG_OP = 'DELETE') THEN
        action_description := 'Appointment deleted: (' || OLD.date::text || ') (' || OLD.complaints || ') (' || status_name || ')';
    END IF;
    if log_user_id is NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    IF action_description IS NOT NULL THEN
        INSERT INTO "log_actions" ("type_id", "description", "user_id")
        VALUES (action_type_id, action_description, log_user_id);
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--- log billing actions function
CREATE OR REPLACE FUNCTION log_billing_action()
RETURNS TRIGGER AS $$
DECLARE
    action_type_id INTEGER;
    action_description TEXT;
    status_name TEXT;
    log_user_id INTEGER;
BEGIN
	action_type_id := (SELECT "id" FROM "log_action_types" WHERE "name" = 'billing');
    IF action_type_id IS NULL THEN
        RAISE EXCEPTION 'Action type "billing" does not exist in log_action_types table'; 
    END IF;
    status_name := (SELECT "name" FROM "payment_statuses" WHERE "id" = NEW.payment_status_id);
    if status_name is NULL THEN
        RAISE EXCEPTION 'Status not found';
    END IF;
    log_user_id := COALESCE(
        (SELECT user_id FROM patients WHERE id = NEW.patient_id),
        (SELECT user_id FROM patients WHERE id = OLD.patient_id)
    );
	IF (TG_OP = 'INSERT') THEN
		action_description := 'New bill created: (' || NEW.value::text || ') (' || NEW.invoice_date::text || ') (' || status_name || ')';
        log_user_id := 1;
	ELSIF (TG_OP = 'UPDATE') THEN
		action_description := 'Bill updated: (' || NEW.value::text || ') (' || NEW.invoice_date::text || ') (' || status_name || ')';
	ELSIF (TG_OP = 'DELETE') THEN
		action_description := 'Bill deleted: (' || OLD.value::text || ') (' || OLD.invoice_date::text || ') (' || status_name || ')';
	END IF;
    if log_user_id is NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
	IF action_description IS NOT NULL THEN
        INSERT INTO log_actions (type_id, description, user_id)
        VALUES (action_type_id, action_description, log_user_id);
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--- log prescriptions actions function
CREATE OR REPLACE FUNCTION log_prescription_action()
RETURNS TRIGGER AS $$
DECLARE
    action_type_id INTEGER;
    action_description TEXT;
    medication_name TEXT;
    log_user_id INTEGER;
BEGIN
	action_type_id := (SELECT "id" FROM "log_action_types" WHERE "name" = 'prescription');
    IF action_type_id IS NULL THEN
        RAISE EXCEPTION 'Action type "prescription" does not exist in log_action_types table'; 
    END IF;
    medication_name := (SELECT "name" FROM "medications" WHERE "id" = COALESCE(NEW.medication_id, OLD.medication_id));
    if medication_name is NULL THEN
        medication_name = "NULL";
    END IF;
	IF (TG_OP = 'INSERT') THEN
		action_description := 'New prescription created: (' || NEW.dosage::text || ') (' || NEW.issue_date::text || ') (' || medication_name || ')';
	ELSIF (TG_OP = 'UPDATE') THEN
		action_description := 'Prescription updated: (' || NEW.dosage::text || ') (' || NEW.issue_date::text || ') (' || medication_name || ')';
	ELSIF (TG_OP = 'DELETE') THEN
		action_description := 'Prescription deleted: (' || OLD.dosage::text || ') (' || OLD.issue_date::text || ') (' || medication_name || ')';
	END IF;
    log_user_id := 1;
	IF action_description IS NOT NULL THEN
        INSERT INTO log_actions (type_id, description, user_id)
        VALUES (action_type_id, action_description, log_user_id);
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--- log diagnosis actions function
CREATE OR REPLACE FUNCTION log_diagnosis_action()
RETURNS TRIGGER AS $$
DECLARE
    action_type_id INTEGER;
    action_description TEXT;
    log_user_id INTEGER;
BEGIN
	action_type_id := (SELECT id FROM log_action_types WHERE name = 'diagnosis');
    IF action_type_id IS NULL THEN
        RAISE EXCEPTION 'Action type "diagnosis" does not exist in log_action_types table'; 
    END IF;
	IF (TG_OP = 'INSERT') THEN
		action_description := 'New diagnosis created: (' || NEW.name || ') (' || NEW.description || ')';
	ELSIF (TG_OP = 'UPDATE') THEN
		action_description := 'Diagnosis updated: (' || NEW.name || ') (' || NEW.description || ')';
	ELSIF (TG_OP = 'DELETE') THEN
		action_description := 'Diagnosis deleted: (' || OLD.name || ') (' || OLD.description || ')';
	END IF;
    log_user_id := (SELECT "id" FROM "users" WHERE "role_id"=1);
    if log_user_id is NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
	IF action_description IS NOT NULL THEN
        INSERT INTO log_actions (type_id, description, user_id)
        VALUES (action_type_id, action_description, log_user_id);
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--- log medical history actions
CREATE OR REPLACE FUNCTION log_medical_records_action()
RETURNS TRIGGER AS $$
DECLARE
    action_type_id INTEGER;
    p_action_type_id INTEGER;
    action_description TEXT;
    diagnosis_name TEXT;
    log_user_id INTEGER;
BEGIN
	action_type_id := (SELECT "id" FROM "log_action_types" WHERE "name" = 'medical history');
    diagnosis_name := (SELECT "name" FROM "diagnosis" WHERE "id" = COALESCE(NEW.diagnosis_id, OLD.diagnosis_id));
    if diagnosis_name is NULL THEN
        RAISE EXCEPTION 'Diagnosis not found';
    END IF;    
	IF (TG_OP = 'INSERT') THEN
		action_description := 'New medical record created: (' || diagnosis_name || ') (' || NEW.conclusion_date::text || ') (' || NEW.recomendations || ')';
	ELSIF (TG_OP = 'UPDATE') THEN
		action_description := 'Medical record updated: (' || diagnosis_name || ') (' || NEW.conclusion_date::text || ') (' || NEW.recomendations || ')';
	ELSIF (TG_OP = 'DELETE') THEN
		action_description := 'Medical record deleted: (' || diagnosis_name || ') (' || OLD.conclusion_date::text || ') (' || OLD.recomendations || ')';
	END IF;
    log_user_id := COALESCE(
        (SELECT "user_id" FROM "doctors" WHERE id = NEW.doctor_id),
        (SELECT "user_id" FROM "doctors" WHERE id = OLD.doctor_id)
    );
    if log_user_id is NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    IF (TG_OP = 'INSERT') THEN
        p_action_type_id := (SELECT "id" FROM "log_action_types" WHERE "name" = 'prescription');
        UPDATE "log_actions"
        SET "user_id" = log_user_id
        WHERE "user_id" = 1 AND "type_id" = p_action_type_id;
    END IF;
	IF action_description IS NOT NULL THEN
        INSERT INTO log_actions (type_id, description, user_id)
        VALUES (action_type_id, action_description, log_user_id);
    END IF;
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--- create schedule function
CREATE OR REPLACE FUNCTION create_doctor_schedule()
RETURNS TRIGGER AS $$
DECLARE
    pattern_id INTEGER;
BEGIN
    pattern_id := COALESCE(
        (SELECT id FROM "skip_days_patterns" WHERE "pattern" = 'ends'),
        1
    );
    INSERT INTO doctors_schedules (skip_days_pattern_id, doctor_id)
    VALUES (pattern_id, NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--- add default diagnosis
CREATE OR REPLACE FUNCTION set_default_diagnosis() RETURNS TRIGGER AS $$
DECLARE
    default_diagnosis_id INTEGER;
BEGIN
    IF NEW.diagnosis_id < 1 THEN
        SELECT id INTO default_diagnosis_id
        FROM "diagnosis"
        WHERE name = 'Observation'
        LIMIT 1;

        IF default_diagnosis_id IS NOT NULL THEN
            NEW.diagnosis_id := default_diagnosis_id;
        ELSE
            IF TG_OP = 'INSERT' THEN
                RAISE EXCEPTION 'Default diagnosis "Observation" not found';
            ELSE
                NEW.diagnosis_id := COALESCE(OLD.diagnosis_id, 1);
            END IF;
        END IF;
    END IF;
    IF (NEW.diagnosis_id <= 0 OR NEW.doctor_id < 0 OR NEW.patient_id <= 0) THEN
        RAISE EXCEPTION 'Invalid id values: diagnosis_id must be > 0, doctor_id must be >= 0, and patient_id must be > 0';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--- create bill RESET client_min_messages;
CREATE OR REPLACE FUNCTION create_bill() RETURNS TRIGGER AS $$
DECLARE
    v_doctor_specialization_fee DECIMAL(19,2);
    v_doctor_qualification_multiplier DECIMAL(3,2);
    v_medications_cost DECIMAL(19,2);
    v_total_bill DECIMAL(19,2);
    v_not_paid_status_id INTEGER;
BEGIN
    SELECT "id" INTO v_not_paid_status_id FROM "payment_statuses" WHERE "name" = 'not paid';
    IF v_not_paid_status_id IS NULL THEN
        RAISE EXCEPTION 'Payment status "not paid" does not exist in payment_statuses table';
    END IF;
    v_doctor_specialization_fee := (SELECT dv.service_fee FROM DoctorsView dv WHERE dv.doctor_id = NEW.doctor_id);
    v_doctor_qualification_multiplier := (SELECT dv.q_mult FROM DoctorsView dv WHERE dv.doctor_id = NEW.doctor_id);
    IF v_doctor_specialization_fee IS NULL OR v_doctor_qualification_multiplier IS NULL THEN
        RAISE EXCEPTION 'Doctor with id % not found or missing required information', NEW.doctor_id;
    END IF;
    v_medications_cost := COALESCE(
        (SELECT SUM(m.price * p.dosage / 100.0) FROM prescriptions p JOIN medications m ON p.medication_id = m.id WHERE p.medical_record_id = NEW.id), 
        0::decimal
    );
    v_total_bill := (v_doctor_specialization_fee * v_doctor_qualification_multiplier) + v_medications_cost;    
    INSERT INTO "bills" ("value", "payment_status_id", "patient_id")
    VALUES (v_total_bill, v_not_paid_status_id, NEW.patient_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--- check appointment status
CREATE OR REPLACE FUNCTION select_and_check_appointments(
    p_role INTEGER,
    p_user_id INTEGER
)
RETURNS TABLE (
    appointment_id INTEGER,
    appointment_date TIMESTAMP,
    status_id INTEGER,
    doctor_id INTEGER,
    doctor_email VARCHAR,
    doctor_name VARCHAR,
    doctor_surname VARCHAR,
    doctor_specialization VARCHAR,
    patient_id INTEGER,
    patient_email VARCHAR,
    patient_name VARCHAR,
    patient_surname VARCHAR
) AS $$
DECLARE
    active_status_id INTEGER;
    canceled_status_id INTEGER;
    v_user_id INTEGER;
BEGIN
    IF p_role IS NOT NULL AND p_user_id IS NOT NULL THEN
        IF p_role IN (1, 2) THEN
            SELECT "id" INTO v_user_id FROM "doctors" WHERE "user_id" = p_user_id;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Doctor with user_id % does not exist in doctors table.', p_user_id;
            END IF;
        ELSE
            SELECT "id" INTO v_user_id FROM "patients" WHERE "user_id" = p_user_id;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Patient with user_id % does not exist in patients table.', p_user_id;
            END IF;
        END IF;
    END IF;

    SELECT "id" INTO active_status_id FROM "appointment_statuses" WHERE name = 'active';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Status "active" does not exist in appointment_statuses table.';
    END IF;

    SELECT "id" INTO canceled_status_id FROM "appointment_statuses" WHERE name = 'canceled by client';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Status "canceled by client" does not exist in appointment_statuses table.';
    END IF;

    UPDATE "appointments"
    SET "status_id" = canceled_status_id
    WHERE "date" < CURRENT_TIMESTAMP 
    AND "appointments"."status_id" = active_status_id
    AND (
    (p_role IS NULL OR p_user_id IS NULL) OR
    (
        (p_role IN (1, 2) AND "appointments"."doctor_id" = v_user_id) OR
        (p_role NOT IN (1, 2) AND "appointments"."patient_id" = v_user_id)
    )
    );

    RETURN QUERY
    SELECT 
        a.id AS appointment_id, 
        a.date AS appointment_date, 
        ast.id AS status_id, 
        dv.user_id AS doctor_id, 
        dv.user_email AS doctor_email, 
        dv.user_name AS doctor_name, 
        dv.user_surname AS doctor_surname,
        dv.spec_name AS doctor_specialization,
        pv.user_id AS patient_id, 
        pv.user_email AS patient_email,
        pv.user_name AS patient_name, 
        pv.user_surname AS patient_surname
    FROM appointments a
    JOIN appointment_statuses ast ON a.status_id = ast.id
    JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
    JOIN PatientsView pv ON a.patient_id = pv.patient_id
    WHERE 
        (p_role IS NULL OR p_user_id IS NULL) OR
        (
            (p_role IN (1, 2) AND dv.user_id = p_user_id) OR
            (p_role NOT IN (1, 2) AND pv.user_id = p_user_id)
        )
    ORDER BY a.date DESC;
END;
$$ LANGUAGE plpgsql;

--- get medical_records
CREATE OR REPLACE FUNCTION select_medical_records(
    s_type INTEGER,
    s_id INTEGER
)
RETURNS TABLE (
    record_id INTEGER,
    conclusion_date DATE,
    recomendations TEXT,
    diagnosis_name VARCHAR,
    doctor_id INTEGER,
    doctor_email VARCHAR,
    doctor_name VARCHAR,
    doctor_surname VARCHAR,
    doctor_qualification VARCHAR,
    doctor_specialization VARCHAR,
    patient_id INTEGER,
    patient_email VARCHAR,
    patient_name VARCHAR,
    patient_surname VARCHAR,
    patient_birthday DATE,
    gender TEXT
) AS $$
BEGIN
    IF s_type IS NULL AND s_id IS NOT NULL THEN
        RAISE EXCEPTION 'Wrong function arguments';
    END IF;
    RETURN QUERY
    SELECT 
        mr.id AS record_id,
        mr.conclusion_date,
        mr.recomendations,
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
    WHERE
        (s_type IS NULL AND s_id is NULL) OR
        (
            (s_type = 1 AND dv.user_id = s_id) OR
            (s_type != 1 AND pv.user_id = s_id) 
        )
    ORDER BY mr.conclusion_date DESC;
END;
$$ LANGUAGE plpgsql;

SELECT proname, proargtypes
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND proowner = (SELECT oid FROM pg_roles WHERE rolname = 'vita_admin')
ORDER BY proname;