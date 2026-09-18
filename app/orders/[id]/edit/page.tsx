import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type EditOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function updateOrderAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const status = String(formData.get("status") ?? "");
  const deadline = String(formData.get("deadline") ?? "");

  if (!id || !clientId || !title || !status || !deadline) {
    throw new Error("Заполни обязательные поля");
  }

  if (amount <= 0) {
    throw new Error("Сумма должна быть больше нуля");
  }

  const { error } = await supabase
    .from("orders")
    .update({
      client_id: clientId,
      title,
      amount,
      status,
      deadline,
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/orders");
}

export default async function EditOrderPage({
  params,
}: EditOrderPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return <p>Заказ не найден</p>;
  }

  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  if (clientsError) {
    return <p>Ошибка загрузки клиентов: {clientsError.message}</p>;
  }

  return (
    <main className="max-w-2xl">
      <h1 className="text-3xl font-semibold">
        Редактирование заказа
      </h1>

      <form action={updateOrderAction} className="mt-8 space-y-5">
        <input type="hidden" name="id" value={order.id} />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Клиент
          </label>

          <select
            name="clientId"
            required
            defaultValue={order.client_id}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          >
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
            minLength={2}
            maxLength={100}
            defaultValue={order.title}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
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
            min={1}
            step={1}
            defaultValue={order.amount}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Статус
          </label>

          <select
            name="status"
            defaultValue={order.status}
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
            defaultValue={order.deadline}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Сохранить изменения
          </button>

          <a
            href="/orders"
            className="rounded-lg border px-5 py-3 font-medium"
          >
            Отмена
          </a>
        </div>
      </form>
    </main>
  );
}