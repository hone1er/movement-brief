"use client";
import { checkIfAddressExists } from "@/app/lib/utils/checkIfAddressExist";
import React from "react";
import { useAccount, useSignMessage } from "wagmi";

const EVMRegistration = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [registrationError, setRegistrationError] = React.useState<
    string | null
  >(null);
  const [registrationSuccess, setRegistrationSuccess] =
    React.useState<boolean>(false);

  const message = "Register account with this address";

  const saveToServer = async (address: string, signature: string) => {
    try {
      const exists = await checkIfAddressExists(address, "evm");
      if (exists) {
        console.log("Address already exists in the database");
        window.alert("Address already exists in the database");
        setRegistrationError("Address already exists in the database");
        return;
      }

      const response = await fetch("/api/authentication/evm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature, message }),
      });
      return response;
    } catch (error) {
      console.error("Error saving data to server:", error);
    }
  };

  const handleOnSuccess = (data: string, account: `0x${string}`) => {
    if (!!address && address === account) {
      saveToServer(address, data)
        ?.then((res) => {
          if (res?.ok) {
            setRegistrationSuccess(true);
            console.log("Account registered successfully");
            window.alert("Account registered successfully");
            setRegistrationError(null);
          }

          if (res?.status === 429) {
            console.log("Too many requests, please try again later");
            window.alert("Too many requests, please try again later");
            setRegistrationError("Too many requests");
            setRegistrationSuccess(false);
          }
        })
        .catch((error) => {
          console.error("Error saving data to server:", error);
          setRegistrationError("Error saving data to server");
          setRegistrationSuccess(false);
        });
    }
  };

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">Connected with:</span>{" "}
        {address}
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Please sign to prove ownership of the address and register your account.
      </p>
      <button
        onClick={async () => {
          await signMessageAsync(
            {
              account: address,
              message: message,
            },
            {
              onSuccess: (data, { account }) => {
                handleOnSuccess(data, account as `0x${string}`);
              },
            },
          );
        }}
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Register Account
      </button>
      {registrationSuccess && !registrationError && (
        <p className="mt-2 text-sm text-green-500">Registration Successful</p>
      )}
      {registrationError && (
        <p className="mt-2 text-sm text-red-500">{registrationError}</p>
      )}
    </div>
  );
};
export default EVMRegistration;
