"use client";

import { useState } from "react";
import Link from "next/link";

import { StatusBadge } from "@/components/orders/StatusBadge";
import { DeleteOrderButton } from "@/components/orders/DeleteOrderButton";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type OrderListItem = {
  id: string;
  title: string;
  amount: number;
  status: "new" | "in_progress" | "completed" | "cancelled";
  deadline: string;
  clientName: string;
};

type OrderListProps = {
  orders: OrderListItem[];
  deleteAction: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};

function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

export function OrderList({
  orders,
  deleteAction,
}: OrderListProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const query = search.toLowerCase();

    const matchesSearch =
      order.title.toLowerCase().includes(query) ||
      order.clientName.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Список заказов
            </p>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Найдено: {filteredOrders.length}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <input
              type="text"
              placeholder="Поиск заказов..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-500 sm:min-w-72 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершённые</option>
              <option value="cancelled">Отменённые</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop table */}
<div className="hidden overflow-x-auto md:block">
  <table className="w-full min-w-[720px] text-left text-sm">
    <thead>
      <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/60">
        <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
          Название
        </th>

        <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
          Клиент
        </th>

        <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
          Сумма
        </th>

        <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
          Статус
        </th>

        <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
          Дедлайн
        </th>

        <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
          Действия
        </th>
      </tr>
    </thead>

    <tbody>
      {filteredOrders.map((order) => (
        <tr
          key={order.id}
          className="border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950/50"
        >
          <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-50">
            {order.title}
          </td>

          <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
            {order.clientName}
          </td>

          <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
            {currencyFormatter.format(order.amount)}
          </td>

          <td className="px-5 py-4">
            <StatusBadge status={order.status} />
          </td>

          <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
            {formatDate(order.deadline)}
          </td>

          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/orders/${order.id}/edit`}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Изменить
              </Link>

              <DeleteOrderButton
                orderId={order.id}
                action={deleteAction}
              />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


{/* Mobile cards */}
<div className="space-y-3 p-4 md:hidden">
  {filteredOrders.length === 0 ? (
    <p className="py-8 text-center text-sm text-zinc-500">
      Заказы не найдены
    </p>
  ) : (
    filteredOrders.map((order) => (
      <div
        key={order.id}
        className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              {order.title}
            </h3>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {order.clientName}
            </p>
          </div>

          <StatusBadge status={order.status} />
        </div>


        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">
              Сумма
            </span>

            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {currencyFormatter.format(order.amount)}
            </span>
          </div>


          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">
              Дедлайн
            </span>

            <span className="text-zinc-700 dark:text-zinc-300">
              {formatDate(order.deadline)}
            </span>
          </div>
        </div>


        <div className="mt-4 flex gap-2">
          <Link
            href={`/orders/${order.id}/edit`}
            className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-center text-sm font-medium dark:border-zinc-700"
          >
            Изменить
          </Link>

          <DeleteOrderButton
            orderId={order.id}
            action={deleteAction}
          />
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
}