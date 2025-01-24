"use client";
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/unbound-method */
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";

export const MovementDisconnectButton = ({
  onDisconnect,
}: {
  onDisconnect: () => void;
}) => {
  const { disconnect } = useWallet();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onDisconnect();
      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };

  return (
    <button
      className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white shadow-md transition hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      onClick={handleDisconnect}
    >
      Disconnect Wallet
    </button>
  );
};
