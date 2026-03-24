"use client";

import { motion } from "framer-motion";
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

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-brand-dark relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background orbs */}
        <div className="orb w-96 h-96 bg-purple-600 top-20 -left-20" />
        <div className="orb w-80 h-80 bg-pink-600 bottom-20 -right-20" />
        <div className="orb w-64 h-64 bg-blue-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-white/60">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Platform Self-Discovery #1 Indonesia
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Sebelum Kenal Orang,
              <br />
              <span className="gradient-text">Kenal Diri Dulu</span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Tak kenal maka tak sayang — tapi kapan kamu mulai menyayangi 
              diri sendiri? SIAPA AKU hadir untuk menjadi cermin diri sejati kamu.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link href="/test" className="btn-primary text-lg px-10 py-4">
                  Yuk, Ketemu Diri Elu 🚀
                </Link>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary text-lg px-10 py-4"
                >
                  Yuk, Ketemu Diri Elu 🚀
                </button>
              )}
              <Link href="/about" className="btn-secondary text-lg px-10 py-4">
                Pelajari Lebih Lanjut
              </Link>
            </div>

            <p className="text-white/30 text-sm mt-6">
              Gratis selamanya · Login dengan Google · Hasil lengkap & personal
            </p>
          </motion.div>

          {/* Floating personality cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {["INFP 🌟", "ENTJ ⚡", "ISFJ 🛡️", "ENTP 🚀", "INTJ ⚡", "ENFP 🌟"].map((type, i) => (
              <motion.div
                key={type}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className="glass rounded-full px-4 py-2 text-sm text-white/60 font-medium"
              >
                {type}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Squad Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Kamu di Squad <span className="gradient-text">Mana?</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              16 kepribadian dikelompokkan dalam 4 squad dengan karakter unik masing-masing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SQUADS.map((squad, i) => (
              <motion.div
                key={squad.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover cursor-pointer group"
                style={{ borderColor: squad.color + "30" }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"
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
                      className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                      style={{ background: squad.color + "20", color: squad.color }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="orb w-64 h-64 bg-purple-600 top-1/2 -left-32" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Lebih dari Sekadar
              <br />
              <span className="gradient-text">Tes Kepribadian</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              SIAPA AKU adalah perjalanan penemuan diri yang bermakna.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 flex gap-5 card-hover"
              >
                <div className="text-4xl shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="orb w-48 h-48 bg-purple-500 -top-10 -right-10" />
            <div className="orb w-40 h-40 bg-pink-500 -bottom-10 -left-10" />
            <div className="relative z-10">
              <p className="text-5xl mb-6">💜</p>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Mereka Mengenal Kamu.
                <br />
                <span className="gradient-text">Sekarang Giliran Kamu.</span>
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Ribuan orang sudah memulai perjalanan self-discovery mereka. 
                Kapan giliran kamu?
              </p>
              {session ? (
                <Link href="/test" className="btn-primary text-lg px-12 py-4 inline-block">
                  Mulai Tes Sekarang — Gratis
                </Link>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary text-lg px-12 py-4"
                >
                  Mulai Tes Sekarang — Gratis
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
