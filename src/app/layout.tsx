import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Finance | Private Financial Intelligence",
  description: "Self-hosted financial intelligence dashboard for Net Worth, Debt Payoff trajectory, and Plaid aggregation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen flex`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
