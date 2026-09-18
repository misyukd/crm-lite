import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PhoneInput } from "@/components/clients/PhoneInput";

type EditClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function updateClientAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();

  if (!id || !name) {
    throw new Error("Не хватает id или имени клиента");
  }

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/clients");
}

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !client) {
    return (
      <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Клиент не найден
            </h1>

            <Link
              href="/clients"
              className="mt-4 inline-block text-sm font-medium text-zinc-600 underline dark:text-zinc-300"
            >
              Вернуться к клиентам
            </Link>
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
            href="/clients"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Назад к клиентам
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Редактирование клиента
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Измените контактную информацию клиента.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <form action={updateClientAction} className="space-y-6">
            <input type="hidden" name="id" value={client.id} />

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Имя <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                defaultValue={client.name}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Компания
              </label>

              <input
                name="company"
                maxLength={100}
                defaultValue={client.company ?? ""}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Телефон
              </label>

              <PhoneInput defaultValue={client.phone ?? ""} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Email
              </label>

              <input
                name="email"
                type="email"
                maxLength={150}
                defaultValue={client.email ?? ""}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row dark:border-zinc-800">
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Сохранить изменения
              </button>

              <Link
                href="/clients"
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