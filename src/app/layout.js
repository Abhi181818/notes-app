"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/hooks/theme";
import DynamicTitle from "@/components/DynamicTitle";

const AppContent = ({ children }) => {
  const { user } = useAuth();

  return (
    <>
      {/* {user && (
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
        </SidebarProvider>
      )} */}
      {children}
    </>
  );
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster />
        <html lang="en">
          <DynamicTitle />
          <body>
            <AppContent>{children}</AppContent>
          </body>
        </html>
      </ThemeProvider>
    </AuthProvider>
  );
}
