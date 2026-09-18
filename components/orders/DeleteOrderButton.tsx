"use client";

import { useState } from "react";

type DeleteOrderButtonProps = {
  orderId: string;
  action: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};

export function DeleteOrderButton({
  orderId,
  action,
}: DeleteOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("id", orderId);

    const result = await action(formData);

    if (!result.success) {
      setMessage(result.message);
      setIsDeleting(false);
      return;
    }

    setMessage("");
    setIsDeleting(false);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMessage("");
          setIsOpen(true);
        }}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
      >
        Удалить
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Удалить заказ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Это действие нельзя отменить.
            </p>

            {message && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {message}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setIsOpen(false);
                }}
                disabled={isDeleting}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Удаление..." : "Да, удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}