import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "AI播客生成器",
  description: "智能播客内容生成平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className="antialiased bg-white min-h-screen"
      >
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
