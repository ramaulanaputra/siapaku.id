'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  Briefcase,
  Check,
  AlertTriangle,
  Copy,
  Heart,
  Brain,
  Moon,
  MessageCircleHeart,
  Share2,
  Sparkles,
  Star,
  Users,
  RefreshCw,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { getMBTIType, getSquadByType } from '@/lib/mbtiData';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const pop = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

/* ------------------------------------------------------------------ */
/*  Squad colour utilities                                             */
/* ------------------------------------------------------------------ */
const squadStyles: Record<string, { ring: string; bg: string; text: string; badge: string; gradient: string; accent: string }> = {
  analis: {
    ring: 'ring-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    gradient: 'from-purple-600 to-purple-400',
    accent: 'purple',
  },
  diplomat: {
    ring: 'ring-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    gradient: 'from-emerald-600 to-emerald-400',
    accent: 'emerald',
  },
  sentinel: {
    ring: 'ring-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    gradient: 'from-blue-600 to-blue-400',
    accent: 'blue',
  },
  explorer: {
    ring: 'ring-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    gradient: 'from-amber-600 to-amber-400',
    accent: 'amber',
  },
};

function getSquadStyle(squad: string) {
  return squadStyles[squad.toLowerCase()] ?? squadStyles.sentinel;
}

