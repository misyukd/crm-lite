"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md py-16">
      <h1 className="text-3xl font-semibold">Вход в CRM</h1>

      <p className="mt-2 text-sm text-zinc-500">
        Войдите в свой аккаунт, чтобы продолжить
      </p>

      <div className="mt-8 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border px-4 py-3 dark:bg-zinc-900"
        />

        {message && (
          <p className="text-sm text-red-600">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Войти
        </button>

        <p className="text-center text-sm text-zinc-500">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </main>
  );
}