/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  // Only expose public env vars here. Server-side secrets
  // (NEXTAUTH_SECRET, GOOGLE_CLIENT_SECRET) are read automatically
  // from process.env at runtime — do NOT inline them into bundles.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
module.exports = nextConfig;
