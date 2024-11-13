class CONFIG {
  TOKEN = "access_token";
  VIEW_TYPE = "view-type";
  APP_ID = "app-id";
  DOC_ID = "doc-id";
}

export const config = new CONFIG();

export const ROLES = {
  ADMIN: 1,
  DOCTOR: 2,
  PATIENT: 3,
};

export const SCHEDULE_PATTRENS = {
  ALL: "all",
  ENDS: "ends",
  ODD: "odd",
  EVEN: "even",
};

export const APP_STATUS = {
  ACTIVE: 1,
  PASSED: 2,
  CANCELLED_CLIENT: 3,
  CANCELLED_CLINIC: 4,
};

export const BILL_STATUS = {
  NOT_PAID: 1,
  PENDING: 2,
  PAID: 3,
};
