"use client";
import { useState, useEffect, useRef } from "react";

const packages = [
  {
    id: "standar",
    name: "Standar",
    price: 99000,
    color: "#6366F1",
    accent: "#818CF8",
    gradient: "from-indigo-600 to-indigo-900",
    features: [
      "✓ Sertifikat Online PDF (verifikasi kode unik/barcode)",
      "✓ Printout Fisik Sertifikat Resmi dikirim ke rumah",
      "✓ Report PDF Personalized & Tailored",
      "✓ Dihubungi Tim Siapa Aku untuk diskusi hasil tes",
    ],
    cta: "Gabung Member",
    popular: false,
    consultCredits: 0,
  },
  {
    id: "premium",
    name: "Premium",
    price: 199000,
    color: "#7C3AED",
    accent: "#A78BFA",
    gradient: "from-violet-600 to-purple-900",
    features: [
      "✓ Semua benefit Member Standar",
      "✓ Printout Fisik Report Premium (dikirim ke rumah)",
      "✓ 1× Konsul Psikolog Gratis",
      "✓ Unlock Fitur Konsultasi Psikolog",
    ],
    cta: "Gabung Premium",
    popular: true,
    consultCredits: 1,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 399000,
    color: "#D97706",
    accent: "#FCD34D",
    gradient: "from-amber-600 to-yellow-900",
    features: [
      "✓ Semua benefit Member Premium",
      "✓ T-Shirt MBTI Personalized",
      "✓ Notebook Eksklusif",
      "✓ Tumbler atau Tote Bag Premium",
      "✓ 2× Konsul Psikolog Gratis",
    ],
    cta: "Gabung Ultimate",
    popular: false,
    consultCredits: 2,
  },
];

