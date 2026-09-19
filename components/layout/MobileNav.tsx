"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
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
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3.2 2.6-5 5.5-5s4.8 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.5" />
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
    >
      <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6" />
    </svg>
  );
}

const items = [
  {
    href: "/",
    label: "Главная",
    icon: <HomeIcon />,
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
  {
    href: "/profile",
    label: "Профиль",
    icon: <ProfileIcon />,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 text-xs transition ${
                active
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {item.icon}

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}