"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MBTI_PROFILES, MBTIType, getSquadColor, getSquadEmoji } from "@/lib/mbtiData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Props {
  params: Promise<{ type: string }>;
}

const DIMENSION_LABELS = [
  { key: "EI", a: "Extrovert", b: "Introvert", aColor: "#3B82F6", bColor: "#7C3AED" },
  { key: "SN", a: "Sensing", b: "iNtuition", aColor: "#F59E0B", bColor: "#EC4899" },
  { key: "TF", a: "Thinking", b: "Feeling", aColor: "#6366F1", bColor: "#EC4899" },
  { key: "JP", a: "Judging", b: "Perceiving", aColor: "#10B981", bColor: "#F59E0B" },
];

export default function ResultPage({ params }: Props) {
  const { type } = use(params);
  const router = useRouter();
  const mbtiType = type.toUpperCase() as MBTIType;
  const profile = MBTI_PROFILES[mbtiType];

  if (!profile) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Tipe tidak ditemukan</p>
          <button onClick={() => router.push("/test")} className="btn-primary">
            Ulangi Tes
          </button>
        </div>
      </main>
    );
  }

  const squadColor = getSquadColor(profile.squad);
  const squadEmoji = getSquadEmoji(profile.squad);

  return (
    <main className="min-h-screen bg-brand-dark">
      <Navbar />

      {/* Hero Result */}
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="orb w-96 h-96 opacity-20" style={{ background: squadColor, top: 0, right: 0 }} />
        <div className="orb w-72 h-72 opacity-15 bg-pink-600 bottom-0 left-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
              style={{ background: squadColor + "20", color: squadColor, border: `1px solid ${squadColor}40` }}
            >
              {squadEmoji} Squad {profile.squad}
            </div>

            <div className="text-8xl mb-4 animate-float inline-block">{profile.emoji}</div>

            <h1 className="font-display text-6xl md:text-7xl font-bold text-white mb-2">
              {profile.type}
            </h1>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: squadColor }}>
              {profile.nickname}
            </h2>
            <p className="text-white/40 italic text-lg mb-8">"{profile.tagline}"</p>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              {profile.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 8 Dimensions */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-white text-center mb-10"
          >
            8 Dimensi Kepribadian Kamu
          </motion.h2>

          <div className="space-y-6">
            {[
              { title: "🧠 Emotional Intelligence", content: profile.emotionalIntelligence },
              { title: "💜 Self-Love Journey", content: profile.selfLoveGuidance },
              { title: "🌑 Shadow Work", content: profile.shadowWork },
              { title: "💫 Love Language", content: profile.loveLanguage.join(" · ") },
              { title: "💼 Career Paths", content: profile.careerPaths.join(", ") },
              { title: "❤️ Romantic Style", content: profile.romanticStyle },
              { title: "👥 Social Dynamics", content: profile.socialDynamics },
              { title: "🎯 Life Purpose", content: profile.purpose },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths & Weaknesses */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-green-400 mb-4">✨ Kekuatan Kamu</h3>
            <ul className="space-y-2">
              {profile.strengths.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-rose-400 mb-4">🌱 Area untuk Tumbuh</h3>
            <ul className="space-y-2">
              {profile.weaknesses.map((w, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-white text-center mb-6">
            Nilai Inti Kamu
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {profile.coreValues.map((v, i) => (
              <motion.span
                key={v}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: squadColor + "20", color: squadColor, border: `1px solid ${squadColor}30` }}
              >
                {v}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Famous People */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-2xl font-bold text-white mb-4">
            Tokoh dengan Tipe yang Sama
          </h3>
          <p className="text-white/40 text-sm mb-6">
            Kamu satu tipe dengan orang-orang luar biasa ini:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {profile.famousPeople.map((person) => (
              <span
                key={person}
                className="glass rounded-full px-4 py-2 text-white/70 text-sm"
              >
                {person}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-10">
            <h3 className="font-display text-3xl font-bold text-white mb-4">
              Simpan Perjalananmu
            </h3>
            <p className="text-white/50 mb-8">
              Lihat history tes kamu, track perkembangan, dan dapatkan insights lebih dalam di My Profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile" className="btn-primary">
                Lihat My Profile
              </Link>
              <Link href="/shop" className="btn-secondary">
                Dapatkan Certificate
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
