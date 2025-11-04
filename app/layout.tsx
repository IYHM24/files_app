import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Files', href: '/files' },
  { name: 'Users', href: '/users' },
];


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Files App",
  description: "App para descargar y gestionar archivos.",
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Aqui va el layout */}
        <div className="bg-blue-100 h-screen">
          <div
            className="p-5 max-h-screen overflow-auto container mx-auto"
          >
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
