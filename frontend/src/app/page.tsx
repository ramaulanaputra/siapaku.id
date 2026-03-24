"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SQUADS = [
  { name: "Explorer", emoji: "🚀", color: "#3B82F6", types: ["ESTP", "ESFP", "ISTP", "ISFP"], desc: "Fleksibel, adaptif, action-oriented" },
  { name: "Guardian", emoji: "🛡️", color: "#F59E0B", types: ["ESTJ", "ESFJ", "ISTJ", "ISFJ"], desc: "Terstruktur, loyal, responsible" },
  { name: "Visionary", emoji: "⚡", color: "#7C3AED", types: ["ENTJ", "ENTP", "INTJ", "INTP"], desc: "Strategic, analytical, independent" },
  { name: "Harmonizer", emoji: "🌟", color: "#EC4899", types: ["ENFJ", "ENFP", "INFJ", "INFP"], desc: "Empathetic, idealistic, creative" },
];

const FEATURES = [
  { icon: "🧠", title: "8 Dimensi Psikologi", desc: "Bukan sekadar 4 huruf MBTI. Kamu dapat insight mendalam tentang emosi, shadow, love language, dan purpose." },
  { icon: "✨", title: "Journey Self-Love", desc: "Setiap hasil tes dibuat personal untuk membantu kamu menerima dan mencintai diri sendiri dengan tulus." },
  { icon: "🔄", title: "Retest Setiap 7 Hari", desc: "Track perkembangan diri kamu. Soal selalu beda dari pool 100+ pertanyaan yang dirancang dengan cermat." },
  { icon: "🎯", title: "Actionable Insights", desc: "Career path, romance dynamics, social tips, dan purpose direction yang spesifik untuk tipe kepribadian kamu." },
];

const STATS = [
  { value: "16", label: "Tipe MBTI" },
  { value: "8", label: "Dimensi Analisis" },
  { value: "1000+", label: "Pertanyaan Unik" },
  { value: "Gratis", label: "Selamanya" },
];

const TESTIMONIALS = [
  { name: "Aulia R.", type: "INFP", text: "Hasilnya detail banget! Akhirnya aku tau kenapa aku begini. Terasa sangat personal.", avatar: "🌸" },
  { name: "Dimas K.", type: "ENTJ", text: "Career path recommendations-nya akurat. Langsung jadi acuan karir gw ke depan.", avatar: "⚡" },
  { name: "Siti N.", type: "ISFJ", text: "Konsultasi psikolognya sangat membantu. Psikolognya ramah dan profesional.", avatar: "🌼" },
];

