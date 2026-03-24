// MBTI Scoring Engine — 7-point Likert Scale with 5 dimensions
// Each answer ranges from -3 (Sangat Tidak Setuju) to +3 (Sangat Setuju)
// Positive score means agreement with the statement's polarity

import { Question, MBTIDimension } from './questions';

export interface Answer {
  questionId: number;
  value: number; // -3 to +3
}

export interface DimensionScore {
  dimension: MBTIDimension;
  poleA: string;      // E, S, T, J, A
  poleB: string;      // I, N, F, P, TU
  scoreA: number;     // raw accumulated score for pole A
  scoreB: number;     // raw accumulated score for pole B
  percentA: number;   // 0-100
  percentB: number;   // 0-100
  dominant: string;   // winning pole letter
}

export interface TestResult {
  dimensions: DimensionScore[];
  mbtiType: string;      // e.g. "INTP"
  identity: string;      // "A" or "T"
  fullType: string;      // e.g. "INTP-A"
  timestamp: number;
}

const DIMENSION_POLES: Record<MBTIDimension, [string, string]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
  AT: ['A', 'TU'],
};

/**
 * Calculate MBTI result from answers
 * 
 * Scoring logic per dimension:
 * - Each question has a polarity (which pole agreeing with it indicates)
 * - Answer value (-3 to +3) is multiplied by direction:
 *   - If polarity matches poleA: positive answer adds to poleA score
 *   - If polarity matches poleB: positive answer adds to poleB score
 * - Percentages are calculated from cumulative raw scores
 */
export function calculateResult(questions: Question[], answers: Answer[]): TestResult {
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));
  
  const dimensions: DimensionScore[] = [];

  for (const [dim, [poleA, poleB]] of Object.entries(DIMENSION_POLES) as [MBTIDimension, [string, string]][]) {
    const dimQuestions = questions.filter(q => q.dimension === dim);
    
    let rawA = 0;
    let rawB = 0;
    let maxPossible = 0;

    for (const q of dimQuestions) {
      const value = answerMap.get(q.id);
      if (value === undefined) continue;
      
      maxPossible += 3; // max per question is 3

      if (q.polarity === poleA) {
        // Agreeing (positive value) → adds to poleA
        if (value > 0) rawA += value;
        else if (value < 0) rawB += Math.abs(value);
      } else {
        // Agreeing (positive value) → adds to poleB
        if (value > 0) rawB += value;
        else if (value < 0) rawA += Math.abs(value);
      }
    }

    // Calculate percentages
    const total = rawA + rawB;
    let percentA: number, percentB: number;
    
    if (total === 0) {
      percentA = 50;
      percentB = 50;
    } else {
      percentA = Math.round((rawA / total) * 100);
      percentB = 100 - percentA;
    }

    // Ensure minimum 1% for non-zero scores
    if (percentA === 0 && rawA > 0) { percentA = 1; percentB = 99; }
    if (percentB === 0 && rawB > 0) { percentB = 1; percentA = 99; }

    const dominant = percentA >= percentB ? poleA : poleB;

    dimensions.push({
      dimension: dim,
      poleA,
      poleB,
      scoreA: rawA,
      scoreB: rawB,
      percentA,
      percentB,
      dominant,
    });
  }

  // Build MBTI type from first 4 dimensions
  const mbtiType = dimensions
    .filter(d => d.dimension !== 'AT')
    .map(d => d.dominant)
    .join('');

  // Identity from AT dimension
  const atDim = dimensions.find(d => d.dimension === 'AT');
  const identity = atDim?.dominant === 'TU' ? 'T' : 'A';
  const fullType = `${mbtiType}-${identity}`;

  return {
    dimensions,
    mbtiType,
    identity,
    fullType,
    timestamp: Date.now(),
  };
}

// Likert scale labels
export const LIKERT_SCALE = [
  { value: -3, label: 'Sangat Tidak Setuju', shortLabel: 'STS', color: '#EF4444' },
  { value: -2, label: 'Tidak Setuju', shortLabel: 'TS', color: '#F97316' },
  { value: -1, label: 'Agak Tidak Setuju', shortLabel: 'ATS', color: '#FBBF24' },
  { value: 0, label: 'Netral', shortLabel: 'N', color: '#9CA3AF' },
  { value: 1, label: 'Agak Setuju', shortLabel: 'AS', color: '#A3E635' },
  { value: 2, label: 'Setuju', shortLabel: 'S', color: '#34D399' },
  { value: 3, label: 'Sangat Setuju', shortLabel: 'SS', color: '#22C55E' },
] as const;

// Dimension display info
export const DIMENSION_INFO: Record<MBTIDimension, { poleALabel: string; poleBLabel: string; poleADesc: string; poleBDesc: string; color: string }> = {
  EI: {
    poleALabel: 'Extraversion',
    poleBLabel: 'Introversion',
    poleADesc: 'Energi dari interaksi sosial',
    poleBDesc: 'Energi dari kesendirian',
    color: '#8B5CF6',
  },
  SN: {
    poleALabel: 'Sensing',
    poleBLabel: 'Intuition',
    poleADesc: 'Fokus pada fakta & detail',
    poleBDesc: 'Fokus pada pola & makna',
    color: '#F59E0B',
  },
  TF: {
    poleALabel: 'Thinking',
    poleBLabel: 'Feeling',
    poleADesc: 'Keputusan berdasarkan logika',
    poleBDesc: 'Keputusan berdasarkan nilai',
    color: '#3B82F6',
  },
  JP: {
    poleALabel: 'Judging',
    poleBLabel: 'Perceiving',
    poleADesc: 'Terstruktur & terencana',
    poleBDesc: 'Fleksibel & spontan',
    color: '#EC4899',
  },
  AT: {
    poleALabel: 'Assertive',
    poleBLabel: 'Turbulent',
    poleADesc: 'Percaya diri & stabil',
    poleBDesc: 'Perfeksionis & growth-driven',
    color: '#10B981',
  },
};
