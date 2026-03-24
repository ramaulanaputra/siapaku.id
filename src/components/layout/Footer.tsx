'use client'
import Link from 'next/link'
import { Sparkles, Heart, Instagram, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-tan rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold">SIAPA AKU</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kenal Diri, Baru Hidup. Platform psikologi untuk mengenal dan menyayangi diri sendiri.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-brand-tan">Menu</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <Link href="/tes/" className="block text-gray-400 hover:text-white transition-colors">Tes MBTI</Link>
              <Link href="/tentang/" className="block text-gray-400 hover:text-white transition-colors">Tentang Kami</Link>
              <Link href="/toko/" className="block text-gray-400 hover:text-white transition-colors">Toko</Link>
              <Link href="/faq/" className="block text-gray-400 hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-brand-tan">Kepribadian</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">🧠 Squad Analis</p>
              <p className="text-gray-400">💚 Squad Diplomat</p>
              <p className="text-gray-400">🛡️ Squad Sentinel</p>
              <p className="text-gray-400">🌟 Squad Explorer</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-brand-tan">Kontak</h4>
            <div className="space-y-3 text-sm">
              <a href="mailto:hello@siapaku.id" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> hello@siapaku.id
              </a>
              <a href="https://instagram.com/siapaku.id" target="_blank" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" /> @siapaku.id
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-4 h-4 text-red-400 fill-red-400" /> oleh Tim SIAPA AKU © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
