export interface IBill {
  id: number;
  amount: number;
  invoice_date: string;
  status_id: number;
  status_name: string;
  user_id: number;
  user_email: string;
  user_name: string;
  user_surname: string;
}
