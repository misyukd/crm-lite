import { StatusBadge } from "@/components/orders/StatusBadge";

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
};

function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}