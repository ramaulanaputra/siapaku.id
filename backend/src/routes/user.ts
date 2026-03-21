import { Router, Response } from "express";
import { query } from "../db/pool";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/user/profile
router.get("/profile", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get user data
    const userResult = await query(
      `SELECT id, email, nama, no_hp, alamat, tentang_diri, profile_picture_url, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    const user = userResult.rows[0];

    // Get latest test
    const latestTest = await query(
      `SELECT mbti_type, squad, test_date, next_test_available_date,
              score_ei, score_sn, score_tf, score_jp
       FROM test_records
       WHERE user_id = $1
       ORDER BY test_date DESC
       LIMIT 1`,
      [userId]
    );

    // Get test history (last 10)
    const historyResult = await query(
      `SELECT mbti_type, squad, test_date
       FROM test_records
       WHERE user_id = $1
       ORDER BY test_date DESC
       LIMIT 10`,
      [userId]
    );

    // Get order count
    const orderCount = await query(
      `SELECT COUNT(*) FROM orders WHERE user_id = $1 AND payment_status = 'paid'`,
      [userId]
    );

    // Get certificates
    const certs = await query(
      `SELECT certificate_code, certificate_type, mbti_type, issued_date
       FROM certificates
       WHERE user_id = $1 AND is_valid = true
       ORDER BY issued_date DESC`,
      [userId]
    );

    res.json({
      ...user,
      latestTest: latestTest.rows[0] || null,
      testHistory: historyResult.rows,
      orderCount: parseInt(orderCount.rows[0].count),
      certificates: certs.rows,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Gagal ambil profil" });
  }
});

// PUT /api/user/profile
router.put("/profile", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { nama, no_hp, alamat, tentang_diri } = req.body;

    // Validate input lengths
    if (tentang_diri && tentang_diri.length > 500) {
      res.status(400).json({ error: "Bio maksimal 500 karakter" });
      return;
    }

    const result = await query(
      `UPDATE users SET
        nama = COALESCE($1, nama),
        no_hp = COALESCE($2, no_hp),
        alamat = COALESCE($3, alamat),
        tentang_diri = COALESCE($4, tentang_diri),
        updated_at = NOW()
       WHERE id = $5
       RETURNING id, nama, no_hp, alamat, tentang_diri`,
      [nama, no_hp, alamat, tentang_diri, userId]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Gagal update profil" });
  }
});

// GET /api/user/orders
router.get("/orders", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await query(
      `SELECT id, order_number, package_type, items, total_price,
              payment_status, order_status, created_at, tracking_number
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ orders: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil orders" });
  }
});

// GET /api/user/certificates
router.get("/certificates", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await query(
      `SELECT c.*, o.order_number
       FROM certificates c
       JOIN orders o ON c.order_id = o.id
       WHERE c.user_id = $1 AND c.is_valid = true
       ORDER BY c.issued_date DESC`,
      [userId]
    );

    res.json({ certificates: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil sertifikat" });
  }
});

export default router;
