export type OrderStatus = "new" | "in_progress" | "completed" | "cancelled";

export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  clientId: string;
  title: string;
  amount: number;
  status: OrderStatus;
  deadline: string;
  createdAt: string;
};
