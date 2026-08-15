import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
  return (
    <main className="max-w-2xl">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        Новый клиент
      </h1>

      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Добавьте нового клиента в CRM
      </p>

      <form action={createClientAction} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Имя *
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Анна Петрова"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Компания
          </label>
          <input
            name="company"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="ООО Ромашка"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Телефон
          </label>
          <input
            name="phone"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="+7 999 123-45-67"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="client@example.com"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Создать клиента
        </button>
      </form>
    </main>
  );
}