"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Ada masalah konfigurasi server. Coba lagi nanti.",
  AccessDenied: "Akses ditolak. Kamu tidak memiliki izin untuk login.",
  Verification: "Link verifikasi sudah kedaluwarsa. Minta link baru.",
  Default: "Terjadi kesalahan saat login. Coba lagi.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const message = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
      <div className="orb w-80 h-80 bg-red-600 top-0 right-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-10 max-w-md w-full text-center relative z-10"
      >
        <div className="text-6xl mb-4">😕</div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Login Gagal
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <Link href="/auth/signin" className="btn-primary">
            Coba Lagi
          </Link>
          <Link href="/" className="btn-secondary">
            Kembali ke Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
