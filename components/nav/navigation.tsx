"use client";

import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/nav/sidebar";
import { useTheme } from "next-themes";
import { Lexend, Oxygen_Mono } from "next/font/google";
import { useEffect, useState } from "react";


interface Navigationprops {
  children: React.ReactNode;
}

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const oxygenMono = Oxygen_Mono({
  variable: "--font-oxygen-mono",
  subsets: ["latin"],
  weight: ["400"],
});


export default function Navigation({ children }: Readonly<Navigationprops>) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <body className={`${lexend.variable} ${oxygenMono.variable} flex h-screen ${theme === "dark" ? "dark" : ""} font-[family-name:var(--font-lexend)]`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-gray-200 dark:border-[#1F1F23]">
          <Navbar />
        </header>
          <main className="flex-1 overflow-auto bg-white dark:bg-[#0F0F12] font-[family-name:var(--font-lexend)]">
            {children}
          </main>
      </div>
    </body>
  );
}