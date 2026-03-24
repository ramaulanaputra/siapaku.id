"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const FAQS = [
  {
    q: "Apakah tes ini akurat?",
    a: "SIAPA AKU menggunakan framework MBTI yang sudah terbukti secara psikologi, diperkaya dengan 8 dimensi tambahan. Tes ini sangat reliabel sebagai alat self-reflection, namun ingat bahwa kepribadian manusia kompleks dan terus berkembang — gunakan hasilnya sebagai cermin, bukan label permanen.",
  },
  {
    q: "Kenapa harus login untuk tes?",
    a: "Login diperlukan agar hasil tes kamu tersimpan di profil personal, kamu bisa track perkembangan dari waktu ke waktu, dan kami bisa pastikan rate limiting (1x per 7 hari) berjalan dengan benar sehingga kamu punya waktu refleksi yang cukup.",
  },
  {
    q: "Kenapa hanya bisa tes 1x per minggu?",
    a: "Self-discovery butuh waktu untuk diresapi. Jika kamu tes setiap hari dengan jawaban berbeda-beda, hasilnya tidak akan bermakna. 7 hari adalah waktu yang cukup untuk kamu menjalani hidup, lalu kembali untuk melihat apakah ada yang berubah dari perspektif kamu.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Sangat aman. Data kamu dienkripsi, tidak pernah dijual ke pihak ketiga, dan kamu bisa request penghapusan data kapan saja. Kami mengikuti standar GDPR untuk perlindungan data.",
  },
  {
    q: "Apa bedanya SIAPA AKU dengan tes MBTI biasa?",
    a: "Tes MBTI biasa hanya memberi kamu 4 huruf. SIAPA AKU memberikan 8 dimensi psikologi yang tailored — termasuk Emotional Intelligence, Self-Love guidance, Shadow Work, Love Language, Career paths, Romance dynamics, Social tips, dan Purpose direction. Kamu bukan sekadar 'INFP', kamu adalah manusia utuh.",
  },
  {
    q: "Apakah sertifikat bisa digunakan untuk keperluan profesional?",
    a: "Sertifikat SIAPA AKU adalah sertifikat self-awareness, bukan sertifikasi profesional psikologi. Cocok untuk personal branding, portofolio kreatif, atau sebagai pembuka percakapan tentang kepribadian kamu.",
  },
  {
    q: "Bagaimana cara verifikasi sertifikat?",
    a: "Setiap sertifikat memiliki barcode unik yang bisa discan atau kodenya bisa dimasukkan di siapaku.id/verify untuk membuktikan keasliannya.",
  },
  {
    q: "Berapa lama pengiriman merchandise?",
    a: "Merchandise custom biasanya membutuhkan 3-5 hari produksi, ditambah waktu pengiriman sesuai kurir yang dipilih. Estimasi total 7-14 hari kerja.",
  },
];

