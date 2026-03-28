"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Gagal memulai login Google. Coba lagi.",
  OAuthCallback: "Gagal saat proses callback dari Google. Pastikan konfigurasi Google OAuth sudah benar.",
  OAuthCreateAccount: "Gagal membuat akun. Coba lagi.",
  Callback: "Terjadi error saat login. Pastikan Google OAuth redirect URI sudah benar di Google Cloud Console.",
  OAuthAccountNotLinked: "Email ini sudah terdaftar dengan metode login lain.",
  AccessDenied: "Akses ditolak. Pastikan OAuth Consent Screen sudah dipublish (bukan Testing mode).",
  Configuration: "Ada masalah konfigurasi server. Cek GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET.",
  google: "Gagal menghubungi Google OAuth. Kemungkinan GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum dikonfigurasi di server.",
  Default: "Terjadi kesalahan saat login. Coba lagi.",
};

function SignInContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam) {
      const msg = ERROR_MESSAGES[errorParam] || ERROR_MESSAGES.Default;
      setError(`${msg} (code: ${errorParam})`);
      setLoading(false);
    }
  }, [errorParam]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signIn("google", { callbackUrl, redirect: true });
    } catch (err: any) {
      setError(`Error: ${err?.message || "Gagal memulai login"}`);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-purple-600 -top-20 -left-20" />
      <div className="orb w-80 h-80 bg-pink-600 -bottom-20 -right-20" />
      <div className="orb w-64 h-64 bg-blue-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-10 text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <img
              src="/logo.svg"
              alt="SIAPA AKU"
              className="w-11 h-11 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(107,29,94,0.4)]"
            />
            <span className="font-display font-bold text-xl text-white">
              SIAPA <span className="gradient-text">AKU</span>
            </span>
          </Link>

          {/* Floating emoji */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl mb-6"
          >
            🔮
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Yuk, Ketemu Diri Kamu
          </h1>
          <p className="text-[#1A1025]/60 mb-8 leading-relaxed text-sm">
            Login untuk memulai perjalanan self-discovery kamu dan menyimpan hasil tes secara personal.
          </p>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-left"
            >
              <p className="text-red-300 text-sm font-medium mb-1">⚠️ Login Gagal</p>
              <p className="text-red-200/70 text-xs leading-relaxed">{error}</p>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? "Memproses..." : "Lanjut dengan Google"}
          </motion.button>

          <div className="mt-6 space-y-3">
            <p className="text-[#1A1025]/30 text-xs">
              Dengan login, kamu setuju dengan{" "}
              <Link href="/privacy" className="text-[#6B1D5E] hover:text-[#6B1D5E]">
                Privacy Policy
              </Link>{" "}
              kami
            </p>
            <p className="text-[#1A1025]/30 text-xs">
              Data kamu aman — tidak pernah dijual ke pihak ketiga
            </p>
          </div>
        </div>

        {/* Features below card */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: "🔒", text: "Login Aman" },
            { icon: "✨", text: "Tes Gratis" },
            { icon: "📊", text: "Hasil Personal" },
          ].map((item) => (
            <div key={item.text} className="glass rounded-xl p-3 text-center">
              <div className="text-lg mb-1">{item.icon}</div>
              <p className="text-[#1A1025]/50 text-xs">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-dark flex items-center justify-center px-6">
        <div className="text-[#1A1025]/60">Loading...</div>
      </main>
    }>
      <SignInContent />
    </Suspense>
  );
}
