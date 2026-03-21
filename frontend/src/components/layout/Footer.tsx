import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">SA</span>
              </div>
              <span className="font-display font-bold text-lg text-white">
                SIAPA <span className="gradient-text">AKU</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Tempat kamu menemukan dan merangkul versi dirimu yang paling asli, 
              dan mulai menyayangi diri sendiri dengan tulus.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/siapaku.id" target="_blank" rel="noreferrer"
                className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white text-xs font-bold">
                IG
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white text-xs font-bold">
                WA
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/test", label: "Tes MBTI" },
                { href: "/profile", label: "My Profile" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4">Kontak</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              <li>hello@siapaku.id</li>
              <li>@siapaku.id</li>
              <li>+62 812-3456-7890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2024 SIAPA AKU. All rights reserved.
          </p>
          <p className="text-white/20 text-xs italic font-display">
            "Kenal Diri, Baru Bisa Sayang Diri"
          </p>
        </div>
      </div>
    </footer>
  );
}
