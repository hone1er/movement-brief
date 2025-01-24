import fs from "fs";
import path from "path";
import { type NextRequest, NextResponse } from "next/server";
import { viemClient } from "@/app/lib/viemClient";

const filePath = path.join(process.cwd(), "public/files/authentication.json");
const RATE_LIMIT = 5; // Max attempts
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour window for rate limiting

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
  const ip = req.headers.get("x-forwarded-for");

  if (!ip) {
    return NextResponse.json(
      { error: "Unable to determine IP address" },
      { status: 400 },
    );
  }

  const { address, signature, message } = await req.json();

  if (!address || !signature) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Verify the signature
  const valid = await viemClient.verifyMessage({
    address,
    message,
    signature,
  });

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Read or initialize file data
    let fileData: {
      address: string;
      ip: string;
      created_on: string;
      attempts: number;
      last_attempt: number;
    }[] = [];

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf8");
      fileData = existingData ? JSON.parse(existingData) : [];
    }

    // Find or create the IP entry
    let ipEntry;

    if (!ipEntry) {
      ipEntry = {
        address: "",
        ip,
        created_on: new Date().toISOString(),
        attempts: 0,
        last_attempt: 0,
      };
      fileData.push(ipEntry);
    }

    // Check rate limit
    const timeSinceLastAttempt = Date.now() - ipEntry.last_attempt;

    if (ipEntry.attempts >= RATE_LIMIT && timeSinceLastAttempt < TIME_WINDOW) {
      const retryAfter = Math.ceil((TIME_WINDOW - timeSinceLastAttempt) / 1000); // seconds
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        { status: 429 },
      );
    }

    // Reset or increment attempts
    if (timeSinceLastAttempt >= TIME_WINDOW) {
      ipEntry.attempts = 1; // Reset after time window
    } else {
      ipEntry.attempts += 1; // Increment attempts
    }

    ipEntry.last_attempt = Date.now();
    ipEntry.address = address;

    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
