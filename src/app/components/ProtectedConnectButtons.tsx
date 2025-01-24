"use client";

import React, { useEffect, useState } from "react";
import Turnstile from "react-turnstile";
import { EVMComponent } from "./evm/EVMComponent";
import MovementComponent from "./MovementComponent";

type Networks = "EVM" | "Aptos/Movement";

const ProtectedConnectButtons = () => {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [connectedNetwork, setConnectedNetwork] = useState<Networks | null>(
    null,
  );

  const handleCaptchaSuccess = (token: string) => {
    setIsCaptchaVerified(true);
    setCaptchaToken(token);
  };

  const verifyTokenOnServer = async () => {
    // Optional: Verify the token on your backend
    try {
      const response = await fetch("/api/authentication/cloudflare/captcha", {
        method: "POST",
        body: JSON.stringify({ token: captchaToken }),
        headers: { "Content-Type": "application/json" },
      });
      return response.ok;
    } catch (error) {
      console.error("Captcha verification failed", error);
      return false;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (captchaToken) {
        const isVerified = await verifyTokenOnServer();
        if (!isVerified) {
          //   setIsCaptchaVerified(false);
        }
      }
    };
    verifyToken()
      .then((val) => console.log(val))
      .catch((err) => console.error(err));
  }, [captchaToken]);

  return (
    <div className="flex min-h-96 min-w-full items-center justify-between bg-gray-100 px-8 text-black">
      {isCaptchaVerified ? (
        <>
          {!connectedNetwork || connectedNetwork === "EVM" ? (
            <div className="mx-auto mt-6 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">EVM</span>
              </p>
              <EVMComponent
                disabled={!isCaptchaVerified}
                onConnect={() => setConnectedNetwork("EVM")}
                onDisconnect={() => setConnectedNetwork(null)}
              />
            </div>
          ) : null}

          {!connectedNetwork || connectedNetwork === "Aptos/Movement" ? (
            <div className="mx-auto mt-6 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  Aptos/Movement
                </span>
              </p>
              <MovementComponent
                disabled={!isCaptchaVerified}
                onConnect={() => setConnectedNetwork("Aptos/Movement")}
                onDisconnect={() => setConnectedNetwork(null)}
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="m-auto">
          <Turnstile
            sitekey="1x00000000000000000000AA"
            onVerify={handleCaptchaSuccess}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
};
export default ProtectedConnectButtons;
