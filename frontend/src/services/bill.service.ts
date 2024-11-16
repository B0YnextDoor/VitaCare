import { userApi } from "../api/interceptors";
import { IBill } from "../types/bills";

export const billService = {
  BILL_URL: "/bills/",

  async getAll() {
    const response = await userApi.get<IBill[]>(this.BILL_URL);
    if (response.status == 200) return response.data;
  },

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IBill>(`${this.BILL_URL}id?id=${id}`);
    if (response.status == 200) return response.data;
  },

  async getUserBills() {
    const response = await userApi.get<IBill[]>(`${this.BILL_URL}user`);
    if (response.status == 200) return response.data;
  },

  async updateBillStatus(status_id: number, id?: string) {
    if (!id) return;
    const response = await userApi.put(`${this.BILL_URL}?id=${id}`, {
      status_id,
    });
    if (response.status == 200) return response.data;
  },
};
