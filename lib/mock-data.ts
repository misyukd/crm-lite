import type { Client, Order } from "./types";

export const mockClients: Client[] = [
  {
    id: "cl_1",
    name: "Анна Петрова",
    email: "anna@example.com",
    phone: "+7 900 111-22-33",
    company: "Петрова Studio",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "cl_2",
    name: "ООО «Север»",
    email: "info@sever.ru",
    phone: "+7 812 555-00-11",
    company: "ООО «Север»",
    createdAt: "2026-02-03T14:30:00Z",
  },
  {
    id: "cl_3",
    name: "Иван Козлов",
    email: "ivan.kozlov@gmail.com",
    phone: "+7 916 444-55-66",
    createdAt: "2026-03-20T09:15:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord_1",
    clientId: "cl_1",
    title: "Разработка лендинга",
    amount: 85000,
    status: "in_progress",
    deadline: "2026-08-25",
    createdAt: "2026-07-01T12:00:00Z",
  },
  {
    id: "ord_2",
    clientId: "cl_2",
    title: "SEO-аудит сайта",
    amount: 45000,
    status: "new",
    deadline: "2026-09-10",
    createdAt: "2026-07-28T16:00:00Z",
  },
  {
    id: "ord_3",
    clientId: "cl_1",
    title: "Поддержка сайта (3 мес.)",
    amount: 30000,
    status: "completed",
    deadline: "2026-06-30",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "ord_4",
    clientId: "cl_3",
    title: "Дизайн логотипа",
    amount: 25000,
    status: "cancelled",
    deadline: "2026-07-15",
    createdAt: "2026-06-10T11:00:00Z",
  },
  {
    id: "ord_5",
    clientId: "cl_2",
    title: "Интеграция CRM",
    amount: 120000,
    status: "in_progress",
    deadline: "2026-10-01",
    createdAt: "2026-08-01T09:00:00Z",
  },
];
