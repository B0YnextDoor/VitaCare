import { userApi } from "../api/interceptors";
import { IPatientProfile } from "../types/user";

export const patientService = {
  PATIENT_URL: "/patients/",

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IPatientProfile>(
      `${this.PATIENT_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },
};
