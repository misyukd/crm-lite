"use client";

type PhoneInputProps = {
  defaultValue?: string;
};

export function PhoneInput({ defaultValue = "" }: PhoneInputProps) {
  return (
    <input
      name="phone"
      type="tel"
      defaultValue={defaultValue}
      maxLength={30}
      onChange={(event) => {
        event.target.value = event.target.value.replace(
          /[^0-9+\-() ]/g,
          ""
        );
      }}
      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
      placeholder="+7 999 123-45-67"
    />
  );
}