const DIMENSIONS = [
  { icon: "🧬", title: "MBTI Foundation", desc: "Identifikasi 4 dimensi kepribadian dasar kamu" },
  { icon: "🧠", title: "Emotional Intelligence", desc: "Pola emosi, blind spot, dan cara healing unikmu" },
  { icon: "💜", title: "Self-Love Guidance", desc: "Panduan mencintai diri yang spesifik untuk tipe kamu" },
  { icon: "🌑", title: "Shadow Work", desc: "Sisi tersembunyi yang perlu diakui dan diintegrasikan" },
  { icon: "⭐", title: "Core Values", desc: "Nilai-nilai yang benar-benar penting untuk kamu" },
  { icon: "💌", title: "Love Language", desc: "Cara kamu memberi dan menerima kasih sayang" },
  { icon: "🎯", title: "Career & Romance", desc: "Path karir dan dinamika hubungan yang cocok" },
  { icon: "🌟", title: "Life Purpose", desc: "Calling lebih dalam yang tersembunyi dalam kepribadianmu" },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="orb w-80 h-80 bg-purple-600 top-0 right-0" />
        <div className="orb w-64 h-64 bg-pink-600 bottom-0 left-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-white/60">
              💜 Tentang Kami
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Kenapa <span className="gradient-text">SIAPA AKU</span>
              <br />Ada?
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              Di era yang serba cepat ini, kita sibuk mengenal orang lain — tapi lupa mengenal diri sendiri.
              Ironi terbesar: orang lain mungkin mengenal kita lebih baik dari kita mengenal diri sendiri.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold text-white mb-6">
                "Tak Kenal Maka<br />
                <span className="gradient-text">Tak Sayang"</span>
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Pepatah lama yang masih sangat relevan. Kita hafal nama teman-teman kita,
                  makanan favorit mereka, mimpi mereka. Tapi ketika ditanya — apa mimpimu yang
                  paling dalam? Apa yang benar-benar kamu nilai? — banyak dari kita terdiam.
                </p>
                <p>
                  SIAPA AKU lahir dari keyakinan bahwa <span className="text-white font-medium">
                  self-knowledge adalah fondasi self-love</span>. Kamu tidak bisa mencintai
                  sesuatu yang tidak kamu kenal. Dan kamu tidak bisa mengenal sesuatu yang
                  tidak pernah kamu temui.
                </p>
                <p>
                  Kami hadir sebagai teman yang tidak menghakimi — yang mengajak kamu memulai
                  percakapan yang sebenarnya dengan diri kamu sendiri.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { stat: "16", label: "Tipe Kepribadian" },
                { stat: "8", label: "Dimensi Psikologi" },
                { stat: "100", label: "Soal di Bank Pertanyaan" },
                { stat: "4", label: "Squad / Kelompok" },
              ].map((item) => (
                <div key={item.label} className="glass rounded-2xl p-5 flex items-center gap-5">
                  <div className="font-display text-4xl font-bold gradient-text">{item.stat}</div>
                  <div className="text-white/60">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8 Dimensions */}
      <section className="py-20 px-6 relative">
        <div className="orb w-72 h-72 bg-purple-600 top-0 left-0" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Bukan Sekadar <span className="gradient-text">4 Huruf</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              SIAPA AKU memperkaya MBTI dengan 8 dimensi psikologi untuk gambaran diri yang utuh.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIMENSIONS.map((dim, i) => (
              <motion.div
                key={dim.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 card-hover"
              >
                <div className="text-3xl mb-3">{dim.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{dim.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{dim.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="orb w-48 h-48 bg-purple-500 -top-10 -right-10" />
            <div className="orb w-40 h-40 bg-pink-500 -bottom-10 -left-10" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🌟</div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">Visi Kami</h2>
              <p className="text-white/60 leading-relaxed text-lg">
                Membantu jutaan orang Indonesia untuk berkenalan dengan diri sendiri dan
                mulai mencintai diri dengan tulus. Karena ketika kamu kenal dirimu, kamu
                bisa hadir lebih penuh untuk orang-orang yang kamu cintai.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-3">
              Pertanyaan <span className="gradient-text">Umum</span>
            </h2>
            <p className="text-white/40">Hal-hal yang sering ditanyakan</p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-white/90 text-sm">{faq.q}</span>
                  <span
                    className={`text-purple-400 transition-transform duration-300 shrink-0 text-lg ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-3">
              Hubungi <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-white/40">Ada pertanyaan? Kami senang mendengar dari kamu</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📧", label: "Email", value: "hello@siapaku.id", href: "mailto:hello@siapaku.id" },
              { icon: "📱", label: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890" },
              { icon: "📸", label: "Instagram", value: "@siapaku.id", href: "https://instagram.com/siapaku.id" },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl p-6 text-center card-hover group"
              >
                <div className="text-3xl mb-3">{contact.icon}</div>
                <p className="text-white/40 text-xs mb-1">{contact.label}</p>
                <p className="text-white/80 text-sm font-medium group-hover:text-purple-400 transition-colors">
                  {contact.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
