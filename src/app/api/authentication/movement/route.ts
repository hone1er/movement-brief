import { type NextRequest, NextResponse } from "next/server";
import nacl from "tweetnacl";
import fs from "fs";
import { decode as decodeBase64 } from "base64-arraybuffer";
import path from "path";

const RATE_LIMIT = 5;
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const filePath = path.join(process.cwd(), "public/files/authentication.json");

const ipAttempts: Record<string, { attempts: number; lastAttempt: number }> =
  {};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    // Read the file and check if the address exists
    let fileData: {
      address: string;
      created_on: string;
    }[] = [];

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf8");
      fileData = existingData ? JSON.parse(existingData) : [];
    }

    const exists = fileData.some((entry) => entry.address === address);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const { address, publicKey, signature, message } = (await req.json()) as {
    address: string;
    publicKey: string;
    signature: string;
    message: string;
  };

  if (!publicKey || !signature || !message) {
    return NextResponse.json(
      { error: "Public Key, signature, and message are required" },
      { status: 400 },
    );
  }

  try {
    // Decode the signature (assumed to be base64-encoded)
    const signatureBuffer = new Uint8Array(decodeBase64(signature));
    const messageBuffer = new TextEncoder().encode(message);
    const publicKeyBuffer = new Uint8Array(decodeBase64(publicKey));

    // Rate limit check
    if (!ipAttempts[ip]) {
      ipAttempts[ip] = { attempts: 0, lastAttempt: 0 };
    }

    const timeSinceLastAttempt = Date.now() - ipAttempts[ip].lastAttempt;

    if (
      ipAttempts[ip].attempts >= RATE_LIMIT &&
      timeSinceLastAttempt < TIME_WINDOW
    ) {
      const retryAfter = Math.ceil((TIME_WINDOW - timeSinceLastAttempt) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        { status: 429 },
      );
    }

    if (timeSinceLastAttempt >= TIME_WINDOW) {
      ipAttempts[ip].attempts = 0;
    }

    ipAttempts[ip].attempts += 1;
    ipAttempts[ip].lastAttempt = Date.now();

    let fileData: {
      address: string;
      ip: string;
      attempts: number;
      last_attempt: number;
      created_on: string;
    }[] = [];

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf8");
      fileData = existingData ? JSON.parse(existingData) : [];
    }

    // Find or create the IP entry
    let ipEntry;

    if (!ipEntry) {
      ipEntry = {
        address,
        ip,
        created_on: new Date().toISOString(),
        attempts: 0,
        last_attempt: 0,
      };
      fileData.push(ipEntry); // Add new entry for this IP
    }

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      messageBuffer,
      signatureBuffer,
      publicKeyBuffer,
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    ipEntry.last_attempt = Date.now();
    ipEntry.address = address;
    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling Aptos authentication:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
