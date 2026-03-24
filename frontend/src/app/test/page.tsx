"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, selectTestQuestions } from "@/lib/questions";
import { Answer, calculateResult, LIKERT_SCALE, DIMENSION_INFO } from "@/lib/scoring";
import type { MBTIDimension } from "@/lib/questions";

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
      <main className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4 relative overflow-hidden">
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
      <main className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
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

  return (
    <main className="min-h-screen bg-[#0a0a14] relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: particleStyles }} />

      {/* ── Noise texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Background gradient orbs ── */}
      <div
        className="fixed w-[500px] h-[500px] rounded-full blur-[120px] top-[-10%] left-[-15%] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: dimColor + "25" }}
      />
      <div
        className="fixed w-[400px] h-[400px] rounded-full blur-[100px] bottom-[-10%] right-[-15%] pointer-events-none transition-colors duration-1000"
        style={{
          backgroundColor: dimColor + "18",
          animationDelay: "2s",
        }}
      />

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

          {/* 5 mini dimension progress bars */}
          <div className="flex gap-1.5 mt-2">
            {dimensionProgress.map((dp) => {
              const dInfo = DIMENSION_INFO[dp.dim];
              const pct = dp.total > 0 ? (dp.answered / dp.total) * 100 : 0;
              return (
                <div key={dp.dim} className="flex-1">
                  <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: dInfo.color }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Question area ── */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-28 pb-8">
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
              {/* Dimension badge */}
              <motion.div
                className="mb-7"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
                  style={{
                    backgroundColor: dimColor + "15",
                    color: dimColor,
                    border: `1px solid ${dimColor}20`,
                  }}
                >
                  {/* Pulsing dot */}
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: dimColor,
                      boxShadow: `0 0 6px ${dimColor}80`,
                      animation: "dot-pulse 2s ease-in-out infinite",
                    }}
                  />
                  {currentDimension === "AT"
                    ? "Assertive / Turbulent"
                    : `${dimInfo?.poleALabel} / ${dimInfo?.poleBLabel}`}
                </span>
              </motion.div>

              {/* Question text */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.35 }}
                className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-14 leading-relaxed px-2 md:px-4"
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
                              : "opacity-60 hover:opacity-100"
                          }
                        `}
                        style={{
                          backgroundColor: isSelected
                            ? option.color
                            : option.color + "18",
                          borderColor: isSelected
                            ? "rgba(255,255,255,0.3)"
                            : option.color + "25",
                          boxShadow: isSelected
                            ? `0 0 24px ${option.color}50, 0 4px 20px rgba(0,0,0,0.3)`
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
    </main>
  );
}
