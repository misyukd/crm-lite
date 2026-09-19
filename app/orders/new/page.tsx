import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type NewOrderPageProps = {
  searchParams: Promise<{
    client?: string;
  }>;
};

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

  const { error } = await supabase
    .from("orders")
    .insert({
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


export default async function NewOrderPage({
  searchParams,
}: NewOrderPageProps) {

  const params = await searchParams;

  const selectedClientId = params.client ?? "";


  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");


  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">
          Ошибка загрузки клиентов: {error.message}
        </p>
      </main>
    );
  }


  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">

      <div className="mx-auto max-w-2xl">

        <div>
          <p className="text-sm text-zinc-500">
            Заказы
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Новый заказ
          </h1>

          <p className="mt-2 text-zinc-500">
            Создайте новый заказ для клиента
          </p>
        </div>


        <form
          action={createOrderAction}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Клиент
            </label>

            <select
              name="clientId"
              required
              defaultValue={selectedClientId}
              className="w-full rounded-xl border px-4 py-3 dark:bg-zinc-900"
            >

              <option value="">
                Выберите клиента
              </option>

              {(clients ?? []).map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
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
              placeholder="Разработка сайта"
              className="w-full rounded-xl border px-4 py-3 dark:bg-zinc-900"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Сумма
            </label>

            <input
              name="amount"
              type="number"
              min="1"
              required
              placeholder="85000"
              className="w-full rounded-xl border px-4 py-3 dark:bg-zinc-900"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Статус
            </label>

            <select
              name="status"
              defaultValue="new"
              className="w-full rounded-xl border px-4 py-3 dark:bg-zinc-900"
            >

              <option value="new">
                Новый
              </option>

              <option value="in_progress">
                В работе
              </option>

              <option value="completed">
                Завершён
              </option>

              <option value="cancelled">
                Отменён
              </option>

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
              className="w-full rounded-xl border px-4 py-3 dark:bg-zinc-900"
            />
          </div>


          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-5 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Создать заказ
          </button>


        </form>

      </div>

    </main>
  );
}