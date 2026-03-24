"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import axios from "axios";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   PAKET TES MBTI
   ───────────────────────────────────────────── */
const PACKAGES = [
  {
    id: "standard",
    name: "Standar",
    price: 99000,
    priceLabel: "Rp 99.000",
    emoji: "🎓",
    color: "#6366F1",
    accent: "#818CF8",
    tagline: "Mulai perjalanan kenali diri",
    features: [
      "Tes MBTI Lengkap",
      "Hasil Analisis Karakter",
      "Rekomendasi Karier",
      "Akses Hasil Digital",
    ],
    popular: false,
    badge: null,
    consultCredits: 0,
  },
  {
    id: "premium",
    name: "Premium",
    price: 199000,
    priceLabel: "Rp 199.000",
    emoji: "👑",
    color: "#7C3AED",
    accent: "#A78BFA",
    tagline: "Report lengkap + bonus konsul psikolog",
    features: [
      "Semua di Paket Standar",
      "PDF Report Premium",
      "Printout Fisik Report",
      "1× Konsul Psikolog Gratis",
      "Unlock Fitur Konsultasi",
    ],
    popular: true,
    badge: "Terpopuler",
    consultCredits: 1,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 399000,
    priceLabel: "Rp 399.000",
    emoji: "💎",
    color: "#D97706",
    accent: "#FCD34D",
    tagline: "Full experience + merchandise eksklusif",
    features: [
      "Semua di Paket Premium",
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
    price: 299000,
    priceLabel: "Rp 299.000",
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
    price: 399000,
    priceLabel: "Rp 399.000",
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
    price: 499000,
    priceLabel: "Rp 499.000",
    emoji: "⭐",
    color: "#F59E0B",
    sessions: 4,
    desc: "4× sesi konsultasi prioritas & komprehensif",
    features: [
      "4× sesi konsultasi",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi",
      "Via webcall (audio/video)",
      "Priority booking",
      "Dedicated psikolog tetap",
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
   Stagger animation variants
   ───────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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
    handleOrder("ultimate", 399000, { bonus_item: ultimateChoice });
  };

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-purple-600 top-0 right-0 animate-pulse-slow" />
        <div className="orb w-72 h-72 bg-pink-600 bottom-0 left-0 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-white/60">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Pembayaran Aman via Midtrans
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Wujudkan <span className="gradient-text">Identity Kamu</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Sertifikat, report, merchandise, dan konsultasi psikolog yang mencerminkan kepribadian unikmu.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ TAB BAR ═══════════════ */}
      <div className="sticky top-16 z-40 px-6 py-4 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
          {[
            { id: "certificate", label: "🏆 Paket Tes" },
            { id: "psikolog", label: "🧠 Konsul Psikolog" },
            { id: "merch", label: "🛍️ Merchandise" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                  : "glass text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══════════════ PAKET TES MBTI ═══════════════ */}
      {activeTab === "certificate" && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Consult credits banner */}
            {consultCredits > 0 && (
              <motion.div {...fadeUp} className="mb-8 glass rounded-2xl p-5 border border-green-500/30 flex items-center gap-4">
                <div className="text-3xl">🎁</div>
                <div>
                  <p className="text-green-400 font-semibold text-sm">Kamu punya {consultCredits}× kredit konsul psikolog!</p>
                  <p className="text-white/50 text-xs">Gunakan kapan saja dari tab Konsul Psikolog.</p>
                </div>
              </motion.div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`glass rounded-3xl p-7 flex flex-col relative overflow-hidden card-shine ${
                    pkg.popular ? "ring-2 ring-purple-500/60" : ""
                  }`}
                >
                  {pkg.badge && (
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      {pkg.badge}
                    </motion.div>
                  )}

                  {/* Glow orb */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl transition-all duration-500"
                    style={{ background: pkg.color }}
                  />

                  <div className="text-4xl mb-4">{pkg.emoji}</div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">Paket {pkg.name}</h3>
                  <p className="text-white/40 text-xs mb-4">{pkg.tagline}</p>
                  <div className="font-display text-3xl font-bold mb-2" style={{ color: pkg.color }}>
                    {pkg.priceLabel}
                  </div>
                  <div className="text-white/30 text-xs mb-6">sekali bayar</div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="text-green-400 shrink-0 mt-0.5">✓</span>
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
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20"
                        : "glass border border-white/20 text-white hover:bg-white/10"
                    } disabled:opacity-60`}
                  >
                    {ordering === pkg.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      `Beli Paket ${pkg.name} →`
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            {/* Payment methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 glass rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-4 text-center">Metode Pembayaran</h3>
              <div className="flex flex-wrap justify-center gap-3 text-white/50 text-sm">
                {["GoPay", "OVO", "Dana", "ShopeePay", "BCA", "Mandiri", "BNI", "BRI", "Permata"].map((method) => (
                  <span key={method} className="glass rounded-lg px-3 py-1.5 text-xs hover:bg-white/10 transition-colors">{method}</span>
                ))}
              </div>
              <p className="text-center text-white/30 text-xs mt-4">Pembayaran aman via Midtrans · SSL Encrypted</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ KONSULTASI PSIKOLOG (KREDIT) ═══════════════ */}
      {activeTab === "psikolog" && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">

            {/* Credits banner */}
            {consultCredits > 0 && (
              <motion.div {...fadeUp} className="mb-8 glass rounded-2xl p-5 border border-green-500/30 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-2xl">
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
              <motion.div {...fadeUp} className="mb-10 glass rounded-2xl p-6 border border-purple-500/30 text-center">
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
                >
                  Lihat Paket Premium →
                </motion.button>
              </motion.div>
            )}

            {/* Section header */}
            <motion.div {...fadeUp} className="text-center mb-10">
              <div className="text-xs text-sky-400 font-bold tracking-[4px] mb-3">KONSULTASI PSIKOLOG</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                Tambah Kredit Konsultasi
              </h2>
              <p className="text-white/50 text-sm max-w-lg mx-auto">
                Beli kredit konsultasi dan gunakan kapan saja sesuai kebutuhanmu.
                Kredit masuk otomatis ke profil setelah pembayaran berhasil.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {CONSULT_PACKAGES.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className={`glass rounded-3xl p-7 flex flex-col relative overflow-hidden card-shine ${
                    !consultUnlocked ? "opacity-50 pointer-events-none select-none" : ""
                  }`}
                >
                  {/* Glow */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 blur-2xl"
                    style={{ background: plan.color }}
                  />

                  <div className="text-4xl mb-3">{plan.emoji}</div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-xs mb-3">{plan.desc}</p>
                  <div className="font-display text-2xl font-bold mb-1" style={{ color: plan.color }}>
                    {plan.priceLabel}
                  </div>
                  <div className="text-white/30 text-xs mb-5">sekali bayar · kredit tidak hangus</div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="text-green-400 shrink-0 mt-0.5">✓</span>
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
                    className="w-full py-3 rounded-xl font-semibold text-sm glass border border-white/20 text-white hover:bg-white/10 transition-all disabled:opacity-60"
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
                </motion.div>
              ))}
            </motion.div>

            {/* How credits work */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 glass rounded-2xl p-6 border border-sky-500/20"
            >
              <div className="text-center mb-6">
                <span className="text-2xl">ℹ️</span>
                <h3 className="font-semibold text-white mt-2">Cara Kerja Kredit Konsultasi</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: "1", icon: "💳", text: "Pilih paket kredit & bayar" },
                  { step: "2", icon: "⚡", text: "Kredit otomatis masuk ke profil" },
                  { step: "3", icon: "📅", text: "Booking sesi kapan saja" },
                  { step: "4", icon: "🧠", text: "Konsultasi via webcall" },
                ].map(({ step, icon, text }) => (
                  <div key={step} className="flex items-center gap-3 glass rounded-xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="text-xs text-white/30 font-bold">STEP {step}</div>
                      <p className="text-sm text-white/70">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Psikolog info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 glass rounded-2xl p-6 text-center"
            >
              <p className="text-2xl mb-2">🧠</p>
              <h3 className="font-semibold text-white mb-2">Psikolog Berlisensi & Berpengalaman</h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
                Semua sesi dilakukan via webcall (audio/video) dengan psikolog yang telah tersertifikasi.
                Jadwal fleksibel, privasi terjaga, dan kredit tidak pernah hangus.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ MERCHANDISE ═══════════════ */}
      {activeTab === "merch" && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {MERCHANDISE.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="glass rounded-2xl overflow-hidden card-shine group cursor-pointer"
                >
                  <div className="h-40 bg-gradient-to-br from-purple-900/40 to-pink-900/30 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent" />
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500 relative z-10">{item.emoji}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-1">{item.name}</h3>
                    <p className="text-white/40 text-xs mb-3">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold gradient-text text-sm">{item.price}</span>
                      <button
                        onClick={() => handleOrder("merchandise", 0)}
                        className="text-xs glass px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
                      >
                        Pesan →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 glass rounded-2xl p-6 text-center"
            >
              <p className="text-2xl mb-2">🎨</p>
              <h3 className="font-semibold text-white mb-2">Merchandise Custom</h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
                Semua merchandise bisa di-customize dengan nama, MBTI type, dan squad color kamu.
                Produksi 3-5 hari kerja, pengiriman ke seluruh Indonesia.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ ULTIMATE CHOICE MODAL ═══════════════ */}
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
              className="glass rounded-3xl p-8 max-w-md w-full"
            >
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
                    className={`glass rounded-2xl p-5 text-center transition-all border-2 ${
                      ultimateChoice === opt.id ? "border-amber-500 bg-amber-500/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-4xl mb-2">{opt.emoji}</div>
                    <p className="text-white font-semibold text-sm">{opt.label}</p>
                    <p className="text-white/40 text-xs mt-1">{opt.desc}</p>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUltimateModal(false)} className="flex-1 py-3 glass rounded-xl text-white/60 hover:text-white text-sm transition-all">
                  Batal
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmUltimateOrder}
                  disabled={!ultimateChoice || ordering === "ultimate"}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl text-white font-semibold text-sm hover:from-amber-500 hover:to-yellow-500 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {ordering === "ultimate" ? "Memproses..." : "Konfirmasi & Bayar →"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
