import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How Cook? - Trợ lý nấu nhiều món",
  description: "Tạo lịch nấu và hướng dẫn từng bước cho bữa ăn nhiều món.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/how-cook-logo-mark.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
