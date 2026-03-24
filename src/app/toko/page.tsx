'use client'
import { motion } from 'framer-motion'
import { ShoppingBag, Award, FileText, Package, Star, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const certificates = [
  { name: 'Sertifikat Digital', price: '19.000', icon: Award, color: 'from-blue-500 to-blue-600',
    features: ['Sertifikat PDF custom', 'Barcode verifikasi', 'Nama & tipe MBTI', 'Download instant'] },
  { name: 'Sertifikat + Laporan', price: '59.000', icon: FileText, color: 'from-purple-500 to-purple-600', popular: true,
    features: ['Sertifikat PDF custom', 'Laporan interaktif 20+ halaman', 'Analisis karir mendalam', 'Panduan hubungan & sosial', 'Strategi self-love personal', 'Tips praktis per dimensi'] },
  { name: 'Paket Premium', price: '299.000', icon: Package, color: 'from-amber-500 to-amber-600',
    features: ['Sertifikat fisik premium', 'Buku laporan interaktif', 'Tas custom MBTI', 'Kaos identitas MBTI', 'Gelang kepribadian', 'Tumbler custom nama + tipe', 'Free ongkir Jabodetabek'] },
]

const merchandise = [
  { name: 'Kartu Psikologi', price: '59.000', desc: 'Deck kartu unik berisi insight psikologi per kepribadian', emoji: '🃏' },
  { name: 'Kaos MBTI', price: '129.000', desc: 'Kaos premium dengan desain khusus tipe kepribadianmu', emoji: '👕' },
  { name: 'Tas Identitas', price: '149.000', desc: 'Tote bag dengan desain squad kepribadianmu', emoji: '👜' },
  { name: 'Gelang Kepribadian', price: '49.000', desc: 'Gelang dengan warna dan simbol tipe MBTI-mu', emoji: '📿' },
  { name: 'Tumbler Custom', price: '89.000', desc: 'Tumbler dengan nama dan identitas MBTI-mu', emoji: '🥤' },
  { name: 'Notebook', price: '69.000', desc: 'Notebook journaling dengan prompts sesuai kepribadianmu', emoji: '📓' },
]

export default function TokoPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-6">
              <ShoppingBag className="w-4 h-4" /> Toko SIAPA AKU
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Bawa Identitasmu ke <span className="gradient-text">Dunia Nyata</span>
            </h1>
            <p className="text-lg text-gray-600">Sertifikat, laporan, dan merchandise yang dipersonalisasi sesuai kepribadianmu.</p>
          </motion.div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Sertifikat & Laporan</h2>
            <p className="text-gray-600 mt-4">Pilih paket yang sesuai dengan kebutuhanmu.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certificates.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  c.popular ? 'border-purple-300 bg-purple-50/50 shadow-xl scale-105' : 'border-gray-200 bg-white'
                }`}>
                {c.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> TERLARIS
                  </span>
                )}
                <div className={`w-14 h-14 bg-gradient-to-br ${c.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <c.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{c.name}</h3>
                <p className="text-3xl font-extrabold mb-6">Rp {c.price}</p>
                <ul className="space-y-3 mb-8">
                  {c.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-2xl font-bold transition-all hover:scale-105 ${
                  c.popular ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  Pilih Paket
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MERCHANDISE */}
      <section className="section-padding bg-gradient-to-b from-white to-brand-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Merchandise</h2>
            <p className="text-gray-600 mt-4">Produk unik yang mencerminkan kepribadianmu.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchandise.map((m, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="text-5xl mb-4">{m.emoji}</div>
                <h3 className="text-lg font-bold mb-1">{m.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{m.desc}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-extrabold text-brand-blue">Rp {m.price}</p>
                  <button className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-extrabold mb-4">Belum Tahu Tipe MBTI-mu?</h2>
            <p className="text-gray-400 mb-8">Tes dulu, baru belanja. Produk kami dipersonalisasi sesuai kepribadianmu!</p>
            <Link href="/tes/" className="btn-primary inline-flex items-center gap-2">
              Tes Gratis Dulu <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
