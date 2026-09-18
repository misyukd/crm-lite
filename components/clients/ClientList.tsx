"use client";
import { useState } from "react";
import type { Client } from "@/lib/types";
import Link from "next/link";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";
const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type ClientListProps = {
  clients: Client[];
  deleteAction: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};

function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

function formatOptional(value?: string) {
  return value ?? "—";
}

export function ClientList({
  clients,
  deleteAction,
}: ClientListProps) {
  const [search, setSearch] = useState("");

const filteredClients = clients.filter((client) => {
  const query = search.toLowerCase();

  return (
    client.name.toLowerCase().includes(query) ||
    client.company?.toLowerCase().includes(query) ||
    client.email?.toLowerCase().includes(query) ||
    client.phone?.toLowerCase().includes(query)
  );
});
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
     <div className="p-4">
  <input
    type="text"
    placeholder="Поиск клиентов..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
  />
</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Имя
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Компания
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Телефон
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Email
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Дата создания
              </th>
              <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
          {filteredClients.length === 0 ? (
  <tr>
    <td
      colSpan={6}
      className="px-4 py-8 text-center text-zinc-500"
    >
      Клиенты не найдены
    </td>
  </tr>
) : (
  filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                  {client.name}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {formatOptional(client.company)}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {formatOptional(client.phone)}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {formatOptional(client.email)}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {formatDate(client.createdAt)}
                </td>
                <td className="px-4 py-3">
    <div className="flex items-center gap-4">
    <Link
      href={`/clients/${client.id}/edit`}
      className="font-medium text-zinc-900 underline dark:text-zinc-100"
    >
      Редактировать
    </Link>

    <DeleteClientButton
      clientId={client.id}
      action={deleteAction}
    />
    </div>
</td>
              </tr>
              
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
