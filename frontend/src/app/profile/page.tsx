"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MBTI_PROFILES, MBTIType, getSquadColor, getSquadEmoji } from "@/lib/mbtiData";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface UserProfile {
  nama: string;
  email: string;
  profile_picture_url?: string;
  tentang_diri?: string;
  consult_credits?: number;
  consult_unlocked?: boolean;
  test_package?: string;
  has_pdf_report?: boolean;
  has_physical_merch?: boolean;
  latestTest?: {
    mbti_type: MBTIType;
    squad: string;
    test_date: string;
    next_test_available_date: string;
  };
  testHistory: Array<{
    mbti_type: MBTIType;
    test_date: string;
  }>;
  orderCount?: number;
  certificates?: Array<{
    certificate_code: string;
    certificate_type: string;
    mbti_type: string;
    issued_date: string;
  }>;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
      });
      setProfile(res.data);
      setBio(res.data.tentang_diri || "");
    } catch {
      if (session?.user) {
        setProfile({
          nama: session.user.name || "",
          email: session.user.email || "",
          profile_picture_url: session.user.image || "",
          testHistory: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveBio = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
        { tentang_diri: bio },
        { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
      );
      setProfile((prev) => prev ? { ...prev, tentang_diri: bio } : prev);
      setEditBio(false);
    } catch {
      setEditBio(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="glass rounded-3xl p-10 max-w-md w-full text-center"
          >
            <div className="text-5xl mb-4">👤</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Login untuk Lihat Profil</h2>
            <p className="text-white/50 mb-8">Simpan perjalanan self-discovery kamu.</p>
            <button onClick={() => signIn("google")} className="btn-primary w-full">
              Login dengan Google
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  const latestMBTI = profile?.latestTest?.mbti_type;
  const mbtiProfile = latestMBTI ? MBTI_PROFILES[latestMBTI] : null;
  const squadColor = mbtiProfile ? getSquadColor(mbtiProfile.squad) : "#7C3AED";
  const squadEmoji = mbtiProfile ? getSquadEmoji(mbtiProfile.squad) : "✨";

  const nextTestDate = profile?.latestTest?.next_test_available_date
    ? new Date(profile.latestTest.next_test_available_date)
    : null;
  const canTest = !nextTestDate || nextTestDate <= new Date();
  const countdown = nextTestDate && !canTest
    ? formatDistanceToNow(nextTestDate, { locale: id, addSuffix: true })
    : null;

  const consultCredits = profile?.consult_credits || 0;
  const consultUnlocked = profile?.consult_unlocked || false;
  const testPackage = profile?.test_package;

  const packageLabel = testPackage === "ultimate" ? "Ultimate 💎" : testPackage === "premium" ? "Premium 👑" : testPackage === "standard" ? "Standar 🎓" : null;

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* ═══════════════ PROFILE HEADER ═══════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-8 mb-6 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ background: squadColor }} />

            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="relative"
              >
                {profile?.profile_picture_url ? (
                  <Image
                    src={profile.profile_picture_url}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-2xl"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-display font-bold text-white">
                    {profile?.nama?.[0] || "?"}
                  </div>
                )}
                {mbtiProfile && (
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-lg"
                    style={{ background: squadColor }}
                  >
                    {squadEmoji}
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-display text-3xl font-bold text-white mb-1">
                  {profile?.nama || session?.user?.name}
                </h1>
                <p className="text-white/40 text-sm mb-3">{profile?.email}</p>

                {/* Package badge */}
                {packageLabel && (
                  <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs font-semibold text-purple-300 mb-3">
                    Paket {packageLabel}
                  </div>
                )}

                {editBio ? (
                  <div className="flex gap-2">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Ceritakan diri kamu..."
                      className="input-dark resize-none text-sm flex-1"
                      rows={2}
                    />
                    <div className="flex flex-col gap-2">
                      <button onClick={saveBio} className="px-3 py-1.5 bg-purple-600 rounded-lg text-white text-xs hover:bg-purple-500 transition-colors">
                        Simpan
                      </button>
                      <button onClick={() => setEditBio(false)} className="px-3 py-1.5 glass rounded-lg text-white/60 text-xs">
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditBio(true)}
                    className="text-white/50 text-sm hover:text-white/80 transition-colors text-left"
                  >
                    {profile?.tentang_diri || "Tambahkan bio... ✏️"}
                  </button>
                )}
              </div>

              {/* MBTI Badge */}
              {mbtiProfile && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="rounded-2xl p-4 text-center min-w-28 shrink-0"
                  style={{ background: squadColor + "15", border: `1px solid ${squadColor}30` }}
                >
                  <div className="text-3xl mb-1">{mbtiProfile.emoji}</div>
                  <div className="font-display font-bold text-xl" style={{ color: squadColor }}>
                    {mbtiProfile.type}
                  </div>
                  <div className="text-white/40 text-xs">{mbtiProfile.nickname}</div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ═══════════════ KREDIT KONSUL CARD ═══════════════ */}
          {consultUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass rounded-2xl p-6 mb-6 relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-sky-500 opacity-10 blur-3xl" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🧠
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Kredit Konsultasi Psikolog</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-sky-400">{consultCredits}</span>
                    <span className="text-white/40 text-sm">sesi tersedia</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">Kredit tidak hangus · Gunakan kapan saja</p>
                </div>
                <Link
                  href="/shop"
                  className="glass rounded-xl px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {consultCredits > 0 ? "Booking Sesi →" : "Beli Kredit →"}
                </Link>
              </div>

              {/* Progress dots showing credits */}
              {consultCredits > 0 && (
                <div className="flex gap-2 mt-4">
                  {Array.from({ length: Math.min(consultCredits, 10) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-purple-400"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                  {consultCredits > 10 && (
                    <span className="text-white/30 text-xs ml-1">+{consultCredits - 10}</span>
                  )}
                </div>
              )}
            </motion.div>
          )}

          <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="md:col-span-2 space-y-6">
              {/* MBTI Result Card */}
              {mbtiProfile ? (
                <motion.div
                  variants={fadeUp}
                  transition={{ delay: 0.15 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-white mb-4">Kepribadianmu</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {mbtiProfile.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mbtiProfile.coreValues.map((v) => (
                      <span
                        key={v}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: squadColor + "20", color: squadColor }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/test/result/${mbtiProfile.type}`}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Lihat hasil lengkap →
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={fadeUp}
                  transition={{ delay: 0.15 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <div className="text-5xl mb-4">🔮</div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Belum Pernah Tes
                  </h3>
                  <p className="text-white/40 text-sm mb-6">
                    Mulai perjalanan self-discovery kamu sekarang!
                  </p>
                  <Link href="/test" className="btn-primary">
                    Mulai Tes MBTI
                  </Link>
                </motion.div>
              )}

              {/* Test History */}
              {profile?.testHistory && profile.testHistory.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-white mb-4">History Tes</h2>
                  <div className="space-y-3">
                    {profile.testHistory.slice(0, 5).map((test, i) => {
                      const p = MBTI_PROFILES[test.mbti_type];
                      if (!p) return null;
                      const color = getSquadColor(p.squad);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{p.emoji}</span>
                            <div>
                              <span className="font-bold text-sm" style={{ color }}>{test.mbti_type}</span>
                              <p className="text-white/30 text-xs">{p.nickname}</p>
                            </div>
                          </div>
                          <span className="text-white/30 text-xs">
                            {formatDistanceToNow(new Date(test.test_date), { locale: id, addSuffix: true })}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Purchases & Certificates */}
              {profile?.certificates && profile.certificates.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  transition={{ delay: 0.25 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-white mb-4">Sertifikat</h2>
                  <div className="space-y-3">
                    {profile.certificates.map((cert, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🏆</span>
                          <div>
                            <span className="font-bold text-sm text-amber-400">{cert.certificate_type === "premium" ? "Premium" : "Standar"}</span>
                            <p className="text-white/30 text-xs font-mono">{cert.certificate_code}</p>
                          </div>
                        </div>
                        <span className="text-white/40 text-xs font-mono">{cert.mbti_type}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
            <div className="space-y-6">
              {/* Next Test */}
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl p-6 text-center"
              >
                {canTest ? (
                  <>
                    <div className="text-3xl mb-3">✅</div>
                    <h3 className="font-semibold text-white mb-2">Siap Tes!</h3>
                    <p className="text-white/40 text-xs mb-4">
                      {profile?.latestTest ? "Soal baru sudah tersedia" : "Mulai tes pertamamu"}
                    </p>
                    <Link href="/test" className="btn-primary w-full text-sm block text-center">
                      Mulai Tes
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-3">⏳</div>
                    <h3 className="font-semibold text-white mb-2">Tes Berikutnya</h3>
                    <p className="text-white/40 text-xs mb-3">
                      Bisa tes lagi {countdown}
                    </p>
                    <p className="text-white/20 text-xs">
                      Gunakan waktu ini untuk refleksi
                    </p>
                  </>
                )}
              </motion.div>

              {/* Consult Credits Quick Card */}
              {consultUnlocked && (
                <motion.div
                  variants={fadeUp}
                  transition={{ delay: 0.18 }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}
                >
                  <div className="text-3xl mb-2">🧠</div>
                  <h3 className="font-semibold text-white mb-1">Kredit Konsul</h3>
                  <div className="text-3xl font-display font-bold text-sky-400 mb-1">{consultCredits}</div>
                  <p className="text-white/30 text-xs mb-3">sesi tersedia</p>
                  <Link
                    href="/shop"
                    className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {consultCredits > 0 ? "Gunakan kredit →" : "Beli kredit →"}
                  </Link>
                </motion.div>
              )}

              {/* Certificate */}
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-semibold text-white mb-2">Dapatkan Sertifikat</h3>
                <p className="text-white/40 text-xs mb-4">
                  Buktikan perjalanan self-discovery kamu
                </p>
                <Link href="/shop" className="btn-secondary w-full text-sm block text-center">
                  Lihat Paket
                </Link>
              </motion.div>

              {/* Squad Info */}
              {mbtiProfile && (
                <motion.div
                  variants={fadeUp}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: squadColor + "15", border: `1px solid ${squadColor}25` }}
                >
                  <div className="text-3xl mb-2">{squadEmoji}</div>
                  <h3 className="font-semibold text-white mb-1">
                    Squad {mbtiProfile.squad}
                  </h3>
                  <p className="text-xs" style={{ color: squadColor }}>
                    {mbtiProfile.squad === "Visionary" ? "Strategic · Analytical · Independent" :
                     mbtiProfile.squad === "Harmonizer" ? "Empathetic · Creative · Idealistic" :
                     mbtiProfile.squad === "Guardian" ? "Loyal · Responsible · Structured" :
                     "Adventurous · Adaptable · Action-oriented"}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
