"use client";

import { ConnectButton as ConnectKitButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from "react";
import EVMRegistration from "./EVMRegistration";

const EVMComponent = ({
  disabled,
  onConnect,
  onDisconnect,
}: {
  disabled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      onConnect();
      setIsConnected(true);
    }
    if (!address) {
      setIsConnected(false);
      onDisconnect();
    }
  }, [address, onConnect, isConnected, onDisconnect]);

  return (
    <>
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <div className="flex flex-col items-center justify-center">
          <div
            className={`${disabled ? "pointer-events-none cursor-not-allowed" : ""}`}
          >
            <ConnectKitButton />
          </div>
        </div>
        {address && <EVMRegistration />}
      </div>
    </>
  );
};

export { EVMComponent };
