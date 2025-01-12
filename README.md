# Next.js App with Bot Prevention

This is a simple **Next.js application** that uses **pnpm** as the package manager. The app includes a bot prevention solution that ensures secure user interactions by verifying IP addresses and signatures while enforcing rate limits.

---

## 🚀 Getting Started

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

## Bot Prevention

This application uses the following bot prevention techniques:

1. **IP Address**: The application verifies the IP address of the user to ensure that the user is not a bot.
2. **Signature**: The application verifies the signature of the user to ensure that the user is not a bot.
3. **Rate Limit**: The application enforces rate limits to prevent bots from making too many requests.

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
