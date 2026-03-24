'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Brain, Heart, Users, ArrowRight, Star, Shield, Compass, BookOpen, CheckCircle, Quote } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const squads = [
  { name: 'Analis', emoji: '🧠', color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', border: 'border-purple-200',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], desc: 'Pemikir strategis, inovatif, dan penuh visi' },
  { name: 'Diplomat', emoji: '💚', color: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], desc: 'Idealis, empatik, dan penuh inspirasi' },
  { name: 'Sentinel', emoji: '🛡️', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-200',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], desc: 'Penjaga, dapat diandalkan, dan penuh dedikasi' },
  { name: 'Explorer', emoji: '🌟', color: 'from-amber-500 to-amber-700', bg: 'bg-amber-50', border: 'border-amber-200',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], desc: 'Petualang, spontan, dan penuh energi' },
]

const features = [
  { icon: Brain, title: '100 Soal Seru', desc: 'Bukan tes membosankan. Soal cerita, skenario lucu, dan pilihan yang bikin mikir.' },
  { icon: Heart, title: 'Hasil yang Mendalam', desc: 'Bukan cuma 4 huruf. Tapi panduan self-love, emotional intelligence, dan purpose.' },
  { icon: Shield, title: '7 Dimensi Psikologi', desc: 'MBTI + Self-Compassion + EI + Values + Shadow Work + Love Language + Purpose.' },
  { icon: Users, title: 'Tailored Per Tipe', desc: 'Setiap hasil disesuaikan khusus untuk tipe kepribadianmu. Bukan template generic.' },
  { icon: Compass, title: 'Panduan Hidup', desc: 'Karir, percintaan, sosial, dan arah hidup — semua tailored buat kamu.' },
  { icon: BookOpen, title: 'Sertifikat & Laporan', desc: 'Dapatkan sertifikat resmi dan laporan interaktif tentang kepribadianmu.' },
]

const steps = [
  { num: '01', title: 'Daftar Gratis', desc: 'Buat akun dengan Google. Gampang, 5 detik.' },
  { num: '02', title: 'Jawab 10 Soal', desc: '10 soal acak dari 100 soal pool. Seru dan relate!' },
  { num: '03', title: 'Temukan Dirimu', desc: 'Hasil lengkap: tipe MBTI + 7 dimensi psikologi mendalam.' },
  { num: '04', title: 'Mulai Self-Love', desc: 'Panduan spesifik untuk menyayangi diri sendiri.' },
]

const testimonials = [
  { name: 'Rina', age: 23, type: 'INFP', text: 'Akhirnya ngerti kenapa aku sering overwhelmed. SIAPA AKU bukan cuma tes, tapi teman yang ngerti aku.' },
  { name: 'Dimas', age: 27, type: 'ENTJ', text: 'Bagian shadow work-nya kena banget. Selama ini aku push diri terlalu keras tanpa sadar.' },
  { name: 'Ayu', age: 21, type: 'ESFJ', text: 'Self-love guide-nya bikin aku belajar bilang "nggak" tanpa rasa bersalah. Game changer!' },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-tan/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-8">
                <Sparkles className="w-4 h-4" /> Platform Psikologi #1 Indonesia
              </span>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Sebelum Kenal Orang,{' '}
              <span className="gradient-text">Kenal Diri Dulu</span>
            </motion.h1>

            <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              Di dunia yang serba cepat, kita terus berkenalan dengan orang baru — tapi lupa berkenalan dengan diri sendiri.
            </motion.p>
            
            <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed italic">
              &ldquo;Tak kenal maka tak sayang.&rdquo; Orang lain bisa mengenali dan menyayangimu — tapi kapan kamu mulai menyayangi dirimu sendiri?
            </motion.p>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tes/" className="btn-primary flex items-center gap-2 text-lg">
                Yuk, Ketemu Diri Elu <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/tentang/" className="btn-outline">Cerita Kami</Link>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 100% Gratis</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Berbasis Riset</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 7 Dimensi</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Quote className="w-12 h-12 text-brand-tan mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Kita hidup di zaman serba cepat. Sosial media bikin kita terus <span className="text-brand-blue">berkenalan dengan orang baru</span> setiap hari.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Tapi di balik semua itu, kita lupa satu hal yang paling penting — <strong>berkenalan dengan diri sendiri</strong>.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Ada pepatah mengatakan, <em>&ldquo;tak kenal maka tak sayang.&rdquo;</em> Orang lain bisa mengenali diri kita dan menyayangi kita. Tapi kapan kita mulai menyayangi diri sendiri? Kenyataannya, kita tak pernah benar-benar mengenal <strong>siapa aku</strong>.
            </p>
            <p className="text-lg text-brand-blue font-semibold mt-8">
              SIAPA AKU hadir sebagai teman — jendela untuk berkenalan dan menyayangi dirimu sendiri. Tempat di mana kamu menemukan versi dirimu yang paling mengenal dan menyayangi dirimu. 💙
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-padding bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-brand-tan font-semibold text-sm uppercase tracking-wider">Kenapa SIAPA AKU?</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">Bukan Tes Biasa</h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">Lebih dari sekadar 4 huruf. Ini adalah perjalanan mengenal dan menyayangi diri sendiri.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-tan rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 SQUADS */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-brand-tan font-semibold text-sm uppercase tracking-wider">4 Squad Kepribadian</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">Temukan Squad-mu</h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">16 kepribadian dalam 4 kelompok unik. Mana yang paling mirip kamu?</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {squads.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className={`${s.bg} ${s.border} border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{s.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold">Squad {s.name}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {s.types.map(t => (
                    <span key={t} className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${s.color} text-white text-sm font-bold`}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-gradient-to-b from-white to-brand-cream">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-brand-tan font-semibold text-sm uppercase tracking-wider">Gimana Caranya?</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">4 Langkah Simpel</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.15 }}
                className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-tan rounded-3xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-extrabold group-hover:scale-110 group-hover:rotate-3 transition-all">
                  {s.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="text-brand-tan font-semibold text-sm uppercase tracking-wider">Mereka Sudah Ketemu</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3">Kata Mereka</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-tan flex items-center justify-center text-lg font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{t.name}, {t.age}</p>
                    <p className="text-brand-tan text-sm font-semibold">{t.type}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-brand-blue to-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Siap Ketemu Diri Sendiri?</h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Kenal diri, baru hidup. Yuk mulai perjalanan self-discovery kamu sekarang. Gratis, 5 menit, dan hasilnya bisa mengubah cara kamu melihat dirimu sendiri.
            </p>
            <Link href="/tes/" className="inline-flex items-center gap-2 bg-white text-brand-blue px-10 py-5 rounded-2xl font-extrabold text-xl hover:bg-blue-50 transition-all hover:scale-105 hover:shadow-2xl">
              Mulai Tes Sekarang <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
