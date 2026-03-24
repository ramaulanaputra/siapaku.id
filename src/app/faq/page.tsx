'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const faqs = [
  { q: 'Apa itu SIAPA AKU?', a: 'SIAPA AKU adalah platform psikologi yang membantu kamu mengenal diri lebih dalam melalui tes MBTI yang diperkaya dengan 7 dimensi psikologi: self-compassion, emotional intelligence, values, shadow work, love language, dan life purpose. Bukan sekadar tes, tapi perjalanan mengenal dan menyayangi diri sendiri.' },
  { q: 'Apakah tes ini gratis?', a: 'Ya! Tes MBTI di SIAPA AKU sepenuhnya gratis. Kamu cukup daftar akun (via Google) dan langsung bisa mulai. Yang berbayar hanya sertifikat dan laporan detail jika kamu tertarik.' },
  { q: 'Berapa soal yang harus dijawab?', a: 'Kamu akan menjawab 10 soal acak dari pool 100 soal kami. Setiap sesi tes, kombinasi soalnya berbeda! Soalnya berbentuk skenario dan cerita yang relate dengan kehidupan sehari-hari, bukan soal membosankan.' },
  { q: 'Seberapa akurat hasilnya?', a: 'Tes kami didasarkan pada framework MBTI yang sudah digunakan jutaan orang di seluruh dunia. Dengan 100 soal pool yang dirancang cermat, hasilnya cukup representatif. Tapi ingat, manusia itu kompleks — hasilnya adalah panduan, bukan label absolut.' },
  { q: 'Bisa tes ulang nggak?', a: 'Bisa! Tapi ada batasan 1 minggu sekali. Ini supaya hasilnya konsisten dan kamu punya waktu untuk meresapi hasil sebelumnya. Setiap tes ulang, kamu dapat kombinasi soal yang berbeda.' },
  { q: 'Apa bedanya dengan 16 Personalities?', a: 'SIAPA AKU menggunakan fondasi MBTI yang sama, tapi diperkaya dengan 7 dimensi psikologi tambahan: self-compassion, emotional intelligence, values & authenticity, shadow work, love language, purpose, dan practical guidance. Plus, semua dalam Bahasa Indonesia yang casual dan relate!' },
  { q: 'Data saya aman nggak?', a: 'Sangat aman. Kami menggunakan enkripsi dan tidak membagikan data pribadi kamu ke pihak ketiga. Hasil tes kamu hanya bisa dilihat oleh kamu sendiri.' },
  { q: 'Apa itu sertifikat dan laporan?', a: 'Sertifikat adalah dokumen resmi tentang tipe kepribadianmu (mulai 19rb). Laporan interaktif adalah dokumen mendalam berisi analisis karir, hubungan, sosial, dan strategi praktis (59rb). Keduanya dipersonalisasi khusus untuk tipe kepribadianmu.' },
  { q: 'Bisa beli merchandise?', a: 'Bisa! Di Toko SIAPA AKU, kamu bisa beli tas, kaos, gelang, tumbler, notebook, dan lainnya — semua dengan desain yang disesuaikan dengan kepribadianmu. Ada juga paket premium (299rb) yang sudah include merchandise.' },
  { q: 'Apakah ada tes selain MBTI?', a: 'Untuk saat ini fokus kami di MBTI yang diperkaya. Ke depannya, kami berencana menambahkan tes-tes lain yang relevan. Stay tuned!' },
]

function FaqItem({ q, a, isOpen, toggle }: { q: string; a: string; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={toggle} className="w-full flex items-center justify-between py-6 text-left group">
        <span className="text-lg font-semibold pr-8 group-hover:text-brand-blue transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-blue' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-gray-600 leading-relaxed pb-6 pr-12">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-semibold text-sm mb-6">
              <HelpCircle className="w-4 h-4" /> Pertanyaan Umum
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">FAQ</h1>
            <p className="text-lg text-gray-600">Semua yang perlu kamu tahu tentang SIAPA AKU.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="card-glass">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} isOpen={openIdx === i} toggle={() => setOpenIdx(openIdx === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-brand-blue to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-extrabold mb-4">Masih Ada Pertanyaan?</h2>
            <p className="text-blue-100 mb-8">Hubungi kami langsung, kami selalu senang membantu!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/6281234567890" target="_blank" className="btn-secondary">WhatsApp Kami</a>
              <Link href="/tentang/" className="bg-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all">Halaman Kontak</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
