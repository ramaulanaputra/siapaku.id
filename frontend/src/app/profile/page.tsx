"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MBTI_PROFILES, MBTIType, getSquadColor, getSquadEmoji } from "@/lib/mbtiData";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface UserProfile {
  nama: string;
  email: string;
  profile_picture_url?: string;
  tentang_diri?: string;
  username?: string;
  tanggal_lahir?: string;
  pekerjaan?: string;
  hobby?: string;
  setauku_aku_ini?: string;
  consult_credits?: number;
  consult_unlocked?: boolean;
  test_package?: string;
  has_pdf_report?: boolean;
  has_physical_merch?: boolean;
  latestTest?: {
    mbti_type: MBTIType;
    squad: string;
    test_date: string;
    next_test_available_date: string;
  };
  testHistory: Array<{
    mbti_type: MBTIType;
    test_date: string;
  }>;
  orderCount?: number;
  certificates?: Array<{
    certificate_code: string;
    certificate_type: string;
    mbti_type: string;
    issued_date: string;
  }>;
}

/* ─────────────────────────── Animation Variants ─────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// Editable field component
function EditableField({
  label,
  icon,
  value,
  placeholder,
  fieldKey,
  type = "text",
  multiline = false,
  maxLength,
  onSave,
  validate,
  helperText,
}: {
  label: string;
  icon: string;
  value: string;
  placeholder: string;
  fieldKey: string;
  type?: string;
  multiline?: boolean;
  maxLength?: number;
  onSave: (key: string, val: string) => Promise<void>;
  validate?: (val: string) => string | null;
  helperText?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = async () => {
    if (validate) {
      const err = validate(draft);
      if (err) {
        setValidationError(err);
        return;
      }
    }
    setValidationError(null);
    setSaving(true);
    try {
      await onSave(fieldKey, draft);
      setEditing(false);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group">
      <label className="text-xs font-semibold tracking-[0.1em] uppercase text-purple-400/70 mb-2 flex items-center gap-2">
        <span className="text-sm">{icon}</span> {label}
      </label>
      {editing ? (
        <>
          <div className="flex gap-2">
            {multiline ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="flex-1 bg-white/[0.06] border border-purple-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] resize-none transition-all backdrop-blur-sm"
                rows={3}
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="flex-1 bg-white/[0.06] border border-purple-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all backdrop-blur-sm"
                autoFocus
              />
            )}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl text-white text-xs font-semibold transition-all disabled:opacity-50"
              >
                {saving ? "..." : "✓"}
              </button>
              <button
                onClick={() => { setEditing(false); setDraft(value); setValidationError(null); }}
                className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl text-white/50 text-xs transition-all"
              >
                ✕
              </button>
            </div>
          </div>
          {validationError && (
            <p className="text-red-400 text-xs mt-2 ml-1">{validationError}</p>
          )}
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/20 transition-all group/edit backdrop-blur-sm"
        >
          {value ? (
            <span className="text-white/80 text-sm">{value}</span>
          ) : (
            <span className="text-white/20 text-sm italic">{placeholder}</span>
          )}
          <span className="text-white/0 group-hover/edit:text-white/30 text-xs ml-2 transition-colors">✏️</span>
        </button>
      )}
      {helperText && !editing && (
        <p className="text-white/20 text-[11px] mt-1.5 ml-4">{helperText}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
      });
      setProfile(res.data);
    } catch {
      if (session?.user) {
        setProfile({
          nama: "",
          email: session.user.email || "",
          profile_picture_url: "",
          testHistory: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format harus JPG, PNG, atau WebP");
      return;
    }

    // Validate size (max 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 1.5MB");
      return;
    }

    try {
      // Compress and resize client-side
      const compressed = await compressImage(file, 256, 0.8);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-picture`,
        { profile_picture_url: compressed },
        { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
      );

      setProfile((prev) => prev ? { ...prev, profile_picture_url: compressed } : prev);
      toast.success("Foto profil diperbarui!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Gagal upload foto");
    }

    // Reset input
    e.target.value = "";
  };

  // Client-side image compression
  const compressImage = (file: File, maxSize: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Calculate dimensions
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxSize) { h = h * (maxSize / w); w = maxSize; }
          } else {
            if (h > maxSize) { w = w * (maxSize / h); h = maxSize; }
          }

          canvas.width = w;
          canvas.height = h;
          ctx?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/webp", quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const saveField = async (key: string, value: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
        { [key]: value || null },
        { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
      );
      setProfile((prev) => prev ? { ...prev, [key]: value } : prev);
      toast.success("Tersimpan!");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Gagal menyimpan";
      toast.error(msg);
      throw err;
    }
  };

  if (status === "unauthenticated") {
    return (
      <main className="relative bg-[#0a0a0f] text-white overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />

        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/30 to-transparent blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-pink-600/20 to-transparent blur-[100px]"
          />
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="flex-1 flex items-center justify-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-10 max-w-md w-full text-center overflow-hidden"
          >
            {/* Accent line top */}
            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-60" />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="font-display text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Login untuk Lihat Profil
                </span>
              </h2>
              <p className="text-white/50 mb-8">Simpan perjalanan self-discovery kamu.</p>
              <button
                onClick={() => signIn("google")}
                className="w-full group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login dengan Google
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const latestMBTI = profile?.latestTest?.mbti_type;
  const mbtiProfile = latestMBTI ? MBTI_PROFILES[latestMBTI] : null;
  const squadColor = mbtiProfile ? getSquadColor(mbtiProfile.squad) : "#7C3AED";
  const squadEmoji = mbtiProfile ? getSquadEmoji(mbtiProfile.squad) : "✨";

  const nextTestDate = profile?.latestTest?.next_test_available_date
    ? new Date(profile.latestTest.next_test_available_date)
    : null;
  const canTest = !nextTestDate || nextTestDate <= new Date();
  const countdown = nextTestDate && !canTest
    ? formatDistanceToNow(nextTestDate, { locale: idLocale, addSuffix: true })
    : null;

  const consultCredits = profile?.consult_credits || 0;
  const consultUnlocked = profile?.consult_unlocked || false;
  const testPackage = profile?.test_package;
  const packageLabel = testPackage === "ultimate" ? "Ultimate 💎" : testPackage === "premium" ? "Premium 👑" : testPackage === "standard" ? "Standar 🎓" : null;

  // Format date for display
  const formatBirthdate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="relative bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ GLOBAL BACKGROUND EFFECTS ═══════════════ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/30 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-pink-600/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-t from-indigo-600/20 to-transparent blur-[100px]"
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ═══════════════ HERO PROFILE SECTION ═══════════════ */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section Label */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-10"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4"
            >
              Profil Saya
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {profile?.nama || "Atur Nama Kamu"}
              </span>
            </motion.h1>
            {profile?.username && (
              <motion.p variants={fadeInUp} className="text-white/30 text-sm mt-2">
                @{profile.username}
              </motion.p>
            )}
          </motion.div>

          {/* ═══════════════ PROFILE HEADER CARD ═══════════════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-8 mb-8 overflow-hidden"
          >
            {/* Accent line top */}
            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-60" />

            {/* Background glows */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: squadColor }} />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: squadColor }} />

            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              {/* Avatar with upload */}
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="relative group/avatar"
              >
                {profile?.profile_picture_url && !profile.profile_picture_url.includes("googleusercontent.com") ? (
                  <Image
                    src={profile.profile_picture_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-2xl ring-2 ring-purple-500/20 object-cover w-[96px] h-[96px] shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-[96px] h-[96px] rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    style={{ background: `linear-gradient(135deg, ${squadColor}80, ${squadColor}40)` }}
                  >
                    {profile?.nama?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                {/* Upload overlay */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer flex items-center justify-center backdrop-blur-sm"
                >
                  <span className="text-white text-xs font-medium">📷 Ganti</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                {mbtiProfile && (
                  <div
                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-lg flex items-center justify-center text-sm shadow-lg ring-2 ring-[#0a0a0f]"
                    style={{ background: squadColor }}
                  >
                    {squadEmoji}
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {profile?.nama || "Atur Nama Kamu"}
                  </h2>
                  {packageLabel && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-xs font-semibold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                      Paket {packageLabel}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mt-1.5">{profile?.email}</p>

                {/* Quick stats row */}
                <div className="flex flex-wrap gap-6 mt-5">
                  {profile?.testHistory && profile.testHistory.length > 0 && (
                    <div className="text-center">
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{profile.testHistory.length}</div>
                      <div className="text-white/30 text-xs mt-0.5">Tes Selesai</div>
                    </div>
                  )}
                  {consultUnlocked && (
                    <div className="text-center">
                      <div className="text-xl font-bold text-sky-400">{consultCredits}</div>
                      <div className="text-white/30 text-xs mt-0.5">Kredit Konsul</div>
                    </div>
                  )}
                  {profile?.certificates && profile.certificates.length > 0 && (
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-400">{profile.certificates.length}</div>
                      <div className="text-white/30 text-xs mt-0.5">Sertifikat</div>
                    </div>
                  )}
                </div>
              </div>

              {/* MBTI Badge */}
              {mbtiProfile && (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05, transition: { duration: 0.25 } }}
                  className="rounded-2xl p-5 text-center min-w-32 shrink-0 backdrop-blur-sm"
                  style={{ background: squadColor + "15", border: `1px solid ${squadColor}30` }}
                >
                  <div className="text-4xl mb-1">{mbtiProfile.emoji}</div>
                  <div className="font-display font-bold text-2xl" style={{ color: squadColor }}>
                    {mbtiProfile.type}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{mbtiProfile.nickname}</div>
                  <div className="text-xs mt-2 px-2 py-0.5 rounded-full" style={{ background: squadColor + "20", color: squadColor }}>
                    Squad {mbtiProfile.squad}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="relative z-10">
        <div className="absolute left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>

      {/* ═══════════════ MAIN CONTENT GRID ═══════════════ */}
      <section className="relative py-12 sm:py-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="md:col-span-2 space-y-6">

              {/* ═══════════════ PROFIL KAMU — Editable Fields ═══════════════ */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -2, transition: { duration: 0.25 } }}
                className="relative rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
              >
                {/* Accent line top */}
                <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg">
                    📝
                  </div>
                  <h2 className="font-display text-xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Profil Kamu
                    </span>
                  </h2>
                </div>

                <div className="space-y-5">
                  <EditableField
                    label="Username"
                    icon="@"
                    value={profile?.username || ""}
                    placeholder="Pilih username unik kamu..."
                    fieldKey="username"
                    maxLength={30}
                    onSave={saveField}
                    validate={(val) => {
                      if (val && !/^[a-z0-9_]+$/.test(val)) {
                        return "Hanya huruf kecil, angka, dan underscore (_)";
                      }
                      if (val && val.length < 3) {
                        return "Minimal 3 karakter";
                      }
                      return null;
                    }}
                    helperText="Huruf kecil, angka, underscore. Min 3 karakter."
                  />

                  <EditableField
                    label="Nama"
                    icon="👤"
                    value={profile?.nama || ""}
                    placeholder="Tulis nama kamu..."
                    fieldKey="nama"
                    maxLength={30}
                    onSave={saveField}
                    helperText="Maks 30 karakter"
                  />

                  <EditableField
                    label="Tanggal Lahir"
                    icon="🎂"
                    value={profile?.tanggal_lahir ? profile.tanggal_lahir.split("T")[0] : ""}
                    placeholder="Pilih tanggal lahir..."
                    fieldKey="tanggal_lahir"
                    type="date"
                    onSave={saveField}
                  />

                  <EditableField
                    label="Pekerjaan"
                    icon="💼"
                    value={profile?.pekerjaan || ""}
                    placeholder="Apa pekerjaan kamu?"
                    fieldKey="pekerjaan"
                    maxLength={100}
                    onSave={saveField}
                  />

                  <EditableField
                    label="Hobby"
                    icon="🎯"
                    value={profile?.hobby || ""}
                    placeholder="Apa hobby kamu? (Bisa lebih dari satu)"
                    fieldKey="hobby"
                    onSave={saveField}
                  />

                  <EditableField
                    label="Tentang Diri"
                    icon="💬"
                    value={profile?.tentang_diri || ""}
                    placeholder="Ceritakan sedikit tentang diri kamu..."
                    fieldKey="tentang_diri"
                    multiline
                    maxLength={500}
                    onSave={saveField}
                  />

                  <EditableField
                    label="Setauku Aku Ini..."
                    icon="🪞"
                    value={profile?.setauku_aku_ini || ""}
                    placeholder="Menurutmu, kamu itu orang yang seperti apa? Tulis bebas..."
                    fieldKey="setauku_aku_ini"
                    multiline
                    maxLength={1000}
                    onSave={saveField}
                  />
                </div>
              </motion.div>

              {/* ═══════════════ MBTI Result Card ═══════════════ */}
              {mbtiProfile ? (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl border border-emerald-500/20 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-40" />

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-lg">
                      🧬
                    </div>
                    <h2 className="font-display text-xl font-bold">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Kepribadianmu
                      </span>
                    </h2>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">
                    {mbtiProfile.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {mbtiProfile.coreValues.map((v) => (
                      <span
                        key={v}
                        className="text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5"
                        style={{ background: squadColor + "20", color: squadColor }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/test/result/${mbtiProfile.type}`}
                    className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Lihat hasil lengkap →
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-10 text-center overflow-hidden"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40" />

                  {/* Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />

                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-5xl mb-4 inline-block"
                    >
                      🔮
                    </motion.div>
                    <h3 className="font-display text-xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Belum Pernah Tes
                      </span>
                    </h3>
                    <p className="text-white/40 text-sm mb-6">
                      Mulai perjalanan self-discovery kamu sekarang!
                    </p>
                    <Link
                      href="/test"
                      className="group relative inline-flex px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white text-sm shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Mulai Tes MBTI
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ Kredit Konsul Card ═══════════════ */}
              {consultUnlocked && (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl border border-sky-500/20 bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-sky-500 to-purple-500 opacity-40" />

                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-sky-500 opacity-10 blur-3xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0 border border-sky-500/10">
                      🧠
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">Kredit Konsultasi Psikolog</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-display font-bold text-sky-400">{consultCredits}</span>
                        <span className="text-white/40 text-sm">sesi tersedia</span>
                      </div>
                      <p className="text-white/30 text-xs mt-1">Kredit tidak hangus · Gunakan kapan saja</p>
                    </div>
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap"
                    >
                      {consultCredits > 0 ? "Booking Sesi →" : "Beli Kredit →"}
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ Test History ═══════════════ */}
              {profile?.testHistory && profile.testHistory.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -2, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl border border-violet-500/20 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-40" />

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-lg">
                      📊
                    </div>
                    <h2 className="font-display text-xl font-bold">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        History Tes
                      </span>
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {profile.testHistory.slice(0, 5).map((test, i) => {
                      const p = MBTI_PROFILES[test.mbti_type];
                      if (!p) return null;
                      const color = getSquadColor(p.squad);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ x: 4, transition: { duration: 0.2 } }}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{p.emoji}</span>
                            <div>
                              <span className="font-bold text-sm" style={{ color }}>{test.mbti_type}</span>
                              <p className="text-white/30 text-xs">{p.nickname}</p>
                            </div>
                          </div>
                          <span className="text-white/30 text-xs">
                            {formatDistanceToNow(new Date(test.test_date), { locale: idLocale, addSuffix: true })}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ Sertifikat ═══════════════ */}
              {profile?.certificates && profile.certificates.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -2, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl border border-amber-500/20 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-40" />

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg">
                      🏆
                    </div>
                    <h2 className="font-display text-xl font-bold">
                      <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                        Sertifikat
                      </span>
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {profile.certificates.map((cert, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-amber-500/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🏆</span>
                          <div>
                            <span className="font-bold text-sm text-amber-400">{cert.certificate_type === "premium" ? "Premium" : "Standar"}</span>
                            <p className="text-white/30 text-xs font-mono">{cert.certificate_code}</p>
                          </div>
                        </div>
                        <span className="text-white/40 text-xs font-mono">{cert.mbti_type}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
            <div className="space-y-6">
              {/* Next Test */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="relative rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-6 text-center overflow-hidden"
              >
                {/* Accent line top */}
                <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40" />

                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] rounded-full bg-purple-600/10 blur-[60px] pointer-events-none" />

                <div className="relative z-10">
                  {canTest ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-3xl mb-3 inline-block"
                      >
                        ✅
                      </motion.div>
                      <h3 className="font-display font-semibold text-white mb-2">Siap Tes!</h3>
                      <p className="text-white/40 text-xs mb-4">
                        {profile?.latestTest ? "Soal baru sudah tersedia" : "Mulai tes pertamamu"}
                      </p>
                      <Link
                        href="/test"
                        className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white text-sm shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
                      >
                        Mulai Tes
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-3">⏳</div>
                      <h3 className="font-display font-semibold text-white mb-2">Tes Berikutnya</h3>
                      <p className="text-white/40 text-xs mb-3">
                        Bisa tes lagi {countdown}
                      </p>
                      <p className="text-white/20 text-xs">
                        Gunakan waktu ini untuk refleksi
                      </p>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Consult Credits Quick Card */}
              {consultUnlocked && (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl p-6 text-center overflow-hidden"
                  style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 opacity-40" />

                  <div className="text-3xl mb-2">🧠</div>
                  <h3 className="font-display font-semibold text-white mb-1">Kredit Konsul</h3>
                  <div className="text-3xl font-display font-bold text-sky-400 mb-1">{consultCredits}</div>
                  <p className="text-white/30 text-xs mb-3">sesi tersedia</p>
                  <Link
                    href="/shop"
                    className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium"
                  >
                    {consultCredits > 0 ? "Gunakan kredit →" : "Beli kredit →"}
                  </Link>
                </motion.div>
              )}

              {/* Certificate */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="relative rounded-2xl border border-amber-500/20 bg-white/[0.03] backdrop-blur-sm p-6 text-center overflow-hidden"
              >
                {/* Accent line top */}
                <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-40" />

                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-display font-semibold text-white mb-2">Dapatkan Sertifikat</h3>
                <p className="text-white/40 text-xs mb-4">
                  Buktikan perjalanan self-discovery kamu
                </p>
                <Link
                  href="/shop"
                  className="block w-full py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm font-semibold text-white/80 text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-center"
                >
                  Lihat Paket
                </Link>
              </motion.div>

              {/* Squad Info */}
              {mbtiProfile && (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl p-6 text-center overflow-hidden backdrop-blur-sm"
                  style={{ background: squadColor + "15", border: `1px solid ${squadColor}25` }}
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-40" style={{ background: `linear-gradient(to right, ${squadColor}, ${squadColor}80)` }} />

                  <div className="text-3xl mb-2">{squadEmoji}</div>
                  <h3 className="font-display font-semibold text-white mb-1">
                    Squad {mbtiProfile.squad}
                  </h3>
                  <p className="text-xs" style={{ color: squadColor }}>
                    {mbtiProfile.squad === "Visionary" ? "Strategic · Analytical · Independent" :
                     mbtiProfile.squad === "Harmonizer" ? "Empathetic · Creative · Idealistic" :
                     mbtiProfile.squad === "Guardian" ? "Loyal · Responsible · Structured" :
                     "Adventurous · Adaptable · Action-oriented"}
                  </p>
                </motion.div>
              )}

              {/* Profile Info Card */}
              {(profile?.pekerjaan || profile?.hobby || profile?.tanggal_lahir) && (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden"
                >
                  {/* Accent line top */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-white/20 to-white/5 opacity-40" />

                  <h3 className="font-display font-semibold text-white text-sm mb-4">Info Singkat</h3>
                  <div className="space-y-3">
                    {profile.tanggal_lahir && (
                      <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <span className="text-white/40">🎂</span>
                        <span className="text-white/60">{formatBirthdate(profile.tanggal_lahir)}</span>
                      </div>
                    )}
                    {profile.pekerjaan && (
                      <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <span className="text-white/40">💼</span>
                        <span className="text-white/60">{profile.pekerjaan}</span>
                      </div>
                    )}
                    {profile.hobby && (
                      <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <span className="text-white/40">🎯</span>
                        <span className="text-white/60">{profile.hobby}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient divider */}
      <div className="relative z-10">
        <div className="absolute left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>

      {/* Spacer before footer */}
      <div className="relative z-10 pb-8" />

      <Footer />
    </main>
  );
}
