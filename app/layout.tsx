import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "无敌念书王",
  description: "智能播客内容生成平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
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
