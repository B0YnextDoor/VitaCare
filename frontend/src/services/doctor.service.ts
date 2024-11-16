import { userApi } from "../api/interceptors";
import { IDoctor, IDoctorCreate, IDoctorUpdate } from "../types/doctor";
import { IDoctorProfile } from "../types/user";

export const doctorService = {
  DOCTOR_URL: "/doctor/",

  async getAll() {
    const response = await userApi.get<IDoctor[]>(this.DOCTOR_URL);
    if (response.status == 200) return response.data;
  },

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IDoctorProfile>(
      `${this.DOCTOR_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async create(data: IDoctorCreate) {
    const response = await userApi.post(this.DOCTOR_URL, data);
    return response;
  },

  async update(data: IDoctorUpdate) {
    const { id, ...rest } = data;
    if (!id) return;
    const response = await userApi.put(`${this.DOCTOR_URL}?id=${id}`, rest);
    return response;
  },
};
