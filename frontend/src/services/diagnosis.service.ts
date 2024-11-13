import { userApi } from "../api/interceptors";
import { IDiagnosisDb } from "../types/med";

export const diagnosisService = {
  BASE_URL: "/diagnosis/",

  async getAll() {
    const response = await userApi.get<IDiagnosisDb[]>(this.BASE_URL);
    if (response.status == 200) return response.data;
  },

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IDiagnosisDb>(
      `${this.BASE_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async create(data: IDiagnosisDb) {
    const response = await userApi.post(this.BASE_URL, data);
    if (response.status == 200) return response.data;
  },

  async update(data: IDiagnosisDb) {
    if (!data.id) return;
    const { id, ...rest } = data;
    const response = await userApi.put(`${this.BASE_URL}?id=${id}`, rest);
    if (response.status == 200) return response.data;
  },

  async delete(id?: number) {
    if (!id) return;
    const response = await userApi.delete(`${this.BASE_URL}?id=${id}`);
    if (response.status == 200) return response.data;
  },
};
