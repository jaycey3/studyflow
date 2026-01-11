import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { LogOut, GraduationCap } from "lucide-react";
import Link from "next/link";
import { CalendarCheck, NotebookPen } from "lucide-react";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Button } from "@heroui/react";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyFlow",
  description: "Manage your study tasks and reflections efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.className} text-neutral-900`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="w-[80%] mx-auto flex-1 flex">
        {children}
        </main>
      </body>
    </html>
  );
}
