--- roles table
INSERT INTO "roles" ("name") 
VALUES 
	('admin'),
	('doctor'),
	('patient');

--- users table
INSERT INTO "users" ("email", "password", "role_id") 
VALUES 
	('admin@example.com', '123456', 1),
	('doctor1@example.com', '123456', 2),
	('doctor2@example.com', '123456', 2),
	('doctor3@example.com', '123456', 2),
	('doctor4@example.com', '123456', 2),
	('doctor5@example.com', '123456', 2),
	('doctor6@example.com', '123456', 2),
	('doctor7@example.com', '123456', 2),
	('doctor8@example.com', '123456', 2),
	('doctor9@example.com', '123456', 2),
	('doctor10@example.com', '123456', 2),
	('patient1@example.com', '123456', 3),
	('patient2@example.com', '123456', 3),
	('patient3@example.com', '123456', 3),
	('patien4@example.com', '123456', 3),
	('patient5@example.com', '123456', 3);

--- user_infos table
INSERT INTO "user_infos" ("name", "surname", "user_id")
VALUES 
	('Van', 'Darkholm', 1),
	('Antonio', 'Banderas', 2),
    ('Rayan', 'Gosling', 3),
    ('Victor', 'Korneplod', 4),
	('Stanislave', 'Boretski', 5),
	('Vlad', 'Borsh', 6),
	('Ivan', 'Zolo', 7),
	('Genadiy', 'Bukin', 8),
	('Leonel', 'Messi', 9),
	('Christiano', 'Ronaldo', 10),
	('Billy', 'Harington', 11),
	('Paul', 'Petrov', 12),
	('Yaroslave', 'Extremskiy', 13),
	('Shershen', 'Shershnev', 14),
	('Anton', 'Guglis', 15),
	('Tayler', 'Derden', 16);

--- log_action_types table
INSERT INTO "log_action_types" ("name")
VALUES
	('account'),
	('appointment'),
	('billing'),
	('prescription'),
	('diagnosis'),
	('medical history');

--- log_actions table
INSERT INTO "log_actions" ("type_id", "description", "user_id") 
VALUES
	(1, 'User loged in', 12),
	(2, 'User made an appointment', 13),
	(3, 'User paid for the appointment', 14),
	(4, 'Doc wrote a prescription', 2),
	(5, 'Doc made up a medical record', 3),
	(6, 'User got his medical history', 15);

--- patients table
INSERT INTO "patients" ("birthday", "gender", "user_id") 
VALUES
	('1987-10-11', 'm', 12),
	('1993-02-28', 'f', 13),
	('1975-12-17', 'm', 14),
	('1997-07-09', 'f', 15),
	('1984-03-22', 'm', 16);

--- patients_anthropometry table
INSERT INTO "patients_anthropometry" ("measurement_date", "weight", "height", "patient_id") 
VALUES
	('2024-05-01', 75.5, 1.80, 1),
	('2024-05-02', 62.3, 1.65, 2),
	('2024-05-03', 88.7, 1.90, 3),
	('2024-05-04', 55.0, 1.60, 4),
	('2024-05-05', 70.2, 1.75, 5);

--- doctor_qualifications table
INSERT INTO "doctor_qualifications" ("name", "multiplier") 
VALUES
	('second', 1.20),
	('first', 1.50),
	('highest', 2.00);

--- doctor_specializations table
INSERT INTO "doctor_specializations" ("name", "description", "service_fee") 
VALUES
	('Cardiologist', 'Specializes in diagnosing and treating heart-related conditions', 150.00),
	('Dermatologist', 'Focuses on conditions affecting the skin, hair, and nails', 130.00),
	('Neurologist', 'Deals with disorders of the nervous system, including the brain and spinal cord', 170.00),
	('Pediatrician', 'Provides medical care for infants, children, and adolescents', 120.00),
	('Orthopedist', 'Specializes in the musculoskeletal system, including bones, joints, and muscles', 160.00),
	('Ophthalmologist', 'Focuses on eye and vision care', 140.00),
	('Dentist', 'Specializes in oral health and treats diseases and conditions of the mouth', 135.00),
	('Surgeon', 'Performs surgical procedures to treat injuries, diseases, and deformities', 200.00),
	('Psychiatrist', 'Specializes in mental health, including substance use disorders', 165.00),
	('General Practitioner', 'Provides primary care and treats a wide range of health conditions', 110.00);

--- doctors table
INSERT INTO "doctors" ("qualification_id", "user_id", "specialization_id") 
VALUES
	(2, 2, 1),
	(3, 3, 2),
	(1, 4, 3),
	(2, 5, 4),
	(3, 6, 5),
	(2, 7, 6),
	(1, 8, 7),
	(3, 9, 8),
	(2, 10, 9),
	(1, 11, 10);

