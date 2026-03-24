"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* ── Animation helpers ─────────────────────────────── */
const spring = { type: "spring", stiffness: 60, damping: 18 };
const smooth = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { ...smooth } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { ...smooth } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { ...spring } },
};
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { ...spring } },
};

function useParallax(offset: number = 80) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [offset, -offset]), {
    stiffness: 80, damping: 25,
  });
  return { ref, y };
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Data ──────────────────────────────────────────── */
const FAQS = [
  {
    q: "Apakah tes ini akurat secara psikologis?",
    a: "SIAPA AKU dibangun di atas framework MBTI yang telah divalidasi secara ilmiah, diperkaya dengan 8 dimensi psikologi tambahan. Hasilnya sangat reliabel sebagai instrumen self-reflection — gunakan sebagai cermin untuk memahami diri, bukan sebagai label permanen.",
  },
  {
    q: "Mengapa saya harus login terlebih dahulu?",
    a: "Autentikasi memungkinkan kami menyimpan hasil tes secara aman di profil personalmu, melacak perkembangan kepribadian dari waktu ke waktu, dan memastikan rate limiting (1× per 7 hari) berjalan dengan benar agar kamu punya ruang refleksi yang cukup.",
  },
  {
    q: "Kenapa tes hanya bisa dilakukan sekali per minggu?",
    a: "Self-discovery membutuhkan waktu untuk diresapi. Tujuh hari adalah interval ideal — cukup untuk menjalani kehidupan, mengamati pola perilakumu, lalu kembali dengan perspektif yang lebih matang. Kualitas di atas kuantitas.",
  },
  {
    q: "Seberapa aman data pribadi saya?",
    a: "Keamanan data adalah prioritas utama kami. Seluruh data dienkripsi end-to-end, tidak pernah dijual ke pihak ketiga, dan kamu memiliki hak penuh untuk meminta penghapusan data kapan saja. Kami mengikuti standar perlindungan data GDPR.",
  },
  {
    q: "Apa yang membedakan SIAPA AKU dari tes MBTI lainnya?",
    a: "Tes MBTI konvensional hanya menghasilkan 4 huruf. SIAPA AKU memberikan analisis mendalam melalui 8 dimensi psikologi — termasuk Emotional Intelligence, Shadow Work, Love Language, Career Path, dan Life Purpose. Kamu bukan sekadar label 'INFP' — kamu adalah manusia utuh dengan kompleksitas yang layak dipahami.",
  },
  {
    q: "Bisakah sertifikat digunakan untuk keperluan profesional?",
    a: "Sertifikat SIAPA AKU adalah bukti perjalanan self-awareness-mu. Ideal untuk personal branding, portofolio kreatif, atau conversation starter tentang kepribadianmu di lingkungan profesional.",
  },
  {
    q: "Bagaimana cara memverifikasi keaslian sertifikat?",
    a: "Setiap sertifikat dilengkapi barcode unik yang bisa di-scan langsung atau diverifikasi melalui siapaku.id/verify untuk memastikan keasliannya.",
  },
  {
    q: "Berapa estimasi pengiriman merchandise?",
    a: "Merchandise custom memerlukan 3–5 hari produksi, ditambah estimasi pengiriman 7–14 hari kerja sesuai lokasi dan kurir yang dipilih.",
  },
];

const DIMENSIONS = [
  { icon: "🧬", title: "MBTI Foundation", desc: "Pemetaan 4 dimensi kepribadian dasar sebagai fondasi pemahaman diri" },
  { icon: "🧠", title: "Emotional Intelligence", desc: "Mengenali pola emosi, blind spot, dan metode healing personal" },
  { icon: "💜", title: "Self-Love Guidance", desc: "Panduan mencintai diri yang dirancang khusus sesuai tipe kepribadianmu" },
  { icon: "🌑", title: "Shadow Work", desc: "Mengakui dan mengintegrasikan sisi tersembunyi dalam dirimu" },
  { icon: "⭐", title: "Core Values", desc: "Mengidentifikasi nilai-nilai fundamental yang mendefinisikan siapa kamu" },
  { icon: "💌", title: "Love Language", desc: "Memahami cara unikmu dalam memberi dan menerima kasih sayang" },
  { icon: "🎯", title: "Career & Romance", desc: "Jalur karir dan dinamika hubungan yang selaras dengan kepribadianmu" },
  { icon: "🌟", title: "Life Purpose", desc: "Mengungkap panggilan hidup yang tersembunyi dalam DNA kepribadianmu" },
];

const VALUES = [
  { icon: "🔬", title: "Berbasis Sains", desc: "Setiap dimensi dibangun di atas riset psikologi yang tervalidasi" },
  { icon: "🤝", title: "Tanpa Penghakiman", desc: "Tidak ada tipe yang lebih baik atau lebih buruk — hanya berbeda" },
  { icon: "🔒", title: "Privasi Absolut", desc: "Data kepribadianmu hanya milikmu, selamanya" },
  { icon: "🌱", title: "Bertumbuh Bersama", desc: "Dirancang untuk mendampingi perjalanan panjang self-discovery-mu" },
];

