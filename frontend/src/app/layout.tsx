import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SIAPA AKU — Kenal Diri, Baru Bisa Sayang Diri",
  description:
    "Platform penemuan diri yang membantu kamu mengenal kepribadian, kekuatan, dan perjalanan self-love kamu melalui tes MBTI yang mendalam dan personal.",
  keywords: ["MBTI", "tes kepribadian", "self-love", "siapa aku", "psikologi"],
  openGraph: {
    title: "SIAPA AKU — Kenal Diri, Baru Bisa Sayang Diri",
    description:
      "Sebelum kenal orang, kenal diri dulu. Mulai perjalanan self-discovery kamu sekarang.",
    url: "https://siapaku.id",
    siteName: "SIAPA AKU",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIAPA AKU",
    description: "Kenal Diri, Baru Bisa Sayang Diri",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "rgba(15, 10, 30, 0.95)",
                color: "#F8F4FF",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "12px",
                backdropFilter: "blur(20px)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              },
              success: {
                iconTheme: { primary: "#A855F7", secondary: "#0F0A1E" },
              },
              error: {
                iconTheme: { primary: "#EC4899", secondary: "#0F0A1E" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
