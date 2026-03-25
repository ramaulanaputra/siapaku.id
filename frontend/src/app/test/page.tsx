"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, selectTestQuestions } from "@/lib/questions";
import { Answer, calculateResult, LIKERT_SCALE, DIMENSION_INFO } from "@/lib/scoring";
import type { MBTIDimension } from "@/lib/questions";
import { Navbar } from "@/components/layout/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ──────────────────── CSS-only background particles ──────────────────── */
const particleStyles = `
@keyframes float-particle {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
  25% { transform: translateY(-120px) translateX(40px) scale(1.2); opacity: 0.6; }
  50% { transform: translateY(-60px) translateX(-30px) scale(0.8); opacity: 0.4; }
  75% { transform: translateY(-160px) translateX(60px) scale(1.1); opacity: 0.2; }
}
@keyframes gradient-mesh {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes float-crystal {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  33% { transform: translateY(-18px) rotate(3deg) scale(1.05); }
  66% { transform: translateY(-8px) rotate(-2deg) scale(0.98); }
}
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.2); }
}
@keyframes dot-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}
@keyframes analyzing-dots {
  0%, 20% { opacity: 0; }
  40% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes spin-gradient {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes ambient-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.1); }
  50% { transform: translate(-20px, 15px) scale(0.95); }
  75% { transform: translate(15px, 25px) scale(1.05); }
}
@keyframes noise-shift {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -5%); }
  20% { transform: translate(10%, 5%); }
  30% { transform: translate(5%, -10%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-10%, 5%); }
  60% { transform: translate(15%, 0); }
  70% { transform: translate(0, 10%); }
  80% { transform: translate(-15%, 0); }
  90% { transform: translate(10%, 5%); }
  100% { transform: translate(5%, 0); }
}
`;