/* ------------------------------------------------------------------ */
/*  Inner component (uses useSearchParams)                             */
/* ------------------------------------------------------------------ */
function HasilContent() {
  const searchParams = useSearchParams();
  const typeCode = (searchParams.get('type') ?? '').toUpperCase();
  const mbti = getMBTIType(typeCode);
  const squad = getSquadByType(typeCode);
  const [copied, setCopied] = useState(false);

  /* ---------- Not found state ---------- */
  if (!mbti) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass max-w-md w-full text-center p-10 space-y-6"
        >
          <div className="text-6xl">🤔</div>
          <h1 className="text-2xl font-bold text-white">Tipe Tidak Ditemukan</h1>
          <p className="text-gray-400">
            Hmm, kayaknya kamu belum ngerjain tesnya atau tipe kepribadiannya nggak valid nih.
            Yuk coba lagi!
          </p>
          <Link href="/tes/" className="btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Mulai Tes
          </Link>
        </motion.div>
      </div>
    );
  }

  const style = getSquadStyle(mbti.squad);

  const handleShare = async () => {
    const url = `${window.location.origin}/hasil?type=${mbti.code}`;
    const text = `✨ Aku adalah ${mbti.code} — ${mbti.nickname}! Cek kepribadianmu juga di SIAPA AKU 👉 ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `SIAPA AKU — ${mbti.code}`, text, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ========== dimensi cards data ========== */
  const dimensi = [
    { icon: <Heart className="w-5 h-5" />, emoji: '💙', title: 'Self-Love & Self-Compassion', content: mbti.selfLove, type: 'text' as const },
    { icon: <Brain className="w-5 h-5" />, emoji: '🧠', title: 'Emotional Intelligence', content: mbti.emotionalBlindSpot, type: 'text' as const },
    { icon: <Moon className="w-5 h-5" />, emoji: '🌙', title: 'Shadow Side', content: mbti.shadowSide, type: 'text' as const },
    { icon: <MessageCircleHeart className="w-5 h-5" />, emoji: '💕', title: 'Love Language', content: mbti.loveLanguage, type: 'text' as const },
    { icon: <Briefcase className="w-5 h-5" />, emoji: '💼', title: 'Career Match', content: mbti.careerMatch, type: 'tags' as const },
    { icon: <Star className="w-5 h-5" />, emoji: '⭐', title: 'Famous People', content: mbti.famousPeople, type: 'list' as const },
  ];

  return (
    <div className="min-h-screen bg-brand-dark overflow-hidden">
      {/* ================================================================ */}
      {/*  HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative section-padding pt-28 pb-20 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br ${style.gradient} opacity-10 blur-3xl`} />
        <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${style.gradient} opacity-10 blur-3xl`} />

        {/* Confetti-like floating dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${style.bg.replace('/10', '/40')}`}
            style={{ top: `${10 + Math.random() * 70}%`, left: `${5 + Math.random() * 90}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Back link */}
          <motion.div variants={fadeUp} custom={0}>
            <Link href="/tes/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Tes
            </Link>
          </motion.div>

          {/* Celebration text */}
          <motion.p variants={fadeUp} custom={1} className="text-sm uppercase tracking-widest text-gray-400 font-medium">
            🎉 Hasil Kepribadianmu
          </motion.p>

          {/* Emoji */}
          <motion.div variants={pop} className="text-7xl md:text-8xl drop-shadow-lg">
            {mbti.emoji}
          </motion.div>

          {/* Type code */}
          <motion.h1
            variants={fadeUp}
            custom={2}
            className="text-6xl md:text-8xl font-extrabold tracking-tight gradient-text"
          >
            {mbti.code}
          </motion.h1>

          {/* Name & nickname */}
          <motion.div variants={fadeUp} custom={3} className="space-y-1">
            <p className="text-xl md:text-2xl font-semibold text-white">{mbti.name}</p>
            <p className={`text-lg font-medium ${style.text}`}>&ldquo;{mbti.nickname}&rdquo;</p>
          </motion.div>

          {/* Squad badge */}
          {squad && (
            <motion.div variants={fadeUp} custom={4} className="flex justify-center">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium ${style.badge}`}>
                <Users className="w-4 h-4" />
                Squad {squad.name}
              </span>
            </motion.div>
          )}

          {/* Tagline */}
          <motion.p variants={fadeUp} custom={5} className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            {mbti.tagline}
          </motion.p>
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/*  DESCRIPTION SECTION                                              */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        custom={0}
        className="section-padding max-w-4xl mx-auto"
      >
        <div className={`card-glass p-8 md:p-10 ring-1 ${style.ring} hover:ring-2 transition-all duration-300`}>
          <div className="flex items-center gap-3 mb-5">
            <div className={`p-2 rounded-lg ${style.bg}`}>
              <Sparkles className={`w-5 h-5 ${style.text}`} />
            </div>
            <h2 className="text-xl font-bold text-white">Tentang Kepribadianmu ✨</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
            {mbti.description}
          </p>
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/*  STRENGTHS & WEAKNESSES                                           */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="section-padding max-w-5xl mx-auto"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
          Kelebihan & Kekuranganmu 🪞
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="card-glass p-7 ring-1 ring-emerald-500/20 hover:ring-emerald-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400">Kelebihan 💪</h3>
            </div>
            <ul className="space-y-3">
              {mbti.strengths.map((s, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.5}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Weaknesses */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="card-glass p-7 ring-1 ring-amber-500/20 hover:ring-amber-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-amber-400">Kekurangan 🌱</h3>
            </div>
            <ul className="space-y-3">
              {mbti.weaknesses.map((w, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.5}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                  </span>
                  {w}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/*  7 DIMENSI PSIKOLOGI                                              */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="section-padding max-w-5xl mx-auto"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            7 Dimensi Psikologi 🔮
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Kenali dirimu lebih dalam lewat tujuh dimensi penting ini
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {dimensi.map((d, idx) => (
            <motion.div
              key={d.title}
              variants={fadeUp}
              custom={idx + 1}
              className={`card-glass p-7 ring-1 ${style.ring} hover:ring-2 transition-all duration-300 hover:-translate-y-1 ${
                idx === dimensi.length - 1 && dimensi.length % 2 !== 0 ? 'md:col-span-2 md:max-w-lg md:mx-auto' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${style.bg}`}>
                  <span className={style.text}>{d.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {d.emoji} {d.title}
                </h3>
              </div>

              {d.type === 'text' && (
                <p className="text-gray-300 leading-relaxed">{d.content as string}</p>
              )}

              {d.type === 'tags' && (
                <div className="flex flex-wrap gap-2">
                  {(d.content as string[]).map((tag, ti) => (
                    <span
                      key={ti}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${style.badge}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {d.type === 'list' && (
                <div className="flex flex-wrap gap-3">
                  {(d.content as string[]).map((person, pi) => (
                    <span
                      key={pi}
                      className="inline-flex items-center gap-1.5 text-gray-300"
                    >
                      <Star className={`w-3.5 h-3.5 ${style.text}`} />
                      {person}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/*  CTA SECTION                                                      */}
      {/* ================================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="section-padding max-w-3xl mx-auto text-center pb-32"
      >
        <motion.div variants={fadeUp} custom={0} className="space-y-3 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Mau lebih keren? 🚀
          </h2>
          <p className="text-gray-400">
            Ambil sertifikat resmimu, share ke temen-temen, atau coba tes ulang!
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Sertifikat */}
          <Link href="/toko/" className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center">
            <Award className="w-5 h-5" />
            Ambil Sertifikat
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Tes Ulang */}
          <Link href="/tes/" className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto justify-center">
            <RefreshCw className="w-4 h-4" />
            Tes Ulang
          </Link>

          {/* Share */}
          <button
            onClick={handleShare}
            className="btn-outline inline-flex items-center gap-2 w-full sm:w-auto justify-center relative"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share Hasil
              </>
            )}
          </button>
        </motion.div>

        {/* Fun closing note */}
        <motion.p variants={fadeUp} custom={2} className="mt-10 text-sm text-gray-500">
          Ingat, nggak ada tipe yang lebih baik dari yang lain. <br className="hidden sm:block" />
          Semua tipe itu unik dan punya kekuatan masing-masing 💛
        </motion.p>
      </motion.section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper with Suspense boundary                                */
/* ------------------------------------------------------------------ */
export default function HasilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full"
          />
        </div>
      }
    >
      <HasilContent />
    </Suspense>
  );
}
