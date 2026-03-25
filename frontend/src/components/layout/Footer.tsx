import Link from "next/link";
import { FooterTestMenu } from "./FooterTestMenu";
import Image from "next/image";

/* ─── Instagram SVG Icon ─── */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
    </svg>
  );
}

/* ─── Email @ Icon ─── */
function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M15.5 12V13.5C15.5 14.88 16.62 16 18 16C19.1 16 20 15.33 20 14.5V12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C13.64 20 15.15 19.5 16.4 18.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 relative">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.svg"
                alt="SIAPA AKU"
                width={36}
                height={42}
                className="drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]"
              />
              <span className="font-display font-bold text-lg text-white">
                SIAPA <span className="gradient-text">AKU</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Tempat kamu menemukan dan merangkul versi dirimu yang paling asli, 
              dan mulai menyayangi diri sendiri dengan tulus.
            </p>

            {/* Social links - IG and Email only */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/siapaku.id/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 text-white/50 hover:text-pink-400 hover:border-pink-400/30 group"
                title="@siapaku.id"
              >
                <InstagramIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="mailto:idsiapaku@gmail.com"
                className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 text-white/50 hover:text-purple-400 hover:border-purple-400/30 group"
                title="idsiapaku@gmail.com"
              >
                <EmailIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">Navigasi</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <FooterTestMenu />
              <li>
                <Link href="/profile" className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">Kontak</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.instagram.com/siapaku.id/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-white/40 hover:text-pink-400 text-sm transition-colors duration-200 group"
                >
                  <InstagramIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>@siapaku.id</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:idsiapaku@gmail.com"
                  className="flex items-center gap-3 text-white/40 hover:text-purple-400 text-sm transition-colors duration-200 group"
                >
                  <EmailIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>idsiapaku@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2024 SIAPA AKU. All rights reserved.
          </p>
          <p className="text-white/20 text-xs italic font-display">
            &ldquo;Kenal Diri, Baru Bisa Sayang Diri&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
