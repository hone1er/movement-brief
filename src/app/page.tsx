import { ConnectButton } from "./components/ConnectButton";
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {/* ethereum wallet login with tailwind styling */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Login with Ethereum Wallet</h1>
        <p className="mt-4">Connect your Ethereum wallet to login</p>
        <ConnectButton />
      </div>
    </main>
  );
}
