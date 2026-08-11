import { createClient } from "@/lib/supabase/server";
import { OrderList } from "@/components/orders/OrderList";
import Link from "next/link";
import { revalidatePath } from "next/cache";

type RelatedClient = {
  name: string | null;
};

function getClientName(clients: RelatedClient | RelatedClient[] | null) {
  const client = Array.isArray(clients) ? clients[0] : clients;

  return client?.name ?? "—";
}

async function deleteOrderAction(formData: FormData) {
  "use server";

  const supabase = createClient();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Не найден id заказа");
  }

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/orders");
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
      <div className="mb-6 flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
      Заказы
    </h1>

    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
      Список заказов из Supabase
    </p>
  </div>

  <Link
    href="/orders/new"
    className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
  >
    Новый заказ
  </Link>
</div>

<OrderList
  orders={formattedOrders}
  deleteAction={deleteOrderAction}
/>
    </main>
  );
}
