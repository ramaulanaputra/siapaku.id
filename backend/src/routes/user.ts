import { Router, Response } from "express";
import { query } from "../db/pool";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/user/profile
router.get("/profile", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get user data including credit system fields
    const userResult = await query(
      `SELECT id, email, nama, no_hp, alamat, tentang_diri, profile_picture_url,
              consult_credits, consult_unlocked, test_package,
              has_pdf_report, has_physical_merch,
              username, tanggal_lahir, pekerjaan, hobby, setauku_aku_ini,
              created_at
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
      consult_credits: user.consult_credits || 0,
      consult_unlocked: user.consult_unlocked || false,
      test_package: user.test_package || null,
      has_pdf_report: user.has_pdf_report || false,
      has_physical_merch: user.has_physical_merch || false,
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
    const { nama, no_hp, alamat, tentang_diri, username, tanggal_lahir, pekerjaan, hobby, setauku_aku_ini } = req.body;

    if (tentang_diri && tentang_diri.length > 500) {
      res.status(400).json({ error: "Bio maksimal 500 karakter" });
      return;
    }

    if (setauku_aku_ini && setauku_aku_ini.length > 1000) {
      res.status(400).json({ error: "Setauku aku ini maksimal 1000 karakter" });
      return;
    }

    // Check username uniqueness if provided
    if (username) {
      if (username.length < 3 || username.length > 50) {
        res.status(400).json({ error: "Username harus 3-50 karakter" });
        return;
      }
      if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        res.status(400).json({ error: "Username hanya boleh huruf, angka, titik, underscore, atau strip" });
        return;
      }
      const existing = await query(
        `SELECT id FROM users WHERE username = $1 AND id != $2`,
        [username.toLowerCase(), userId]
      );
      if (existing.rows.length > 0) {
        res.status(400).json({ error: "Username sudah dipakai" });
        return;
      }
    }

    const result = await query(
      `UPDATE users SET
        nama = COALESCE($1, nama),
        no_hp = COALESCE($2, no_hp),
        alamat = COALESCE($3, alamat),
        tentang_diri = COALESCE($4, tentang_diri),
        username = COALESCE($5, username),
        tanggal_lahir = COALESCE($6, tanggal_lahir),
        pekerjaan = COALESCE($7, pekerjaan),
        hobby = COALESCE($8, hobby),
        setauku_aku_ini = COALESCE($9, setauku_aku_ini),
        updated_at = NOW()
       WHERE id = $10
       RETURNING id, nama, no_hp, alamat, tentang_diri, username, tanggal_lahir, pekerjaan, hobby, setauku_aku_ini`,
      [nama, no_hp, alamat, tentang_diri, username?.toLowerCase(), tanggal_lahir, pekerjaan, hobby, setauku_aku_ini, userId]
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

// GET /api/user/consult-credits — dedicated endpoint for credit balance
router.get("/consult-credits", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const userResult = await query(
      `SELECT consult_credits, consult_unlocked FROM users WHERE id = $1`,
      [userId]
    );

    const sessionsResult = await query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'completed') as sessions_completed,
        COUNT(*) FILTER (WHERE status = 'scheduled') as sessions_scheduled,
        COUNT(*) FILTER (WHERE status = 'pending') as sessions_pending
       FROM psikolog_sessions WHERE user_id = $1`,
      [userId]
    );

    const purchaseHistory = await query(
      `SELECT o.package_type, o.total_price, o.created_at
       FROM orders o
       WHERE o.user_id = $1
         AND o.payment_status = 'paid'
         AND o.package_type IN ('consult-basic', 'consult-premium', 'consult-ultimate')
       ORDER BY o.created_at DESC
       LIMIT 10`,
      [userId]
    );

    const user = userResult.rows[0];
    const stats = sessionsResult.rows[0];

    res.json({
      consult_unlocked: user?.consult_unlocked || false,
      consult_credits: user?.consult_credits || 0,
      sessions_completed: parseInt(stats?.sessions_completed || "0"),
      sessions_scheduled: parseInt(stats?.sessions_scheduled || "0"),
      sessions_pending: parseInt(stats?.sessions_pending || "0"),
      purchase_history: purchaseHistory.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil data kredit konsultasi" });
  }
});

export default router;
