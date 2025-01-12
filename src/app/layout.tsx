import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Web3Provider } from "./context/Web3Provider";
import QueryProvider from "./context/QueryProvider";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Web3Provider>
          <QueryProvider>{children}</QueryProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
