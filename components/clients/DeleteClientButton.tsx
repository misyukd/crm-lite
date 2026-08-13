"use client";

import { useState } from "react";

type DeleteClientButtonProps = {
  clientId: string;
  action: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};

export function DeleteClientButton({
  clientId,
  action,
}: DeleteClientButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

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
              Удалить клиента?
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Это действие нельзя отменить.
            </p>
            {message && (
            <p className="mt-3 text-sm text-red-600">
              {message}
            </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Отмена
              </button>

              <button
  type="button"
  onClick={async () => {
    const formData = new FormData();
    formData.append("id", clientId);

    const result = await action(formData);
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    
    setIsOpen(false);
    setMessage("");

    if (!result.success) {
      alert(result.message);
      return;
    }

    setIsOpen(false);
  }}
  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white"
>
  Да, удалить
</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}