import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner"

// Fallback to system fonts to avoid build-time fetch errors in restricted environments
const ibmPlexArabic = { variable: "--font-ibm-plex-arabic" };
const spaceMono = { variable: "--font-space-mono" };

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
