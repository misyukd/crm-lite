import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/orders/StatusBadge";

type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function ClientPage({
  params,
}: ClientPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select(
      `
      id,
      name,
      email,
      phone,
      company,
      created_at,
      orders (
        id,
        title,
        amount,
        status,
        deadline
      )
      `
    )
    .eq("id", id)
    .single();


  if (error || !client) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">
          Клиент не найден
        </h1>
      </main>
    );
  }


  const orders = client.orders ?? [];

  const totalAmount = orders.reduce(
    (sum, order) => sum + Number(order.amount),
    0
  );


  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">

      <div className="mx-auto max-w-5xl">


        <Link
          href="/clients"
          className="text-sm text-zinc-500 hover:underline"
        >
          ← Назад к клиентам
        </Link>


        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">


          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-sm text-zinc-500">
                Клиент
              </p>

              <h1 className="mt-1 text-3xl font-semibold">
                {client.name}
              </h1>


              <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">

                <p>
                  🏢 {client.company ?? "Компания не указана"}
                </p>

                <p>
                  📞 {client.phone ?? "Телефон не указан"}
                </p>

                <p>
                  ✉️ {client.email ?? "Email не указан"}
                </p>

              </div>

            </div>


            <div className="flex flex-wrap gap-3">

  <Link
    href={`/orders/new?client=${client.id}`}
    className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
  >
    + Новый заказ
  </Link>

  <Link
    href={`/clients/${client.id}/edit`}
    className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium dark:border-zinc-700"
  >
    Редактировать
  </Link>

</div>


          </div>


          <div className="mt-8 grid gap-4 sm:grid-cols-2">


            <div className="rounded-xl bg-zinc-100 p-5 dark:bg-zinc-800">
              <p className="text-sm text-zinc-500">
                Заказы
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {orders.length}
              </p>
            </div>


            <div className="rounded-xl bg-zinc-100 p-5 dark:bg-zinc-800">
              <p className="text-sm text-zinc-500">
                Общая сумма
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {currencyFormatter.format(totalAmount)}
              </p>
            </div>


          </div>


        </div>



        <div className="mt-8">

          <h2 className="text-2xl font-semibold">
            История заказов
          </h2>


          <div className="mt-4 space-y-4">


            {orders.length === 0 ? (

              <div className="rounded-xl border p-6 text-zinc-500">
                У клиента пока нет заказов
              </div>

            ) : (

              orders.map((order) => (

                <div
                  key={order.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-semibold">
                        {order.title}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        Дедлайн:{" "}
                        {dateFormatter.format(
                          new Date(order.deadline)
                        )}
                      </p>

                    </div>


                    <StatusBadge status={order.status}/>


                  </div>


                  <p className="mt-4 text-2xl font-semibold">
                    {currencyFormatter.format(
                      Number(order.amount)
                    )}
                  </p>


                </div>

              ))

            )}


          </div>

        </div>


      </div>

    </main>
  );
}