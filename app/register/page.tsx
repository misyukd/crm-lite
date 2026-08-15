"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Регистрация прошла успешно. Проверь почту.");
  }

  return (
    <main className="mx-auto max-w-md py-16">
      <h1 className="text-3xl font-semibold">
        Регистрация
      </h1>

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
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleRegister}
          className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Зарегистрироваться
        </button>
      </div>
    </main>
  );
}