const consultPackages = [
  {
    id: "basic",
    name: "Basic Service",
    price: 299000,
    sessions: 2,
    color: "#0EA5E9",
    icon: "💬",
    desc: "2 sesi konsultasi dengan psikolog berpengalaman",
  },
  {
    id: "premium_consult",
    name: "Premium Service",
    price: 399000,
    sessions: 3,
    color: "#8B5CF6",
    icon: "🧠",
    desc: "3 sesi konsultasi mendalam & personal",
  },
  {
    id: "ultimate_consult",
    name: "Ultimate Service",
    price: 499000,
    sessions: 4,
    color: "#F59E0B",
    icon: "⭐",
    desc: "4 sesi konsultasi prioritas & komprehensif",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function PricingCard({ pkg, index, onSelect }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(pkg)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)"
          : "translateY(60px) scale(0.95)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
        cursor: "pointer",
        position: "relative",
        borderRadius: 24,
        padding: pkg.popular ? "2px" : "1px",
        background: pkg.popular
          ? `linear-gradient(135deg, ${pkg.color}, ${pkg.accent})`
          : "rgba(255,255,255,0.08)",
        boxShadow: hovered
          ? `0 32px 64px -12px ${pkg.color}55, 0 0 0 1px ${pkg.color}33`
          : pkg.popular
          ? `0 20px 40px -8px ${pkg.color}44`
          : "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {pkg.popular && (
        <div style={{
          position: "absolute",
          top: -16,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(90deg, ${pkg.color}, ${pkg.accent})`,
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 2,
          padding: "6px 20px",
          borderRadius: 99,
          zIndex: 10,
          boxShadow: `0 4px 20px ${pkg.color}66`,
          whiteSpace: "nowrap",
        }}>
          ✦ PALING POPULER
        </div>
      )}

      <div style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
        borderRadius: pkg.popular ? 22 : 23,
        padding: "36px 28px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow orb */}
        <div style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${pkg.color}33 0%, transparent 70%)`,
          transition: "all 0.5s ease",
          transform: hovered ? "scale(1.4)" : "scale(1)",
        }} />

        <div>
          <div style={{ fontSize: 13, color: pkg.accent, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>
            {pkg.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
            {formatRupiah(pkg.price)}
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>sekali bayar</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {pkg.features.map((f, i) => (
            <div key={i} style={{
              fontSize: 14,
              color: "#D1D5DB",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.5s ease ${index * 0.12 + i * 0.06 + 0.3}s`,
            }}>
              {f}
            </div>
          ))}
        </div>

        {pkg.consultCredits > 0 && (
          <div style={{
            background: `${pkg.color}22`,
            border: `1px solid ${pkg.color}44`,
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 13,
            color: pkg.accent,
            textAlign: "center",
          }}>
            🎁 {pkg.consultCredits}× kredit konsul psikolog gratis
          </div>
        )}

        <button style={{
          background: pkg.popular
            ? `linear-gradient(135deg, ${pkg.color}, ${pkg.accent})`
            : `${pkg.color}22`,
          border: `1px solid ${pkg.color}66`,
          color: "#fff",
          padding: "14px 24px",
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.3s ease",
          letterSpacing: 0.5,
        }}>
          {pkg.cta} →
        </button>
      </div>
    </div>
  );
}

function ConsultCard({ pkg, index, onSelect }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(pkg)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered ? "translateY(-6px)" : "translateY(0)"
          : "translateY(50px)",
        transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
        cursor: "pointer",
        background: "linear-gradient(145deg, #1a1a2e, #16213e)",
        border: `1px solid ${hovered ? pkg.color : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: hovered ? `0 20px 40px ${pkg.color}33` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 80% 20%, ${pkg.color}18 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
      }} />

      <div style={{ fontSize: 36 }}>{pkg.icon}</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{pkg.name}</div>
        <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>{pkg.desc}</div>
      </div>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 8,
      }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: pkg.color }}>
          {formatRupiah(pkg.price)}
        </span>
      </div>
      <div style={{
        background: `${pkg.color}22`,
        borderRadius: 10,
        padding: "8px 14px",
        fontSize: 13,
        color: pkg.color,
        fontWeight: 600,
        textAlign: "center",
      }}>
        {pkg.sessions}× sesi konsultasi
      </div>
      <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
        ✓ Kredit bebas dipakai kapan saja
      </div>
    </div>
  );
}

export default function PricingSection({ user, onPayment }) {
  const [sectionRef, sectionInView] = useInView(0.05);
  const [consultRef, consultInView] = useInView(0.05);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePackageSelect = async (pkg) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk melanjutkan pembelian.");
      return;
    }
    setSelectedPkg(pkg);
    setPaymentLoading(true);
    try {
      await onPayment(pkg);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div style={{ background: "#0D0D1A", minHeight: "100vh", padding: "80px 0" }}>

      {/* ── Test Packages ── */}
      <div ref={sectionRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          textAlign: "center",
          marginBottom: 64,
          opacity: sectionInView ? 1 : 0,
          transform: sectionInView ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 800, letterSpacing: 4, marginBottom: 12 }}>
            PAKET MEMBER
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: 0 }}>
            Pilih Paket Member
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
            Tes MBTI gratis untuk semua. Upgrade ke Member untuk sertifikat resmi, report personal, dan konsultasi psikolog.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          alignItems: "start",
        }}>
          {packages.map((pkg, i) => (
            <PricingCard key={pkg.id} pkg={pkg} index={i} onSelect={handlePackageSelect} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        maxWidth: 1100,
        margin: "80px auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
        <div style={{ fontSize: 14, color: "#6B7280", whiteSpace: "nowrap" }}>atau tambah kredit konsultasi</div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
      </div>

      {/* ── Consult Packages ── */}
      <div ref={consultRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          textAlign: "center",
          marginBottom: 48,
          opacity: consultInView ? 1 : 0,
          transform: consultInView ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ fontSize: 12, color: "#0EA5E9", fontWeight: 800, letterSpacing: 4, marginBottom: 12 }}>
            KONSULTASI PSIKOLOG
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: 0 }}>
            Tambah Kredit Konsultasi
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15, marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
            Beli kredit sesi konsultasi dan gunakan kapan saja sesuai kebutuhanmu.
            Kredit masuk otomatis ke akun setelah pembayaran.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {consultPackages.map((pkg, i) => (
            <ConsultCard key={pkg.id} pkg={pkg} index={i} onSelect={handlePackageSelect} />
          ))}
        </div>

        {/* Credit info box */}
        <div style={{
          marginTop: 40,
          background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(124,58,237,0.1))",
          border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: 16,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          opacity: consultInView ? 1 : 0,
          transform: consultInView ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>ℹ️ Cara Kerja Kredit Konsultasi</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { step: "1", text: "Pilih paket & bayar via Midtrans" },
              { step: "2", text: "Kredit masuk otomatis ke profil" },
              { step: "3", text: "Gunakan kredit kapan saja untuk booking" },
              { step: "4", text: "Konsul via webcall tanpa batas waktu" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0EA5E9, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {step}
                </div>
                <span style={{ fontSize: 13, color: "#D1D5DB" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
