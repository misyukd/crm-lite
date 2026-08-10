import { ClientList } from "@/components/clients/ClientList";
import { mockClients } from "@/lib/mock-data";

export default function ClientsPage() {
  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Клиенты</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Список всех клиентов
        </p>
      </div>

      <ClientList clients={mockClients} />
    </main>
  );
}
