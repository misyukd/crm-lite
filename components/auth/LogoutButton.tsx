"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full rounded-xl border border-red-200 px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
    >
      Выйти из аккаунта
    </button>
  );
}