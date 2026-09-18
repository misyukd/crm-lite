import type { OrderStatus } from "@/lib/types";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  new: {
    label: "Новый",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
    dotClassName: "bg-blue-500",
  },

  in_progress: {
    label: "В работе",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    dotClassName: "bg-amber-500",
  },

  completed: {
    label: "Завершён",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    dotClassName: "bg-emerald-500",
  },

  cancelled: {
    label: "Отменён",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
    dotClassName: "bg-red-500",
  },
};

type StatusBadgeProps = {
  status: OrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
      {config.label}
    </span>
  );
}