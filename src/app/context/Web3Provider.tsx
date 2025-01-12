/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const defaultConfig = getDefaultConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  appName: "Movement - brief",
  appUrl: "https://movement-brief.vercel.app",
  appDescription: "A brief movement",
  appIcon: "/favicon.ico",
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const config = createConfig(defaultConfig);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
