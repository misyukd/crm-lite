"use client";

import { useState } from "react";
import Link from "next/link";

import type { Client } from "@/lib/types";
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
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              База клиентов
            </p>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Найдено: {filteredClients.length}
            </p>
          </div>

          <input
            type="text"
            placeholder="Поиск клиентов..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-500 sm:max-w-sm dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/60">
              <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                Имя
              </th>

              <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                Компания
              </th>

              <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                Телефон
              </th>

              <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                Email
              </th>

              <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                Дата создания
              </th>

              <th className="px-5 py-3.5 font-medium text-zinc-500 dark:text-zinc-400">
                Действия
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-zinc-500"
                >
                  Клиенты не найдены
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950/50"
                >
                  <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                    {client.name}
                  </td>

                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                    {formatOptional(client.company)}
                  </td>

                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                    {formatOptional(client.phone)}
                  </td>

                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                    {formatOptional(client.email)}
                  </td>

                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-300">
                    {formatDate(client.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/clients/${client.id}/edit`}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Изменить
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