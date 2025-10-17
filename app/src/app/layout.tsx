"use client";
import "@/shared/styles/globals.css";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { LoadingProvider, StoreProvider } from "@/app/providers";
import { EmailRequirementChecking } from "@/d__features/emailRequirement/model";
import { AgreementsRequirementChecking } from "@/d__features/agreementsRequirement/model";
import {
  METADATA_DESCRIPTION,
  METADATA_TITLE,
  PORTAL_TARGET_ID,
} from "@/shared/config";
import { TelegramWebAppInitializer } from "@/d__features/telegram/model";
import { ThemeInitialiser } from "@/d__features/themeSwitcher/model";

const Header = dynamic(
  () => import("@/c__widgets/header/ui").then((mod) => mod.Header),
  { ssr: false }
);

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>{METADATA_TITLE}</title>
        <meta name="description" content={METADATA_DESCRIPTION} />
      </head>
      <body  className={`${inter.variable} antialiased flex flex-col h-screen bg-[var(--background-global)]`}>
        <StoreProvider>
          <ThemeInitialiser></ThemeInitialiser>
          <TelegramWebAppInitializer />
          <Header></Header>
          <LoadingProvider>
            <main className="pb-35 flex-grow h-full">{children}</main>
          </LoadingProvider>
          <EmailRequirementChecking />
          <AgreementsRequirementChecking />
        </StoreProvider>
        <div id={PORTAL_TARGET_ID}></div>
      </body>
    </html>
  );
}
