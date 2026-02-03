import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { TRPCProvider } from "@/lib/trpc/provider";
import  Header  from "@/components/Header"; 
import { auth } from "@/auth";
import CategoryHydrator from "@/components/category-hydrator";
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "Expense Tracker App",
  description: "Created by Dhruv Charne",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
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
            <Header />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </TRPCProvider>
    </body>
      
    </html >
  );
}
