# Krasyov Pavel

# 253502

---

# Тема: система управления медицинского учреждения "VitaCare"

---

## Функциональные требования

Система управления предназначена для администрирования медицинских услуг, управления расписанием врачей, больничными листами, а также для контроля проведения приёмов пациентов, выписки рецептов, выставление счетов за услуги.

Система включает роли администратора, врача и пациента.
Для доступа к системе пользователи проходят аутентификации (email + пароль) и авторизации (админ/врач/пациент).

- Администратор управляет всеми данными, добавляет новых врачей, лекарства, составляет график работы врачей, подтверждает оплату приёмов/отменяет приём и может просматривать журнал действий пользователей.
- Врачи после входа в систему могут управлять пациентами: проводить приёмы, смотреть историю болезни пациента и справочник заболеваний с их описанием, составлять больничные листы, выписывать рецепты на лекарства. _Счёт будет выставляться автоматически после завершения приема, его сумма будет зависеть от базовой стоимости консультации специалиста, его категории и стоимости препаратов._
- Пациенты после входа/регистрации могут записаться на приём к врачу/отменить приём, оплачивать счета за приём и просматривать свою историю болезни(формируется из больничных листов пациента).

---

## Основные сущности

> Роль:  
> id - уникальный индентификатор  
> name - название роли (admin / doctor / patient)

```
CREATE TABLE "roles" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(20) UNIQUE NOT NULL
);
```

> Пользователь:  
> (связь многие к одному с сущностью 'Роль')  
> id - уникальный идентификатор  
> email - электронная почта пользователя для связи  
> password - пароль от аккаунта  
> role_id - идентификатор роли пользователя

```
CREATE TABLE "users" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "email" varchar(100) UNIQUE NOT NULL,
  "password" text NOT NULL,
  "role_id" integer NOT NULL CONSTRAINT positive_role_id CHECK (role_id > 0) REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

> Информация пользователя:  
> (связь один к одному с сущностью 'Пользователь')  
> id - уникальный идентификатор  
> name - имя пользователя  
> surname - фамилия пользователя  
> user_id - идентификатор пользователя

```
CREATE TABLE "user_infos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(64) NOT NULL,
  "surname" varchar(64) NOT NULL,
  "user_id" integer NOT NULL CONSTRAINT positive_user_id CHECK (user_id > 0) REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)
```

> Тип действия:  
> id - уникальный идентификатор  
> name - тип действия (account/appointment/billing/prescription/diagnosis/medical history)

```
CREATE TABLE "log_action_types" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(20) NOT NULL,
)
```

> Запись действия пользователя:  
> (связь многие к одному с сущностью 'Пользователь',  
> связь многие к одному с сущностью 'Тип действия')  
> id - уникальный идентификатор  
> type_id - идентификатор типа действия
> description - описание действия  
> user_id - идентификатор пользователя

```
CREATE TABLE "log_actions" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "type_id" integer NOT NULL REFERENCES "log_action_types" ("id"), ON DELETE RESTRICT ON UPDATE CASCADE
  "description" text NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_log_ids CHECK (type_id > 0 AND user_id > 0)
);
```

> Пациент:  
> (связь один к одному с сущностью 'Пользователь',  
> связь многие ко многим с сущностью 'Доктор' через сущность 'Приём')  
> id - уникальный идентификатор  
> birhday - день рождения пациента  
> gender - пол пациента  
> user_id - идентификатор пользователя

```
CREATE TABLE "patients" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "birthday" date NOT NULL,
  "gender" varchar(1) NOT NULL CONSTRAINT check_patients_gender CHECK (gender IN ('m', 'f')),
  "user_id" integer NOT NULL CONSTRAINT positive_user_id CHECK (user_id > 0) REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
