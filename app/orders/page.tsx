import { createClient } from "@/lib/supabase/server";
import { OrderList } from "@/components/orders/OrderList";

type RelatedClient = {
  name: string | null;
};

function getClientName(clients: RelatedClient | RelatedClient[] | null) {
  const client = Array.isArray(clients) ? clients[0] : clients;

  return client?.name ?? "—";
}

export default async function OrdersPage() {
  const supabase = createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      title,
      amount,
      status,
      deadline,
      created_at,
      client_id,
      clients (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main>
        <h1>Заказы</h1>
        <p>Ошибка загрузки заказов: {error.message}</p>
      </main>
    );
  }
  const formattedOrders = (orders ?? []).map((order) => ({
    id: order.id,
    title: order.title,
    amount: Number(order.amount),
    status: order.status,
    deadline: order.deadline,
    clientName: getClientName(order.clients),
  }));

  return (
    <main>
      <h1>Заказы</h1>
      <p>Список заказов из Supabase</p>

      <OrderList orders={formattedOrders} />
    </main>
  );
}
