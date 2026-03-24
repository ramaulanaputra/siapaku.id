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

const PSIKOLOG_PLANS: Record<string, { sessions: number; price: number }> = {
  "psikolog-basic":    { sessions: 2, price: 399000 },
  "psikolog-extra":   { sessions: 3, price: 499000 },
  "psikolog-ultimate": { sessions: 4, price: 599000 },
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

    // Check psikolog access — harus punya premium
    if (PSIKOLOG_PLANS[package_type]) {
      const userResult = await query(`SELECT has_premium_package FROM users WHERE id = $1`, [userId]);
      if (!userResult.rows[0]?.has_premium_package) {
        res.status(403).json({ error: "Fitur konsul psikolog hanya untuk pengguna Paket Premium" }); return;
      }
    }

    let subtotal = 0;
    for (const item of items) { subtotal += (item.price || 0) * (item.quantity || 1); }

    const shipping_cost = ["premium", "merchandise"].includes(package_type) ? 25000 : 0;
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

// GET /api/shop/psikolog/status — cek status subscription & sesi gratis
router.get("/psikolog/status", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userResult = await query(
      `SELECT has_premium_package, free_psikolog_session FROM users WHERE id = $1`, [userId]
    );
    const user = userResult.rows[0];

    const activeSub = await query(
      `SELECT * FROM psikolog_subscriptions WHERE user_id = $1 AND is_active = true AND period_end > NOW()
       ORDER BY created_at DESC LIMIT 1`, [userId]
    );

    const freeSessions = await query(
      `SELECT * FROM psikolog_sessions WHERE user_id = $1 AND is_free_session = true AND status != 'cancelled'`,
      [userId]
    );

    res.json({
      has_premium: user?.has_premium_package || false,
      free_session_available: user?.free_psikolog_session || false,
      free_sessions_used: freeSessions.rows.length,
      active_subscription: activeSub.rows[0] || null,
    });
  } catch {
    res.status(500).json({ error: "Gagal ambil status psikolog" });
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

      // Activate premium flag + free psikolog session
      if (order.package_type === "premium") {
        await query(
          `UPDATE users SET has_premium_package=true, free_psikolog_session=true, updated_at=NOW() WHERE id=$1`,
          [order.user_id]
        );
        // Create free session record
        await query(
          `INSERT INTO psikolog_sessions (user_id, is_free_session, status) VALUES ($1, true, 'pending')`,
          [order.user_id]
        );
        // Generate certificate + PDF report
        const lastTest = await query(
          `SELECT mbti_type FROM test_records WHERE user_id=$1 ORDER BY test_date DESC LIMIT 1`,
          [order.user_id]
        );
        if (lastTest.rows.length > 0) {
          const certCode = `CERT-${Date.now().toString(36).toUpperCase()}`;
          const verifyCode = uuidv4().replace(/-/g, "").substring(0, 16).toUpperCase();
          await query(
            `INSERT INTO certificates (order_id, user_id, certificate_code, certificate_type, mbti_type, verification_code)
             VALUES ($1,$2,$3,'premium',$4,$5)`,
            [order.id, order.user_id, certCode, lastTest.rows[0].mbti_type, verifyCode]
          );
        }
      }

      // Standard package — certificate + PDF report
      if (order.package_type === "standard") {
        const lastTest = await query(
          `SELECT mbti_type FROM test_records WHERE user_id=$1 ORDER BY test_date DESC LIMIT 1`,
          [order.user_id]
        );
        if (lastTest.rows.length > 0) {
          const certCode = `CERT-${Date.now().toString(36).toUpperCase()}`;
          const verifyCode = uuidv4().replace(/-/g, "").substring(0, 16).toUpperCase();
          await query(
            `INSERT INTO certificates (order_id, user_id, certificate_code, certificate_type, mbti_type, verification_code)
             VALUES ($1,$2,$3,'standard',$4,$5)`,
            [order.id, order.user_id, certCode, lastTest.rows[0].mbti_type, verifyCode]
          );
        }
      }

      // Psikolog subscription activation
      if (PSIKOLOG_PLANS[order.package_type]) {
        const plan = PSIKOLOG_PLANS[order.package_type];
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        // Deactivate old subscription if any
        await query(
          `UPDATE psikolog_subscriptions SET is_active=false WHERE user_id=$1 AND is_active=true`,
          [order.user_id]
        );
        await query(
          `INSERT INTO psikolog_subscriptions
            (user_id, order_id, plan_type, sessions_per_month, sessions_remaining, period_end)
           VALUES ($1,$2,$3,$4,$4,$5)`,
          [order.user_id, order.id, order.package_type, plan.sessions, periodEnd.toISOString()]
        );
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook gagal" });
  }
});

export default router;
