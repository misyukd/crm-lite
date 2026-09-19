import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/orders/StatusBadge";


type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};


export default async function ClientPage({
  params,
}: ClientPageProps) {

  const { id } = await params;

  const supabase = await createClient();


  const { data: client, error } = await supabase
    .from("clients")
    .select(`
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
    `)
    .eq("id", id)
    .single();


  if (error || !client) {
    notFound();
  }


  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">

      <div className="mx-auto max-w-5xl">

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                {client.name}
              </h1>

              {client.company && (
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  {client.company}
                </p>
              )}
            </div>


            <Link
              href={`/clients/${client.id}/edit`}
              className="rounded-xl border px-4 py-2 text-sm font-medium"
            >
              Редактировать
            </Link>

          </div>


          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="text-xs text-zinc-500">
                Телефон
              </p>

              <p className="mt-1 font-medium">
                {client.phone || "—"}
              </p>
            </div>


            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="text-xs text-zinc-500">
                Email
              </p>

              <p className="mt-1 font-medium">
                {client.email || "—"}
              </p>
            </div>

          </div>

        </div>



        <div className="mt-8 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Заказы
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Все заказы этого клиента
            </p>
          </div>


          <Link
            href={`/orders/new?client=${client.id}`}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            + Новый заказ
          </Link>

        </div>



        <div className="mt-4 grid gap-4">

          {client.orders.length === 0 ? (

            <div className="rounded-2xl border bg-white p-6 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              У клиента пока нет заказов
            </div>

          ) : (

            client.orders.map((order) => (

              <div
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {order.title}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Дедлайн: {order.deadline}
                    </p>
                  </div>


                  <StatusBadge status={order.status} />

                </div>


                <p className="mt-4 text-2xl font-semibold">
                  {Number(order.amount).toLocaleString("ru-RU")} ₽
                </p>

              </div>

            ))

          )}

        </div>


      </div>

    </main>
  );
}