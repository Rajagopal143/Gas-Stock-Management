import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cylinder Distribution Manager",
  description: "LPG cylinder distribution dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
