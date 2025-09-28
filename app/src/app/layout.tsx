"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { LoadingProvider } from "@/components/LoadingProvider";
import { TelegramWebAppProvider } from "@/components/TelegramWebAppProvider";
import StoreProvider from "@/redux/StoreProvider";
import { useEffect } from "react";
import EmailRequirementChecking from "@/components/EmailRequirementChecking";
import AgreementAcceptedChecking from "@/components/AgreementAcceptedChecking";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <title>Секретный Обменник</title>
        <meta name="description" content="Test Change - Telegram Mini App" />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col h-screen`}>
        <StoreProvider>
          <TelegramWebAppProvider>
            <Header></Header>
            <LoadingProvider>
              <main className="pb-35 flex-grow h-full">{children}</main>
            </LoadingProvider>
            <EmailRequirementChecking></EmailRequirementChecking>
            <AgreementAcceptedChecking></AgreementAcceptedChecking>
          </TelegramWebAppProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
