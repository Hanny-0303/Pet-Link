import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/components/store";
import TabBar from "@/components/tab-bar";
import Toaster from "@/components/toaster";

export const metadata: Metadata = {
  title: "遛遛 · 养宠人的聚集地",
  description: "狗找搭子，猫找人吸，异宠找懂的人。养宠人的聚集地。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fdf8f3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <AppStoreProvider>
          <div className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-cream pb-20 shadow-[0_0_80px_rgba(80,60,40,0.12)]">
            {children}
          </div>
          <TabBar />
          <Toaster />
        </AppStoreProvider>
      </body>
    </html>
  );
}