/* ── Component ─────────────────────────────────────── */
export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Parallax for hero orbs */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orbY1 = useSpring(useTransform(heroProgress, [0, 1], [0, -120]), { stiffness: 50, damping: 20 });
  const orbY2 = useSpring(useTransform(heroProgress, [0, 1], [0, -80]), { stiffness: 50, damping: 20 });
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  /* Parallax for story section */
  const storyParallax = useParallax(60);
  const dimParallax = useParallax(40);
  const visionParallax = useParallax(50);

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 overflow-hidden">
        {/* Animated orbs */}
        <motion.div style={{ y: orbY1 }} className="orb w-[500px] h-[500px] bg-purple-600/30 -top-32 -right-32 blur-3xl" />
        <motion.div style={{ y: orbY2 }} className="orb w-[400px] h-[400px] bg-pink-600/20 -bottom-20 -left-20 blur-3xl" />

        <motion.div style={{ opacity: heroOpacity }} className="max-w-4xl mx-auto text-center relative z-10">
          <SectionReveal>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8 text-sm text-white/50 tracking-wide">
              💜 Tentang Kami
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1]">
              Perjalanan Mengenal
              <br />
              <span className="gradient-text">Diri Dimulai</span> dari Sini
            </motion.h1>

            <motion.p variants={fadeUp} className="text-white/45 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Di dunia yang mengajarkan kita mengenal segalanya kecuali diri sendiri,
              SIAPA AKU hadir sebagai ruang aman untuk menemukan siapa kamu sebenarnya.
            </motion.p>
          </SectionReveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Brand Story ──────────────────────────────── */}
      <section ref={storyParallax.ref} className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SectionReveal>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-purple-400/70 text-sm font-medium tracking-wider uppercase mb-6">
                <span className="w-8 h-px bg-purple-400/50" />
                Cerita Kami
              </motion.div>

              <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                &ldquo;Tak Kenal Maka
                <br />
                <span className="gradient-text">Tak Sayang&rdquo;</span>
              </motion.h2>

              <motion.div variants={stagger} className="space-y-5 text-white/55 leading-relaxed text-[15px]">
                <motion.p variants={fadeUp}>
                  Pepatah lama yang menyimpan kebenaran universal. Kita menghafal nama teman-teman kita,
                  mengetahui makanan favorit mereka, memahami mimpi mereka. Namun ketika ditanya —
                  <span className="text-white/80 italic"> apa mimpimu yang paling dalam?</span> —
                  banyak dari kita terdiam.
                </motion.p>
                <motion.p variants={fadeUp}>
                  SIAPA AKU lahir dari satu keyakinan sederhana:{" "}
                  <span className="text-white font-semibold">
                    self-knowledge adalah fondasi self-love.
                  </span>{" "}
                  Kamu tidak bisa mencintai sesuatu yang tidak kamu kenal. Dan kamu tidak bisa mengenal
                  sesuatu yang tidak pernah kamu temui.
                </motion.p>
                <motion.p variants={fadeUp}>
                  Kami hadir bukan sebagai penilai, melainkan sebagai teman perjalanan —
                  yang mengajak kamu membuka percakapan paling penting dalam hidupmu:
                  percakapan dengan diri sendiri.
                </motion.p>
              </motion.div>
            </SectionReveal>

            <motion.div style={{ y: storyParallax.y }}>
              <SectionReveal className="space-y-4">
                {[
                  { stat: "16", label: "Tipe Kepribadian", suffix: "Unik" },
                  { stat: "8", label: "Dimensi Psikologi", suffix: "Mendalam" },
                  { stat: "100+", label: "Soal di Bank", suffix: "Pertanyaan" },
                  { stat: "4", label: "Squad Eksklusif", suffix: "Komunitas" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    variants={slideRight}
                    className="glass rounded-2xl p-6 flex items-center gap-6 group hover:bg-white/[0.06] transition-colors duration-500"
                  >
                    <div className="font-display text-4xl md:text-5xl font-bold gradient-text min-w-[80px]">
                      {item.stat}
                    </div>
                    <div>
                      <div className="text-white/80 font-medium">{item.label}</div>
                      <div className="text-white/35 text-sm">{item.suffix}</div>
                    </div>
                  </motion.div>
                ))}
              </SectionReveal>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Our Values ───────────────────────────────── */}
      <section className="py-24 md:py-28 px-6 relative overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-purple-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-purple-400/70 text-sm font-medium tracking-wider uppercase mb-4">
              <span className="w-8 h-px bg-purple-400/50" />
              Prinsip Kami
              <span className="w-8 h-px bg-purple-400/50" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Dibangun dengan <span className="gradient-text">Intensi</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/40 max-w-xl mx-auto">
              Setiap fitur, setiap kata, setiap dimensi — dirancang dengan satu tujuan:
              membantumu memahami diri lebih dalam.
            </motion.p>
          </SectionReveal>

          <SectionReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((val) => (
              <motion.div
                key={val.title}
                variants={scaleIn}
                className="glass rounded-2xl p-7 text-center group hover:bg-white/[0.06] transition-all duration-500"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{val.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{val.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </SectionReveal>
        </div>
      </section>

      {/* ── 8 Dimensions ─────────────────────────────── */}
      <section ref={dimParallax.ref} className="py-24 md:py-32 px-6 relative overflow-hidden">
        <motion.div style={{ y: dimParallax.y }} className="orb w-[500px] h-[500px] bg-purple-600/20 -top-32 -left-32 blur-3xl" />
        <motion.div style={{ y: dimParallax.y }} className="orb w-[400px] h-[400px] bg-pink-600/15 -bottom-20 -right-20 blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-purple-400/70 text-sm font-medium tracking-wider uppercase mb-4">
              <span className="w-8 h-px bg-purple-400/50" />
              Kedalaman Analisis
              <span className="w-8 h-px bg-purple-400/50" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
              Bukan Sekadar <span className="gradient-text">4 Huruf</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/40 max-w-2xl mx-auto text-[15px]">
              MBTI tradisional memberimu label. SIAPA AKU memberimu pemahaman.
              Melalui 8 dimensi psikologi yang saling terhubung, kami memetakan
              gambaran diri yang utuh dan bermakna.
            </motion.p>
          </SectionReveal>

          <SectionReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIMENSIONS.map((dim, i) => (
              <motion.div
                key={dim.title}
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl p-6 group hover:bg-white/[0.06] transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">{dim.icon}</div>
                  <h3 className="font-semibold text-white text-sm mb-2">{dim.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{dim.desc}</p>
                </div>
              </motion.div>
            ))}
          </SectionReveal>
        </div>
      </section>

      {/* ── Vision ───────────────────────────────────── */}
      <section ref={visionParallax.ref} className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <motion.div
              variants={scaleIn}
              className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            >
              <motion.div style={{ y: visionParallax.y }} className="orb w-[300px] h-[300px] bg-purple-500/20 -top-20 -right-20 blur-3xl" />
              <motion.div style={{ y: visionParallax.y }} className="orb w-[250px] h-[250px] bg-pink-500/15 -bottom-16 -left-16 blur-3xl" />

              <div className="relative z-10">
                <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/[0.04] mb-8">
                  <span className="text-4xl">🌟</span>
                </motion.div>

                <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
                  Visi Kami
                </motion.h2>

                <motion.p variants={fadeUp} className="text-white/50 leading-relaxed text-lg md:text-xl max-w-2xl mx-auto mb-8">
                  Membantu jutaan orang Indonesia untuk berkenalan dengan diri sendiri
                  dan mulai mencintai diri dengan tulus.
                </motion.p>

                <motion.p variants={fadeUp} className="text-white/35 leading-relaxed max-w-xl mx-auto text-[15px]">
                  Karena ketika kamu benar-benar mengenal dirimu, kamu bisa hadir lebih utuh —
                  untuk dirimu sendiri, dan untuk orang-orang yang kamu cintai.
                </motion.p>
              </div>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-purple-400/70 text-sm font-medium tracking-wider uppercase mb-4">
              <span className="w-8 h-px bg-purple-400/50" />
              FAQ
              <span className="w-8 h-px bg-purple-400/50" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Pertanyaan <span className="gradient-text">Umum</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/35">
              Hal-hal yang sering ditanyakan tentang SIAPA AKU
            </motion.p>
          </SectionReveal>

          <SectionReveal className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass rounded-2xl overflow-hidden group"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <span className="font-medium text-white/85 text-sm">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-purple-400 shrink-0 text-lg"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-white/45 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </SectionReveal>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────── */}
      <section className="py-24 md:py-28 px-6 relative overflow-hidden">
        <div className="orb w-[400px] h-[400px] bg-purple-600/10 top-0 right-0 blur-3xl" />

        <div className="max-w-3xl mx-auto relative z-10">
          <SectionReveal className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-purple-400/70 text-sm font-medium tracking-wider uppercase mb-4">
              <span className="w-8 h-px bg-purple-400/50" />
              Kontak
              <span className="w-8 h-px bg-purple-400/50" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Mari <span className="gradient-text">Terhubung</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/35">
              Ada pertanyaan atau saran? Kami selalu senang mendengar dari kamu.
            </motion.p>
          </SectionReveal>

          <SectionReveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📧", label: "Email", value: "hello@siapaku.id", href: "mailto:hello@siapaku.id" },
              { icon: "📱", label: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890" },
              { icon: "📸", label: "Instagram", value: "@siapaku.id", href: "https://instagram.com/siapaku.id" },
            ].map((contact) => (
              <motion.a
                key={contact.label}
                variants={scaleIn}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl p-7 text-center group hover:bg-white/[0.06] transition-all duration-500"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-500">{contact.icon}</div>
                <p className="text-white/35 text-xs mb-1.5 tracking-wide uppercase">{contact.label}</p>
                <p className="text-white/75 text-sm font-medium group-hover:text-purple-400 transition-colors duration-300">
                  {contact.value}
                </p>
              </motion.a>
            ))}
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
