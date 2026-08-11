import { createClient } from "@/lib/supabase/server";
import { ClientList } from "@/components/clients/ClientList";
import Link from "next/link";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";
import { revalidatePath } from "next/cache";
async function deleteClientAction(formData: FormData) {
  "use server";

  const supabase = createClient();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Не найден id клиента");
  }
  const { count, error: ordersError } = await supabase
  .from("orders")
  .select("*", { count: "exact", head: true })
  .eq("client_id", id);

if (ordersError) {
  throw new Error(ordersError.message);
}

if (count && count > 0) {
  throw new Error(
    "Нельзя удалить клиента: у него есть связанные заказы"
  );
}
  const { data, error } = await supabase
  .from("clients")
  .delete()
  .eq("id", id)
  .select();

console.log("DELETE RESULT:", data);
console.log("DELETE ERROR:", error);

if (error) {
  throw new Error(error.message);
}

revalidatePath("/clients");

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