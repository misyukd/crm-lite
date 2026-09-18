"use client";
import { useState } from "react";
import { StatusBadge } from "@/components/orders/StatusBadge";
import Link from "next/link";
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
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-4 flex gap-3">
      <input
  type="text"
  placeholder="Поиск заказов..."
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
/>

  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
    className="rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
  >
    <option value="all">Все статусы</option>
    <option value="new">Новые</option>
    <option value="in_progress">В работе</option>
    <option value="completed">Завершённые</option>
    <option value="cancelled">Отменённые</option>
  </select>
</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Название
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Клиент
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Сумма
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Статус
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Дедлайн
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Действия
              </th>
          </tr>
          </thead>

          <tbody>
  {filteredOrders.length === 0 ? (
    <tr>
      <td
        colSpan={6}
        className="px-4 py-8 text-center text-zinc-500"
      >
        Заказы не найдены
      </td>
    </tr>
  ) : (
    filteredOrders.map((order) => (
      <tr
        key={order.id}
        className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
      >
        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
          {order.title}
        </td>

        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
          {order.clientName}
        </td>

        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
          {currencyFormatter.format(order.amount)}
        </td>

        <td className="px-4 py-3">
          <StatusBadge status={order.status} />
        </td>

        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
          {formatDate(order.deadline)}
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href={`/orders/${order.id}/edit`}
              className="font-medium text-zinc-900 underline dark:text-zinc-100"
            >
              Редактировать
            </Link>

            <DeleteOrderButton
              orderId={order.id}
              action={deleteAction}
            />
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}