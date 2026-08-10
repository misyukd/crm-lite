import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Клиенты" },
  { href: "/orders", label: "Заказы" },
];

export function AppNav() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-5 py-6 dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          CRM Lite
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Управление клиентами
        </p>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
