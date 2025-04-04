"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/hooks/theme";
import DynamicTitle from "@/components/DynamicTitle";
import Script from "next/script";

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
          <head>
            <meta
              name="google-site-verification"
              content="zyFST-yppUMiy2xHAPNodmjmuafTgghQ35Z3IHrh2oo"
            />
            <Script
              type="text/javascript"
              src="//pl26165613.effectiveratecpm.com/47/68/e7/4768e74be5885fafaf08d82a6171d7a5.js"
            ></Script>
          </head>
          <body>
            <AppContent>{children}</AppContent>
          </body>
        </html>
      </ThemeProvider>
    </AuthProvider>
  );
}