/* ──────────────────── Floating Particles Component ──────────────────── */
function FloatingParticles({ count = 30 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 8,
        duration: Math.random() * 10 + 8,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────── Sparkle burst on selection ──────────────────── */
function SparkBurst({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sm"
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            x: Math.cos((i / 6) * Math.PI * 2) * 30,
            y: Math.sin((i / 6) * Math.PI * 2) * 30,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ color }}
        >
          ✦
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ══════════════════════ MAIN COMPONENT ══════════════════════ */
export default function TestPage() {
  const { data: session } = useSession();
  const router = useRouter();

  /* ── state ── */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const [justSelected, setJustSelected] = useState<number | null>(null);

  /* ── init ── */
  useEffect(() => {
    setQuestions(selectTestQuestions());
  }, []);

  /* ── derived ── */
  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const answeredCount = answers.size;
  const currentDimension = currentQuestion?.dimension;
  const dimInfo = currentDimension ? DIMENSION_INFO[currentDimension] : null;
  const allAnswered = answeredCount >= questions.length && questions.length > 0;

  const dimensionProgress = useMemo(() => {
    const dims: MBTIDimension[] = ["EI", "SN", "TF", "JP", "AT"];
    return dims.map((dim) => {
      const dimQs = questions.filter((q) => q.dimension === dim);
      const answered = dimQs.filter((q) => answers.has(q.id)).length;
      return { dim, total: dimQs.length, answered };
    });
  }, [questions, answers]);

  /* ── load existing answer on nav ── */
  useEffect(() => {
    if (currentQuestion) {
      const existing = answers.get(currentQuestion.id);
      setSelectedValue(existing !== undefined ? existing : null);
    }
  }, [currentIndex, currentQuestion, answers]);

  /* ── handlers ── */
  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return;
      setSelectedValue(value);
      setJustSelected(value);
      setTimeout(() => setJustSelected(null), 500);

      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, value);
        return next;
      });

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
        }
      }, 300);
    },
    [currentQuestion, currentIndex, questions.length]
  );

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goForward = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  /* ── keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showIntro) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) {
        handleAnswer(num - 4);
      }
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "ArrowRight") goForward();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showIntro, handleAnswer, goBack, goForward]);

  /* ── submit ── */
  const handleSubmit = async () => {
    if (answeredCount < questions.length) return;
    setIsSubmitting(true);

    try {
      const answerArray: Answer[] = Array.from(answers.entries()).map(
        ([qId, value]) => ({ questionId: qId, value })
      );
      const result = calculateResult(questions, answerArray);

      if (session?.user?.email) {
        try {
          await fetch(`${API}/api/test/result`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email, result }),
          });
        } catch {
          // Continue even if save fails
        }
      }

      localStorage.setItem("siapaku_result", JSON.stringify(result));
      router.push(`/test/result/${result.mbtiType}?identity=${result.identity}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  /* ════════════ SUBMITTING OVERLAY ════════════ */
  if (isSubmitting) {
    const dims: MBTIDimension[] = ["EI", "SN", "TF", "JP", "AT"];
    return (
      <main className="min-h-screen bg-[#101020] flex items-center justify-center p-4 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: particleStyles }} />
        <FloatingParticles count={20} />

        {/* spinning gradient circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
            style={{
              background:
                "conic-gradient(from 0deg, #8B5CF6, #F59E0B, #3B82F6, #EC4899, #10B981, #8B5CF6)",
              animation: "spin-gradient 4s linear infinite",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div
            className="rounded-3xl border border-white/10 p-10 md:p-14 max-w-md mx-auto"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(40px)",
            }}
          >
            <motion.div
              className="text-7xl mb-8"
              animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🔮
            </motion.div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Menganalisis kepribadianmu
              <span className="inline-flex ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="text-white/60"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </span>
            </h2>

            <p className="text-white/30 text-sm mb-8">
              Menghitung 5 dimensi dari {questions.length} jawaban
            </p>

            <div className="space-y-3">
              {dims.map((dim, idx) => {
                const info = DIMENSION_INFO[dim];
                return (
                  <motion.div
                    key={dim}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.4, duration: 0.4 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.8 + idx * 0.4,
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ backgroundColor: info.color + "30" }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 + idx * 0.4 }}
                      >
                        ✓
                      </motion.span>
                    </motion.div>
                    <span className="text-sm text-white/60">
                      <span style={{ color: info.color }} className="font-semibold">
                        {info.poleALabel}
                      </span>
                      {" / "}
                      <span style={{ color: info.color }} className="font-semibold">
                        {info.poleBLabel}
                      </span>
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ════════════ INTRO SCREEN ════════════ */
  if (showIntro) {
    const dims: MBTIDimension[] = ["EI", "SN", "TF", "JP", "AT"];

    return (
      <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <style dangerouslySetInnerHTML={{ __html: particleStyles }} />

        {/* Animated gradient mesh background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a14 0%, #120a28 25%, #0a0a14 50%, #0a1a20 75%, #0a0a14 100%)",
            backgroundSize: "400% 400%",
            animation: "gradient-mesh 15s ease infinite",
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            animation: "noise-shift 8s steps(10) infinite",
          }}
        />

        <FloatingParticles count={40} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg w-full text-center"
        >
          {/* Crystal ball */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <div
              className="text-8xl md:text-9xl inline-block"
              style={{ animation: "float-crystal 4s ease-in-out infinite" }}
            >
              🔮
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-display, system-ui)" }}
          >
            Tes Kepribadian MBTI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/40 mb-8 text-base md:text-lg"
          >
            100 pertanyaan · 5 dimensi · 10-15 menit
          </motion.p>

          {/* Dimension pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8"
          >
            {dims.map((dim, idx) => {
              const info = DIMENSION_INFO[dim];
              const label = dim === "AT" ? "A / T" : dim.split("").join(" / ");
              return (
                <motion.div
                  key={dim}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.65 + idx * 0.08,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/[0.06]"
                  style={{
                    background: `linear-gradient(135deg, ${info.color}10, ${info.color}05)`,
                  }}
                >
                  {/* Glowing dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: info.color,
                      boxShadow: `0 0 8px ${info.color}80`,
                      animation: "dot-pulse 2s ease-in-out infinite",
                      animationDelay: `${idx * 0.3}s`,
                    }}
                  />
                  <span
                    className="text-sm font-bold tracking-wide"
                    style={{ color: info.color }}
                  >
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="text-white/25 text-sm mb-10 space-y-1.5 max-w-sm mx-auto leading-relaxed"
          >
            <p>
              Jawab setiap pernyataan dengan jujur sesuai dirimu yang sebenarnya,
              bukan siapa yang kamu inginkan.
            </p>
            <p>Tidak ada jawaban benar atau salah.</p>
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <motion.button
              onClick={() => setShowIntro(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full max-w-sm mx-auto block text-lg font-bold text-white py-4 px-12 rounded-2xl overflow-hidden"
              style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
            >
              {/* Animated gradient bg */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED, #8B5CF6, #EC4899, #7C3AED)",
                  backgroundSize: "300% 300%",
                  animation: "gradient-mesh 4s ease infinite",
                }}
              />
              <span className="relative z-10">Mulai Tes 🚀</span>
            </motion.button>
          </motion.div>

          {/* Keyboard tip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="text-white/15 text-xs mt-5"
          >
            Tekan angka 1-7 untuk jawab cepat
          </motion.p>
        </motion.div>
      </main>
    );
  }

  /* ════════════ LOADING STATE ════════════ */
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#101020] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/40"
        >
          Mempersiapkan pertanyaan...
        </motion.div>
      </main>
    );
  }

  /* ════════════ MAIN TEST UI ════════════ */
  const dimColor = dimInfo?.color || "#7C3AED";

  // Personality keywords for ambient bottom section
  const personalityKeywords = [
    "Empati", "Kreativitas", "Logika", "Intuisi", "Harmoni",
    "Strategi", "Imajinasi", "Keberanian", "Refleksi", "Adaptasi",
    "Visi", "Ketenangan", "Ekspresi", "Analisis", "Inspirasi",
    "Ketegasan", "Fleksibilitas", "Kepekaan", "Kebijaksanaan", "Spontanitas"
  ];

  // Inspirational quotes that rotate
  const inspoQuotes = [
    "Mengenal diri sendiri adalah awal dari kebijaksanaan.",
    "Setiap jawaban membawa kamu lebih dekat pada dirimu.",
    "Tidak ada jawaban yang salah — hanya yang jujur.",
    "Kepribadianmu adalah superpower-mu.",
    "Semakin dalam kamu mengenal diri, semakin luas duniamu.",
  ];
  const currentQuote = inspoQuotes[currentIndex % inspoQuotes.length];

  return (
    <main className="min-h-screen bg-[#101020] relative overflow-hidden flex flex-col">
      <Navbar />
      <style dangerouslySetInnerHTML={{ __html: particleStyles }} />

      {/* ── Noise texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Immersive animated background that reflects dimension ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary breathing orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
          animate={{
            x: ["-10%", "5%", "-15%", "0%"],
            y: ["-5%", "10%", "-8%", "0%"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: dimColor + "28", top: "-15%", left: "-10%" }}
        />
        {/* Secondary floating orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[130px]"
          animate={{
            x: ["0%", "-10%", "8%", "0%"],
            y: ["0%", "-8%", "5%", "0%"],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ backgroundColor: dimColor + "22", bottom: "-10%", right: "-10%" }}
        />
        {/* Center ambient glow */}
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full blur-[100px]"
          animate={{
            opacity: [0.12, 0.25, 0.12],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ backgroundColor: dimColor, top: "30%", left: "35%" }}
        />
        {/* Floating accent particles that match dimension color */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`accent-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              backgroundColor: dimColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, -(Math.random() * 200 + 80)],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: Math.random() * 6 + 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Horizontal light streak */}
        <motion.div
          className="absolute h-[1px] w-[40%] left-[30%]"
          style={{
            background: `linear-gradient(90deg, transparent, ${dimColor}30, transparent)`,
            top: "50%",
          }}
          animate={{ opacity: [0, 0.5, 0], scaleX: [0.5, 1.2, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Top bar (glassmorphism) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
        style={{
          background: "rgba(10, 10, 20, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <button
              onClick={() => router.push("/")}
              className="text-white/30 hover:text-white/60 text-sm transition-colors duration-200 flex items-center gap-1"
            >
              <span>←</span> Keluar
            </button>
            <span className="text-white/50 text-sm font-mono tabular-nums tracking-wider">
              {currentIndex + 1}{" "}
              <span className="text-white/20">/</span> {questions.length}
            </span>
            <span className="text-white/30 text-sm tabular-nums">
              <span className="text-white/50 font-semibold">{answeredCount}</span>{" "}
              dijawab
            </span>
          </div>

          {/* Main progress bar */}
          <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, ${dimColor}CC, ${dimColor})`,
                boxShadow: `0 0 12px ${dimColor}40`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Glow tip */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{
                  background: dimColor,
                  boxShadow: `0 0 8px ${dimColor}, 0 0 16px ${dimColor}60`,
                }}
              />
            </motion.div>
          </div>

          {/* 5 mini dimension progress bars - color hints at current dimension */}
          <div className="flex gap-1 mt-2">
            {dimensionProgress.map((dp) => {
              const dInfo = DIMENSION_INFO[dp.dim];
              const pct = dp.total > 0 ? (dp.answered / dp.total) * 100 : 0;
              const isActive = dp.dim === currentDimension;
              return (
                <div key={dp.dim} className="flex-1">
                  <motion.div
                    className="h-[3px] rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    animate={{ opacity: isActive ? 1 : 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: dInfo.color,
                        boxShadow: isActive ? `0 0 6px ${dInfo.color}60` : "none",
                      }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Question area ── */}
      <div className="relative z-10 flex items-center justify-center flex-1 px-4 pt-24 pb-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -80, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-center"
            >


              {/* Question text */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.35 }}
                className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-16 leading-relaxed px-2 md:px-6"
                style={{ fontFamily: "var(--font-display, system-ui)" }}
              >
                {currentQuestion?.text}
              </motion.h2>

              {/* ── Likert scale ── */}
              <div
                className="flex items-center justify-center gap-2 md:gap-3 mb-5 px-2"
                style={{ animation: "breathe 4s ease-in-out infinite" }}
              >
                {LIKERT_SCALE.map((option) => {
                  const isSelected = selectedValue === option.value;
                  const wasJustSelected = justSelected === option.value;
                  const absVal = Math.abs(option.value);

                  // Size classes
                  const sizeClass =
                    absVal === 3
                      ? "w-14 h-14 md:w-16 md:h-16"
                      : absVal === 2
                        ? "w-12 h-12 md:w-14 md:h-14"
                        : absVal === 1
                          ? "w-10 h-10 md:w-12 md:h-12"
                          : "w-9 h-9 md:w-10 md:h-10";

                  return (
                    <div key={option.value} className="relative">
                      <motion.button
                        onClick={() => handleAnswer(option.value)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        animate={
                          wasJustSelected
                            ? { scale: [1, 1.25, 1] }
                            : { scale: 1 }
                        }
                        transition={
                          wasJustSelected
                            ? {
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              }
                            : { type: "spring", stiffness: 400, damping: 25 }
                        }
                        className={`
                          ${sizeClass} rounded-full transition-all duration-200
                          flex items-center justify-center cursor-pointer
                          border-2 relative
                          ${
                            isSelected
                              ? "shadow-xl"
                              : ""
                          }
                        `}
                        style={{
                          backgroundColor: isSelected
                            ? option.color
                            : option.color + "38",
                          borderColor: isSelected
                            ? "rgba(255,255,255,0.5)"
                            : option.color + "50",
                          boxShadow: isSelected
                            ? `0 0 30px ${option.color}80, 0 0 60px ${option.color}40, 0 4px 20px rgba(0,0,0,0.3)`
                            : "none",
                        }}
                        title={option.label}
                      >
                        {/* Inner white dot on selection */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 20,
                              }}
                              className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"
                            />
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {/* Sparkle burst */}
                      <AnimatePresence>
                        {wasJustSelected && (
                          <SparkBurst color={option.color} />
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Scale labels */}
              <div className="flex justify-between px-1 md:px-4 mb-0">
                <span className="text-white/20 text-[11px] md:text-xs">
                  Sangat Tidak Setuju
                </span>
                <span className="text-white/15 text-[11px] md:text-xs">
                  Netral
                </span>
                <span className="text-white/20 text-[11px] md:text-xs">
                  Sangat Setuju
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation footer ── */}
          <div className="flex items-center justify-between mt-10">
            <motion.button
              onClick={goBack}
              disabled={currentIndex === 0}
              whileHover={currentIndex > 0 ? { x: -3 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
              className="text-white/30 hover:text-white/60 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-white/[0.04] text-sm"
            >
              ← Sebelumnya
            </motion.button>

            {allAnswered ? (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative px-8 py-3 rounded-2xl text-white font-bold text-base overflow-hidden disabled:opacity-50"
                style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #7C3AED, #8B5CF6, #EC4899, #7C3AED)",
                    backgroundSize: "300% 300%",
                    animation: "gradient-mesh 3s ease infinite",
                  }}
                />
                <span className="relative z-10">Lihat Hasil ✨</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={goForward}
                disabled={currentIndex >= questions.length - 1}
                whileHover={
                  currentIndex < questions.length - 1 ? { x: 3 } : {}
                }
                whileTap={
                  currentIndex < questions.length - 1 ? { scale: 0.95 } : {}
                }
                className="text-white/30 hover:text-white/60 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-white/[0.04] text-sm"
              >
                Selanjutnya →
              </motion.button>
            )}
          </div>

          {/* Unanswered count */}
          {!allAnswered && answeredCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6"
            >
              <p className="text-white/15 text-xs">
                {questions.length - answeredCount} pertanyaan belum dijawab
                {currentIndex >= questions.length - 1 && (
                  <span className="text-amber-400/50 ml-1">
                    — jawab semua untuk melihat hasil
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ══════════ CREATIVE BOTTOM SECTION — Personality Cosmos ══════════ */}
      <div className="relative z-10 w-full pb-12 pt-4 hidden md:block">
        {/* Divider line with glow */}
        <div className="max-w-4xl mx-auto mb-8 relative">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/3 blur-sm"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: dimColor }}
          />
        </div>

        {/* Floating personality keywords */}
        <div className="max-w-5xl mx-auto px-8 relative h-24 overflow-hidden">
          {personalityKeywords.map((word, i) => {
            const row = i % 3;
            const startX = ((i * 37 + 13) % 90) + 2;
            const topPos = row === 0 ? "5%" : row === 1 ? "40%" : "72%";
            const delay = i * 0.8;
            const duration = 18 + (i % 5) * 4;
            const isHighlight = i % 7 === currentIndex % 7;
            return (
              <motion.span
                key={word}
                className="absolute text-xs md:text-sm font-medium whitespace-nowrap select-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isHighlight ? [0.15, 0.5, 0.15] : [0.06, 0.15, 0.06],
                  x: [0, 30, -20, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay,
                }}
                style={{
                  left: `${startX}%`,
                  top: topPos,
                  color: isHighlight ? dimColor : "rgba(255,255,255,0.5)",
                  textShadow: isHighlight ? `0 0 20px ${dimColor}60` : "none",
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        {/* Inspirational quote */}
        <div className="max-w-2xl mx-auto text-center mt-6 px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="text-white/20 text-sm italic font-light tracking-wide"
            >
              &ldquo;{currentQuote}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Personality dimension mini-visualizer */}
        <div className="max-w-lg mx-auto mt-8 px-6">
          <div className="flex items-center justify-center gap-3">
            {(["EI", "SN", "TF", "JP"] as const).map((dim) => {
              const info = DIMENSION_INFO[dim];
              const isActive = currentQuestion?.dimension === dim;
              const dimAnswered = questions.filter(
                (q) => q.dimension === dim && answers.has(q.id)
              ).length;
              const dimTotal = questions.filter((q) => q.dimension === dim).length;
              const pct = dimTotal > 0 ? (dimAnswered / dimTotal) * 100 : 0;
              return (
                <motion.div
                  key={dim}
                  className="flex flex-col items-center gap-1.5"
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="relative w-10 h-10">
                    {/* Background circle */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18" cy="18" r="14"
                        fill="none"
                        stroke={info.color + "20"}
                        strokeWidth="3"
                      />
                      <motion.circle
                        cx="18" cy="18" r="14"
                        fill="none"
                        stroke={info.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="87.96"
                        animate={{ strokeDashoffset: 87.96 - (87.96 * pct) / 100 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                          filter: isActive ? `drop-shadow(0 0 6px ${info.color}80)` : "none",
                        }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/60">
                      {dim}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 16 }}
                      className="h-0.5 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
