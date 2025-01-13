# Next.js App with Bot Prevention

This is a simple **Next.js application** that uses **pnpm** as the package manager. The app includes a bot prevention solution that ensures secure user interactions by verifying IP addresses and signatures while enforcing rate limits.

---

## Getting Started

### 1. Clone the Repository

````bash
git clone https://github.com/hone1er/movement-brief.git
cd movement-brief


### 2. Install Dependencies
```bash
pnpm install
````

### 3. Run the Development Server

```bash
pnpm dev
```

### 4. Environment Variables

Create a `.env.local` file in the root directory of the project and add the following environment variables:

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=""
```

---

## Wallet Verification

This application uses the following wallet verification techniques:

1. **Wallet Connect**: The application uses Wallet Connect to connect to the user's wallet
2. **Signature**: The application requests the user to sign a message to verify the user's wallet. A WAGMI useSignMessage hook is used on the client side. The signature, address, and message are sent to the server for verification using VIEMs verifySignature function.

---

## Bot Prevention

This application uses the following bot prevention techniques:

1. **IP Address**: The application verifies the IP address of the user to ensure that the user is not a bot.
2. **Signature**: The application verifies the signature of the user to ensure that the user is not a bot.
3. **Rate Limit**: The application enforces rate limits to prevent bots from making too many requests.

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