export default function HomePage() {
  const { data: session } = useSession();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.92]);

  return (
    <main className="min-h-screen bg-brand-dark relative overflow-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated orbs */}
        <div className="orb w-[500px] h-[500px] bg-purple-600 top-10 -left-32 animate-pulse-slow animate-morph" />
        <div className="orb w-96 h-96 bg-pink-600 bottom-10 -right-24 animate-pulse-slow animate-morph" style={{ animationDelay: "2s" }} />
        <div className="orb w-72 h-72 bg-blue-600 top-1/3 left-1/2 -translate-x-1/2 animate-pulse-slow" style={{ animationDelay: "4s" }} />

        {/* Grid lines (subtle background pattern) */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8 text-sm text-white/60 animate-glow-pulse"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Platform Self-Discovery #1 Indonesia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05]"
            >
              Satu Tes.
              <br />
              <span className="gradient-text">Ribuan Jawaban Tentang Kamu.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              SIAPA AKU menggali 8 dimensi kepribadianmu — dari cara berpikir, 
              emosi, hingga love language. Gratis, personal, dan mendalam.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {session ? (
                <Link href="/test" className="btn-primary text-lg px-10 py-4 hover:scale-105 transition-transform">
                  Yuk, Ketemu Diri Kamu 🚀
                </Link>
              ) : (
                <button onClick={() => signIn("google")} className="btn-primary text-lg px-10 py-4 hover:scale-105 transition-transform">
                  Yuk, Ketemu Diri Kamu 🚀
                </button>
              )}
              <Link href="/about" className="btn-secondary text-lg px-10 py-4">
                Pelajari Lebih Lanjut
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-white/30 text-sm mt-6"
            >
              Gratis selamanya · Login dengan Google · Hasil lengkap & personal
            </motion.p>
          </motion.div>

        </motion.div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3 group" data-scroll="fade" data-delay={`${(i + 1) * 100}`}>
                <span className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">{stat.value}</span>
                <span className="text-white/30 text-sm border-l border-white/10 pl-3">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SQUAD SECTION ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="orb w-80 h-80 bg-purple-500/30 top-0 right-0 animate-pulse-slow" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-purple-400 font-bold tracking-[5px] mb-4" data-scroll="fade">
              4 SQUAD UNIK
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4" data-scroll="up">
              Kamu di Squad <span className="gradient-text">Mana?</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto" data-scroll="up" data-delay="100">
              16 kepribadian dikelompokkan dalam 4 squad dengan karakter unik masing-masing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SQUADS.map((squad, i) => (
              <div
                key={squad.name}
                data-scroll={i % 2 === 0 ? "left" : "right"}
                data-delay={`${(i + 1) * 100}`}
                className="glass rounded-2xl p-6 card-hover card-shine cursor-pointer group"
                style={{ borderColor: squad.color + "30" }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                  style={{ background: squad.color + "20" }}
                >
                  {squad.emoji}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  Squad {squad.name}
                </h3>
                <p className="text-white/40 text-xs mb-4">{squad.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {squad.types.map((type) => (
                    <span
                      key={type}
                      className="text-xs px-2 py-0.5 rounded-full font-mono font-bold transition-all duration-300 hover:scale-110"
                      style={{ background: squad.color + "20", color: squad.color }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="orb w-64 h-64 bg-purple-600 top-1/2 -left-32 animate-morph" />
        <div className="orb w-48 h-48 bg-pink-600/30 bottom-20 right-10" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-pink-400 font-bold tracking-[5px] mb-4" data-scroll="fade">
              KENAPA SIAPA AKU?
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4" data-scroll="up">
              Lebih dari Sekadar
              <br />
              <span className="gradient-text">Tes Kepribadian</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto" data-scroll="up" data-delay="100">
              SIAPA AKU adalah perjalanan penemuan diri yang bermakna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                data-scroll={i % 2 === 0 ? "left" : "right"}
                data-delay={`${(i + 1) * 100}`}
                className="glass rounded-2xl p-8 flex gap-5 card-hover card-shine group"
              >
                <div className="text-4xl shrink-0 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-blue-400 font-bold tracking-[5px] mb-4" data-scroll="fade">
              TESTIMONIALS
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4" data-scroll="up">
              Apa Kata <span className="gradient-text">Mereka?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                data-scroll="slide-up-blur"
                data-delay={`${(i + 1) * 150}`}
                className="glass rounded-2xl p-6 card-hover card-shine relative"
              >
                <div className="text-3xl mb-4">{t.avatar}</div>
                <p className="text-white/70 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-purple-400 text-xs font-mono">{t.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING PREVIEW ═══════════════ */}
      <section className="py-24 px-6 relative">
        <div className="orb w-72 h-72 bg-amber-500/20 top-1/3 right-0" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs text-amber-400 font-bold tracking-[5px] mb-4" data-scroll="fade">
              PAKET MEMBER
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4" data-scroll="up">
              Tes Gratis, Member mulai <span className="gradient-text-gold">Rp 99.000</span>
            </h2>
            <p className="text-white/40 text-lg" data-scroll="up" data-delay="100">
              Tes MBTI & report digital gratis. Upgrade ke Member untuk sertifikat resmi, report personal, dan konsultasi psikolog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pt-4">
            {[
              { name: "Standar", price: "Rp 99rb", emoji: "🎓", highlight: false },
              { name: "Premium", price: "Rp 199rb", emoji: "👑", highlight: true },
              { name: "Ultimate", price: "Rp 399rb", emoji: "💎", highlight: false },
            ].map((pkg, i) => (
              <div
                key={pkg.name}
                data-scroll="up"
                data-delay={`${(i + 1) * 100}`}
                className={`glass rounded-2xl p-6 text-center card-hover card-shine relative overflow-visible ${
                  pkg.highlight ? "ring-2 ring-purple-500/50" : ""
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 whitespace-nowrap">
                    ✦ Terpopuler
                  </div>
                )}
                <div className="text-3xl mb-3">{pkg.emoji}</div>
                <h3 className="font-display font-bold text-white text-lg">Member {pkg.name}</h3>
                <div className="font-display text-2xl font-bold gradient-text my-2">{pkg.price}</div>
                <p className="text-white/30 text-xs">sekali bayar</p>
              </div>
            ))}
          </div>

          <div className="text-center" data-scroll="zoom-in" data-delay="400">
            <Link
              href="/shop"
              className="btn-primary text-lg px-12 py-4 inline-block hover:scale-105 transition-transform"
            >
              Lihat Semua Paket →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            data-scroll="zoom-in"
            className="glass rounded-3xl p-12 relative overflow-hidden animated-border"
          >
            <div className="orb w-48 h-48 bg-purple-500 -top-10 -right-10 animate-morph" />
            <div className="orb w-40 h-40 bg-pink-500 -bottom-10 -left-10 animate-morph" style={{ animationDelay: "3s" }} />
            <div className="relative z-10">
              <p className="text-5xl mb-6" data-scroll="zoom-in" data-delay="100">💜</p>
              <h2 className="font-display text-4xl font-bold text-white mb-4" data-scroll="up" data-delay="200">
                Mereka Mengenal Kamu.
                <br />
                <span className="gradient-text">Sekarang Giliran Kamu.</span>
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed" data-scroll="up" data-delay="300">
                Ribuan orang sudah memulai perjalanan self-discovery mereka. 
                Kapan giliran kamu?
              </p>
              <div data-scroll="up" data-delay="400">
                {session ? (
                  <Link href="/test" className="btn-primary text-lg px-12 py-4 inline-block hover:scale-105 transition-transform">
                    Mulai Tes Sekarang — Gratis
                  </Link>
                ) : (
                  <button onClick={() => signIn("google")} className="btn-primary text-lg px-12 py-4 hover:scale-105 transition-transform">
                    Mulai Tes Sekarang — Gratis
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
