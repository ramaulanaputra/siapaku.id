"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getRandomQuestions } from "@/lib/questions";
import { calculateMBTI, Answer } from "@/lib/scoring";
import { Question } from "@/lib/questions";
import { Navbar } from "@/components/layout/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const TOTAL_QUESTIONS = 60;

export default function TestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextTestDate, setNextTestDate] = useState<Date | null>(null);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      checkTestEligibility();
    }
  }, [status]);

  const checkTestEligibility = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/test/eligibility`,
        { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
      );
      if (!res.data.canTest) {
        setNextTestDate(new Date(res.data.nextTestDate));
      }
    } catch {
      // Allow test if API fails
    }
  };

  const startTest = () => {
    const q = getRandomQuestions(TOTAL_QUESTIONS);
    setQuestions(q);
    setTestStarted(true);
  };

  const handleSelect = useCallback(
    (choice: "A" | "B") => {
      if (isAnimating) return;
      setSelectedChoice(choice);

      setTimeout(() => {
        const newAnswer: Answer = {
          questionId: questions[currentIndex].id,
          choice,
        };
        const newAnswers = [...answers.filter((a) => a.questionId !== questions[currentIndex].id), newAnswer];
        setAnswers(newAnswers);
        setIsAnimating(true);

        setTimeout(async () => {
          if (currentIndex + 1 >= questions.length) {
            await submitTest(newAnswers);
          } else {
            setCurrentIndex((prev) => prev + 1);
            setSelectedChoice(null);
            setIsAnimating(false);
          }
        }, 300);
      }, 200);
    },
    [isAnimating, questions, currentIndex, answers]
  );

  const submitTest = async (finalAnswers: Answer[]) => {
    setIsSubmitting(true);
    try {
      const result = calculateMBTI(questions, finalAnswers);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/test/submit`,
        {
          mbti_type: result.mbtiType,
          scores: result.scores,
          questions_answered: questions.map((q) => q.id),
        },
        {
          headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
        }
      );

      toast.success("Tes selesai! Melihat hasilmu...");
      router.push(`/test/result/${result.mbtiType}`);
    } catch (error) {
      // Still show result even if save fails
      const result = calculateMBTI(questions, finalAnswers);
      router.push(`/test/result/${result.mbtiType}`);
    }
  };

  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;
  const currentQuestion = questions[currentIndex];

  // Not logged in
  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-10 max-w-md w-full text-center"
          >
            <div className="text-5xl mb-4">🔮</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Login Dulu Yuk
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Kamu perlu login untuk menyimpan hasil tes dan mulai perjalanan 
              self-discovery kamu.
            </p>
            <button
              onClick={() => signIn("google")}
              className="btn-primary w-full text-base py-3"
            >
              Login dengan Google
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Rate limited
  if (nextTestDate) {
    const now = new Date();
    const diff = nextTestDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return (
      <main className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-10 max-w-md w-full text-center"
          >
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Sabar Dulu Ya!
            </h2>
            <p className="text-white/50 mb-6 leading-relaxed">
              Self-discovery butuh waktu untuk direnungkan. Kamu bisa test lagi dalam:
            </p>
            <div className="glass rounded-2xl p-6 mb-8">
              <div className="text-4xl font-display font-bold gradient-text">
                {days}h {hours}j
              </div>
              <div className="text-white/40 text-sm mt-1">lagi</div>
            </div>
            <p className="text-white/30 text-sm">
              Gunakan waktu ini untuk refleksi hasil tes sebelumnya.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="btn-secondary mt-6 w-full"
            >
              Lihat Profil Saya
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Start screen
  if (!testStarted) {
    return (
      <main className="min-h-screen bg-brand-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center"
          >
            <div className="orb w-72 h-72 bg-purple-600 top-20 left-1/2 -translate-x-1/2 absolute" />
            <div className="relative z-10">
              <div className="text-6xl mb-6 animate-float inline-block">🔮</div>
              <h1 className="font-display text-5xl font-bold text-white mb-4">
                Siap Ketemu <span className="gradient-text">Diri Elu?</span>
              </h1>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                {TOTAL_QUESTIONS} pertanyaan yang dirancang untuk membantu kamu memahami 
                kepribadian, emosi, dan perjalanan self-love kamu.
              </p>

              <div className="glass rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-white mb-4">Sebelum mulai:</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  {[
                    "Tidak ada jawaban benar atau salah — ikuti instinct pertama kamu",
                    "Butuh sekitar 10-15 menit untuk selesai",
                    "Jawab berdasarkan siapa kamu sekarang, bukan siapa yang kamu inginkan",
                    "Hasil kamu akan tersimpan di profil dan bisa dilihat kapan saja",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-purple-400 shrink-0 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={startTest}
                className="btn-primary text-lg px-16 py-4"
              >
                Mulai Tes — {TOTAL_QUESTIONS} Pertanyaan
              </button>
              <p className="text-white/20 text-sm mt-4">100% gratis · Tidak perlu kartu kredit</p>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Test in progress
  if (isSubmitting) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-6 animate-spin-slow">🔮</div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Memproses Hasilmu...
          </h2>
          <p className="text-white/40">Sebentar lagi kamu akan ketemu diri kamu sendiri</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-dark flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full">
          {/* Counter */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-white/30 text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="glass rounded-full px-3 py-1 text-xs text-white/40">
              {currentQuestion?.dimension === "EI" ? "Energi" :
               currentQuestion?.dimension === "SN" ? "Persepsi" :
               currentQuestion?.dimension === "TF" ? "Keputusan" : "Gaya Hidup"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                {/* Scenario */}
                {currentQuestion.scenario && (
                  <div className="glass rounded-xl px-4 py-3 mb-4 text-sm text-white/50 italic border border-purple-500/20">
                    📖 {currentQuestion.scenario}
                  </div>
                )}

                {/* Question */}
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                  {currentQuestion.text}
                </h2>

                {/* Options */}
                <div className="space-y-4">
                  {(["A", "B"] as const).map((choice) => {
                    const option = choice === "A" ? currentQuestion.optionA : currentQuestion.optionB;
                    const isSelected = selectedChoice === choice;

                    return (
                      <motion.button
                        key={choice}
                        onClick={() => handleSelect(choice)}
                        disabled={isAnimating}
                        whileHover={{ scale: isAnimating ? 1 : 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-600/30 to-pink-600/20 border-purple-400/50 shadow-glow"
                            : "glass border-white/10 hover:border-white/25 hover:bg-white/8"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold mt-0.5 transition-colors ${
                            isSelected
                              ? "bg-purple-500 text-white"
                              : "bg-white/10 text-white/50"
                          }`}>
                            {choice}
                          </div>
                          <p className={`text-base leading-relaxed transition-colors ${
                            isSelected ? "text-white" : "text-white/70"
                          }`}>
                            {option.text}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-center text-white/20 text-xs mt-6">
                  Pilih yang paling mencerminkan dirimu
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
