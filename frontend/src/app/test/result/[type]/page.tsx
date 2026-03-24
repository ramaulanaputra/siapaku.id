"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TestResult,
  DimensionScore,
  DIMENSION_INFO,
} from "@/lib/scoring";
import { MBTI_PROFILES, MBTIType, getSquadColor, getSquadEmoji } from "@/lib/mbtiData";
import { StoryGenerator } from "@/components/StoryGenerator";
import type { MBTIDimension } from "@/lib/questions";

/* ═══════════════════════════════════════════
   A/T Identity descriptions per MBTI type
   ═══════════════════════════════════════════ */
const ASSERTIVE_TRAITS: Record<MBTIType, string> = {
  INTJ: "seorang strategist yang tenang dan tidak goyah oleh opini orang lain",
  INTP: "seorang pemikir yang percaya diri dengan analisis kamu tanpa ragu berlebihan",
  ENTJ: "seorang pemimpin yang mantap dan tidak mudah terdistraksi oleh keraguan internal",
  ENTP: "seorang inovator yang berani menjalankan ide tanpa takut gagal",
  INFJ: "seorang advocate yang stabil secara emosional dan tidak mudah terbawa emosi orang lain",
  INFP: "seorang idealis yang menerima diri apa adanya tanpa inner critic yang berlebihan",
  ENFJ: "seorang pemimpin hati yang bisa memberi tanpa kehilangan diri sendiri",
  ENFP: "seorang campaigner yang berani menjadi diri sendiri tanpa takut judgement",
  ISTJ: "seorang guardian yang mantap menjalankan tugas tanpa overthinking",
  ISFJ: "seorang protector yang bisa bilang tidak tanpa merasa bersalah",
  ESTJ: "seorang pemimpin yang decisive tanpa second-guessing berlebihan",
  ESFJ: "seorang nurturer yang tetap stabil meski ada konflik di sekitar kamu",
  ISTP: "seorang craftsman yang cool dan tidak terpengaruh tekanan sosial",
  ISFP: "seorang seniman yang percaya diri dengan ekspresi unik kamu",
  ESTP: "seorang risk-taker yang calculated dan tidak mudah terganggu oleh kegagalan",
  ESFP: "seorang entertainer yang authentic tanpa butuh validasi dari orang lain",
};

const TURBULENT_TRAITS: Record<MBTIType, string> = {
  INTJ: "seorang strategist yang terus menyempurnakan rencana sampai benar-benar optimal",
  INTP: "seorang pemikir yang selalu push diri untuk menemukan jawaban yang lebih dalam",
  ENTJ: "seorang pemimpin yang terus menaikkan standar dan tidak pernah puas dengan 'cukup baik'",
  ENTP: "seorang inovator yang selalu challenge diri untuk menghasilkan ide yang lebih brilian",
  INFJ: "seorang advocate yang sangat aware dengan dampak tindakan kamu terhadap orang lain",
  INFP: "seorang idealis yang terus menggali kedalaman emosional untuk authentic growth",
  ENFJ: "seorang pemimpin hati yang selalu improve cara kamu support orang-orang terdekat",
  ENFP: "seorang campaigner yang terus berevolusi menjadi versi terbaik dari diri kamu",
  ISTJ: "seorang guardian yang perfeksionis dan selalu meningkatkan standar kualitas kerja",
  ISFJ: "seorang protector yang sangat attentive terhadap kebutuhan orang yang kamu sayangi",
  ESTJ: "seorang pemimpin yang terus improve sistem dan tidak toleran terhadap mediocrity",
  ESFJ: "seorang nurturer yang terus belajar cara lebih baik untuk hadir bagi orang lain",
  ISTP: "seorang craftsman yang terus mengasah skill sampai level mastery tertinggi",
  ISFP: "seorang seniman yang terus menggali ekspresi yang lebih authentic dan mendalam",
  ESTP: "seorang doer yang belajar dari setiap kegagalan dan bangkit lebih kuat",
  ESFP: "seorang entertainer yang terus grow dan tidak puas hanya di permukaan",
};

function getAssertiveDescription(type: MBTIType): string {
  return `Sebagai ${type}-A, kamu memiliki kepercayaan diri yang stabil. Kamu tidak mudah terpengaruh oleh stres dan cenderung tenang menghadapi tekanan. Kamu menerima dirimu apa adanya dan tidak terlalu khawatir tentang pandangan orang lain. Ini membuat kamu ${ASSERTIVE_TRAITS[type]}. Namun, hati-hati agar kamu tidak menjadi complacent — kadang sedikit ketidakpuasan bisa menjadi bahan bakar pertumbuhan.`;
}

