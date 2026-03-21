import { Router, Response } from "express";
import { query } from "../db/pool";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/test/eligibility
// Check if user can take the test (rate limiting: 1x per 7 days)
router.get("/eligibility", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await query(
      `SELECT next_test_available_date, mbti_type, test_date
       FROM test_records
       WHERE user_id = $1
       ORDER BY test_date DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.json({ canTest: true, firstTime: true });
      return;
    }

    const latest = result.rows[0];
    const nextDate = new Date(latest.next_test_available_date);
    const canTest = nextDate <= new Date();

    res.json({
      canTest,
      nextTestDate: latest.next_test_available_date,
      lastMbtiType: latest.mbti_type,
      lastTestDate: latest.test_date,
    });
  } catch (error) {
    console.error("Eligibility check error:", error);
    res.status(500).json({ error: "Gagal cek eligibilitas" });
  }
});

// POST /api/test/submit
// Submit test results and save to DB
router.post("/submit", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { mbti_type, scores, questions_answered } = req.body;

    if (!mbti_type || !scores) {
      res.status(400).json({ error: "Data tidak lengkap" });
      return;
    }

    // Validate MBTI type
    const validTypes = [
      "INTJ","INTP","ENTJ","ENTP",
      "INFJ","INFP","ENFJ","ENFP",
      "ISTJ","ISFJ","ESTJ","ESFJ",
      "ISTP","ISFP","ESTP","ESFP"
    ];
    if (!validTypes.includes(mbti_type.toUpperCase())) {
      res.status(400).json({ error: "Tipe MBTI tidak valid" });
      return;
    }

    // Check rate limit
    const eligibility = await query(
      `SELECT next_test_available_date FROM test_records
       WHERE user_id = $1
       ORDER BY test_date DESC LIMIT 1`,
      [userId]
    );

    if (eligibility.rows.length > 0) {
      const nextDate = new Date(eligibility.rows[0].next_test_available_date);
      if (nextDate > new Date()) {
        res.status(429).json({
          error: "Belum bisa tes lagi",
          nextTestDate: eligibility.rows[0].next_test_available_date,
        });
        return;
      }
    }

    // Determine squad from MBTI type
    const squadMap: Record<string, string> = {
      ESTP: "Explorer", ESFP: "Explorer", ISTP: "Explorer", ISFP: "Explorer",
      ESTJ: "Guardian", ESFJ: "Guardian", ISTJ: "Guardian", ISFJ: "Guardian",
      ENTJ: "Visionary", ENTP: "Visionary", INTJ: "Visionary", INTP: "Visionary",
      ENFJ: "Harmonizer", ENFP: "Harmonizer", INFJ: "Harmonizer", INFP: "Harmonizer",
    };
    const squad = squadMap[mbti_type.toUpperCase()];

    // Next test available: 7 days from now
    const nextTestDate = new Date();
    nextTestDate.setDate(nextTestDate.getDate() + 7);

    // Save test record
    const result = await query(
      `INSERT INTO test_records
        (user_id, mbti_type, squad, score_ei, score_sn, score_tf, score_jp, questions_answered, detailed_results, next_test_available_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, mbti_type, squad, test_date, next_test_available_date`,
      [
        userId,
        mbti_type.toUpperCase(),
        squad,
        JSON.stringify(scores.EI || {}),
        JSON.stringify(scores.SN || {}),
        JSON.stringify(scores.TF || {}),
        JSON.stringify(scores.JP || {}),
        JSON.stringify(questions_answered || []),
        JSON.stringify(scores),
        nextTestDate.toISOString(),
      ]
    );

    res.status(201).json({
      success: true,
      testRecord: result.rows[0],
    });
  } catch (error) {
    console.error("Test submit error:", error);
    res.status(500).json({ error: "Gagal menyimpan hasil tes" });
  }
});

// GET /api/test/history
// Get user's test history
router.get("/history", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await query(
      `SELECT id, mbti_type, squad, score_ei, score_sn, score_tf, score_jp,
              test_date, next_test_available_date
       FROM test_records
       WHERE user_id = $1
       ORDER BY test_date DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({ history: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil history" });
  }
});

// GET /api/test/stats
// Get aggregate stats (public)
router.get("/stats", async (_, res: Response): Promise<void> => {
  try {
    const totalTests = await query("SELECT COUNT(*) FROM test_records");
    const topTypes = await query(
      `SELECT mbti_type, COUNT(*) as count
       FROM test_records
       GROUP BY mbti_type
       ORDER BY count DESC
       LIMIT 5`
    );
    const topSquads = await query(
      `SELECT squad, COUNT(*) as count
       FROM test_records
       GROUP BY squad
       ORDER BY count DESC`
    );

    res.json({
      totalTests: parseInt(totalTests.rows[0].count),
      topTypes: topTypes.rows,
      squadDistribution: topSquads.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil statistik" });
  }
});

export default router;
