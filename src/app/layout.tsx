import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner"

import { IBM_Plex_Sans_Arabic, Space_Mono } from "next/font/google";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة ذكاء الإعلانات | صناعة المحتوى الإبداعي",
  description: "المنصة الرائدة لتوليد الإعلانات الذكية باستخدام أحدث تقنيات الذكاء الاصطناعي",
};

import { QueryProvider } from "@/shared/components/query-provider";
import { ModalsProvider } from "@/shared/components/modals-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased font-sans",
          ibmPlexArabic.variable,
          spaceMono.variable
        )}
      >
        <QueryProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <ModalsProvider />
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster position='top-center' richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
