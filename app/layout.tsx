import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Pocket Town Companions",
  description: "A cozy web-based pet town companion game built with Next.js, Supabase, and reusable game UI components.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
