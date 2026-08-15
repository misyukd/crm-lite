import { createClient } from "@/lib/supabase/server";
import { ClientList } from "@/components/clients/ClientList";
import Link from "next/link";
import { revalidatePath } from "next/cache";
async function deleteClientAction(formData: FormData) {
  "use server";

  const supabase = createClient();

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
  const supabase = createClient();

  const { data: clients, error } = await supabase
    .from("clients")       
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main>
        <h1>Клиенты</h1>
        <p>Ошибка загрузки клиентов: {error.message}</p>
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
    <main>
     <div className="mb-6 flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
      Клиенты
    </h1>

    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
      Список клиентов из Supabase
    </p>
  </div>

  <Link
    href="/clients/new"
    className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
  >
    Новый клиент
  </Link>
</div>
<ClientList
  clients={formattedClients}
  deleteAction={deleteClientAction}
/>
    </main>
  );
}