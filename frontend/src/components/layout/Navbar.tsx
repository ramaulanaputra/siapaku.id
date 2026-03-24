"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/test", label: "Tes MBTI" },
    { href: "/about", label: "About" },
    { href: "/shop", label: "Shop" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-dark shadow-2xl shadow-black/50"
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
            className="group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
          />
          <span className="font-display font-bold text-lg text-white tracking-tight">
            SIAPA <span className="gradient-text">AKU</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 hover:text-purple-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors cursor-pointer">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-white/80 font-medium">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-white/40 hover:text-white/70 text-xs transition-colors"
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
          className="md:hidden text-white/70 hover:text-white"
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
            className="md:hidden glass-dark border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/70 hover:text-white font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <button onClick={() => signOut()} className="text-left text-red-400 hover:text-red-300 text-sm">
                  Keluar
                </button>
              ) : (
                <button onClick={() => signIn("google")} className="btn-primary text-sm">
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
