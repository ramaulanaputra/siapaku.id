import { Router, Request, Response } from "express";
import { query } from "../db/pool";
import { authenticate, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SA-${timestamp}-${random}`;
};

/* ─────────────────────────────────────────────
   Package definitions
   ───────────────────────────────────────────── */

// Test packages
const TEST_PACKAGES: Record<string, { name: string; price: number; consultCredits: number; unlockConsult: boolean }> = {
  standard:  { name: "Paket Standar",  price: 99000,  consultCredits: 0, unlockConsult: false },
  premium:   { name: "Paket Premium",  price: 199000, consultCredits: 1, unlockConsult: true },
  ultimate:  { name: "Paket Ultimate", price: 399000, consultCredits: 2, unlockConsult: true },
};

// Consultation credit packages (one-time purchase, NOT subscription)
const CONSULT_PACKAGES: Record<string, { name: string; price: number; sessions: number }> = {
  "consult-basic":    { name: "Basic Service Konsultasi",    price: 299000, sessions: 2 },
  "consult-premium":  { name: "Premium Service Konsultasi",  price: 399000, sessions: 3 },
  "consult-ultimate": { name: "Ultimate Service Konsultasi", price: 499000, sessions: 4 },
};

// GET /api/shop/products
router.get("/products", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT id, name, slug, description, category, price, stock, images, is_customizable, weight_grams
       FROM products WHERE is_active = true ORDER BY category, price ASC`
    );
    res.json({ products: result.rows });
  } catch {
    res.status(500).json({ error: "Gagal ambil produk" });
  }
});

// GET /api/shop/products/:slug
router.get("/products/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(`SELECT * FROM products WHERE slug = $1 AND is_active = true`, [req.params.slug]);
    if (result.rows.length === 0) { res.status(404).json({ error: "Produk tidak ditemukan" }); return; }
    res.json({ product: result.rows[0] });
  } catch {
    res.status(500).json({ error: "Gagal ambil produk" });
  }
});

// POST /api/shop/orders
router.post("/orders", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { package_type, items, shipping_name, shipping_phone, shipping_address,
            shipping_city, shipping_province, shipping_postal_code, shipping_courier, notes } = req.body;

    if (!package_type || !items || items.length === 0) {
      res.status(400).json({ error: "Data order tidak lengkap" }); return;
    }

    // Consult credit packages require consult_unlocked
    if (CONSULT_PACKAGES[package_type]) {
      const userResult = await query(`SELECT consult_unlocked FROM users WHERE id = $1`, [userId]);
      if (!userResult.rows[0]?.consult_unlocked) {
        res.status(403).json({ error: "Fitur konsul psikolog hanya untuk pengguna Paket Premium / Ultimate. Beli paket terlebih dahulu." }); return;
      }
    }

    let subtotal = 0;
    for (const item of items) { subtotal += (item.price || 0) * (item.quantity || 1); }

    const needsShipping = ["ultimate", "merchandise"].includes(package_type);
    const shipping_cost = needsShipping ? 25000 : 0;
    const total_price = subtotal + shipping_cost;
    const orderNumber = generateOrderNumber();

    const result = await query(
      `INSERT INTO orders (user_id, order_number, package_type, items, subtotal, shipping_cost, total_price,
        shipping_name, shipping_phone, shipping_address, shipping_city, shipping_province,
        shipping_postal_code, shipping_courier, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [userId, orderNumber, package_type, JSON.stringify(items), subtotal, shipping_cost, total_price,
       shipping_name, shipping_phone, shipping_address, shipping_city, shipping_province,
       shipping_postal_code, shipping_courier, notes]
    );

    const order = result.rows[0];
    res.status(201).json({
      success: true,
      order: { ...order, payment_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${uuidv4()}` },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Gagal buat order" });
  }
});

