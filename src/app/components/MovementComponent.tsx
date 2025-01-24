"use client";
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect, useState } from "react";
import { type WalletName, useWallet } from "@aptos-labs/wallet-adapter-react";

import MovementRegistration from "./MovementRegistration";
import { MovementDisconnectButton } from "./MovementDisconnectButton";
import MovementConnectButton from "./MovementConnectButton";

const MovementComponent = ({
  disabled,
  onConnect,
  onDisconnect,
}: {
  disabled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) => {
  const { connected } = useWallet();

  useEffect(() => {
    if (connected) {
      onConnect();
    }
    if (!connected) {
      onDisconnect();
    }
  }, [connected, onConnect, onDisconnect]);

  return (
    <>
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <div className="flex flex-col items-center justify-center">
          {connected ? (
            <>
              <MovementRegistration />
              <MovementDisconnectButton onDisconnect={onDisconnect} />
            </>
          ) : (
            <MovementConnectButton disabled={disabled} onConnect={onConnect} />
          )}
        </div>
      </div>
    </>
  );
};

export default MovementComponent;
