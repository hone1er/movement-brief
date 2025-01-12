"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount, useSignMessage } from "wagmi";

export function ConnectButton() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const message = "Register account";

  // Check if the address is already in the DB (JSON file)
  const checkIfAddressExists = async (address: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/authentication?address=${address}`);
      const data = (await response.json()) as { exists: boolean };
      return data.exists;
    } catch (error) {
      console.error("Error checking if address exists:", error);
      return false; // Default to false if there's an error
    }
  };

  const saveToServer = async (address: string, signature: string) => {
    try {
      const exists = await checkIfAddressExists(address);
      if (exists) {
        console.log("Address already exists in the database");
        window.alert("Address already exists in the database");
        return;
      }

      const response = await fetch("/api/authentication", {
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

  return (
    <>
      <div className="flex min-h-screen min-w-full flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md">
          <ConnectKitButton />
          {address && (
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  Connected with:
                </span>{" "}
                {address}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Please sign to prove ownership of the address and register your
                account.
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
                        if (address === account) {
                          saveToServer(address, data)
                            ?.then((res) => {
                              if (res?.ok) {
                                console.log("Account registered successfully");
                                window.alert("Account registered successfully");
                              }
                              if (res?.status === 429) {
                                console.log(
                                  "Too many requests, please try again later",
                                );
                                window.alert(
                                  "Too many requests, please try again later",
                                );
                              }
                            })
                            .catch((error) => {
                              console.error(
                                "Error saving data to server:",
                                error,
                              );
                            });
                        }
                      },
                    },
                  );
                }}
                className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register Account
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  ); // or return a loading indicator
}
