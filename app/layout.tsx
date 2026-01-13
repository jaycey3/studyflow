import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

import { Navbar } from "@/components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyFlow",
  description: "Manage your study tasks and reflections efficiently.",
};

export default function RootLayout({
  children,
}:  {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.className} text-neutral-900 bg-gray-50`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="w-[70%] mx-auto flex-1 flex">
        {children}
        </main>
      </body>
    </html>
  );
}
