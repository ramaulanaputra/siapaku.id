"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import axios from "axios";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   PAKET MEMBER SIAPA AKU
   Tes MBTI & report digital dasar GRATIS.
   Paket member = benefit eksklusif tambahan.
   ───────────────────────────────────────────── */
const PACKAGES = [
  {
    id: "standard",
    name: "Standar",
    price: 99000,
    priceLabel: "Rp 99.000",
    emoji: "📚",
    color: "#6366F1",
    accent: "#818CF8",
    tagline: "Sertifikat resmi & report personalized",
    features: [
      "Unlock Tes Big Five dan Enneagram",
      "Sertifikat Online PDF (verifikasi via kode unik/barcode)",
      "Printout Fisik Sertifikat Resmi (dikirim ke rumah)",
      "Report PDF Personalized & Tailored",
      "Dihubungi Tim Siapa Aku untuk diskusi hasil tes",
    ],
    popular: false,
    badge: null,
    consultCredits: 0,
  },
  {
    id: "premium",
    name: "Premium",
    price: 299000,
    priceLabel: "Rp 299.000",
    emoji: "👑",
    color: "#7C3AED",
    accent: "#A78BFA",
    tagline: "Semua di Standar + bonus konsul psikolog",
    features: [
      "Semua benefit Member Standar",
      "Printout Fisik Report Premium (dikirim ke rumah)",
      "Unlock Fitur Konsultasi Psikolog",
      "1× Konsul Psikolog Gratis",
    ],
    popular: true,
    badge: "Terpopuler",
    consultCredits: 1,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 549000,
    priceLabel: "Rp 549.000",
    emoji: "💎",
    color: "#D97706",
    accent: "#FCD34D",
    tagline: "Full experience + merchandise eksklusif",
    features: [
      "Semua benefit Member Premium",
      "T-Shirt MBTI Personalized",
      "Notebook Eksklusif",
      "Pilih: Tumbler atau Tote Bag Premium",
      "2× Konsul Psikolog Gratis",
    ],
    popular: false,
    badge: "Best Value",
    consultCredits: 2,
  },
];

/* ─────────────────────────────────────────────
   PAKET KONSULTASI PSIKOLOG (Kredit / Beli Putus)
   ───────────────────────────────────────────── */
const CONSULT_PACKAGES = [
  {
    id: "consult-basic",
    name: "Basic Service",
    price: 399000,
    priceLabel: "Rp 399.000",
    emoji: "💬",
    color: "#0EA5E9",
    sessions: 2,
    desc: "2× sesi konsultasi dengan psikolog berpengalaman",
    features: [
      "2× sesi konsultasi",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi",
      "Via webcall (audio/video)",
      "Kredit bebas dipakai kapan saja",
    ],
  },
  {
    id: "consult-premium",
    name: "Premium Service",
    price: 549000,
    priceLabel: "Rp 549.000",
    emoji: "🧠",
    color: "#8B5CF6",
    sessions: 3,
    desc: "3× sesi konsultasi mendalam & personal",
    features: [
      "3× sesi konsultasi",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi",
      "Via webcall (audio/video)",
      "Priority booking",
      "Kredit bebas dipakai kapan saja",
    ],
  },
  {
    id: "consult-ultimate",
    name: "Ultimate Service",
    price: 699000,
    priceLabel: "Rp 699.000",
    emoji: "⭐",
    color: "#F59E0B",
    sessions: 4,
    desc: "4× sesi konsultasi prioritas & komprehensif",
    features: [
      "4× sesi konsultasi",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi",
      "Via webcall (audio/video)",
      "Priority booking + Bebas Pilih Psikolog",
      "Kredit bebas dipakai kapan saja",
    ],
  },
];

const MERCHANDISE = [
  { name: "Kartu Psikologi", price: "Rp 59.000", emoji: "🃏", desc: "64 kartu insights per personality type", slug: "kartu-psikologi" },
  { name: "Tas/Backpack Custom", price: "Rp 199.000", emoji: "🎒", desc: "Design eksklusif dengan MBTI identity", slug: "tas-backpack-custom" },
  { name: "T-Shirt Custom", price: "Rp 79.000", emoji: "👕", desc: "Cotton premium, design unik per type", slug: "tshirt-custom" },
  { name: "Notebook", price: "Rp 69.000", emoji: "📔", desc: "Untuk journaling & self-discovery", slug: "notebook" },
  { name: "Tumbler Custom", price: "Rp 89.000", emoji: "🥤", desc: "Nama + MBTI + squad color", slug: "tumbler-custom" },
  { name: "Tote Bag Premium", price: "Rp 89.000", emoji: "👜", desc: "Tote bag premium dengan MBTI identity", slug: "tote-bag-premium" },
  { name: "Phone Case Custom", price: "Rp 79.000", emoji: "📱", desc: "Design personality-specific", slug: "phone-case-custom" },
  { name: "Gelang Custom", price: "Rp 49.000", emoji: "📿", desc: "MBTI type & squad color kamu", slug: "gelang-custom" },
];

