import type { Metadata } from "next";

import { AppNav } from "@/components/layout/AppNav";
import { MobileNav } from "@/components/layout/MobileNav";

import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Lite",
  description: "Простая CRM для малого бизнеса",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <AppNav />

        <div className="flex min-h-full flex-1 flex-col pb-20 md:pb-0">
          {children}
        </div>

        <MobileNav />
      </body>
    </html>
  );
}