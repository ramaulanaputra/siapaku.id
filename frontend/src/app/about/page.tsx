"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* ─────────────────────────── Animation Variants ─────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
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

/* ─────────────────────────── Particle Field ─────────────────────────── */

function ParticleField() {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
      opacity: number;
      drift: number;
    }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
      drift: -20 + Math.random() * 40,
    }));
    setParticles(generated);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-30px) translateX(var(--drift));
          }
          50% {
            transform: translateY(-15px) translateX(calc(var(--drift) * -0.5));
          }
          75% {
            transform: translateY(-40px) translateX(calc(var(--drift) * 0.3));
          }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background:
                p.id % 3 === 0
                  ? `rgba(168, 85, 247, ${p.opacity})`
                  : `rgba(255, 255, 255, ${p.opacity})`,
              animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
              // @ts-ignore
              "--drift": `${p.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
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
  { icon: "🧬", title: "MBTI Foundation", desc: "Pemetaan 4 dimensi kepribadian dasar sebagai fondasi pemahaman diri", accent: "from-violet-500 to-purple-600", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { icon: "🧠", title: "Emotional Intelligence", desc: "Mengenali pola emosi, blind spot, dan metode healing personal", accent: "from-blue-500 to-cyan-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: "💜", title: "Self-Love Guidance", desc: "Panduan mencintai diri yang dirancang khusus sesuai tipe kepribadianmu", accent: "from-fuchsia-500 to-pink-600", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
  { icon: "🌑", title: "Shadow Work", desc: "Mengakui dan mengintegrasikan sisi tersembunyi dalam dirimu", accent: "from-slate-400 to-zinc-600", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  { icon: "⭐", title: "Core Values", desc: "Mengidentifikasi nilai-nilai fundamental yang mendefinisikan siapa kamu", accent: "from-cyan-500 to-blue-600", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { icon: "💌", title: "Love Language", desc: "Memahami cara unikmu dalam memberi dan menerima kasih sayang", accent: "from-rose-500 to-pink-600", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { icon: "🎯", title: "Career & Romance", desc: "Jalur karir dan dinamika hubungan yang selaras dengan kepribadianmu", accent: "from-amber-500 to-orange-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: "🌟", title: "Life Purpose", desc: "Mengungkap panggilan hidup yang tersembunyi dalam DNA kepribadianmu", accent: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const VALUES = [
  { icon: "🔬", title: "Berbasis Sains", desc: "Setiap dimensi dibangun di atas riset psikologi yang tervalidasi", accent: "from-purple-500 to-violet-600", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: "🤝", title: "Tanpa Penghakiman", desc: "Tidak ada tipe yang lebih baik atau lebih buruk — hanya berbeda", accent: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: "🔒", title: "Privasi Absolut", desc: "Data kepribadianmu hanya milikmu, selamanya", accent: "from-blue-500 to-cyan-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: "🌱", title: "Bertumbuh Bersama", desc: "Dirancang untuk mendampingi perjalanan panjang self-discovery-mu", accent: "from-pink-500 to-rose-600", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

/* ── Component ─────────────────────────────────────── */
export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Parallax for hero */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="relative bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16"
      >
        {/* Particle background */}
        <ParticleField />

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
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-xs sm:text-sm text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="shrink-0"
              >
                💜
              </motion.span>
              Tentang Kami
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">Perjalanan Mengenal</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Diri Dimulai
            </span>{" "}
            <span className="text-white">dari Sini</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed mb-10"
          >
            Di dunia yang mengajarkan kita mengenal segalanya kecuali diri sendiri,
            SIAPA AKU hadir sebagai ruang aman untuk menemukan siapa kamu sebenarnya.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5"
            >
              <div className="w-1 h-2 bg-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* ══════════════════ BRAND STORY ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        {/* Top gradient line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Story text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
              >
                Cerita Kami
              </motion.span>

              <motion.h2
                variants={fadeInUp}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight"
              >
                &ldquo;Tak Kenal Maka
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Tak Sayang&rdquo;
                </span>
              </motion.h2>

              <motion.div variants={staggerContainer} className="space-y-5 text-white/50 leading-relaxed text-[15px]">
                <motion.p variants={fadeInUp}>
                  Pepatah lama yang menyimpan kebenaran universal. Kita menghafal nama teman-teman kita,
                  mengetahui makanan favorit mereka, memahami cara mereka berpikir. Namun ketika seseorang bertanya —
                  <span className="text-white/80 italic"> kamu itu sebenarnya orang yang seperti apa?</span> —
                  banyak dari kita justru terdiam.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  SIAPA AKU lahir dari satu keyakinan sederhana:{" "}
                  <span className="text-white font-semibold">
                    self-knowledge adalah fondasi self-love.
                  </span>{" "}
                  Kamu tidak bisa mencintai sesuatu yang tidak kamu kenal. Dan kamu tidak bisa mengenal
                  sesuatu yang tidak pernah kamu temui.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  Kami hadir bukan sebagai penilai, melainkan sebagai teman perjalanan —
                  yang mengajak kamu membuka percakapan paling penting dalam hidupmu:
                  percakapan dengan diri sendiri.
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right: Stat cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4"
            >
              {[
                { stat: "16", label: "Tipe Kepribadian", suffix: "Unik" },
                { stat: "8", label: "Dimensi Psikologi", suffix: "Mendalam" },
                { stat: "1000+", label: "Soal di Bank", suffix: "Pertanyaan" },
                { stat: "4", label: "Squad Eksklusif", suffix: "Komunitas" },
                { stat: "🧬", label: "Big Five", suffix: "Personality Traits" },
                { stat: "✦", label: "Enneagram", suffix: "Core Motivation" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeInRight}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 flex items-center gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 group-hover:opacity-80 transition-opacity" />
                  <div className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent min-w-[80px]">
                    {item.stat}
                  </div>
                  <div>
                    <div className="text-white/80 font-medium">{item.label}</div>
                    <div className="text-white/40 text-sm">{item.suffix}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </section>

      {/* ══════════════════ OUR VALUES ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-600/20 to-transparent blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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
              Prinsip Kami
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              <span className="text-white">Dibangun dengan </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Intensi
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/50 max-w-xl mx-auto text-base sm:text-lg"
            >
              Setiap fitur, setiap kata, setiap dimensi — dirancang dengan satu tujuan:
              membantumu memahami diri lebih dalam.
            </motion.p>
          </motion.div>

          {/* Values cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {VALUES.map((val) => (
              <motion.div
                key={val.title}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative rounded-2xl border ${val.border} bg-white/[0.03] backdrop-blur-sm p-7 text-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5`}
              >
                {/* Accent line top */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${val.accent} opacity-40 group-hover:opacity-80 transition-opacity`}
                />
                <div className={`w-14 h-14 rounded-xl ${val.bg} flex items-center justify-center text-3xl mb-5 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                  {val.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{val.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </section>

      {/* ══════════════════ 8 DIMENSIONS ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/25 to-transparent blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-pink-600/20 to-transparent blur-[100px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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
              Kedalaman Analisis
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5"
            >
              <span className="text-white">Bukan Sekadar </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                4 Huruf
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/50 max-w-2xl mx-auto text-base sm:text-lg"
            >
              MBTI tradisional memberimu label. SIAPA AKU memberimu pemahaman.
              Melalui 8 dimensi psikologi yang saling terhubung, kami memetakan
              gambaran diri yang utuh dan bermakna.
            </motion.p>
          </motion.div>

          {/* Dimension cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {DIMENSIONS.map((dim) => (
              <motion.div
                key={dim.title}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative rounded-2xl border ${dim.border} bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5`}
              >
                {/* Accent line top */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${dim.accent} opacity-40 group-hover:opacity-80 transition-opacity`}
                />
                {/* Glow on hover */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/0 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700" />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${dim.bg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    {dim.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">{dim.title}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{dim.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </section>

      {/* ══════════════════ VISION ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-10 sm:p-16 text-center overflow-hidden"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -inset-[1px] bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.15),transparent,rgba(236,72,153,0.15),transparent)] rounded-3xl"
              />
            </div>

            {/* BG Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-purple-600/20 to-transparent blur-[100px]"
              />
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.08, 0.15, 0.08],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-pink-600/15 to-transparent blur-[100px]"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/[0.04] mb-8 text-4xl"
              >
                🌟
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.span
                  variants={fadeInUp}
                  className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
                >
                  Visi
                </motion.span>

                <motion.h2
                  variants={fadeInUp}
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                >
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Visi Kami
                  </span>
                </motion.h2>

                <motion.p
                  variants={fadeInUp}
                  className="text-white/50 leading-relaxed text-lg md:text-xl max-w-2xl mx-auto mb-8"
                >
                  Membantu jutaan orang Indonesia untuk berkenalan dengan diri sendiri
                  dan mulai mencintai diri dengan tulus.
                </motion.p>

                <motion.p
                  variants={fadeInUp}
                  className="text-white/40 leading-relaxed max-w-xl mx-auto text-[15px]"
                >
                  Karena ketika kamu benar-benar mengenal dirimu, kamu bisa hadir lebih utuh —
                  untuk dirimu sendiri, dan untuk orang-orang yang kamu cintai.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        {/* Background orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/15 to-transparent blur-[120px]"
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-14"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
            >
              FAQ
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
            >
              <span className="text-white">Pertanyaan </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Umum
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/45 max-w-lg mx-auto"
            >
              Hal-hal yang sering ditanyakan tentang SIAPA AKU
            </motion.p>
          </motion.div>

          {/* FAQ items */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-3"
          >
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden group"
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
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </section>

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        {/* Background orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.06, 0.12, 0.06],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-purple-600/15 to-transparent blur-[120px]"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-14"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
            >
              Kontak
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
            >
              <span className="text-white">Mari </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Terhubung
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/45 max-w-lg mx-auto"
            >
              Ada pertanyaan atau saran? Kami selalu senang mendengar dari kamu.
            </motion.p>
          </motion.div>

          {/* Contact cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: "📧", label: "Email", value: "hello@siapaku.id", href: "mailto:hello@siapaku.id", accent: "from-purple-500 to-violet-600", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { icon: "📱", label: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890", accent: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { icon: "📸", label: "Instagram", value: "@siapaku.id", href: "https://instagram.com/siapaku.id", accent: "from-pink-500 to-rose-600", bg: "bg-pink-500/10", border: "border-pink-500/20" },
            ].map((contact) => (
              <motion.a
                key={contact.label}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className={`group relative rounded-2xl border ${contact.border} bg-white/[0.03] backdrop-blur-sm p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5`}
              >
                {/* Accent line top */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${contact.accent} opacity-40 group-hover:opacity-80 transition-opacity`}
                />
                <div className={`w-14 h-14 rounded-xl ${contact.bg} flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                  {contact.icon}
                </div>
                <p className="text-white/40 text-xs mb-1.5 tracking-[0.15em] uppercase font-semibold">{contact.label}</p>
                <p className="text-white/75 text-sm font-medium group-hover:text-purple-400 transition-colors duration-300">
                  {contact.value}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