/* ─────────────────────────────────────────────
   Animation variants (Homepage DNA)
   ───────────────────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ShopPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"certificate" | "psikolog" | "merch">("certificate");
  const [ordering, setOrdering] = useState<string | null>(null);
  const [ultimateChoice, setUltimateChoice] = useState<"tumbler" | "totebag" | null>(null);
  const [showUltimateModal, setShowUltimateModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const consultUnlocked = userProfile?.consult_unlocked || false;
  const consultCredits = userProfile?.consult_credits || 0;

  useEffect(() => {
    if (session) fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
      });
      setUserProfile(res.data);
    } catch {}
  };

  const handleOrder = async (packageId: string, price: number, extra?: object) => {
    if (!session) { signIn("google"); return; }
    setOrdering(packageId);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shop/orders`,
        { package_type: packageId, items: [{ id: packageId, name: packageId, price, quantity: 1, ...extra }] },
        { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
      );
      if (res.data.order?.payment_url) {
        window.open(res.data.order.payment_url, "_blank");
      } else {
        toast.success("Order dibuat! Tim kami akan menghubungi kamu.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Gagal membuat order. Coba lagi.";
      toast.error(msg);
    } finally {
      setOrdering(null);
    }
  };

  const handleUltimateOrder = () => {
    if (!session) { signIn("google"); return; }
    setShowUltimateModal(true);
  };

  const confirmUltimateOrder = () => {
    if (!ultimateChoice) { toast.error("Pilih dulu: Tumbler atau Tote Bag"); return; }
    setShowUltimateModal(false);
    handleOrder("ultimate", 549000, { bonus_item: ultimateChoice });
  };

  return (
    <main className="relative bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden py-16 sm:py-20"
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/30 to-transparent blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-pink-600/20 to-transparent blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-t from-indigo-600/20 to-transparent blur-[100px]"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-xs sm:text-sm text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
              Pembayaran Aman via Midtrans
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">Wujudkan</span>{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Identitas Personal dan Profesional Kamu!
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed"
          >
            Tes MBTI gratis untuk semua. Upgrade ke Member untuk Big Five + Enneagram, sertifikat resmi, report personal, merchandise, dan konsultasi psikolog.
          </motion.p>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* ══════════════════ TAB BAR ══════════════════ */}
      <div className="sticky top-16 z-40 px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex gap-2 flex-wrap justify-center">
          {[
            { id: "certificate", label: "🏆 Paket Member" },
            { id: "psikolog", label: "🧠 Konsul Psikolog" },
            { id: "merch", label: "🛍️ Merchandise" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "border border-white/10 bg-white/5 backdrop-blur-sm text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ══════════════════ PAKET MEMBER ══════════════════ */}
      {activeTab === "certificate" && (
        <section className="relative py-24 sm:py-32">
          {/* Top gradient divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Section header */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="text-center mb-16"
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
              >
                Paket Member
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Pilih Paketmu
                </span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-white/50 max-w-lg mx-auto text-base sm:text-lg"
              >
                Tes MBTI gratis untuk semua. Upgrade untuk benefit eksklusif.
              </motion.p>
            </motion.div>

            {/* Free test info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl shrink-0">🆓</div>
              <div>
                <p className="text-emerald-400 font-semibold text-sm">Tes MBTI & Report Digital Dasar — Gratis!</p>
                <p className="text-white/40 text-xs">Semua orang bisa ikut tes dan lihat hasil dasar tanpa bayar. Paket Member memberikan benefit eksklusif tambahan.</p>
              </div>
            </motion.div>

            {/* Consult credits banner */}
            {consultCredits > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm p-5 flex items-center gap-4"
              >
                <div className="text-3xl">🎁</div>
                <div>
                  <p className="text-green-400 font-semibold text-sm">Kamu punya {consultCredits}× kredit konsul psikolog!</p>
                  <p className="text-white/50 text-xs">Gunakan kapan saja dari tab Konsul Psikolog.</p>
                </div>
              </motion.div>
            )}

            {/* Package cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={scaleIn}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`group relative rounded-2xl border ${
                    pkg.popular
                      ? "border-purple-500/40 bg-white/[0.06] ring-2 ring-purple-500/30"
                      : "border-white/10 bg-white/[0.03]"
                  } backdrop-blur-sm p-6 sm:p-8 flex flex-col transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden`}
                >
                  {/* Accent line top */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-40 group-hover:opacity-80 transition-opacity"
                    style={{ background: `linear-gradient(to right, ${pkg.color}, ${pkg.accent})` }}
                  />

                  {/* Popular badge */}
                  {pkg.badge && (
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="absolute -top-0 right-4 translate-y-3"
                    >
                      <span className="inline-flex px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-purple-500/30">
                        {pkg.badge}
                      </span>
                    </motion.div>
                  )}

                  {/* Animated gradient border for popular */}
                  {pkg.popular && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -inset-[1px] bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.3),transparent,rgba(236,72,153,0.3),transparent)] rounded-2xl"
                        style={{ padding: "1px" }}
                      />
                    </div>
                  )}

                  {/* Glow orb */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20"
                    style={{ background: pkg.color }}
                  />

                  <div className="relative z-10 flex flex-col flex-1">
                    <div className="text-4xl mb-4">{pkg.emoji}</div>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">Member {pkg.name}</h3>
                    <p className="text-white/45 text-xs mb-4">{pkg.tagline}</p>
                    <div className="mb-1">
                      <span className="font-display text-3xl sm:text-4xl font-bold" style={{ color: pkg.accent }}>
                        {pkg.priceLabel}
                      </span>
                    </div>
                    <div className="text-white/30 text-xs mb-6">sekali bayar</div>

                    <ul className="space-y-3 mb-6 flex-1">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                          <span className="text-purple-400 shrink-0 mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {pkg.consultCredits > 0 && (
                      <div
                        className="rounded-xl p-3 mb-4 text-center text-sm font-semibold"
                        style={{ background: `${pkg.color}15`, border: `1px solid ${pkg.color}30`, color: pkg.accent }}
                      >
                        🎁 {pkg.consultCredits}× kredit konsul psikolog gratis
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        pkg.id === "ultimate"
                          ? handleUltimateOrder()
                          : handleOrder(pkg.id, pkg.price)
                      }
                      disabled={ordering === pkg.id}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        pkg.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                          : "border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 hover:bg-white/10 hover:border-white/20"
                      } disabled:opacity-60`}
                    >
                      {ordering === pkg.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Memproses...
                        </span>
                      ) : (
                        `Gabung Member ${pkg.name} →`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Payment methods */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8"
            >
              <h3 className="font-semibold text-white mb-4 text-center">Metode Pembayaran</h3>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                {[
                  { name: "GoPay", bg: "bg-[#00AED6]/15", border: "border-[#00AED6]/30", text: "text-[#00AED6]", hoverBg: "hover:bg-[#00AED6]/25" },
                  { name: "OVO", bg: "bg-[#4C3494]/15", border: "border-[#4C3494]/30", text: "text-[#9B7FD4]", hoverBg: "hover:bg-[#4C3494]/25" },
                  { name: "Dana", bg: "bg-[#108EE9]/15", border: "border-[#108EE9]/30", text: "text-[#108EE9]", hoverBg: "hover:bg-[#108EE9]/25" },
                  { name: "ShopeePay", bg: "bg-[#EE4D2D]/15", border: "border-[#EE4D2D]/30", text: "text-[#EE4D2D]", hoverBg: "hover:bg-[#EE4D2D]/25" },
                  { name: "BCA", bg: "bg-[#003D79]/20", border: "border-[#1A6CB5]/30", text: "text-[#5BA3E0]", hoverBg: "hover:bg-[#003D79]/30" },
                  { name: "Mandiri", bg: "bg-[#003B71]/20", border: "border-[#003B71]/30", text: "text-[#F5A623]", hoverBg: "hover:bg-[#003B71]/30" },
                  { name: "BNI", bg: "bg-[#005F3D]/15", border: "border-[#F26722]/30", text: "text-[#F26722]", hoverBg: "hover:bg-[#005F3D]/25" },
                  { name: "BRI", bg: "bg-[#00529C]/15", border: "border-[#00529C]/30", text: "text-[#4DA3FF]", hoverBg: "hover:bg-[#00529C]/25" },
                  { name: "Permata", bg: "bg-[#006837]/15", border: "border-[#006837]/30", text: "text-[#4CAF50]", hoverBg: "hover:bg-[#006837]/25" },
                ].map((m) => (
                  <span key={m.name} className={`rounded-xl px-4 py-2 text-xs font-semibold border backdrop-blur-sm transition-all duration-300 ${m.bg} ${m.border} ${m.text} ${m.hoverBg}`}>{m.name}</span>
                ))}
              </div>
              <p className="text-center text-white/30 text-xs mt-4">Pembayaran aman via Midtrans · SSL Encrypted</p>
            </motion.div>
          </div>

          {/* Bottom gradient divider */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </section>
      )}

      {/* ══════════════════ KONSULTASI PSIKOLOG ══════════════════ */}
      {activeTab === "psikolog" && (
        <section className="relative py-24 sm:py-32">
          {/* Top gradient divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-sky-600/20 to-transparent blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-t from-purple-600/20 to-transparent blur-[100px]"
            />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

            {/* Credits banner */}
            {consultCredits > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm p-5 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div className="flex-1">
                  <p className="text-green-400 font-semibold text-sm">Saldo Kredit Konsultasi</p>
                  <p className="text-white text-2xl font-bold">{consultCredits}× sesi tersedia</p>
                  <p className="text-white/40 text-xs">Gunakan kapan saja tanpa batas waktu</p>
                </div>
              </motion.div>
            )}

            {/* Lock notice if consult not unlocked */}
            {!consultUnlocked && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-12 rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-8 text-center"
              >
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Fitur Eksklusif Paket Premium & Ultimate</h3>
                <p className="text-white/50 text-sm max-w-md mx-auto mb-4">
                  Fitur konsultasi psikolog hanya tersedia untuk pengguna yang telah membeli{" "}
                  <strong className="text-purple-400">Paket Premium</strong> atau{" "}
                  <strong className="text-amber-400">Paket Ultimate</strong>.
                  Kamu juga langsung mendapatkan kredit konsul gratis sebagai bonus!
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab("certificate")}
                  className="group relative inline-flex px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white text-sm shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02]"
                >
                  Lihat Paket Premium →
                </motion.button>
              </motion.div>
            )}

            {/* Section header */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="text-center mb-16"
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
              >
                Konsultasi Psikolog
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Tambah Kredit Konsultasi
                </span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-white/50 max-w-lg mx-auto text-base sm:text-lg"
              >
                Beli kredit konsultasi dan gunakan kapan saja sesuai kebutuhanmu.
                Kredit masuk otomatis ke profil setelah pembayaran berhasil.
              </motion.p>
            </motion.div>

            {/* Consult package cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {CONSULT_PACKAGES.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={scaleIn}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 flex flex-col transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden ${
                    !consultUnlocked ? "opacity-50 pointer-events-none select-none" : ""
                  }`}
                >
                  {/* Accent line top */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-40 group-hover:opacity-80 transition-opacity"
                    style={{ background: `linear-gradient(to right, ${plan.color}, transparent)` }}
                  />

                  {/* Glow */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-500"
                    style={{ background: plan.color }}
                  />

                  <div className="relative z-10 flex flex-col flex-1">
                    <div className="text-4xl mb-3">{plan.emoji}</div>
                    <h3 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-white/45 text-xs mb-3">{plan.desc}</p>
                    <div className="mb-1">
                      <span className="font-display text-2xl sm:text-3xl font-bold" style={{ color: plan.color }}>
                        {plan.priceLabel}
                      </span>
                    </div>
                    <div className="text-white/30 text-xs mb-5">sekali bayar · kredit tidak hangus</div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                          <span className="text-purple-400 shrink-0 mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div
                      className="rounded-xl p-3 mb-4 text-center font-bold text-lg"
                      style={{ background: `${plan.color}15`, color: plan.color }}
                    >
                      {plan.sessions}× sesi konsultasi
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOrder(plan.id, plan.price)}
                      disabled={ordering === plan.id || !consultUnlocked}
                      className="w-full py-3.5 rounded-2xl font-semibold text-sm border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-60"
                    >
                      {ordering === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Memproses...
                        </span>
                      ) : (
                        `Beli ${plan.sessions}× Kredit Konsul →`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient divider */}
            <div className="my-12 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* How credits work */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div variants={fadeInUp} className="text-center mb-8">
                <span className="text-2xl">ℹ️</span>
                <h3 className="font-display text-xl font-semibold text-white mt-2">Cara Kerja Kredit Konsultasi</h3>
              </motion.div>
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { step: "1", icon: "💳", text: "Pilih paket kredit & bayar" },
                  { step: "2", icon: "⚡", text: "Kredit otomatis masuk ke profil" },
                  { step: "3", icon: "📅", text: "Booking sesi kapan saja" },
                  { step: "4", icon: "🧠", text: "Konsultasi via webcall" },
                ].map(({ step, icon, text }) => (
                  <motion.div
                    key={step}
                    variants={fadeInUp}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    className="group relative rounded-2xl border border-sky-500/20 bg-white/[0.03] backdrop-blur-sm p-5 flex items-center gap-3 transition-shadow duration-300 hover:shadow-xl hover:shadow-sky-500/5"
                  >
                    {/* Accent line */}
                    <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-sky-500/40 to-purple-500/40 opacity-40 group-hover:opacity-80 transition-opacity" />
                    <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-lg flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="text-xs text-white/30 font-bold">STEP {step}</div>
                      <p className="text-sm text-white/60">{text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Psikolog info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 text-center"
            >
              <p className="text-2xl mb-2">🧠</p>
              <h3 className="font-display text-lg font-semibold text-white mb-2">Psikolog Berlisensi & Berpengalaman</h3>
              <p className="text-white/45 text-sm leading-relaxed max-w-md mx-auto">
                Semua sesi dilakukan via webcall (audio/video) dengan psikolog yang telah tersertifikasi.
                Jadwal fleksibel, privasi terjaga, dan kredit tidak pernah hangus.
              </p>
            </motion.div>
          </div>

          {/* Bottom gradient divider */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </section>
      )}

      {/* ══════════════════ MERCHANDISE ══════════════════ */}
      {activeTab === "merch" && (
        <section className="relative py-24 sm:py-32">
          {/* Top gradient divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-600/20 to-transparent blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-t from-purple-600/20 to-transparent blur-[100px]"
            />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section header */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="text-center mb-16"
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
              >
                Merchandise
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Ekspresikan Identitasmu
                </span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-white/50 max-w-lg mx-auto text-base sm:text-lg"
              >
                Merchandise custom dengan nama, MBTI type, dan squad color kamu.
              </motion.p>
            </motion.div>

            {/* Merch grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {MERCHANDISE.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-500/40 opacity-40 group-hover:opacity-80 transition-opacity z-10" />

                  <div className="h-40 bg-gradient-to-br from-purple-900/30 to-pink-900/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500 relative z-10">{item.emoji}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white text-sm mb-1">{item.name}</h3>
                    <p className="text-white/40 text-xs mb-3">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-sm">{item.price}</span>
                      <button
                        onClick={() => handleOrder("merchandise", 0)}
                        className="text-xs px-4 py-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        Pesan →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient divider */}
            <div className="my-12 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* Merch info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 text-center"
            >
              <p className="text-2xl mb-2">🎨</p>
              <h3 className="font-display text-lg font-semibold text-white mb-2">Merchandise Custom</h3>
              <p className="text-white/45 text-sm leading-relaxed max-w-md mx-auto">
                Semua merchandise bisa di-customize dengan nama, MBTI type, dan squad color kamu.
                Produksi 3-5 hari kerja, pengiriman ke seluruh Indonesia.
              </p>
            </motion.div>
          </div>

          {/* Bottom gradient divider */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </section>
      )}

      {/* ══════════════════ ULTIMATE CHOICE MODAL ══════════════════ */}
      <AnimatePresence>
        {showUltimateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowUltimateModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="relative rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-8 max-w-md w-full overflow-hidden"
            >
              {/* Modal orb */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-600/20 blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-white mb-2 text-center">Pilih Bonus Kamu 🎁</h3>
                <p className="text-white/50 text-sm text-center mb-6">Paket Ultimate termasuk 1 pilihan item berikut:</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { id: "tumbler", emoji: "🥤", label: "Tumbler Custom", desc: "Dengan nama & MBTI identity" },
                    { id: "totebag", emoji: "👜", label: "Tote Bag Premium", desc: "Tote bag premium eksklusif" },
                  ].map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setUltimateChoice(opt.id as any)}
                      className={`rounded-2xl p-5 text-center transition-all duration-300 border-2 bg-white/[0.03] backdrop-blur-sm ${
                        ultimateChoice === opt.id ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.15)]" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-4xl mb-2">{opt.emoji}</div>
                      <p className="text-white font-semibold text-sm">{opt.label}</p>
                      <p className="text-white/40 text-xs mt-1">{opt.desc}</p>
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowUltimateModal(false)} className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all duration-300">
                    Batal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmUltimateOrder}
                    disabled={!ultimateChoice || ordering === "ultimate"}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl text-white font-semibold text-sm shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:shadow-[0_0_50px_rgba(217,119,6,0.5)] transition-all duration-300 disabled:opacity-50"
                  >
                    {ordering === "ultimate" ? "Memproses..." : "Konfirmasi & Bayar →"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
