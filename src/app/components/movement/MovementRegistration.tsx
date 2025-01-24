/* eslint-disable @typescript-eslint/unbound-method */
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useState } from "react";
import { encode as encodeBase64 } from "base64-arraybuffer";
import { checkIfAddressExists } from "../../lib/utils/checkIfAddressExist";

const MovementRegistration = () => {
  const { account, signMessage } = useWallet();

  const address = account?.address;
  const [verificationResult, setVerificationResult] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );

  const handleRegistration = async () => {
    if (!account || !address) {
      setRegistrationError("No wallet connected");
      return;
    }

    const isRegistered = await checkIfAddressExists(address, "movement");
    if (isRegistered) {
      setRegistrationError("Address is already registered");
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      // Generate message with nonce
      const nonce = (Math.random() * 1000000).toLocaleString();
      const message = `Register account with this address: ${address}`;

      const signatureResult = await signMessage({
        message,
        nonce,
      });

      if (!signatureResult) {
        setRegistrationError("Signature verification failed");
        setIsRegistering(false);
        return;
      }
      console.log("Signature:", signatureResult);

      // Convert signature and address to base64
      const signatureBase64 = encodeBase64(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (
          signatureResult.signature as unknown as {
            data: { data: ArrayBuffer };
          }
        ).data.data,
      );
      const publicKey = account.publicKey;
      const publicKeyBase64 = encodeBase64(
        new Uint8Array(
          Buffer.from(publicKey.toLocaleString().replace(/^0x/, ""), "hex"),
        ),
      );

      // Send authentication request to backend
      const response = await fetch("/api/authentication/movement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          publicKey: publicKeyBase64,
          message: signatureResult.fullMessage,
          signature: signatureBase64,
        }),
      });

      const result = await response.json();

      if (result) {
        setVerificationResult(true);
        window.alert("Account registered successfully");
      } else {
        setRegistrationError("Registration failed");
      }
    } catch (error) {
      setRegistrationError("Network error during registration");
      console.error("Registration error:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="mt-6">
      {address && (
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Connected with:</span>{" "}
          {address.slice(0, 6)}...{address.slice(-5)}
        </p>
      )}
      <p className="mt-4 flex-wrap text-left text-sm text-gray-500">
        Please sign to prove ownership of the address and register your account.
      </p>
      <div className="my-4">
        <button
          onClick={handleRegistration}
          disabled={isRegistering}
          className={`rounded px-4 py-2 font-bold text-white ${
            isRegistering
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isRegistering ? "Registering..." : "Sign Message"}
        </button>
        {verificationResult && !registrationError && (
          <p className="mt-2 text-sm text-green-500">Registration Successful</p>
        )}
        {registrationError && (
          <p className="mt-2 text-sm text-red-500">{registrationError}</p>
        )}
      </div>
    </div>
  );
};

export default MovementRegistration;
