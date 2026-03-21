"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MBTI_PROFILES, MBTIType, getSquadColor } from "@/lib/mbtiData";
import axios from "axios";

interface VerifyResult {
  valid: boolean;
  certificate?: {
    code: string;
    mbti_type: MBTIType;
    type: string;
    owner: string;
    issued_date: string;
  };
}

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${trimmed}`
      );
      setResult(res.data);
    } catch (e: any) {
      setError(
        e.response?.data?.error || "Sertifikat tidak ditemukan atau tidak valid."
      );
    } finally {
      setLoading(false);
    }
  };

  const cert = result?.certificate;
  const profile = cert ? MBTI_PROFILES[cert.mbti_type] : null;
  const squadColor = profile ? getSquadColor(profile.squad) : "#7C3AED";

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Verifikasi <span className="gradient-text">Sertifikat</span>
            </h1>
            <p className="text-white/50">Masukkan kode untuk memverifikasi keaslian sertifikat</p>
          </motion.div>

          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Contoh: CERT-ABC123XYZ"
                className="input-dark flex-1 font-mono uppercase tracking-wider"
              />
              <button
                onClick={handleVerify}
                disabled={loading || !code.trim()}
                className="btn-primary px-6 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verifikasi"
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
              >
                ❌ {error}
              </motion.div>
            )}

            {result?.valid && cert && profile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${squadColor}, ${squadColor}80)` }}
                />
                <div className="p-8 text-center">
                  <div className="text-5xl mb-3">{profile.emoji}</div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4"
                    style={{ background: squadColor + "20", color: squadColor }}>
                    ✅ Sertifikat Valid
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white mb-1">{cert.owner}</h2>
                  <p className="text-white/40 text-sm mb-4">
                    Tipe Kepribadian: <span className="font-bold" style={{ color: squadColor }}>{cert.mbti_type}</span>
                    {" · "}{profile.nickname}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="glass rounded-xl p-3">
                      <p className="text-white/30 text-xs mb-1">Paket</p>
                      <p className="text-white capitalize font-medium">{cert.type}</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="text-white/30 text-xs mb-1">Diterbitkan</p>
                      <p className="text-white font-medium">
                        {new Date(cert.issued_date).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/20 text-xs mt-4 font-mono">{cert.code}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </main>
  );
}
