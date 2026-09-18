import Link from "next/link";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { ClientList } from "@/components/clients/ClientList";

async function deleteClientAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return {
      success: false,
      message: "Не найден id клиента",
    };
  }

  const { count, error: ordersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("client_id", id);

  if (ordersError) {
    return {
      success: false,
      message: ordersError.message,
    };
  }

  if (count && count > 0) {
    return {
      success: false,
      message: "Нельзя удалить клиента: у него есть связанные заказы",
    };
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/clients");

  return {
    success: true,
    message: "Клиент удалён",
  };
}

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <h1 className="text-xl font-semibold text-red-700 dark:text-red-300">
            Не удалось загрузить клиентов
          </h1>

          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const formattedClients = (clients ?? []).map((client) => ({
    id: client.id,
    name: client.name,
    email: client.email ?? undefined,
    phone: client.phone ?? undefined,
    company: client.company ?? undefined,
    createdAt: client.created_at,
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
              Клиенты
            </h1>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Управляйте клиентской базой и контактной информацией.
            </p>
          </div>

          <Link
            href="/clients/new"
            className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            + Новый клиент
          </Link>
        </div>

        <ClientList
          clients={formattedClients}
          deleteAction={deleteClientAction}
        />
      </div>
    </main>
  );
}