// GET /api/shop/orders/:orderNumber
router.get("/orders/:orderNumber", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT * FROM orders WHERE order_number = $1 AND user_id = $2`,
      [req.params.orderNumber, req.user!.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: "Order tidak ditemukan" }); return; }
    res.json({ order: result.rows[0] });
  } catch {
    res.status(500).json({ error: "Gagal ambil order" });
  }
});

// GET /api/shop/consult/status — check consult credits & access
router.get("/consult/status", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userResult = await query(
      `SELECT consult_unlocked, consult_credits FROM users WHERE id = $1`, [userId]
    );
    const user = userResult.rows[0];

    const sessionsUsed = await query(
      `SELECT COUNT(*) FROM psikolog_sessions WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );

    res.json({
      consult_unlocked: user?.consult_unlocked || false,
      consult_credits: user?.consult_credits || 0,
      sessions_used: parseInt(sessionsUsed.rows[0].count),
    });
  } catch {
    res.status(500).json({ error: "Gagal ambil status konsultasi" });
  }
});

// POST /api/shop/midtrans/webhook
router.post("/midtrans/webhook", async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id, transaction_status, fraud_status, transaction_id } = req.body;

    let paymentStatus = "pending";
    let orderStatus = "pending";

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || !fraud_status) {
        paymentStatus = "paid";
        orderStatus = "processing";
      }
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      paymentStatus = "failed";
      orderStatus = "cancelled";
    }

    const orderResult = await query(
      `UPDATE orders SET payment_status=$1, order_status=$2, midtrans_transaction_id=$3,
        paid_at = CASE WHEN $1='paid' THEN NOW() ELSE paid_at END, updated_at=NOW()
       WHERE order_number=$4 RETURNING id, user_id, package_type, total_price`,
      [paymentStatus, orderStatus, transaction_id, order_id]
    );

    if (orderResult.rows.length > 0 && paymentStatus === "paid") {
      const order = orderResult.rows[0];
      const userId = order.user_id;

      // ── Test package activation ──────────────────────────
      if (TEST_PACKAGES[order.package_type]) {
        const pkg = TEST_PACKAGES[order.package_type];
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        // Set test_package
        updates.push(`test_package = $${paramIndex++}`);
        values.push(order.package_type);

        // PDF report for premium & ultimate
        if (["premium", "ultimate"].includes(order.package_type)) {
          updates.push(`has_pdf_report = true`);
        }

        // Physical merch for ultimate
        if (order.package_type === "ultimate") {
          updates.push(`has_physical_merch = true`);
        }

        // Unlock consult for premium & ultimate
        if (pkg.unlockConsult) {
          updates.push(`consult_unlocked = true`);
        }

        // Add bonus consult credits
        if (pkg.consultCredits > 0) {
          updates.push(`consult_credits = COALESCE(consult_credits, 0) + $${paramIndex++}`);
          values.push(pkg.consultCredits);
        }

        updates.push(`updated_at = NOW()`);
        values.push(userId);

        await query(
          `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
          values
        );

        // Generate certificate
        const lastTest = await query(
          `SELECT mbti_type FROM test_records WHERE user_id=$1 ORDER BY test_date DESC LIMIT 1`,
          [userId]
        );
        if (lastTest.rows.length > 0) {
          const certCode = `CERT-${Date.now().toString(36).toUpperCase()}`;
          const verifyCode = uuidv4().replace(/-/g, "").substring(0, 16).toUpperCase();
          const certType = ["premium", "ultimate"].includes(order.package_type) ? "premium" : "standard";
          await query(
            `INSERT INTO certificates (order_id, user_id, certificate_code, certificate_type, mbti_type, verification_code)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [order.id, userId, certCode, certType, lastTest.rows[0].mbti_type, verifyCode]
          );
        }
      }

      // ── Consultation credit package ──────────────────────
      if (CONSULT_PACKAGES[order.package_type]) {
        const pkg = CONSULT_PACKAGES[order.package_type];

        // Add credits to user profile
        await query(
          `UPDATE users SET consult_credits = COALESCE(consult_credits, 0) + $1, updated_at = NOW() WHERE id = $2`,
          [pkg.sessions, userId]
        );

        // Log the credit purchase
        await query(
          `INSERT INTO consult_credit_logs (user_id, order_id, package_type, credits_added, price_paid)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, order.id, order.package_type, pkg.sessions, pkg.sessions * 100000]
        ).catch(() => {
          // Table might not exist yet, that's okay
        });
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook gagal" });
  }
});

export default router;
