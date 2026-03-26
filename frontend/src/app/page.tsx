"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
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

/* ─────────────────────────── Data ─────────────────────────── */

const SQUADS = [
  {
    name: "Visionary",
    emoji: "🎓",
    color: "from-purple-500 to-indigo-600",
    ring: "ring-purple-500/30",
    glow: "hover:shadow-purple-500/20",
    desc: "Pemikir strategis & visioner yang selalu haus pengetahuan.",
    types: ["INTJ", "INTP", "ENTJ", "ENTP"],
  },
  {
    name: "Harmonizer",
    emoji: "💚",
    color: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-500/30",
    glow: "hover:shadow-emerald-500/20",
    desc: "Idealis penuh empati yang menginspirasi dan membantu sesama.",
    types: ["INFJ", "INFP", "ENFJ", "ENFP"],
  },
  {
    name: "Guardian",
    emoji: "🛡️",
    color: "from-blue-500 to-cyan-600",
    ring: "ring-blue-500/30",
    glow: "hover:shadow-blue-500/20",
    desc: "Pelindung setia yang menjaga stabilitas dan keharmonisan.",
    types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  },
  {
    name: "Explorer",
    emoji: "🔥",
    color: "from-orange-500 to-rose-600",
    ring: "ring-orange-500/30",
    glow: "hover:shadow-orange-500/20",
    desc: "Jiwa bebas & spontan yang hidup di momen sekarang.",
    types: ["ISTP", "ISFP", "ESTP", "ESFP"],
  },
];

