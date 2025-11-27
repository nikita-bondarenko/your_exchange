"use client";
import "@/shared/styles/globals.css";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import {
  LoadingProvider,
  StoreProvider,
  TelegramAppInitializer,
} from "@/app/providers";
import { PORTAL_TARGET_ID } from "@/shared/config";
import { RateUpdatingRequirementChecking } from "@/d__features/exchange/lib";
import {
  AgreementsRequirementChecking,
  ButtonPressTracking,
  EmailRequirementChecking,
  InputChangeTracking,
  PageOpenTracking,
} from "@/d__features/userDataDisplay/lib";
import { ThemeInitialiser } from "./providers/ThemeInitialiser";
import { Head } from "@/c__widgets/head/ui";
import { Header } from "@/c__widgets/header/ui";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <Head />
      <body className={`${inter.variable}`}>
        <StoreProvider>
          <ThemeInitialiser />
          <TelegramAppInitializer />
          <PageOpenTracking />
          <Header />
          <LoadingProvider>
            <main>{children}</main>
          </LoadingProvider>

          <EmailRequirementChecking />
          <AgreementsRequirementChecking />
          <RateUpdatingRequirementChecking />
          <InputChangeTracking />
          <ButtonPressTracking />
        </StoreProvider>
        <div id={PORTAL_TARGET_ID}></div>
      </body>
    </html>
  );
}
