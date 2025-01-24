import crypto from "crypto";

import { NextResponse, type NextRequest } from "next/server";

const SECRET_KEY = "1x0000000000000000000000000000000AA";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Only POST requests are allowed" },
      { status: 405 },
    );
  }

  try {
    const { token } = (await req.json()) as {
      token: string;
    };

    // Turnstile injects a token in "cf-turnstile-response".
    const ip = req.headers.get("x-forwarded-for");
    if (!token || !ip) {
      return NextResponse.json(
        { error: "Token and IP address are required" },
        { status: 400 },
      );
    }

    // Validate the token by calling the "/siteverify" API endpoint.
    const formData = new URLSearchParams();
    formData.append("secret", SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", ip);

    // Generate an idempotency key to prevent reprocessing of the same token.
    const idempotencyKey = crypto.randomUUID();
    formData.append("idempotency_key", idempotencyKey);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    // First validation request
    const firstResult = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const firstOutcome = await firstResult.json();

    if (!firstOutcome) {
      return NextResponse.json(
        { error: "First validation failed" },
        {
          status: 400,
        },
      );
    }

    // Second validation request with the idempotency key
    const subsequentResult = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const subsequentOutcome = await subsequentResult.json();

    if (!subsequentOutcome) {
      return NextResponse.json(
        { error: "Subsequent validation failed" },
        {
          status: 400,
        },
      );
    }

    // If both validations pass
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying Turnstile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