--- medications table
INSERT INTO "medications" ("name", "description", "price") 
VALUES
	('Aspirin', 'Pain reliever and fever reducer', 5.99),
	('Ibuprofen', 'Nonsteroidal anti-inflammatory drug (NSAID) used to reduce pain, fever, and inflammation', 7.49),
	('Amoxicillin', 'Antibiotic used to treat bacterial infections', 12.99),
	('Lisinopril', 'ACE inhibitor used to treat high blood pressure and heart failure', 15.50),
	('Levothyroxine', 'Synthetic thyroid hormone used to treat hypothyroidism', 18.75),
	('Metformin', 'Oral diabetes medicine that helps control blood sugar levels', 9.99),
	('Amlodipine', 'Calcium channel blocker used to treat high blood pressure and angina', 11.25),
	('Omeprazole', 'Proton pump inhibitor used to reduce stomach acid and treat acid reflux', 14.50),
	('Gabapentin', 'Anticonvulsant and nerve pain medication', 22.99),
	('Sertraline', 'Selective serotonin reuptake inhibitor (SSRI) used to treat depression and anxiety', 16.75);

--- diagnosis table
INSERT INTO "diagnosis" ("name", "description") 
VALUES
	('Influenza', 'Sudden onset of fever, chills, headache, muscle pain, and fatigue. Often accompanied by cough, sore throat, and runny nose.'),
	('Hypertension', 'Persistently elevated blood pressure, often without noticeable symptoms. May cause headaches, shortness of breath, or nosebleeds in severe cases.'),
	('Type 2 Diabetes', 'Increased thirst, frequent urination, blurred vision, slow-healing wounds, and unexplained weight loss. May also cause fatigue and increased hunger.'),
	('Asthma', 'Wheezing, shortness of breath, chest tightness, and coughing, particularly at night or early morning. Symptoms often worsen with exercise or exposure to allergens.'),
	('Migraine', 'Intense, throbbing headache often accompanied by nausea, vomiting, and sensitivity to light and sound. May be preceded by visual disturbances known as aura.'),
	('Osteoarthritis', 'Joint pain and stiffness, particularly after periods of inactivity. Affected joints may be swollen and have reduced range of motion.'),
	('Depression', 'Persistent feelings of sadness, loss of interest in activities, changes in sleep and appetite, difficulty concentrating, and thoughts of death or suicide.'),
	('Pneumonia', 'Cough with phlegm, fever, chills, and difficulty breathing. May also cause chest pain, fatigue, and loss of appetite.'),
	('Eczema', 'Dry, itchy, and inflamed skin. May present as red, scaly patches or small, fluid-filled blisters. Often appears on hands, feet, face, and behind the knees.');

--- medical_records table
INSERT INTO "medical_records" ("diagnosis_id", "conclusion_date", "doctor_id", "patient_id") 
VALUES
	(1, '2024-01-15', 10, 1),
	(2, '2024-02-20', 1, 2),
	(6, '2024-03-05', 8, 3),
	(7, '2024-04-10', 9, 4),
	(9, '2024-05-01', 2, 5);

--- prescriptions table
INSERT INTO "prescriptions" ("dosage", "issue_date", "medication_id", "medical_record_id") 
VALUES
	(100.00, '2024-01-16', 1, 1),
	(50.50, '2024-02-21', 4, 2),
	(200.75, '2024-03-06', 2, 3),
	(30.00, '2024-04-11', 10, 4),
	(150.25, '2024-05-02', 3, 5);

--- appointment_statuses table
INSERT INTO "appointment_statuses" (name) 
VALUES
	('active'),
	('passed'),
	('canceled by client'),
	('canceled by clinic');

--- appointments table
INSERT INTO "appointments" ("date", "complaints", "status_id", "doctor_id", "patient_id") 
VALUES
	('2024-10-01 10:00:00', 'Routine checkup', 2, 10, 1),
	('2024-10-02 14:30:00', 'Headache', 2, 1, 2),
	('2024-10-03 09:15:00', 'Canceled due to patient unavailability', 3, 8, 3),
	('2024-10-04 16:45:00', 'Clinic rescheduling needed', 2, 9, 4),
	('2024-10-05 11:00:00', 'Follow-up on previous treatment', 2, 2, 5);

--- skip_days_patterns table
INSERT INTO "skip_days_patterns" ("pattern") 
VALUES
	('ends'),
	('odd'),
	('even'),
	('all');

--- doctors_schedules table
INSERT INTO "doctors_schedules" ("start_time", "end_time", "skip_days_pattern_id", "doctor_id") 
VALUES
	('08:00', '16:00', 1, 1),
	('09:00', '17:00', 2, 2),
	('10:00', '18:00', 3, 3),
	('08:30', '16:30', 1, 4),
	('09:30', '17:30', 2, 5),
	('10:30', '18:30', 3, 6),
	('08:00', '14:00', 4, 7),
	('10:00', '16:00', 1, 8),
	('12:00', '20:00', 2, 9),
	('09:00', '15:00', 3, 10);

--- payment_statuses table
INSERT INTO "payment_statuses" ("name") 
VALUES
	('not paid'),
	('pending'),
	('paid');

--- bills table
INSERT INTO "bills" ("value", "invoice_date", "payment_status_id", "patient_id") 
VALUES
	(250.50, '2024-10-26', 3, 1), 
	(230.00, '2024-10-25', 3, 2),
	(175.25, '2024-10-24', 3, 3),
	(150.00, '2024-10-26', 3, 4),
	(300.75, '2024-10-25', 3, 5);