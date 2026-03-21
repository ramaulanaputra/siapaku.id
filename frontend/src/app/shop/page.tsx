"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: 19000,
    priceLabel: "Rp 19.000",
    emoji: "🎓",
    color: "#6366F1",
    tagline: "Buktikan dirimu",
    features: [
      "Sertifikat online (PDF)",
      "Nama & MBTI type kamu",
      "Barcode verification code",
      "Design shareable sosial media",
    ],
    notIncluded: ["Detailed report"],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 59000,
    priceLabel: "Rp 59.000",
    emoji: "🌱",
    color: "#7C3AED",
    tagline: "Paling populer",
    features: [
      "Sertifikat online (PDF)",
      "Interactive PDF Report (20-30 hal)",
      "Career & romance advice detail",
      "Practical planning & strategy",
      "Design premium & customized",
      "Barcode verification code",
    ],
    notIncluded: [],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 299000,
    priceLabel: "Rp 299.000",
    emoji: "👑",
    color: "#BE185D",
    tagline: "Experience lengkap",
    features: [
      "Physical sertifikat premium (cetak)",
      "Physical interactive report book",
      "1x Tas/Backpack custom",
      "1x T-Shirt custom eksklusif",
      "1x Gelang/Wristband custom",
      "1x Tumbler custom",
      "Lifetime digital access",
    ],
    notIncluded: [],
    popular: false,
  },
];

const MERCHANDISE = [
  { name: "Kartu Psikologi", price: "Rp 59.000", emoji: "🃏", desc: "64 kartu insights per personality type", slug: "kartu-psikologi" },
  { name: "Tas/Backpack Custom", price: "Rp 199.000", emoji: "🎒", desc: "Design eksklusif dengan MBTI identity", slug: "tas-backpack-custom" },
  { name: "T-Shirt Custom", price: "Rp 79.000", emoji: "👕", desc: "Cotton premium, design unik per type", slug: "tshirt-custom" },
  { name: "Gelang Custom", price: "Rp 49.000", emoji: "📿", desc: "MBTI type & squad color kamu", slug: "gelang-custom" },
  { name: "Tumbler Custom", price: "Rp 89.000", emoji: "🥤", desc: "Nama + MBTI + squad color", slug: "tumbler-custom" },
  { name: "Notebook", price: "Rp 69.000", emoji: "📔", desc: "Untuk journaling & self-discovery", slug: "notebook" },
  { name: "Phone Case Custom", price: "Rp 79.000", emoji: "📱", desc: "Design personality-specific", slug: "phone-case-custom" },
];

export default function ShopPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"certificate" | "merch">("certificate");
  const [ordering, setOrdering] = useState<string | null>(null);

  const handleOrder = async (packageId: string, price: number) => {
    if (!session) {
      signIn("google");
      return;
    }
    setOrdering(packageId);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shop/orders`,
        {
          package_type: packageId,
          items: [{ id: packageId, name: packageId, price, quantity: 1 }],
        },
        { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
      );
      // Redirect to Midtrans payment page
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
              Sertifikat, report, dan merchandise yang mencerminkan kepribadian unikmu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-40 px-6 py-4 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex gap-2">
          {[
            { id: "certificate", label: "🏆 Paket Sertifikat" },
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
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass rounded-3xl p-7 flex flex-col relative overflow-hidden ${
                    pkg.popular ? "ring-2 ring-purple-500/50" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Terpopuler
                    </div>
                  )}

                  <div className="text-4xl mb-4">{pkg.emoji}</div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">
                    Paket {pkg.name}
                  </h3>
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
                    {pkg.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/30 line-through">
                        <span className="shrink-0 mt-0.5">✗</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOrder(pkg.id, pkg.price)}
                    disabled={ordering === pkg.id}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500"
                        : "glass border border-white/20 text-white hover:bg-white/10"
                    } disabled:opacity-60`}
                  >
                    {ordering === pkg.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      `Beli ${pkg.name}`
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Payment info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 glass rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-4 text-center">Metode Pembayaran</h3>
              <div className="flex flex-wrap justify-center gap-4 text-white/50 text-sm">
                {[
                  "GoPay", "OVO", "Dana", "ShopeePay", "BCA", "Mandiri", "BNI", "BRI", "Permata",
                ].map((method) => (
                  <span key={method} className="glass rounded-lg px-3 py-1.5 text-xs">
                    {method}
                  </span>
                ))}
              </div>
              <p className="text-center text-white/30 text-xs mt-4">
                Pembayaran aman via Midtrans · SSL Encrypted
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Merchandise */}
      {activeTab === "merch" && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MERCHANDISE.map((item, i) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl overflow-hidden card-hover group"
                >
                  {/* Product image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-900/40 to-pink-900/30 flex items-center justify-center">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-white/40 text-xs mb-3">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold gradient-text">{item.price}</span>
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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

      <Footer />
    </main>
  );
}
