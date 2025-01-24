/* eslint-disable @typescript-eslint/unbound-method */
import { useWallet, type WalletName } from "@aptos-labs/wallet-adapter-react";
import React, { useState } from "react";

const MovementConnectButton = ({
  disabled,
  onConnect,
}: {
  disabled: boolean;
  onConnect: () => void;
}) => {
  const { connect, account } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleConnect = async (walletName: WalletName) => {
    try {
      setIsModalOpen(false);
      connect(walletName);
      onConnect();
      console.log("Connected to wallet:", account);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  return (
    <>
      <button
        disabled={disabled}
        className={`rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition ${!disabled ? "hover:scale-105" : ""} ${!disabled ? "hover:bg-blue-700" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        onClick={() => setIsModalOpen(true)}
      >
        Connect Wallet
      </button>
      {isModalOpen && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Connect Wallet</h2>
            <ul className="flex flex-col gap-4 pb-4">
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleConnect("Nightly" as WalletName)}
              >
                Nightly
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleConnect("Petra" as WalletName)}
              >
                Petra
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleConnect("Razor" as WalletName)}
              >
                Razor
              </button>
            </ul>

            <button
              className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white shadow-md transition hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default MovementConnectButton;
