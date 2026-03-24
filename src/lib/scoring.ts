export interface ScoreResult {
  type: string
  scores: { E:number; I:number; S:number; N:number; T:number; F:number; J:number; P:number }
  percentages: {
    EI: { dominant: string; percentage: number }
    SN: { dominant: string; percentage: number }
    TF: { dominant: string; percentage: number }
    JP: { dominant: string; percentage: number }
  }
}

export function calculateMBTI(answers: Record<number, 'A'|'B'>, questions: any[]): ScoreResult {
  const scores = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 }
  questions.forEach(q => {
    const a = answers[q.id]
    if (!a) return
    const opt = a === 'A' ? q.optionA : q.optionB
    Object.entries(opt.scores).forEach(([k, v]) => { scores[k as keyof typeof scores] += v as number })
  })
  const pct = (a: number, b: number) => { const t = a+b; return t === 0 ? 50 : Math.round((Math.max(a,b)/t)*100) }
  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('')
  return {
    type, scores,
    percentages: {
      EI: { dominant: scores.E >= scores.I ? 'E':'I', percentage: pct(scores.E, scores.I) },
      SN: { dominant: scores.S >= scores.N ? 'S':'N', percentage: pct(scores.S, scores.N) },
      TF: { dominant: scores.T >= scores.F ? 'T':'F', percentage: pct(scores.T, scores.F) },
      JP: { dominant: scores.J >= scores.P ? 'J':'P', percentage: pct(scores.J, scores.P) },
    }
  }
}
