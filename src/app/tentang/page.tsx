'use client'
import { motion } from 'framer-motion'
import { Heart, Users, Brain, Sparkles, Target, Shield, Mail, Instagram, Phone, MessageCircle } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const values = [
  { icon: Heart, title: 'Self-Love First', desc: 'Setiap fitur dirancang untuk membantu kamu menyayangi diri sendiri, bukan menghakimi.' },
  { icon: Brain, title: 'Berbasis Riset', desc: 'Dibangun di atas fondasi MBTI + 6 framework psikologi tambahan yang sudah terbukti.' },
  { icon: Users, title: 'Teman, Bukan Guru', desc: 'Kami bukan menggurui. Kami menemani kamu dalam perjalanan mengenal diri.' },
  { icon: Shield, title: 'Safe Space', desc: 'Semua data kamu aman. Ini ruang yang nyaman dan tanpa judgment.' },
  { icon: Target, title: 'Actionable', desc: 'Bukan cuma teori. Setiap insight punya langkah praktis yang bisa langsung diterapkan.' },
  { icon: Sparkles, title: 'Fun & Meaningful', desc: 'Siapa bilang psikologi harus berat? Di sini, seru dan bermakna jalan bareng.' },
]

const timeline = [
  { year: '💡', title: 'Ide Lahir', desc: 'Berangkat dari keresahan: kita sibuk kenal orang, lupa kenal diri sendiri.' },
  { year: '🔬', title: 'Riset Mendalam', desc: 'Mempelajari MBTI, self-compassion, emotional intelligence, shadow work, dan lainnya.' },
  { year: '🎨', title: 'Desain & Konsep', desc: 'Merancang pengalaman tes yang seru, bukan membosankan. Psikologi yang fun!' },
  { year: '🚀', title: 'SIAPA AKU Lahir', desc: 'Platform yang membantu ribuan orang berkenalan dan bersahabat dengan diri sendiri.' },
]

export default function TentangPage() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="section-padding bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-6">
              <Heart className="w-4 h-4" /> Cerita Kami
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Tentang <span className="gradient-text">SIAPA AKU</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Kita hidup di zaman serba cepat. Sosial media bikin kita terus berkenalan dengan orang baru setiap hari. Tapi di balik semua itu, kita lupa satu hal paling penting — <strong>berkenalan dengan diri sendiri</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card-glass text-center p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">&ldquo;Tak Kenal Maka Tak Sayang&rdquo;</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              Orang lain bisa saja mengenali diri kita dan menyayangi kita. Tapi kapan kita menyayangi diri sendiri? Kenyataannya, kita tak pernah benar-benar mengenal <strong>siapa aku</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              SIAPA AKU hadir sebagai <strong>teman</strong>. Di sini, kamu mengenali siapa kamu sebenarnya — sebuah jendela untuk berkenalan dan menyayangi diri sendiri.
            </p>
            <p className="text-brand-blue font-semibold text-lg">
              Berteman dan menyayangi diri sendiri. SIAPA AKU adalah tempat di mana kamu menemukan versi dirimu yang paling mengenali dan menyayangi dirimu sendiri. 💙
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-padding bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Nilai-Nilai Kami</h2>
            <p className="text-gray-600 mt-4">Prinsip yang memandu setiap hal yang kami buat.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="card-glass hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-tan rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Perjalanan Kami</h2>
          </motion.div>
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-tan rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {t.year}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{t.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-padding bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Hubungi Kami</h2>
            <p className="text-gray-400 mb-12">Punya pertanyaan? Kami selalu senang mendengar dari kamu.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Mail, label: 'Email', value: 'hello@siapaku.id', href: 'mailto:hello@siapaku.id' },
                { icon: Instagram, label: 'Instagram', value: '@siapaku.id', href: 'https://instagram.com/siapaku.id' },
                { icon: MessageCircle, label: 'WhatsApp', value: 'Chat Kami', href: 'https://wa.me/6281234567890' },
                { icon: Phone, label: 'Telepon', value: '+62 812-3456-7890', href: 'tel:+6281234567890' },
              ].map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener"
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-all group">
                  <c.icon className="w-8 h-8 text-brand-tan mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-sm">{c.label}</p>
                  <p className="text-gray-400 text-xs mt-1">{c.value}</p>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
