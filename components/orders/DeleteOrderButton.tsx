"use client";

import { useState } from "react";

type DeleteOrderButtonProps = {
  orderId: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function DeleteOrderButton({
  orderId,
  action,
}: DeleteOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="font-medium text-red-600 hover:underline"
      >
        Удалить
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">
              Удалить заказ?
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Это действие нельзя отменить.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Отмена
              </button>

              <form action={action}>
                <input type="hidden" name="id" value={orderId} />

                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white"
                >
                  Да, удалить
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}