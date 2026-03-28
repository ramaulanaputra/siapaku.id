"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [testDropdown, setTestDropdown] = useState(false);
  const [mobileTestOpen, setMobileTestOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTestDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setTestDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setTestDropdown(false), 200);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-light shadow-2xl shadow-[#6B1D5E]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.svg"
            alt="SIAPA AKU"
            width={38}
            height={38}
            className="group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(107,29,94,0.4)]"
          />
          <span className="font-display font-bold text-lg text-white tracking-tight">
            SIAPA <span className="gradient-text">AKU</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-[#1A1025]/80 hover:text-[#6B1D5E] text-sm font-medium transition-colors duration-200 hover:text-[#6B1D5E]"
          >
            Home
          </Link>

          {/* Tes SIAPA AKU Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              onClick={() => setTestDropdown(!testDropdown)}
              className="flex items-center gap-1.5 text-[#1A1025]/80 hover:text-[#6B1D5E] text-sm font-medium transition-colors duration-200 hover:text-[#6B1D5E]"
            >
              Tes SIAPA AKU
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${testDropdown ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {testDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl border border-[#6B1D5E]/15 bg-white/95 backdrop-blur-xl shadow-2xl shadow-[#6B1D5E]/10 overflow-hidden"
                >
                  {/* Glow accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-[#6B1D5E] to-purple-500 opacity-60" />

                  <div className="p-2">
                    {/* Tes MBTI - Active */}
                    <Link
                      href="/test"
                      onClick={() => setTestDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1A1025]/90 hover:text-[#6B1D5E] hover:bg-white/80 transition-all duration-200 group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                        🧠
                      </span>
                      <div>
                        <p className="text-sm font-medium">Tes MBTI</p>
                        <p className="text-[11px] text-[#1A1025]/40">16 tipe kepribadian</p>
                      </div>
                    </Link>

                    {/* Divider */}
                    <div className="mx-3 my-1 h-px bg-white/60" />

                    {/* Tes Big Five - Locked */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1A1025]/40 cursor-not-allowed select-none">
                      <span className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-sm">
                        🔒
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Tes Big Five</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6B1D5E]/15 text-[#6B1D5E]/60 font-semibold tracking-wide">
                            SOON
                          </span>
                        </div>
                        <p className="text-[11px] text-[#1A1025]/30">5 trait kepribadian</p>
                      </div>
                    </div>

                    {/* Tes Enneagram - Locked */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1A1025]/40 cursor-not-allowed select-none">
                      <span className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-sm">
                        🔒
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Tes Enneagram</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6B1D5E]/15 text-[#6B1D5E]/60 font-semibold tracking-wide">
                            SOON
                          </span>
                        </div>
                        <p className="text-[11px] text-[#1A1025]/30">9 tipe ennea</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about"
            className="text-[#1A1025]/80 hover:text-[#6B1D5E] text-sm font-medium transition-colors duration-200 hover:text-[#6B1D5E]"
          >
            About
          </Link>
          <Link
            href="/shop"
            className="text-[#1A1025]/80 hover:text-[#6B1D5E] text-sm font-medium transition-colors duration-200 hover:text-[#6B1D5E]"
          >
            Shop
          </Link>
          <Link
            href="/profile"
            className="text-[#1A1025]/80 hover:text-[#6B1D5E] text-sm font-medium transition-colors duration-200 hover:text-[#6B1D5E]"
          >
            My Profile
          </Link>
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 hover:bg-white/90 transition-colors cursor-pointer">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-[#1A1025]/90 font-medium">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-[#1A1025]/50 hover:text-[#1A1025]/80 text-xs transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="btn-primary text-sm py-2 px-6"
            >
              Masuk dengan Google
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#1A1025]/80 hover:text-[#6B1D5E]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-light border-t border-[#6B1D5E]/10"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-[#1A1025]/80 hover:text-[#6B1D5E] font-medium transition-colors py-2"
              >
                Home
              </Link>

              {/* Mobile: Tes SIAPA AKU expandable */}
              <div>
                <button
                  onClick={() => setMobileTestOpen(!mobileTestOpen)}
                  className="w-full flex items-center justify-between text-[#1A1025]/80 hover:text-[#6B1D5E] font-medium transition-colors py-2"
                >
                  <span>Tes SIAPA AKU</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${mobileTestOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {mobileTestOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-2 space-y-1 border-l-2 border-[#6B1D5E]/20 ml-2">
                        <Link
                          href="/test"
                          onClick={() => { setMenuOpen(false); setMobileTestOpen(false); }}
                          className="flex items-center gap-2.5 text-[#1A1025]/70 hover:text-[#6B1D5E] text-sm py-2 transition-colors"
                        >
                          <span>🧠</span> Tes MBTI
                        </Link>
                        <div className="flex items-center gap-2.5 text-[#1A1025]/35 text-sm py-2 cursor-not-allowed">
                          <span>🔒</span> Tes Big Five
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6B1D5E]/15 text-[#6B1D5E]/50 font-semibold">SOON</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#1A1025]/35 text-sm py-2 cursor-not-allowed">
                          <span>🔒</span> Tes Enneagram
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6B1D5E]/15 text-[#6B1D5E]/50 font-semibold">SOON</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-[#1A1025]/80 hover:text-[#6B1D5E] font-medium transition-colors py-2"
              >
                About
              </Link>
              <Link
                href="/shop"
                onClick={() => setMenuOpen(false)}
                className="text-[#1A1025]/80 hover:text-[#6B1D5E] font-medium transition-colors py-2"
              >
                Shop
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-[#1A1025]/80 hover:text-[#6B1D5E] font-medium transition-colors py-2"
              >
                My Profile
              </Link>

              <div className="h-px bg-white/60 my-2" />

              {session ? (
                <button onClick={() => signOut()} className="text-left text-red-500 hover:text-red-600 text-sm py-2">
                  Keluar
                </button>
              ) : (
                <button onClick={() => signIn("google")} className="btn-primary text-sm mt-1">
                  Masuk dengan Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
