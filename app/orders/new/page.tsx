import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function createOrderAction(formData: FormData) {
  "use server";

  const supabase = createClient();

  const clientId = String(formData.get("clientId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const status = String(formData.get("status") ?? "new");
  const deadline = String(formData.get("deadline") ?? "");

  if (!clientId || !title || !amount || !deadline) {
    throw new Error("Заполни обязательные поля");
  }

  const { error } = await supabase.from("orders").insert({
    client_id: clientId,
    title,
    amount,
    status,
    deadline,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/orders");
}

export default async function NewOrderPage() {
  const supabase = createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  if (error) {
    return <p>Ошибка загрузки клиентов: {error.message}</p>;
  }

  return (
    <main className="max-w-2xl">
      <h1 className="text-3xl font-semibold">
        Новый заказ
      </h1>

      <form action={createOrderAction} className="mt-8 space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Клиент
          </label>

          <select
            name="clientId"
            required
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          >
            <option value="">Выберите клиента</option>

            {(clients ?? []).map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Название заказа
          </label>

          <input
            name="title"
            required
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
            placeholder="Разработка сайта"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Сумма
          </label>

          <input
            name="amount"
            type="number"
            required
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
            placeholder="85000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Статус
          </label>

          <select
            name="status"
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          >
            <option value="new">Новый</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершён</option>
            <option value="cancelled">Отменён</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Дедлайн
          </label>

          <input
            name="deadline"
            type="date"
            required
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Создать заказ
        </button>
      </form>
    </main>
  );
}