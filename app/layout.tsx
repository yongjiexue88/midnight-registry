import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "午夜登记簿",
  description: "在月影公寓夜班前台核验身份、阻止错误记录占据真实人生。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
