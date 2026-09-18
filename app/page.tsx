import Link from "next/link";

import { StatCard } from "@/components/dashboard/StatCard";
import { createClient } from "@/lib/supabase/server";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function isActiveOrder(status: string) {
  return status === "new" || status === "in_progress";
}

function ClientsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3.2 2.6-5 5.5-5s4.8 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.5c2.8.2 4.5 1.7 5 4.5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 9h10" />
      <path d="M7 15h6" />
      <circle cx="17" cy="12" r="2" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 13h4l2-6 4 10 2-4h4" />
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("id");

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("amount, status");

  if (clientsError || ordersError) {
    return (
      <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <h1 className="text-xl font-semibold text-red-700 dark:text-red-300">
            Не удалось загрузить Dashboard
          </h1>

          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Попробуйте обновить страницу.
          </p>
        </div>
      </main>
    );
  }

  const totalAmount = (orders ?? []).reduce(
    (sum, order) => sum + Number(order.amount),
    0
  );

  const activeOrdersCount = (orders ?? []).filter((order) =>
    isActiveOrder(order.status)
  ).length;

  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              CRM Lite
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Краткий обзор клиентов, заказов и общей суммы.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/clients/new"
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              + Новый клиент
            </Link>

            <Link
              href="/orders/new"
              className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              + Новый заказ
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Клиенты"
            value={String((clients ?? []).length)}
            hint="Всего в базе"
            icon={<ClientsIcon />}
          />

          <StatCard
            label="Заказы"
            value={String((orders ?? []).length)}
            hint="Всего заказов"
            icon={<OrdersIcon />}
          />

          <StatCard
            label="Общая сумма"
            value={currencyFormatter.format(totalAmount)}
            hint="Сумма всех заказов"
            icon={<MoneyIcon />}
          />

          <StatCard
            label="Активные заказы"
            value={String(activeOrdersCount)}
            hint="Новые и в работе"
            icon={<ActivityIcon />}
          />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Link
            href="/clients"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Клиенты
            </p>

            <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Управление клиентской базой
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Добавляйте клиентов, редактируйте контакты и находите нужных через поиск.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
              Открыть клиентов →
            </p>
          </Link>

          <Link
            href="/orders"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Заказы
            </p>

            <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Контроль заказов
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Следите за суммами, статусами и дедлайнами всех текущих заказов.
            </p>

            <p className="mt-5 text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
              Открыть заказы →
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}