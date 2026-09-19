"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      setEmail(user.email ?? "");
      setName(user.user_metadata?.full_name ?? "");
    }

    loadUser();
  }, []);

  async function handleSave() {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setMessage("Имя должно содержать минимум 2 символа.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: trimmedName,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setMessage("Профиль обновлён.");
    setIsLoading(false);
  }

  return (
    <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Аккаунт
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Профиль
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Управляйте данными вашего аккаунта.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Имя
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                Email пока нельзя изменить из CRM.
              </p>
            </div>

            {message && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {isLoading ? "Сохраняем..." : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}