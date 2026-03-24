"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const PACKAGES = [
  {
    id: "standard",
    name: "Standard",
    price: 99000,
    priceLabel: "Rp 99.000",
    emoji: "🎓",
    color: "#6366F1",
    tagline: "Mulai perjalanan kenali diri",
    features: [
      "Sertifikat online (PDF) & printout fisik dengan nama & MBTI type",
      "Barcode verification code",
      "Design premium & shareable sosial media",
      "Personalised Interactive PDF Report",
      "Career, romance & social advice detail",
      "Practical planning & strategy sections",
    ],
    popular: false,
    badge: null,
  },
  {
    id: "premium",
    name: "Premium",
    price: 399000,
    priceLabel: "Rp 399.000",
    emoji: "👑",
    color: "#BE185D",
    tagline: "Experience lengkap + konsul psikolog",
    features: [
      "Semua yang ada di Paket Standard",
      "1x T-Shirt custom eksklusif",
      "1x Gelang/Wristband custom MBTI",
      "Pilih 1: Tumbler custom ATAU Tote Bag premium",
      "🧠 Unlock fitur Konsul Psikolog",
      "🎁 Bonus GRATIS 1x sesi konsul psikolog (1 jam)",
    ],
    popular: true,
    badge: "Terpopuler",
  },
];

const PSIKOLOG_PLANS = [
  {
    id: "psikolog-basic",
    name: "Basic Service",
    price: 399000,
    priceLabel: "Rp 399.000/bulan",
    emoji: "🌱",
    color: "#6366F1",
    sessions: 2,
    desc: "2x konsul dengan psikolog dalam sebulan",
    features: [
      "2x sesi konsultasi per bulan",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi & berpengalaman",
      "Jadwal fleksibel via webcall (audio/video)",
      "Catatan sesi & rekomendasi tindak lanjut",
    ],
  },
  {
    id: "psikolog-extra",
    name: "Extra Service",
    price: 499000,
    priceLabel: "Rp 499.000/bulan",
    emoji: "⚡",
    color: "#7C3AED",
    sessions: 3,
    desc: "3x konsul dengan psikolog dalam sebulan",
    features: [
      "3x sesi konsultasi per bulan",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi & berpengalaman",
      "Jadwal fleksibel via webcall (audio/video)",
      "Catatan sesi & rekomendasi tindak lanjut",
      "Priority booking",
    ],
  },
  {
    id: "psikolog-ultimate",
    name: "Ultimate Service",
    price: 599000,
    priceLabel: "Rp 599.000/bulan",
    emoji: "🌟",
    color: "#BE185D",
    sessions: 4,
    desc: "4x konsul dengan psikolog dalam sebulan",
    features: [
      "4x sesi konsultasi per bulan",
      "Durasi 1 jam per sesi",
      "Psikolog berlisensi & berpengalaman",
      "Jadwal fleksibel via webcall (audio/video)",
      "Catatan sesi & rekomendasi tindak lanjut",
      "Priority booking",
      "Dedicated psikolog tetap",
      "Chat support antar sesi",
    ],
  },
];

const MERCHANDISE = [
  { name: "Kartu Psikologi", price: "Rp 59.000", emoji: "🃏", desc: "64 kartu insights per personality type", slug: "kartu-psikologi" },
  { name: "Tas/Backpack Custom", price: "Rp 199.000", emoji: "🎒", desc: "Design eksklusif dengan MBTI identity", slug: "tas-backpack-custom" },
  { name: "T-Shirt Custom", price: "Rp 79.000", emoji: "👕", desc: "Cotton premium, design unik per type", slug: "tshirt-custom" },
  { name: "Gelang Custom", price: "Rp 49.000", emoji: "📿", desc: "MBTI type & squad color kamu", slug: "gelang-custom" },
  { name: "Tumbler Custom", price: "Rp 89.000", emoji: "🥤", desc: "Nama + MBTI + squad color", slug: "tumbler-custom" },
  { name: "Tote Bag Premium", price: "Rp 89.000", emoji: "👜", desc: "Tote bag premium dengan MBTI identity", slug: "tote-bag-premium" },
  { name: "Notebook", price: "Rp 69.000", emoji: "📔", desc: "Untuk journaling & self-discovery", slug: "notebook" },
  { name: "Phone Case Custom", price: "Rp 79.000", emoji: "📱", desc: "Design personality-specific", slug: "phone-case-custom" },
];

