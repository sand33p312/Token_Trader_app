import type { Metadata } from "next";
// Note: Using next/font/google
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/lib/QueryProvider";
import { ReduxProvider } from "@/lib/store/ReduxProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Axiom Token Trader",
  description: "Token discovery and trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-zinc-950 font-sans antialiased",
          inter.variable
        )}
      >
        <QueryProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}