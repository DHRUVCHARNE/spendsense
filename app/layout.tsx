import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { TRPCProvider } from "@/lib/trpc/provider";
import  Header  from "@/components/Header"; 
import CategoryHydrator from "@/components/category-hydrator";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { appInfo } from "@/components/config";
import { cachedAuth } from "@/lib/authUtils";

export const metadata: Metadata = {
  title: appInfo.title,
  description:appInfo.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await cachedAuth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {session?.user?.id && (
              <CategoryHydrator userId={session.user.id} />
            )}
            <Header/>
          {children}
          <Toaster richColors position="top-right" />
          <Footer />
        </ThemeProvider>
      </TRPCProvider>
    </body>
    </html >
  );
}
