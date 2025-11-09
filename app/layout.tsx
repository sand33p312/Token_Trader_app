import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import the Inter font
import "./globals.css";
import { QueryProvider } from "@/lib/QueryProvider";
import { ReduxProvider } from "@/lib/store/ReduxProvider";
import { cn } from "@/lib/utils";

// Configure the Inter font
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Axiom Token Discovery",
  description: "A pixel-perfect replica of the Axiom token discovery table.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-zinc-950 font-sans antialiased",
          inter.variable // Apply the font variable
        )}
      >
        <QueryProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}