```

> Антропометрия пациента:  
> (связь одни к одному с сущностью 'Пациент')  
> id - уникальный идентификатор  
> measurement_date - дата измерения  
> weight - вес пациента  
> height - рост пациента  
> patient_id - идентификатор пациента

```
CREATE TABLE "patients_anthropometry" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "measurement_date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "weight" DECIMAL(4,1) NOT NULL,
  "height" DECIMAL(3,2) NOT NULL,
  "patient_id" INTEGER NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT positive_anthropometry CHECK (patient_id > 0 AND weight > 0 AND height > 0)
);
```

> Категория врача:  
> id - уникальный идентификатор  
> name - название категории  
> multiplier - коэффициент за категорию (2-я - х1.2; 1-я - х1.5; высшая - х2)

```
CREATE TABLE "doctor_qualifications" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(10) NOT NULL DEFAULT 'second',
  "multiplier" decimal(3,2) NOT NULL DEFAULT 1.2 CONSTRAINT positive_multiplier CHECK (multiplier > 0)
);
```

> Специализация врача:  
> id - уникальный идентификатор  
> name - название специализации  
> description - описание специализации  
> service_fee - плата за приём

```
CREATE TABLE "doctor_specializations" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "service_fee" decimal(19,2) NOT NULL CONSTRAINT positive_fee CHECK (service_fee > 0)
);
```

> Доктор:  
> (связь один к одному с сущностью 'Пользователь',  
> связь многие к одному с сущностью 'Специализация врача',  
> связь многие ко многим с сущностью 'Пациент' через сущность 'Приём')  
> id - уникальный идентификатор  
> qualification_id - идентификатор категории врача  
> user_id - идентификатор пользователя  
> specialization_id - идентификатор специализации врача

```
CREATE TABLE "doctors" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "qualification_id" integer NOT NULL REFERENCES "doctor_qualifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "user_id" integer NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "specialization_id" integer NOT NULL REFERENCES "doctor_specializations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  CONSTRAINT positive_doctor_ids CHECK (qualification_id > 0 AND user_id > 0 AND specialization_id > 0)
);
```

> Лекарство:  
> id - уникальный идентификатор  
> name - название лекарства  
> description - описание лекарства  
> price - цена лекарства

```
CREATE TABLE "medications" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL,
  "description" text NOT NULL,
  "price" decimal(19,2) NOT NULL CONSTRAINT positive_price CHECK (price > 0)
);
```

> Диагноз:  
> id - уникальный идентификатор  
> name - название диагноза  
> description - описание симптомов

```
CREATE TABLE "diagnosis" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" text NOT NULL
);
```

> Больничный лист:  
> (связь многие к одному с сущностью 'Пациент',  
> связь многие к одному с сущностью 'Доктор',  
> связь многие к одному с сущностью 'Диагноз')  
> id - уникальный идентификатор  
> diagnosis_id - идентификатор диагноза пациента  
> conclusion_date - дата заключения  
> recomendations - рекомендации врача  
> doctor_id - идентификатор врача  
> patient_id - идентификатор пациента

```
CREATE TABLE "medical_records" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "diagnosis_id" integer NOT NULL REFERENCES "diagnosis" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "conclusion_date" date NOT NULL DEFAULT CURRENT_DATE,
  "recomendations" TEXT DEFAULT 'Bed rest, isolation.',
  "doctor_id" integer NOT NULL DEFAULT 0 REFERENCES "doctors" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
  "patient_id" integer NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_medical_records_ids CHECK (diagnosis_id > 0 AND doctor_id >= 0 AND patient_id > 0)
);
```

> Рецепт:  
> (связь многие к одному с сущностью 'Лекарство',  
> связь многие к одному с сущностью 'Больничный лист')  
> id - уникальный идентификатор  
> dosage - доза лекарства в мг  
> issue_date - дата выписки рецепта  
> medication_id - идентификатор лекарства  
> medical_record_id - идентификатор больничного листа

```
CREATE TABLE "prescriptions" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "dosage" decimal(6,2) NOT NULL,
  "issue_date" date NOT NULL DEFAULT CURRENT_DATE,
  "medication_id" integer NOT NULL DEFAULT 0 REFERENCES "medications" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
  "medical_record_id" integer NOT NULL REFERENCES "medical_records" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_prescriptions_ids CHECK (medication_id >= 0 AND medical_record_id > 0)
);
```

> Статус приёма:
> id - уникальный идентификатор  
> name - название статуса (active / passed / canceled by client / canceled by clinic)

```
CREATE TABLE "appointment_statuses" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(20) NOT NULL DEFAULT 'active'
);
```

> Приём:  
> (связь многие к одному с сущностью 'Пациент',  
> связь многие к одному с сущностью 'Доктор',  
> связь многие к одному с сущностью 'Статус приёма')  
> id - уникальный идентификатор  
> date - дата и время приёма  
> status_id - идентификатор статуса приёма  
> doctor_id - идентификатор врача  
> patient_id - идентификатор пациента

```
CREATE TABLE "appointments" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "complaints" text NOT NULL DEFAULT 'scheduled appointment',
  "status_id" integer NOT NULL REFERENCES "appointment_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "doctor_id" integer NOT NULL REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "patient_id" integer NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_appointments_ids CHECK (status_id > 0 AND doctor_id > 0 AND patient_id > 0)
);
```

> Выходные врачей:  
> id - уникальный идентификатор  
> pattern - выходные дни (ends - Sat, Sun / odd - Mon, Wen, Fri, Sun / even - Tue, Thu, Sat / all - vacation)

```
CREATE TABLE "skip_days_patterns" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "pattern" varchar(10) NOT NULL DEFAULT 'ends'
);
```

> График работы врача:  
> (связь один к одному с сущностью 'Доктор')  
> id - уникальный идентификатор  
> start_time - время начала рабочего дня  
> end_time - время окончания рабочего дня  
> skip_days_pattern_id - идентификатор выходных дней врача  
> doctor_id - идентификатор врача

```
CREATE TABLE "doctors_schedules" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "start_time" TIME NOT NULL DEFAULT '08:00',
  "end_time" TIME NOT NULL DEFAULT '16:00',
  "skip_days_pattern_id" INTEGER NOT NULL REFERENCES "skip_days_patterns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "doctor_id" INTEGER NOT NULL REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT positive_schedules_id CHECK (doctor_id > 0 AND skip_days_pattern_id > 0)
);
```

> Статус оплаты:  
> id - уникальный идентификатор  
> name - название статуса (not paid - не оплачен / pending - ожидает подтверждения / paid - оплачен)

```
CREATE TABLE "payment_statuses" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" varchar(10) NOT NULL DEFAULT 'not paid'
);
```

> Счёт за приём:  
> (связь многие к одному с сущностью 'Пациент',  
> связь многие к одному с сущностью 'Статус оплаты')  
> id - уникальный идентификатор  
> value - сумма счёта  
> invoice_date - дата выставления счёта  
> payment_status_id - идентификатор статус оплаты (не оплачен, ожидает подтверждения, оплачен)  
> patient_id - идентификатор пациента

```
CREATE TABLE "bills" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "value" decimal(19,2) NOT NULL,
  "invoice_date" date NOT NULL DEFAULT CURRENT_DATE,
  "payment_status_id" integer NOT NULL REFERENCES "payment_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "patient_id" integer NOT NULL REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT positive_bills_ids CHECK (payment_status_id > 0 AND patient_id > 0)
);
```

---

## Даталогическая модель базы данных

![Database.](/VitaCare.png "Database schema")

---

## Создание физической базы данных и её заполнение

1. Заходим за пользователя postgres:

```
psql -U postgres
```

2. Создаём нового пользователя с правами суперпользователя и возможностью создавать базы данных:

```
   CREATE USER vita_admin WITH SUPERUSER CREATEDB PASSWORD 'password';
```

3. Выходим и заходим как новый пользователь:

```
\q
psql -U vita_admin -d postgres
```

4. Создаём базу данных:

```
CREATE DATABASE vita_care WITH OWNER = vita_admin ENCODING = 'UTF8' LOCALE_PROVIDER = 'libc' CONNECTION LIMIT
   = -1 IS_TEMPLATE = False;
```

5. Убедимся что она создана и переключимся на неё:

```
   \l
   \c vita_care
```

6. Создаём таблицы базы данных:

```
\i 'D:\\BD\\CreateTables.sql'
```

7. Заполняем таблицы данными:

```
\i 'D:\\BD\\Insertion.sql'
```
