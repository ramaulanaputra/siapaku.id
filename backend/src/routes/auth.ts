import { Router, Request, Response } from "express";
import { query } from "../db/pool";
import jwt from "jsonwebtoken";

const router = Router();

// POST /api/auth/google
// Called from NextAuth signIn callback to sync user to our DB
router.post("/google", async (req: Request, res: Response): Promise<void> => {
  try {
    const { google_id, email, nama, profile_picture_url } = req.body;

    if (!google_id || !email) {
      res.status(400).json({ error: "google_id dan email diperlukan" });
      return;
    }

    // Upsert user — insert or update
    const result = await query(
      `INSERT INTO users (google_id, email, nama, profile_picture_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE SET
         email = EXCLUDED.email,
         nama = COALESCE(EXCLUDED.nama, users.nama),
         profile_picture_url = COALESCE(EXCLUDED.profile_picture_url, users.profile_picture_url),
         updated_at = NOW()
       RETURNING id, google_id, email, nama, role`,
      [google_id, email, nama, profile_picture_url]
    );

    const user = result.rows[0];

    // Generate internal JWT
    const token = jwt.sign(
      { id: user.id, google_id: user.google_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "siapaku-secret-key-change-in-prod",
      { expiresIn: "30d" }
    );

    res.json({ user, token });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Auth gagal" });
  }
});

// GET /api/auth/verify
// Verify certificate by code
router.get("/verify/:code", async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const result = await query(
      `SELECT c.*, u.nama, u.email
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       WHERE c.verification_code = $1 AND c.is_valid = true`,
      [code]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Sertifikat tidak ditemukan atau tidak valid" });
      return;
    }

    const cert = result.rows[0];
    res.json({
      valid: true,
      certificate: {
        code: cert.certificate_code,
        mbti_type: cert.mbti_type,
        type: cert.certificate_type,
        owner: cert.nama,
        issued_date: cert.issued_date,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Verifikasi gagal" });
  }
});

export default router;
