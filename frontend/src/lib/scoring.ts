import { Question, WEIGHT_SCORES, Dimension } from "./questions";
import { MBTIType } from "./mbtiData";

export interface Answer {
  questionId: number;
  choice: "A" | "B";
}

export interface DimensionScore {
  dimension: Dimension;
  scoreA: number;
  scoreB: number;
  total: number;
  percentage: number;
  result: string;
  strength: "strong" | "moderate" | "slight";
}

export interface TestResult {
  mbtiType: MBTIType;
  scores: Record<Dimension, DimensionScore>;
  completedAt: Date;
}

export function calculateMBTI(questions: Question[], answers: Answer[]): TestResult {
  const scores: Partial<Record<Dimension, DimensionScore>> = {};
  const dimensions: Dimension[] = ["EI", "SN", "TF", "JP"];

  dimensions.forEach((dim) => {
    const dimQuestions = questions.filter((q) => q.dimension === dim);
    let scoreA = 0;
    let scoreB = 0;

    dimQuestions.forEach((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      if (!answer) return;
      const option = answer.choice === "A" ? q.optionA : q.optionB;
      const weight = WEIGHT_SCORES[option.weight];
      if (weight > 0) scoreA += Math.abs(weight);
      else if (weight < 0) scoreB += Math.abs(weight);
    });

    const total = scoreA + scoreB;
    const percentage = total === 0 ? 50 : Math.round((scoreA / total) * 100);
    const resultA = dim === "EI" ? "E" : dim === "SN" ? "S" : dim === "TF" ? "T" : "J";
    const resultB = dim === "EI" ? "I" : dim === "SN" ? "N" : dim === "TF" ? "F" : "P";
    const result = percentage >= 50 ? resultA : resultB;
    const diff = Math.abs(percentage - 50);
    const strength = diff >= 20 ? "strong" : diff >= 10 ? "moderate" : "slight";

    scores[dim] = { dimension: dim, scoreA, scoreB, total, percentage, result, strength };
  });

  const mbtiType = (
    scores["EI"]!.result + scores["SN"]!.result + scores["TF"]!.result + scores["JP"]!.result
  ) as MBTIType;

  return { mbtiType, scores: scores as Record<Dimension, DimensionScore>, completedAt: new Date() };
}

export function getScoreLabel(dimension: Dimension, percentage: number): string {
  const labels: Record<Dimension, [string, string]> = {
    EI: ["Extrovert", "Introvert"],
    SN: ["Sensing", "iNtuition"],
    TF: ["Thinking", "Feeling"],
    JP: ["Judging", "Perceiving"],
  };
  const [a, b] = labels[dimension];
  const diff = Math.abs(percentage - 50);
  const strength = diff >= 20 ? "Sangat " : diff >= 10 ? "" : "Sedikit ";
  return percentage >= 50 ? `${strength}${a}` : `${strength}${b}`;
}
