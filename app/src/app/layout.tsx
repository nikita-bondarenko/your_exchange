"use client"
import { Inter } from "next/font/google";
import "@/shared/styles/globals.css";
import {
  LoadingProvider,
  StoreProvider,
  TelegramWebAppProvider,
} from "@/providers";
import { EmailRequirementChecking } from "@/d__features/email-requirement/model";
import { AgreementsRequirementChecking } from "@/d__features/agreements-requirement/model";
import { METADATA_DESCRIPTION, METADATA_TITLE, PORTAL_TARGET_ID } from "@/shared/config";
import dynamic from "next/dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
});

const Header = dynamic(() => import('@/c__widgets/header/ui').then(mod => mod.Header), { ssr: false });

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
      <body className={`${inter.variable} antialiased flex flex-col h-screen`}>
        <StoreProvider>
          <TelegramWebAppProvider>
            <Header></Header>
            <LoadingProvider>
              <main className="pb-35 flex-grow h-full">{children}</main>
            </LoadingProvider>
            <EmailRequirementChecking />
            <AgreementsRequirementChecking />
          </TelegramWebAppProvider>
        </StoreProvider>
        <div id={PORTAL_TARGET_ID}></div>
      </body>
    </html>
  );
}
