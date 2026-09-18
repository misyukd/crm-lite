import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PhoneInput } from "@/components/clients/PhoneInput";

async function createClientAction(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Пользователь не авторизован");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();

  if (!name) {
    throw new Error("Имя клиента обязательно");
  }

  const { error } = await supabase.from("clients").insert({
    name,
    email: email || null,
    phone: phone || null,
    company: company || null,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/clients");
}

export default function NewClientPage() {
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
            Новый клиент
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Добавьте контактную информацию нового клиента.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <form action={createClientAction} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Имя <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                className={inputClass}
                placeholder="Анна Петрова"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Компания
              </label>

              <input
                name="company"
                maxLength={100}
                className={inputClass}
                placeholder="ООО Ромашка"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Телефон
              </label>

              <PhoneInput />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Email
              </label>

              <input
                name="email"
                type="email"
                maxLength={150}
                className={inputClass}
                placeholder="client@example.com"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row dark:border-zinc-800">
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Создать клиента
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