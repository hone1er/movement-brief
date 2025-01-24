/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { WagmiProvider, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const defaultConfig = getDefaultConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
  appName: "Movement - brief",
  projectId: "4277b8b006e09d749bca21309da4b29a",
});

// const wallets = [
//   // add plugins for non AIP 62 compliant wallets here

// ];
const config = new AptosConfig({
  network: Network.TESTNET,
  fullnode: "https://aptos.testnet.porto.movementlabs.xyz/v1",
  faucet: "https://fund.testnet.porto.movementlabs.xyz/",
});

const aptos = new Aptos(config);
const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WagmiProvider config={defaultConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AptosWalletAdapterProvider
            // plugins={wallets}
            autoConnect={true}
            dappConfig={config}
            onError={(error) => {
              console.log("error", error);
            }}
          >
            {children}
          </AptosWalletAdapterProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