export default function ShopPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"certificate" | "psikolog" | "merch">("certificate");
  const [ordering, setOrdering] = useState<string | null>(null);
  const [premiumChoice, setPremiumChoice] = useState<"tumbler" | "totebag" | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const hasPremium = (session as any)?.user?.has_premium_package;

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
    } catch {
      toast.error("Gagal membuat order. Coba lagi.");
    } finally {
      setOrdering(null);
    }
  };

  const handlePremiumOrder = () => {
    if (!session) { signIn("google"); return; }
    setShowPremiumModal(true);
  };

  const confirmPremiumOrder = () => {
    if (!premiumChoice) { toast.error("Pilih dulu: Tumbler atau Tote Bag"); return; }
    setShowPremiumModal(false);
    handleOrder("premium", 399000, { bonus_item: premiumChoice });
  };

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="orb w-80 h-80 bg-purple-600 top-0 right-0" />
        <div className="orb w-64 h-64 bg-pink-600 bottom-0 left-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Wujudkan <span className="gradient-text">Identity Kamu</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Sertifikat, report, merchandise, dan konsultasi psikolog yang mencerminkan kepribadian unikmu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-40 px-6 py-4 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
          {[
            { id: "certificate", label: "🏆 Paket" },
            { id: "psikolog", label: "🧠 Konsul Psikolog" },
            { id: "merch", label: "🛍️ Merchandise" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "glass text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Packages */}
      {activeTab === "certificate" && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {PACKAGES.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass rounded-3xl p-7 flex flex-col relative overflow-hidden ${
                    pkg.popular ? "ring-2 ring-pink-500/60" : ""
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {pkg.badge}
                    </div>
                  )}
                  <div className="text-4xl mb-4">{pkg.emoji}</div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">Paket {pkg.name}</h3>
                  <p className="text-white/40 text-xs mb-4">{pkg.tagline}</p>
                  <div className="font-display text-3xl font-bold mb-6" style={{ color: pkg.color }}>
                    {pkg.priceLabel}
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => pkg.id === "premium" ? handlePremiumOrder() : handleOrder(pkg.id, pkg.price)}
                    disabled={ordering === pkg.id}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500"
                        : "glass border border-white/20 text-white hover:bg-white/10"
                    } disabled:opacity-60`}
                  >
                    {ordering === pkg.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : `Beli Paket ${pkg.name}`}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 glass rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 text-center">Metode Pembayaran</h3>
              <div className="flex flex-wrap justify-center gap-4 text-white/50 text-sm">
                {["GoPay", "OVO", "Dana", "ShopeePay", "BCA", "Mandiri", "BNI", "BRI", "Permata"].map((method) => (
                  <span key={method} className="glass rounded-lg px-3 py-1.5 text-xs">{method}</span>
                ))}
              </div>
              <p className="text-center text-white/30 text-xs mt-4">Pembayaran aman via Midtrans · SSL Encrypted</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Psikolog Subscription */}
      {activeTab === "psikolog" && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">

            {!hasPremium && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 glass rounded-2xl p-6 border border-pink-500/30 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Fitur Eksklusif Paket Premium</h3>
                <p className="text-white/50 text-sm max-w-md mx-auto mb-4">
                  Layanan konsultasi psikolog hanya tersedia untuk pengguna yang telah membeli{" "}
                  <strong className="text-pink-400">Paket Premium (Rp 399.000)</strong>.
                  Kamu juga mendapatkan <strong className="text-green-400">1x sesi gratis</strong> sebagai bonus!
                </p>
                <button
                  onClick={() => setActiveTab("certificate")}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:from-pink-500 hover:to-purple-500 transition-all"
                >
                  Lihat Paket Premium →
                </button>
              </motion.div>
            )}

            {hasPremium && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 glass rounded-2xl p-5 border border-green-500/30 flex items-center gap-4">
                <div className="text-3xl">🎁</div>
                <div>
                  <p className="text-green-400 font-semibold text-sm">Kamu punya 1x sesi konsul gratis!</p>
                  <p className="text-white/50 text-xs">Bonus dari pembelian Paket Premium kamu. Pilih paket di bawah untuk mulai berlangganan.</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PSIKOLOG_PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass rounded-3xl p-7 flex flex-col relative overflow-hidden ${!hasPremium ? "opacity-50 pointer-events-none select-none" : ""}`}
                >
                  <div className="text-4xl mb-3">{plan.emoji}</div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-xs mb-3">{plan.desc}</p>
                  <div className="font-display text-2xl font-bold mb-5" style={{ color: plan.color }}>{plan.priceLabel}</div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOrder(plan.id, plan.price)}
                    disabled={ordering === plan.id || !hasPremium}
                    className="w-full py-3 rounded-xl font-semibold text-sm glass border border-white/20 text-white hover:bg-white/10 transition-all disabled:opacity-60"
                  >
                    {ordering === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : `Berlangganan ${plan.sessions}x/Bulan`}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 glass rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">🧠</p>
              <h3 className="font-semibold text-white mb-2">Psikolog Berlisensi & Berpengalaman</h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
                Semua sesi dilakukan via webcall (audio/video) dengan psikolog yang telah tersertifikasi.
                Jadwal fleksibel, privasi terjaga, dan hasil konsultasi tersimpan di profilmu.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Merchandise */}
      {activeTab === "merch" && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MERCHANDISE.map((item, i) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl overflow-hidden card-hover group"
                >
                  <div className="h-40 bg-gradient-to-br from-purple-900/40 to-pink-900/30 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
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
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 glass rounded-2xl p-6 text-center">
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

      {/* Premium Choice Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPremiumModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="font-display text-2xl font-bold text-white mb-2 text-center">Pilih Bonus Kamu 🎁</h3>
              <p className="text-white/50 text-sm text-center mb-6">Paket Premium termasuk 1 pilihan item berikut:</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { id: "tumbler", emoji: "🥤", label: "Tumbler Custom", desc: "Dengan nama & MBTI identity" },
                  { id: "totebag", emoji: "👜", label: "Tote Bag Premium", desc: "Tote bag premium eksklusif" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPremiumChoice(opt.id as any)}
                    className={`glass rounded-2xl p-5 text-center transition-all border-2 ${
                      premiumChoice === opt.id ? "border-pink-500 bg-pink-500/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-4xl mb-2">{opt.emoji}</div>
                    <p className="text-white font-semibold text-sm">{opt.label}</p>
                    <p className="text-white/40 text-xs mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowPremiumModal(false)} className="flex-1 py-3 glass rounded-xl text-white/60 hover:text-white text-sm transition-all">
                  Batal
                </button>
                <button
                  onClick={confirmPremiumOrder}
                  disabled={!premiumChoice || ordering === "premium"}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-semibold text-sm hover:from-pink-500 hover:to-purple-500 transition-all disabled:opacity-50"
                >
                  {ordering === "premium" ? "Memproses..." : "Konfirmasi & Bayar →"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
