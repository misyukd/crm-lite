import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function createOrderAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Пользователь не авторизован");
  }

  const clientId = String(formData.get("clientId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const status = String(formData.get("status") ?? "new");
  const deadline = String(formData.get("deadline") ?? "");

  if (!clientId || !title || !deadline) {
    throw new Error("Заполни обязательные поля");
  }

  if (amount <= 0) {
    throw new Error("Сумма должна быть больше нуля");
  }

  const { error } = await supabase.from("orders").insert({
    client_id: clientId,
    title,
    amount,
    status,
    deadline,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/orders");
}

export default async function NewOrderPage() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  if (error) {
    return (
      <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
            <h1 className="text-xl font-semibold text-red-700 dark:text-red-300">
              Не удалось загрузить клиентов
            </h1>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500";

  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/orders"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Назад к заказам
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Новый заказ
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Создайте новый заказ и привяжите его к клиенту.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <form action={createOrderAction} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Клиент <span className="text-red-500">*</span>
              </label>

              <select
                name="clientId"
                required
                className={inputClass}
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
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Название заказа <span className="text-red-500">*</span>
              </label>

              <input
                name="title"
                required
                minLength={2}
                maxLength={100}
                className={inputClass}
                placeholder="Разработка сайта"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Сумма <span className="text-red-500">*</span>
              </label>

              <input
                name="amount"
                type="number"
                required
                min={1}
                step={1}
                className={inputClass}
                placeholder="85000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Статус
              </label>

              <select
                name="status"
                className={inputClass}
              >
                <option value="new">Новый</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершён</option>
                <option value="cancelled">Отменён</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Дедлайн <span className="text-red-500">*</span>
              </label>

              <input
                name="deadline"
                type="date"
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row dark:border-zinc-800">
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Создать заказ
              </button>

              <Link
                href="/orders"
                className="rounded-xl border border-zinc-300 px-5 py-3 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}