const FEATURES = [
  {
    icon: "🧠",
    title: "Emotional Intelligence",
    desc: "Pahami kecerdasan emosionalmu dan cara kamu mengelola perasaan",
    accent: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: "💜",
    title: "Self-Love Journey",
    desc: "Temukan cara mencintai diri sendiri yang sesuai dengan kepribadianmu",
    accent: "from-fuchsia-500 to-pink-600",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
  },
  {
    icon: "🌑",
    title: "Shadow Work",
    desc: "Kenali sisi gelap yang tersembunyi dan transformasikan jadi kekuatan",
    accent: "from-slate-400 to-zinc-600",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
  {
    icon: "💎",
    title: "Core Values",
    desc: "Temukan nilai-nilai inti yang menjadi fondasi hidupmu",
    accent: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: "💕",
    title: "Love Language",
    desc: "Ketahui bahasa cinta utamamu dan cara kamu mengekspresikan kasih sayang",
    accent: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: "🎯",
    title: "Career Path",
    desc: "Rekomendasi jalur karir yang selaras dengan kepribadian dan passion kamu",
    accent: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: "💑",
    title: "Romantic Style",
    desc: "Pahami pola romantismu dan chemistry dengan tipe kepribadian lain",
    accent: "from-red-500 to-rose-600",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    icon: "🤝",
    title: "Social Dynamics",
    desc: "Kenali cara kamu berinteraksi dan membangun koneksi sosial",
    accent: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const STATS = [
  { value: 16, suffix: "", label: "Tipe MBTI" },
  { value: 8, suffix: "", label: "Dimensi Analisis" },
  { value: 1000, suffix: "+", label: "Pertanyaan Unik" },
  { value: 0, suffix: "", label: "Big Five", display: "🧬" },
  { value: 0, suffix: "", label: "Enneagram", display: "✦" },
  { value: 0, suffix: "", label: "Gratis Selamanya", display: "∞" },
];

const TESTIMONIALS = [
  {
    text: "Gila sih ini tes MBTI paling detail yang pernah gue coba. Shadow work-nya bener-bener bikin gue introspeksi.",
    name: "Ayu Pratiwi",
    type: "INFJ",
    squad: "Harmonizer",
    accent: "border-emerald-500/30",
  },
  {
    text: "Love language analysis-nya akurat banget! Akhirnya ngerti kenapa gue selalu butuh quality time.",
    name: "Reza Mahendra",
    type: "ENFP",
    squad: "Harmonizer",
    accent: "border-emerald-500/30",
  },
  {
    text: "Career path recommendation-nya literally nge-describe passion gue yang selama ini gue raguin. Thank you SIAPA AKU!",
    name: "Sinta Dewi",
    type: "ENTJ",
    squad: "Visionary",
    accent: "border-purple-500/30",
  },
];

const PRICING = [
  {
    name: "Standar",
    price: "Rp 30K",
    period: "sekali bayar",
    desc: "Akses tes lanjutan & report eksklusif member.",
    features: [
      "Unlock tes Big Five (OCEAN) dan Enneagram",
      "Report umum lengkap & mendalam MBTI + OCEAN + Enneagram, khusus member",
    ],
    cta: "Gabung Member Standar →",
    popular: false,
    accent: "from-white/5 to-white/10",
    border: "border-white/10",
    emoji: "📚",
  },
  {
    name: "Premium",
    price: "Rp 100K",
    period: "sekali bayar",
    desc: "Semua di Standar + diskusi eksklusif & guide personal.",
    features: [
      "Semua benefit Member Standar",
      "Dihubungi Tim SIAPA AKU untuk diskusi hasil tes MBTI, Big Five & Enneagram",
      "Digital Personalised Guide: Cermin Diri",
      "Digital Personalised Guide: Pijar Kiprah",
      "Digital Personalised Guide: Tatap Romansa",
    ],
    cta: "Gabung Member Premium →",
    popular: true,
    accent: "from-purple-500 to-pink-500",
    border: "border-purple-500/40",
    emoji: "👑",
  },
  {
    name: "Ultimate",
    price: "Rp 300K",
    period: "sekali bayar",
    desc: "Full experience + sertifikat, merchandise & konsul psikolog.",
    features: [
      "Semua benefit Member Premium",
      "Digital & Print-out Fisik Sertifikat resmi SIAPA AKU",
      "Print-out Fisik Guide: Cermin Diri, Pijar Kiprah & Tatap Romansa",
      "T-Shirt SIAPA AKU (Customizable)",
      "Merchandise Premium (Tote Bag, Notebook, Pen, Tumbler)",
      "Unlock Fitur Konsul Psikolog",
    ],
    cta: "Gabung Member Ultimate →",
    popular: false,
    accent: "from-amber-500 to-yellow-500",
    border: "border-amber-500/30",
    emoji: "💎",
  },
];

const STEPS = [
  {
    icon: "🔑",
    title: "Login dengan Google",
    desc: "Cukup satu klik untuk memulai perjalanan self-discovery kamu.",
  },
  {
    icon: "📝",
    title: "Jawab 100 Pertanyaan",
    desc: "Pertanyaan acak dari 1000+ bank soal. Jujur = akurat.",
  },
  {
    icon: "✨",
    title: "Dapatkan Insight Mendalam",
    desc: "16 tipe MBTI, 8 dimensi, Big Five, Enneagram, dan profil personal yang detail.",
  },
];

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

/* ─────────────────────────── Counter Hook ─────────────────────────── */

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || target === 0) return;
    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return count;
}

function StatCounter({
  value,
  suffix,
  label,
  display,
}: {
  value: number;
  suffix: string;
  label: string;
  display?: string;
}) {
  const [inView, setInView] = useState(false);
  const count = useCountUp(value, 2000, inView);

  return (
    <motion.div
      variants={fadeInUp}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col items-center gap-2 px-6 py-4"
    >
      <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
        {display ? display : `${count}${suffix}`}
      </span>
      <span className="text-sm sm:text-base text-white/60 font-medium">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────── */

export default function HomePage() {
  const { data: session } = useSession();
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
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden py-16 sm:py-20"
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
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-xs sm:text-sm text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] max-w-[90vw] text-center leading-snug">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="shrink-0"
              >
                ✦
              </motion.span>
              <span className="whitespace-nowrap">Platform Self-Discovery #1 Indonesia</span>
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="mb-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/logo.svg"
                alt="SIAPA AKU"
                width={80}
                height={100}
                className="drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                priority
              />
            </motion.div>
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
            <span className="text-white">Satu Tes.</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Ribuan Jawaban
              <br />
              Tentang Kamu.
            </span>
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
            className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed mb-4"
          >
            Temukan siapa kamu sebenarnya — melalui 16 tipe MBTI dan 8 dimensi
            psikologi yang mengupas cara kamu berpikir, merasakan, mencintai,
            hingga sisi diri yang jarang kamu temui. Gratis, personal, dan bermakna.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-sm sm:text-base text-white/40 max-w-2xl leading-relaxed mb-10"
          >
            Sebagai Member, kamu juga mendapat akses eksklusif ke Big Five (OCEAN) dan Enneagram — dua pendekatan psikologi berbasis sains untuk memahami dirimu lebih utuh.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <button
              onClick={() => {
                if (session) {
                  window.location.href = "/test";
                } else {
                  signIn("google");
                }
              }}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">
                Yuk, Ketemu Diri Kamu 🚀
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <Link
              href="/about"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm font-semibold text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>

          {/* Micro text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="text-xs text-white/30"
          >
            Gratis selamanya · Login dengan Google · Hasil lengkap &amp;
            personal
          </motion.p>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* ══════════════════ STATS / TRUST BAR ══════════════════ */}
      <section className="relative py-16">
        {/* Top gradient line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-0"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              <StatCounter {...stat} />
              {i < STATS.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </section>

      {/* ══════════════════ 8 DIMENSI ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              8 Dimensi Analisis
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Lebih dari Sekadar Tes Kepribadian
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/50 max-w-xl mx-auto text-base sm:text-lg"
            >
              SIAPA AKU adalah perjalanan penemuan diri yang bermakna.
            </motion.p>
          </motion.div>

          {/* Cards grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative rounded-2xl border ${f.border} bg-white/[0.03] backdrop-blur-sm p-6 transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-500/5`}
              >
                {/* Accent line top */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${f.accent} opacity-40 group-hover:opacity-80 transition-opacity`}
                />
                <div
                  className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center text-2xl mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ SQUAD ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              4 Squad Unik
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Kamu di Squad Mana?
              </span>
            </motion.h2>
          </motion.div>

          {/* Squad cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SQUADS.map((squad, i) => (
              <motion.div
                key={squad.name}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.25 },
                }}
                className={`group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 ${squad.glow} hover:shadow-xl ring-1 ${squad.ring} ring-inset`}
              >
                <div className="text-4xl mb-4">{squad.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {squad.name}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed mb-4">
                  {squad.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {squad.types.map((t) => (
                    <span
                      key={t}
                      className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${squad.color} bg-opacity-10 text-white/80 font-medium border border-white/10`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
              Cara Kerja
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                3 Langkah Mudah
              </span>
            </motion.h2>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-[2px]">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 origin-left"
              />
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-3xl backdrop-blur-sm">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              Testimoni
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Apa Kata Mereka?
              </span>
            </motion.h2>
          </motion.div>

          {/* Testimonial cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={`relative rounded-2xl border ${t.accent} bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8`}
              >
                {/* Quote icon */}
                <div className="text-3xl text-purple-500/30 mb-4">"</div>
                <p className="text-white/70 leading-relaxed mb-6 text-sm sm:text-base">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-sm font-bold text-white/60">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {t.type} · {t.squad}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section className="relative py-24 sm:py-32">
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
              Gabung Member
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
              className="text-white/50 max-w-lg mx-auto"
            >
              Tes MBTI gratis untuk semua. Upgrade ke Member untuk tes lanjutan, report eksklusif, guide personal, dan lebih banyak lagi.
            </motion.p>
          </motion.div>

          {/* Free test notice */}
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

          {/* Pricing cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {PRICING.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className={`relative rounded-2xl border ${pkg.border} ${
                  pkg.popular
                    ? "bg-white/[0.06] ring-2 ring-purple-500/30"
                    : "bg-white/[0.03]"
                } backdrop-blur-sm p-6 sm:p-8 flex flex-col`}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-purple-500/30">
                      Paling Populer
                    </span>
                  </div>
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

                <div className="text-3xl mb-3">{(pkg as any).emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Member {pkg.name}
                </h3>
                <p className="text-sm text-white/40 mb-4">{pkg.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {pkg.price}
                  </span>
                  <span className="text-sm text-white/40 ml-2">
                    /{pkg.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <span className="text-purple-400 mt-0.5 shrink-0">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    pkg.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20"
                      : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {pkg.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Lihat lebih banyak button */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm font-semibold text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Lebih Banyak Lagi
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
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

            {/* BG Orb */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-5xl mb-6 inline-block"
              >
                💜
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Mereka Mengenal Kamu.
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Sekarang Giliran Kamu.
                </span>
              </h2>
              <p className="text-white/45 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Mulai perjalanan mengenal diri sendiri. Gratis, mendalam, dan
                personal.
              </p>
              <button
                onClick={() => {
                  if (session) {
                    window.location.href = "/test";
                  } else {
                    signIn("google");
                  }
                }}
                className="group relative inline-flex px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Mulai Sekarang — Gratis 🚀
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
