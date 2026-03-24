'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, Brain, Heart, Compass, Shield, RotateCcw } from 'lucide-react'
import { getRandomQuestions, Question } from '@/lib/questions'
import { calculateMBTI } from '@/lib/scoring'
import Link from 'next/link'

const categoryIcons: Record<string, { icon: any; label: string; color: string }> = {
  EI: { icon: Brain, label: 'Energi & Interaksi', color: 'text-purple-500' },
  SN: { icon: Compass, label: 'Cara Melihat Dunia', color: 'text-blue-500' },
  TF: { icon: Heart, label: 'Cara Mengambil Keputusan', color: 'text-pink-500' },
  JP: { icon: Shield, label: 'Gaya Hidup', color: 'text-amber-500' },
}

export default function TestPage() {
  const [phase, setPhase] = useState<'intro'|'test'|'result'>('intro')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 'A'|'B'>>({})
  const [result, setResult] = useState<any>(null)
  const [direction, setDirection] = useState(1)

  const startTest = () => {
    const q = getRandomQuestions(10)
    setQuestions(q)
    setCurrentQ(0)
    setAnswers({})
    setPhase('test')
  }

  const selectAnswer = (choice: 'A'|'B') => {
    const newAnswers = { ...answers, [questions[currentQ].id]: choice }
    setAnswers(newAnswers)
    
    if (currentQ < questions.length - 1) {
      setDirection(1)
      setTimeout(() => setCurrentQ(prev => prev + 1), 300)
    } else {
      const res = calculateMBTI(newAnswers, questions)
      setResult(res)
      setPhase('result')
    }
  }

  const goBack = () => {
    if (currentQ > 0) {
      setDirection(-1)
      setCurrentQ(prev => prev - 1)
    }
  }

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-brand-tan rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Siap Ketemu <span className="gradient-text">Diri Sendiri?</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              10 pertanyaan seru yang akan membantumu mengenal siapa kamu sebenarnya. Nggak ada jawaban benar atau salah — jawab aja sesuai hati. 💙
            </p>

            <div className="card-glass max-w-lg mx-auto mb-8 text-left">
              <h3 className="font-bold text-lg mb-4">📋 Sebelum mulai:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-blue/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-blue flex-shrink-0 mt-0.5">1</span>
                  <span>Jawab sesuai insting pertama, jangan overthinking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-blue/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-blue flex-shrink-0 mt-0.5">2</span>
                  <span>Pilih yang paling relate sama kehidupan sehari-hari</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-blue/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-blue flex-shrink-0 mt-0.5">3</span>
                  <span>Nggak ada jawaban benar atau salah — semua valid!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-blue/10 rounded-full flex items-center justify-center text-xs font-bold text-brand-blue flex-shrink-0 mt-0.5">⏱️</span>
                  <span>Waktu: ~3-5 menit aja</span>
                </li>
              </ul>
            </div>

            <button onClick={startTest} className="btn-primary text-xl px-12 py-5 flex items-center gap-3 mx-auto">
              Mulai Tes <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // RESULT PHASE
  if (phase === 'result' && result) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="w-32 h-32 bg-gradient-to-br from-brand-blue to-brand-tan rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="text-5xl font-extrabold text-white">{result.type}</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Kamu Sudah Ketemu! 🎉</h1>
            <p className="text-lg text-gray-600 mb-8">Tipe kepribadianmu adalah...</p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="card-glass mb-8">
              <h2 className="text-5xl font-extrabold gradient-text mb-4">{result.type}</h2>
              
              {/* Score bars */}
              <div className="space-y-4 mt-8 text-left">
                {Object.entries(result.percentages).map(([key, val]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{key[0]} ({key === 'EI' ? 'Extrovert' : key === 'SN' ? 'Sensing' : key === 'TF' ? 'Thinking' : 'Judging'})</span>
                      <span>{key[1]} ({key === 'EI' ? 'Introvert' : key === 'SN' ? 'Intuition' : key === 'TF' ? 'Feeling' : 'Perceiving'})</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${val.dominant === key[0] ? val.percentage : 100 - val.percentage}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-brand-blue to-brand-tan rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{val.dominant === key[0] ? val.percentage : 100 - val.percentage}%</span>
                      <span>{val.dominant === key[1] ? val.percentage : 100 - val.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/hasil/?type=${result.type}`} className="btn-primary flex items-center gap-2 justify-center">
                Lihat Hasil Lengkap <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={() => { setPhase('intro'); setResult(null) }}
                className="btn-outline flex items-center gap-2 justify-center">
                <RotateCcw className="w-5 h-5" /> Tes Ulang
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // TEST PHASE
  const q = questions[currentQ]
  const catInfo = categoryIcons[q?.category || 'EI']
  const progress = ((currentQ + 1) / questions.length) * 100

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-brand-cream to-amber-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500">Soal {currentQ + 1} dari {questions.length}</span>
            <span className="text-sm font-bold text-brand-blue">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-brand-blue to-brand-tan rounded-full" />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQ}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.3 }}>
            
            {/* Category badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {catInfo && <catInfo.icon className={`w-5 h-5 ${catInfo.color}`} />}
              <span className={`text-sm font-semibold ${catInfo?.color}`}>{catInfo?.label}</span>
            </div>

            {/* Question text */}
            <div className="card-glass text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">{q?.text}</h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {['A', 'B'].map((choice) => {
                const opt = choice === 'A' ? q?.optionA : q?.optionB
                const isSelected = answers[q?.id] === choice
                return (
                  <motion.button key={choice} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => selectAnswer(choice as 'A'|'B')}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-brand-blue bg-brand-blue/10 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-brand-blue/50 hover:shadow-md'
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                        isSelected ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {choice}
                      </div>
                      <span className="text-lg font-medium">{opt?.text}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={goBack} disabled={currentQ === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              currentQ === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-brand-blue hover:bg-blue-50'
            }`}>
            <ArrowLeft className="w-5 h-5" /> Sebelumnya
          </button>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQ ? 'bg-brand-blue scale-125' : answers[questions[i]?.id] ? 'bg-brand-tan' : 'bg-gray-300'
              }`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
