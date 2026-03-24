'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, User, ShoppingBag } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/tes/', label: '✨ Tes MBTI', highlight: true },
  { href: '/tentang/', label: 'Tentang' },
  { href: '/toko/', label: 'Toko' },
  { href: '/faq/', label: 'FAQ' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-tan rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text">SIAPA AKU</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  link.highlight
                    ? 'bg-brand-blue text-white hover:bg-blue-700 hover:scale-105'
                    : 'text-gray-600 hover:text-brand-blue hover:bg-blue-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/toko/" className="p-2 rounded-xl text-gray-500 hover:text-brand-blue hover:bg-blue-50 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link href="/profil/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-white font-semibold text-sm hover:bg-gray-800 transition-all hover:scale-105">
              <User className="w-4 h-4" /> Masuk
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                    link.highlight ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <Link href="/profil/" onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl bg-brand-dark text-white font-semibold text-center">
                Masuk / Daftar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
