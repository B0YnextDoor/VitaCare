--- users view
CREATE OR REPLACE 
VIEW UsersView AS
	SELECT r.id as role_id, r.name as role_name, u.email as user_email, ui.name as user_name, ui.surname as user_surname, u.id as user_id
	FROM "roles" as r
	JOIN "users" AS u ON r.id = u.role_id
	JOIN "user_infos" AS ui ON u.id = ui.user_id;

--- patients view
CREATE OR REPLACE
VIEW PatientsView AS
	SELECT uv.user_id as user_id, uv.user_email, uv.user_name, uv.user_surname, p.id as patient_id, p.birthday,
	(CASE 
		WHEN p.gender = 'm' THEN 'Male'
		ELSE 'Female'
	END) as gender
	FROM "patients" AS p
	JOIN UsersView uv ON p.user_id = uv.user_id;

--- doctors view
CREATE OR REPLACE
VIEW DoctorsView AS
	SELECT uv.user_id as user_id, uv.user_email, uv.user_name, uv.user_surname, d.id as doctor_id, dq.id AS q_id, dq.name AS q_name, dq.multiplier AS q_mult, ds.id AS spec_id, ds.name AS spec_name, ds.description AS spec_desc, ds.service_fee
	FROM "doctors" d
	JOIN "doctor_qualifications" dq ON d.qualification_id = dq.id
	JOIN "doctor_specializations" ds ON d.specialization_id = ds.id
	JOIN UsersView uv ON d.user_id = uv.user_id;