import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  
  // Test token exchange
  let tokenTest = "skipped";
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: "test",
        grant_type: "authorization_code",
        redirect_uri: "https://siapaku.vercel.app/api/auth/callback/google",
      }),
    });
    tokenTest = await res.text();
  } catch (e: any) {
    tokenTest = e.message;
  }

  const resp = NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      GOOGLE_CLIENT_ID: clientId ? `${clientId.substring(0, 12)}... (${clientId.length} chars)` : "NOT SET",
      GOOGLE_CLIENT_SECRET: clientSecret ? `SET (${clientSecret.length} chars, starts with: ${clientSecret.substring(0, 6)}...)` : "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? `SET (${process.env.NEXTAUTH_SECRET.length} chars)` : "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    },
    googleTokenExchangeTest: tokenTest,
  });
  
  resp.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return resp;
}
