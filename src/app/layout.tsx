import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SIAPA AKU - Kenal Diri, Baru Hidup',
  description: 'Platform psikologi MBTI untuk mengenal diri lebih dalam. Sebelum kenal orang, kenal diri dulu.',
  keywords: 'MBTI, tes kepribadian, psikologi, siapa aku, personality test',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
