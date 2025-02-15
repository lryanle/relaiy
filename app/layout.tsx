import Navigation from "@/components/nav/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/context/auth-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relaiy",
  description:
    "Relaiy (reel—ayy) is a SaaS platform that streamlines conversational agents. Each agent generates & parses a context tree for each user response, and displays live updates to the dashboard user.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <body className="antialiased">
            <Navigation>{children}</Navigation>
          </body>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </html>
  );
}