function getTurbulentDescription(type: MBTIType): string {
  return `Sebagai ${type}-T, kamu memiliki dorongan internal yang kuat untuk terus berkembang. Perfeksionisme kamu adalah pisau bermata dua — membuatmu meraih standar tinggi, tapi juga bisa melelahkan. Kamu sangat aware dengan kelemahan diri dan selalu berusaha improve. Ini membuat kamu ${TURBULENT_TRAITS[type]}. Ingat bahwa kamu sudah cukup baik — pertumbuhan tidak harus datang dari ketidakpuasan.`;
}

/* ═══════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ═══════════════════════════════════════════
   Dimension Bar Component
   ═══════════════════════════════════════════ */
function DimensionBar({ dim, index }: { dim: DimensionScore; index: number }) {
  const info = DIMENSION_INFO[dim.dimension as MBTIDimension];
  const isADominant = dim.percentA >= dim.percentB;
  const dominantLabel = isADominant ? info.poleALabel : info.poleBLabel;
  const dominantPercent = isADominant ? dim.percentA : dim.percentB;
  const isIdentity = dim.dimension === "AT";

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="mb-5"
    >
      {/* Labels */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/80">{info.poleALabel}</span>
        <span className="text-xs text-white/40 uppercase tracking-wider">
          {isIdentity ? "Identity" : dim.dimension}
        </span>
        <span className="text-sm font-medium text-white/80">{info.poleBLabel}</span>
      </div>

      {/* Bar */}
      <div className="relative h-10 rounded-full overflow-hidden bg-white/5 border border-white/10">
        {/* Pole A fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-l-full flex items-center justify-end pr-3"
          style={{ backgroundColor: isADominant ? info.color : `${info.color}40` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${dim.percentA}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {dim.percentA >= 25 && (
            <span className="text-xs font-bold text-white drop-shadow-lg">{dim.percentA}%</span>
          )}
        </motion.div>

        {/* Pole B fill */}
        <motion.div
          className="absolute right-0 top-0 h-full rounded-r-full flex items-center justify-start pl-3"
          style={{ backgroundColor: !isADominant ? info.color : `${info.color}40` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${dim.percentB}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {dim.percentB >= 25 && (
            <span className="text-xs font-bold text-white drop-shadow-lg">{dim.percentB}%</span>
          )}
        </motion.div>

        {/* Center divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 z-10" />
      </div>

      {/* Dominant indicator */}
      <div className="flex justify-center mt-1.5">
        <span
          className="text-xs font-semibold px-3 py-0.5 rounded-full"
          style={{ color: info.color, background: `${info.color}15` }}
        >
          {dominantPercent}% {dominantLabel}
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Expandable Card Component
   ═══════════════════════════════════════════ */
function DimensionCard({
  icon,
  title,
  content,
  index,
  squadColor,
  isList,
}: {
  icon: string;
  title: string;
  content: string | string[];
  index: number;
  squadColor: string;
  isList?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isArray = Array.isArray(content);
  const displayContent = isArray ? content.join(" · ") : content;
  const shouldTruncate = !isArray && displayContent.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="glass rounded-2xl p-6 card-hover card-shine cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${squadColor}20` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            {title}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white/30 text-xs"
            >
              ▼
            </motion.span>
          </h3>

          <AnimatePresence mode="wait">
            {isArray ? (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={false}
                animate={{ height: "auto" }}
              >
                {(content as string[]).map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: `${squadColor}15`,
                      color: squadColor,
                      border: `1px solid ${squadColor}30`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            ) : (
              <motion.p
                className="text-white/60 leading-relaxed text-sm"
                initial={false}
                animate={{ height: "auto" }}
              >
                {shouldTruncate && !expanded
                  ? displayContent.slice(0, 150) + "..."
                  : displayContent}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Main Result Page (inner, wrapped with Suspense)
   ═══════════════════════════════════════════ */
function ResultContent() {
  const { data: session } = useSession();
  const params = useParams();
  const searchParams = useSearchParams();

  const typeParam = (params.type as string)?.toUpperCase() || "";
  const identityParam = searchParams.get("identity")?.toUpperCase() || "A";

  const mbtiType = typeParam as MBTIType;
  const profile = MBTI_PROFILES[mbtiType];

  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shareText, setShareText] = useState("Bagikan Hasilmu");

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("siapaku_result");
      if (stored) {
        setTestResult(JSON.parse(stored));
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (!profile) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🤔</div>
          <p className="text-white/50 mb-6 text-lg">Tipe kepribadian tidak ditemukan</p>
          <Link href="/test" className="btn-primary">
            Mulai Tes
          </Link>
        </div>
      </main>
    );
  }

  const squadColor = getSquadColor(profile.squad);
  const squadEmoji = getSquadEmoji(profile.squad);
  const identity = testResult?.identity || identityParam;
  const fullType = `${mbtiType}-${identity}`;

  const dimensions = testResult?.dimensions || [];
  const hasDimensions = dimensions.length > 0;

  const handleShare = async () => {
    const text = `✨ Hasil tes MBTI SiapAku: Aku adalah ${fullType} — ${profile.nickname}! "${profile.tagline}"\n\nCek kepribadianmu di siapaku.id 🔮`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Aku ${fullType}!`, text, url: window.location.href });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShareText("Tersalin! ✓");
      setTimeout(() => setShareText("Bagikan Hasilmu"), 2500);
    }
  };

  const dimensionCards = [
    { icon: "🧠", title: "Emotional Intelligence", content: profile.emotionalIntelligence },
    { icon: "💜", title: "Self-Love Journey", content: profile.selfLoveGuidance },
    { icon: "🌑", title: "Shadow Work", content: profile.shadowWork },
    { icon: "💎", title: "Core Values", content: profile.coreValues },
    { icon: "💕", title: "Love Language", content: profile.loveLanguage },
    { icon: "🎯", title: "Career Path", content: profile.careerPaths },
    { icon: "💑", title: "Romantic Style", content: profile.romanticStyle },
    { icon: "🤝", title: "Social Dynamics", content: profile.socialDynamics },
  ];

  return (
    <main className="min-h-screen bg-brand-dark relative overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        {/* Background orbs */}
        <div
          className="orb w-[500px] h-[500px] animate-pulse-slow"
          style={{ background: squadColor, top: "-100px", right: "-100px", opacity: 0.12 }}
        />
        <div
          className="orb w-[400px] h-[400px] animate-pulse-slow"
          style={{ background: "#EC4899", bottom: "-100px", left: "-100px", opacity: 0.08, animationDelay: "2s" }}
        />
        <div
          className="orb w-[300px] h-[300px] animate-morph animate-pulse-slow"
          style={{ background: squadColor, top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.06 }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Squad badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium mb-8"
              style={{
                background: `${squadColor}15`,
                color: squadColor,
                border: `1px solid ${squadColor}30`,
              }}
            >
              {squadEmoji} Squad {profile.squad}
            </div>
          </motion.div>

          {/* Emoji */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="text-8xl md:text-9xl mb-6 inline-block animate-float"
          >
            {profile.emoji}
          </motion.div>

          {/* Type display */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-2 tracking-tight">
              {mbtiType}
              <span style={{ color: squadColor }}>-{identity}</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-white/40 text-lg mb-2">Kamu adalah</p>
            <h2
              className="font-display text-2xl md:text-4xl font-bold mb-2"
              style={{ color: squadColor }}
            >
              {profile.nickname}
            </h2>
            <p className="text-white/50 text-sm mb-1 italic">{profile.nicknameEn}</p>
            <p className="text-white/40 italic text-lg mt-4 max-w-lg mx-auto">
              &ldquo;{profile.tagline}&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ DIMENSION BARS ═══════════════ */}
      {hasDimensions && (
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-2"
            >
              Dimensi Kepribadian
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/40 text-center text-sm mb-10"
            >
              Berdasarkan jawaban kamu dari 100 pertanyaan
            </motion.p>

            <div className="glass rounded-3xl p-6 md:p-8">
              {dimensions.map((dim, i) => (
                <DimensionBar key={dim.dimension} dim={dim} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ DESCRIPTION ═══════════════ */}
      <section className="py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
              style={{ background: `linear-gradient(90deg, ${squadColor}, transparent)` }}
            />
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              Tentang {mbtiType}
            </h3>
            <p className="text-white/70 leading-relaxed text-lg">{profile.description}</p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ STRENGTHS & WEAKNESSES ═══════════════ */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-10"
          >
            Kekuatan & Area Pertumbuhan
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-600 rounded-l-2xl" />
              <h3 className="font-semibold text-green-400 mb-5 flex items-center gap-2 text-lg">
                <span className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center text-base">✨</span>
                Kekuatan Kamu
              </h3>
              <ul className="space-y-3">
                {profile.strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Weaknesses */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-red-600 rounded-l-2xl" />
              <h3 className="font-semibold text-rose-400 mb-5 flex items-center gap-2 text-lg">
                <span className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center text-base">🌱</span>
                Area untuk Tumbuh
              </h3>
              <ul className="space-y-3">
                {profile.weaknesses.map((w, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <span className="w-2 h-2 bg-rose-400 rounded-full shrink-0" />
                    {w}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 8 DIMENSI KEPRIBADIAN ═══════════════ */}
      <section className="py-16 px-6 relative">
        <div
          className="orb w-[300px] h-[300px]"
          style={{ background: squadColor, top: "20%", right: "-80px", opacity: 0.06 }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              8 Dimensi Kepribadian
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Analisis mendalam tentang siapa kamu sebenarnya — dari emosi, love language, shadow, hingga purpose hidup kamu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dimensionCards.map((card, i) => (
              <DimensionCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                content={card.content}
                index={i}
                squadColor={squadColor}
                isList={Array.isArray(card.content)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PURPOSE ═══════════════ */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${squadColor}15, ${squadColor}05)`,
              border: `1px solid ${squadColor}20`,
            }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${squadColor}, transparent 70%)`,
              }}
            />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
                Life Purpose
              </h3>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed italic">
                &ldquo;{profile.purpose}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FAMOUS PEOPLE ═══════════════ */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold text-white mb-3"
          >
            Tokoh dengan Tipe yang Sama
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-sm mb-8"
          >
            Kamu satu tipe dengan orang-orang luar biasa ini
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {profile.famousPeople.map((person, i) => (
              <motion.div
                key={person}
                variants={scaleIn}
                className="glass rounded-2xl px-5 py-3 flex items-center gap-3 card-hover"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{ background: `${squadColor}30` }}
                >
                  {person.charAt(0)}
                </div>
                <span className="text-white/80 text-sm font-medium">{person}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ IDENTITY VARIANT (A/T) ═══════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
              {/* Accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                style={{
                  background: identity === "A"
                    ? "linear-gradient(90deg, #10B981, #34D399)"
                    : "linear-gradient(90deg, #8B5CF6, #A78BFA)",
                }}
              />

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: identity === "A" ? "#10B98120" : "#8B5CF620",
                  }}
                >
                  {identity === "A" ? "🛡️" : "🔥"}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Identity: {identity === "A" ? "Assertive" : "Turbulent"}
                  </h3>
                  <p className="text-white/40 text-sm">
                    {identity === "A"
                      ? "Percaya diri, stabil secara emosional, dan stress-resistant"
                      : "Perfeksionis, self-aware, dan growth-driven"}
                  </p>
                </div>
              </div>

              <p className="text-white/70 leading-relaxed">
                {identity === "A"
                  ? getAssertiveDescription(mbtiType)
                  : getTurbulentDescription(mbtiType)}
              </p>

              {/* Mini comparison */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: identity === "A" ? "#10B98115" : "rgba(255,255,255,0.03)",
                    border: identity === "A" ? "1px solid #10B98130" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className={`text-sm font-semibold mb-1 ${identity === "A" ? "text-emerald-400" : "text-white/40"}`}>
                    Assertive (-A)
                  </div>
                  <div className="text-xs text-white/40">
                    Tenang · Stabil · Self-assured
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: identity === "T" ? "#8B5CF615" : "rgba(255,255,255,0.03)",
                    border: identity === "T" ? "1px solid #8B5CF630" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="text-2xl mb-2">🔥</div>
                  <div className={`text-sm font-semibold mb-1 ${identity === "T" ? "text-violet-400" : "text-white/40"}`}>
                    Turbulent (-T)
                  </div>
                  <div className="text-xs text-white/40">
                    Perfeksionis · Aware · Growth
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-3xl p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                background: `radial-gradient(circle at 50% 100%, ${squadColor}, transparent 60%)`,
              }}
            />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display text-3xl font-bold text-white mb-3">
                Itulah Kamu, <span style={{ color: squadColor }}>{fullType}</span>!
              </h3>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Setiap kepribadian itu unik dan berharga. Kenali dirimu, terima dirimu, dan tumbuh jadi versi terbaik kamu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={handleShare} className="btn-primary flex items-center gap-2 justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  {shareText}
                </button>
                {hasDimensions && (
                  <StoryGenerator
                    mbtiType={mbtiType}
                    identity={identity}
                    userName={session?.user?.name || undefined}
                    dimensions={dimensions}
                  />
                )}
                <Link href="/test" className="btn-secondary">
                  🔄 Ulangi Tes
                </Link>
              </div>

              <Link
                href="/"
                className="inline-block mt-6 text-white/30 hover:text-white/60 transition-colors text-sm"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

/* ═══════════════════════════════════════════
   Page export with Suspense
   ═══════════════════════════════════════════ */
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-dark flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40">Memuat hasil kamu...</p>
          </div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
