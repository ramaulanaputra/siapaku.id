import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  
  // Test if client_id + client_secret are valid by calling Google's tokeninfo
  let tokenTestResult = "not tested";
  try {
    // Try token exchange with a dummy code to see if credentials are recognized
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: "test_invalid_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "https://siapaku.vercel.app/api/auth/callback/google",
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    // If credentials are valid but code is invalid, we get "invalid_grant"
    // If credentials are invalid, we get "invalid_client"
    tokenTestResult = JSON.stringify(tokenData);
  } catch (err: any) {
    tokenTestResult = `Error: ${err.message}`;
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    env: {
      GOOGLE_CLIENT_ID: clientId ? `${clientId.substring(0, 20)}... (${clientId.length} chars)` : "NOT SET",
      GOOGLE_CLIENT_SECRET: clientSecret ? `SET (${clientSecret.length} chars, starts with: ${clientSecret.substring(0, 6)}...)` : "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? `SET (${process.env.NEXTAUTH_SECRET.length} chars)` : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    },
    googleTokenExchangeTest: tokenTestResult,
  };

  return NextResponse.json(diagnostics);
}
