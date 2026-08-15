import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
      <main>
        <h1>Клиент не найден</h1>
      </main>
    );
  }

  return (
    <main className="max-w-2xl">
      <h1 className="text-3xl font-semibold">
        Редактирование клиента
      </h1>

      <form action={updateClientAction} className="mt-8 space-y-5">
        <input type="hidden" name="id" value={client.id} />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Имя
          </label>

          <input
            name="name"
            required
            defaultValue={client.name}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Компания
          </label>

          <input
            name="company"
            defaultValue={client.company ?? ""}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Телефон
          </label>

          <input
            name="phone"
            defaultValue={client.phone ?? ""}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            name="email"
            type="email"
            defaultValue={client.email ?? ""}
            className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Сохранить изменения
        </button>
      </form>
    </main>
  );
}