import { OrderList } from "@/components/orders/OrderList";
import { mockClients, mockOrders } from "@/lib/mock-data";

export default function OrdersPage() {
  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Заказы</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Список всех заказов
        </p>
      </div>

      <OrderList orders={mockOrders} clients={mockClients} />
    </main>
  );
}
