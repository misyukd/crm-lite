import { createClient } from "@/lib/supabase/server";
import { ClientList } from "@/components/clients/ClientList";

export default async function ClientsPage() {
  const supabase = createClient();
console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "KEY EXISTS:",
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
);

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
      <h1>Клиенты</h1>
      <p>Список клиентов из Supabase</p>

      <ClientList clients={formattedClients} />
    </main>
  );
}