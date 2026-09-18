"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/client";

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3.2 2.6-5 5.5-5s4.8 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.5c2.8.2 4.5 1.7 5 4.5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    href: "/clients",
    label: "Клиенты",
    icon: <ClientsIcon />,
  },
  {
    href: "/orders",
    label: "Заказы",
    icon: <OrdersIcon />,
  },
];

export function AppNav() {
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const userEmail = user.email ?? "";

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        userEmail.split("@")[0] ||
        "Пользователь";

      setEmail(userEmail);
      setDisplayName(name);
    }

    loadUser();
  }, []);

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const avatarLetter =
    displayName.charAt(0).toUpperCase() ||
    email.charAt(0).toUpperCase() ||
    "U";

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            CRM
          </div>

          <div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              CRM Lite
            </p>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Управление бизнесом
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <span className="shrink-0">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        {email && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {avatarLetter}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {displayName}
              </p>

              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {email}
              </p>
            </div>
          </div>
        )}

        <LogoutButton />
      </div>
    </aside>
  );
}