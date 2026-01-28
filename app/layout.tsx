import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { TRPCProvider } from "@/lib/trpc/provider";
import  Header  from "@/components/Header"; 
export const metadata: Metadata = {
  title: "Expense Tracker App",
  description: "Created by Dhruv Charne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <Header />
          {children}
        </ThemeProvider>
      </TRPCProvider>
    </body>
      
    </html >
  );
}
