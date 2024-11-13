CREATE OR REPLACE PROCEDURE update_user(
    p_user_id INT,
    p_email VARCHAR(100),
    p_password TEXT,
    p_role_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "users" 
    SET 
        "email" = p_email,
        "password" = p_password,
        "role_id" = p_role_id
    WHERE "id" = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with id % not found', p_user_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_user_info(
    p_info_id INT,
    p_name VARCHAR(64),
    p_surname VARCHAR(64),
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "user_infos" 
    SET 
        "name" = p_name,
        "surname" = p_surname,
        "user_id" = p_user_id
    WHERE "id" = p_info_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User info with id % not found', p_info_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_patient(
    p_patient_id INT,
    p_birthday DATE,
    p_gender CHAR(1),
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "patients"
    SET
        "birthday" = p_birthday,
        "gender" = p_gender,
        "user_id" = p_user_id
    WHERE "id" = p_patient_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Patient with id % not found', p_patient_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_patient_anthropometry(
    p_anthropometry_id INT,
    p_weight NUMERIC(4,1),
    p_height NUMERIC(3,2),
    p_patient_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "patients_anthropometry"
    SET
        "measurement_date" = CURRENT_DATE,
        "weight" = p_weight,
        "height" = p_height,
        "patient_id" = p_patient_id
    WHERE "id" = p_anthropometry_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Anthropometry record with id % not found', p_anthropometry_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_doctor(
    p_doctor_id INT,
    p_qualification_id INT,
    p_user_id INT,
    p_specialization_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "doctors"
    SET
        "qualification_id" = p_qualification_id,
        "user_id" = p_user_id,
        "specialization_id" = p_specialization_id
    WHERE "id" = p_doctor_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Doctor with id % not found', p_doctor_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_bill_status(
    p_bill_id INT,
    p_payment_status_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "bills"
    SET
        "payment_status_id" = p_payment_status_id
    WHERE "id" = p_bill_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bill with id % not found', p_bill_id;
    END IF;
END;
$$;

SELECT 
    routine_name
FROM information_schema.routines
WHERE routine_type = 'PROCEDURE' AND routine_schema = 'public';