export const checkIfAddressExists = async (
  address: string,
  network: "evm" | "movement",
): Promise<boolean> => {
  try {
    const response = await fetch(
      `/api/authentication/${network}?address=${address}`,
    );
    const data = (await response.json()) as { exists: boolean };
    return data.exists;
  } catch (error) {
    console.error("Error checking if address exists:", error);
    return false; // Default to false if there's an error
  }
};
