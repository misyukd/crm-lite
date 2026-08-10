import { StatCard } from "@/components/dashboard/StatCard";
import { mockClients, mockOrders } from "@/lib/mock-data";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function isActiveOrder(status: string) {
  return status === "new" || status === "in_progress";
}

export default function DashboardPage() {
  const totalAmount = mockOrders.reduce((sum, order) => sum + order.amount, 0);
  const activeOrdersCount = mockOrders.filter((order) =>
    isActiveOrder(order.status),
  ).length;

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Обзор вашего бизнеса
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Клиенты"
          value={String(mockClients.length)}
          hint="Всего в базе"
        />
        <StatCard
          label="Заказы"
          value={String(mockOrders.length)}
          hint="Всего заказов"
        />
        <StatCard
          label="Общая сумма"
          value={currencyFormatter.format(totalAmount)}
          hint="Сумма всех заказов"
        />
        <StatCard
          label="Активные заказы"
          value={String(activeOrdersCount)}
          hint="Новые и в работе"
        />
      </div>
    </main>
  );
}
