import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </p>

          {hint ? (
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              {hint}
            </p>
          ) : null}
        </div>

        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}