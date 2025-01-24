import React from "react";
import Script from "next/script";
import ProtectedConnectButtons from "./components/ProtectedConnectButtons";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div className="flex w-full max-w-xl flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Login with Wallet</h1>
        <p className="mt-4">
          Select the chain and wallet you want to connect to
        </p>

        <ProtectedConnectButtons />
      </div>
    </main>
  );
}
