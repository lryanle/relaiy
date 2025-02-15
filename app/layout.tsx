import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/nav/navigation";
import { ThemeProvider } from "@/components/theme-provider";


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
        <body
          className="antialiased"
        >
          <Navigation>{children}</Navigation>
        </body>
      </ThemeProvider>
    </html>
  );
}
