--- users
CREATE TRIGGER log_users_actions_trigger
AFTER INSERT OR UPDATE OR DELETE 
ON "users"
FOR EACH ROW 
EXECUTE FUNCTION log_account_action();

--- user infos
CREATE TRIGGER log_user_infos_actions_trigger
AFTER INSERT OR UPDATE OR DELETE 
ON "user_infos"
FOR EACH ROW 
EXECUTE FUNCTION log_account_action();

--- doctors
CREATE TRIGGER log_doctors_actions_trigger
AFTER INSERT OR UPDATE OR DELETE 
ON "doctors"
FOR EACH ROW 
EXECUTE FUNCTION log_account_action();

CREATE TRIGGER create_doctor_shedule_trigger
AFTER INSERT 
ON "doctors"
FOR EACH ROW
EXECUTE FUNCTION create_doctor_schedule();

--- patients
CREATE TRIGGER log_patients_actions_trigger
AFTER INSERT OR UPDATE OR DELETE 
ON "patients"
FOR EACH ROW 
EXECUTE FUNCTION log_account_action();


--- patients anthropometry
CREATE TRIGGER log_patients_anthropometry_actions_trigger
AFTER INSERT OR UPDATE OR DELETE 
ON "patients_anthropometry"
FOR EACH ROW 
EXECUTE FUNCTION log_account_action();

--- appointments
CREATE TRIGGER log_appointment_actions_trigger
AFTER INSERT OR UPDATE OR DELETE
ON "appointments"
FOR EACH ROW
EXECUTE FUNCTION log_appointment_action();

--- bills
CREATE TRIGGER log_billing_actions_trigger
AFTER INSERT OR UPDATE OR DELETE
ON "bills"
FOR EACH ROW
EXECUTE FUNCTION log_billing_action();

--- prescriptions
CREATE TRIGGER log_prescription_actions_trigger
AFTER INSERT OR UPDATE OR DELETE
ON "prescriptions"
FOR EACH ROW
EXECUTE FUNCTION log_prescription_action();

--- diagnosis
CREATE TRIGGER log_diagnosis_actions_trigger
AFTER INSERT OR UPDATE OR DELETE
ON "diagnosis"
FOR EACH ROW
EXECUTE FUNCTION log_diagnosis_action();


--- medical records
CREATE TRIGGER set_default_diagnosis_trigger
BEFORE INSERT OR UPDATE ON medical_records
FOR EACH ROW
EXECUTE FUNCTION set_default_diagnosis();

CREATE TRIGGER log_medical_records_action_trigger
AFTER INSERT OR UPDATE OR DELETE
ON "medical_records"
FOR EACH ROW
EXECUTE FUNCTION log_medical_records_action();

CREATE TRIGGER create_bill_trigger
AFTER INSERT ON medical_records
FOR EACH ROW
EXECUTE FUNCTION create_bill();


SELECT 
    trg.tgname AS trigger_name,
    tbl.relname AS table_name,
    ns.nspname AS schema_name,
    CASE trg.tgtype & 66
        WHEN 2 THEN 'BEFORE'
        WHEN 66 THEN 'INSTEAD OF'
        ELSE 'AFTER'
    END AS trigger_type,
    ARRAY[
        CASE WHEN trg.tgtype & 1 = 1 THEN 'INSERT' END,
        CASE WHEN trg.tgtype & 2 = 2 THEN 'DELETE' END,
        CASE WHEN trg.tgtype & 4 = 4 THEN 'UPDATE' END,
        CASE WHEN trg.tgtype & 8 = 8 THEN 'TRUNCATE' END
    ] AS event_manipulation,
    CASE trg.tgenabled
        WHEN 'O' THEN 'ENABLED'
        WHEN 'D' THEN 'DISABLED'
        WHEN 'R' THEN 'ENABLED REPLICA'
        WHEN 'A' THEN 'ENABLED ALWAYS'
    END AS trigger_enabled
FROM 
    pg_trigger trg
    JOIN pg_class tbl ON trg.tgrelid = tbl.oid
    JOIN pg_namespace ns ON tbl.relnamespace = ns.oid
WHERE 
    NOT trg.tgisinternal
ORDER BY 
    schema_name, table_name, trigger_name;
