"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, selectTestQuestions } from "@/lib/questions";
import { Answer, calculateResult, LIKERT_SCALE, DIMENSION_INFO } from "@/lib/scoring";
import type { MBTIDimension } from "@/lib/questions";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function TestPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [showIntro, setShowIntro] = useState(true);

  // Initialize questions on mount
  useEffect(() => {
    setQuestions(selectTestQuestions());
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;
  const answeredCount = answers.size;

  // Current dimension info for color theming
  const currentDimension = currentQuestion?.dimension;
  const dimInfo = currentDimension ? DIMENSION_INFO[currentDimension] : null;

  // Dimension progress tracking
  const dimensionProgress = useMemo(() => {
    const dims: MBTIDimension[] = ["EI", "SN", "TF", "JP", "AT"];
    return dims.map(dim => {
      const dimQs = questions.filter(q => q.dimension === dim);
      const answered = dimQs.filter(q => answers.has(q.id)).length;
      return { dim, total: dimQs.length, answered };
    });
  }, [questions, answers]);

  // Load existing answer when navigating to a question
  useEffect(() => {
    if (currentQuestion) {
      const existing = answers.get(currentQuestion.id);
      setSelectedValue(existing !== undefined ? existing : null);
    }
  }, [currentIndex, currentQuestion, answers]);

  const handleAnswer = useCallback((value: number) => {
    if (!currentQuestion) return;
    setSelectedValue(value);
    
    // Save answer
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(currentQuestion.id, value);
      return next;
    });

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  }, [currentQuestion, currentIndex, questions.length]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const goForward = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showIntro) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) {
        handleAnswer(num - 4); // 1→-3, 2→-2, ..., 7→+3
      }
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "ArrowRight") goForward();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showIntro, handleAnswer, goBack, goForward]);

  // Submit results
  const handleSubmit = async () => {
    if (answeredCount < questions.length) return;
    setIsSubmitting(true);

    try {
      const answerArray: Answer[] = Array.from(answers.entries()).map(([qId, value]) => ({
        questionId: qId,
        value,
      }));

      const result = calculateResult(questions, answerArray);

      // Save to backend
      if (session?.user?.email) {
        try {
          await fetch(`${API}/api/test/result`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              result,
            }),
          });
        } catch {
          // Continue even if save fails
        }
      }

      // Save to localStorage as backup
      localStorage.setItem("siapaku_result", JSON.stringify(result));

      // Navigate to result
      router.push(`/test/result/${result.mbtiType}?identity=${result.identity}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center"
        >
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Tes Kepribadian MBTI
            </h1>
            <p className="text-white/50 mb-3 leading-relaxed">
              100 pertanyaan · 5 dimensi · 10-15 menit
            </p>
            <div className="text-white/30 text-sm mb-8 space-y-2">
              <p>Jawab setiap pernyataan dengan jujur sesuai dirimu yang sebenarnya, bukan siapa yang kamu inginkan.</p>
              <p>Tidak ada jawaban benar atau salah.</p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-8">
              {(["EI", "SN", "TF", "JP", "AT"] as MBTIDimension[]).map(dim => {
                const info = DIMENSION_INFO[dim];
                return (
                  <div key={dim} className="glass rounded-xl p-3 text-center">
                    <div className="text-xs font-bold mb-1" style={{ color: info.color }}>
                      {dim === "AT" ? "A/T" : dim.split("").join("/")}
                    </div>
                    <div className="text-[10px] text-white/30">20 soal</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowIntro(false)}
              className="btn-primary text-lg px-12 py-4 w-full hover:scale-[1.02] transition-transform"
            >
              Mulai Tes 🚀
            </button>

            <p className="text-white/20 text-xs mt-4">
              Tekan angka 1-7 di keyboard untuk jawab cepat
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white/50">Mempersiapkan pertanyaan...</div>
      </main>
    );
  }

  // All answered — show submit
  const allAnswered = answeredCount >= questions.length;

  return (
    <main className="min-h-screen bg-brand-dark relative overflow-hidden">
      {/* Background orbs */}
      <div 
        className="orb w-96 h-96 top-10 -left-48 animate-pulse-slow transition-colors duration-1000"
        style={{ backgroundColor: dimInfo?.color ? dimInfo.color + "40" : "#7C3AED40" }}
      />
      <div 
        className="orb w-72 h-72 bottom-10 -right-36 animate-pulse-slow transition-colors duration-1000"
        style={{ backgroundColor: dimInfo?.color ? dimInfo.color + "30" : "#EC489930", animationDelay: "2s" }}
      />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => router.push("/")}
              className="text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              ← Keluar
            </button>
            <span className="text-white/60 text-sm font-mono">
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-white/40 text-sm">
              {answeredCount} dijawab
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-colors duration-500"
              style={{ backgroundColor: dimInfo?.color || "#7C3AED" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Dimension mini-progress */}
          <div className="flex gap-1.5 mt-2">
            {dimensionProgress.map(dp => (
              <div key={dp.dim} className="flex-1">
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: dp.total > 0 ? `${(dp.answered / dp.total) * 100}%` : "0%",
                      backgroundColor: DIMENSION_INFO[dp.dim].color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24 pb-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-center"
            >
              {/* Dimension badge */}
              <div className="mb-6">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    backgroundColor: (dimInfo?.color || "#7C3AED") + "20",
                    color: dimInfo?.color || "#7C3AED"
                  }}
                >
                  {currentDimension === "AT" ? "Assertive / Turbulent" : 
                   `${dimInfo?.poleALabel} / ${dimInfo?.poleBLabel}`}
                </span>
              </div>

              {/* Question text */}
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white mb-12 leading-relaxed px-4">
                {currentQuestion?.text}
              </h2>

              {/* Likert scale */}
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 px-2">
                {LIKERT_SCALE.map((option) => {
                  const isSelected = selectedValue === option.value;
                  const size = Math.abs(option.value) === 3 ? "w-14 h-14 md:w-16 md:h-16" :
                               Math.abs(option.value) === 2 ? "w-12 h-12 md:w-14 md:h-14" :
                               Math.abs(option.value) === 1 ? "w-10 h-10 md:w-12 md:h-12" :
                               "w-9 h-9 md:w-10 md:h-10";
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`
                        ${size} rounded-full transition-all duration-200 
                        flex items-center justify-center
                        hover:scale-110 active:scale-95
                        ${isSelected 
                          ? "ring-4 ring-white/30 scale-110 shadow-lg" 
                          : "hover:ring-2 hover:ring-white/10 opacity-70 hover:opacity-100"}
                      `}
                      style={{ 
                        backgroundColor: isSelected ? option.color : option.color + "40",
                        boxShadow: isSelected ? `0 0 20px ${option.color}40` : "none",
                      }}
                      title={option.label}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scale labels */}
              <div className="flex justify-between px-2 md:px-4 mb-8">
                <span className="text-white/30 text-xs">Sangat Tidak Setuju</span>
                <span className="text-white/20 text-xs">Netral</span>
                <span className="text-white/30 text-xs">Sangat Setuju</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goBack}
              disabled={currentIndex === 0}
              className="text-white/40 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              ← Sebelumnya
            </button>

            {allAnswered ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 text-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menghitung...
                  </span>
                ) : (
                  "Lihat Hasil ✨"
                )}
              </button>
            ) : (
              <button
                onClick={goForward}
                disabled={currentIndex >= questions.length - 1}
                className="text-white/40 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
              >
                Selanjutnya →
              </button>
            )}
          </div>

          {/* Skip indicator */}
          {!allAnswered && answeredCount > 0 && (
            <div className="text-center mt-6">
              <p className="text-white/20 text-xs">
                {questions.length - answeredCount} pertanyaan belum dijawab
                {currentIndex >= questions.length - 1 && (
                  <span className="text-amber-400/60 ml-1">— jawab semua untuk melihat hasil</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
