import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#005b96",
};

export const metadata: Metadata = {
  title: "BoltEagle Master",
  description: "Enterprise Master Dashboard",
  //manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BoltEagle Master",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/drop.png",
    apple: "/icons/drop.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.className} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
