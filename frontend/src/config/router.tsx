import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layot";
import { PAGES } from "./urls";
import Home from "../pages/home/Home";
import { Auth } from "../pages/auth/Auth";
import { Account } from "../pages/account/Account";
import { Doctor } from "../pages/doctor/Doctor";
import { Appointment } from "../pages/appointment/Appointment";
import { Patient } from "../pages/patient/Patient";
import { AppointmentForm } from "../pages/appointment/AppointmentForm";
import { Bill } from "../pages/bill/Bill";
import { Diagnosis } from "../pages/diagnosis/Diagnosis";
import { Medication } from "../pages/medication/Medication";
import { Prescription } from "../pages/prescription/Prescription";
import { Record } from "../pages/record/Record";
import { DoctorForm } from "../pages/doctor/DoctorForm";
import { Schedule } from "../pages/schedule/Schedule";

export const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export const routes = [
  {
    path: PAGES.AUTH,
    element: <Auth />,
  },
  {
    path: PAGES.HOME,
    element: <Home />,
  },
  {
    path: PAGES.ACCOUNT,
    element: <Account />,
  },
  {
    path: `${PAGES.DOCTOR}/:id`,
    element: <Doctor />,
  },
  {
    path: `${PAGES.DOCTOR_FORM}/:upd?`,
    element: <DoctorForm />,
  },
  {
    path: `${PAGES.SCHEDULE}/:id?`,
    element: <Schedule />,
  },
  {
    path: `${PAGES.APPOINTMENT}/:id`,
    element: <Appointment />,
  },
  {
    path: `${PAGES.APPOINTMENT_FORM}/:upd?`,
    element: <AppointmentForm />,
  },
  {
    path: `${PAGES.BILL}/:id`,
    element: <Bill />,
  },
  {
    path: `${PAGES.PATIENT}/:id`,
    element: <Patient />,
  },
  {
    path: `${PAGES.DIAGNOSIS}/:id?`,
    element: <Diagnosis />,
  },
  {
    path: `${PAGES.MEDICATION}/:id?`,
    element: <Medication />,
  },
  {
    path: `${PAGES.PRESCRIPTION}/`,
    element: <Prescription />,
  },
  {
    path: `${PAGES.RECORD}/:id?`,
    element: <Record />,
  },
];
