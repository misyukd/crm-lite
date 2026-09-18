"use client";

import Link from "next/link";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleRegister() {
    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setMessage("Регистрация прошла успешно. Проверьте почту.");
    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            CRM
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Создать аккаунт
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Зарегистрируйтесь, чтобы начать работу с CRM Lite.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Пароль
              </label>

              <input
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                Используйте пароль длиной не менее 6 символов.
              </p>
            </div>

            {message && (
              <div
                className={
                  isSuccess
                    ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                }
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}
            </button>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          CRM Lite · Управление клиентами и заказами
        </p>
      </div>
    </main>
  );
}