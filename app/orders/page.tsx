import Link from "next/link";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { OrderList } from "@/components/orders/OrderList";

type RelatedClient = {
  name: string | null;
};

function getClientName(clients: RelatedClient | RelatedClient[] | null) {
  const client = Array.isArray(clients) ? clients[0] : clients;

  return client?.name ?? "—";
}

async function deleteOrderAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return {
      success: false,
      message: "Не найден id заказа",
    };
  }

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/orders");

  return {
    success: true,
    message: "Заказ удалён",
  };
}

export default async function OrdersPage() {
  const supabase = await createClient();

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
      <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <h1 className="text-xl font-semibold text-red-700 dark:text-red-300">
            Не удалось загрузить заказы
          </h1>

          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        </div>
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
    clientId: order.client_id,
  }));

  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              CRM Lite
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Заказы
            </h1>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Управляйте суммами, статусами и дедлайнами заказов.
            </p>
          </div>

          <Link
            href="/orders/new"
            className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            + Новый заказ
          </Link>
        </div>

        <OrderList
          orders={formattedOrders}
          deleteAction={deleteOrderAction}
        />
      </div>
    </main>
  );
}