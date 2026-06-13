import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Midnight Registry",
  description: "A 2D identity verification horror game set at the Moonshadow Apartments night desk.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
