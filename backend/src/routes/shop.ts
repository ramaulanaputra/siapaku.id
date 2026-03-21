import { Router, Request, Response } from "express";
import { query } from "../db/pool";
import { authenticate, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SA-${timestamp}-${random}`;
};

// GET /api/shop/products
router.get("/products", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT id, name, slug, description, category, price, stock, images, is_customizable, weight_grams
       FROM products
       WHERE is_active = true
       ORDER BY category, price ASC`
    );
    res.json({ products: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil produk" });
  }
});

// GET /api/shop/products/:slug
router.get("/products/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT * FROM products WHERE slug = $1 AND is_active = true`,
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Produk tidak ditemukan" });
      return;
    }
    res.json({ product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil produk" });
  }
});

// GET /api/shop/packages
router.get("/packages", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT * FROM certificate_packages WHERE is_active = true ORDER BY price ASC`
    );
    res.json({ packages: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil paket" });
  }
});

// POST /api/shop/orders
// Create a new order
router.post("/orders", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      package_type,
      items,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_province,
      shipping_postal_code,
      shipping_courier,
      notes,
    } = req.body;

    if (!package_type || !items || items.length === 0) {
      res.status(400).json({ error: "Data order tidak lengkap" });
      return;
    }

    // Calculate total from items
    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    }

    // Shipping cost (simplified)
    const shipping_cost = package_type === "premium" || package_type === "merchandise" ? 25000 : 0;
    const total_price = subtotal + shipping_cost;

    const orderNumber = generateOrderNumber();

    const result = await query(
      `INSERT INTO orders (
        user_id, order_number, package_type, items, subtotal, shipping_cost, total_price,
        shipping_name, shipping_phone, shipping_address,
        shipping_city, shipping_province, shipping_postal_code,
        shipping_courier, notes
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        userId, orderNumber, package_type,
        JSON.stringify(items), subtotal, shipping_cost, total_price,
        shipping_name, shipping_phone, shipping_address,
        shipping_city, shipping_province, shipping_postal_code,
        shipping_courier, notes,
      ]
    );

    const order = result.rows[0];

    // TODO: Integrate Midtrans here
    // For now return order with mock payment URL
    res.status(201).json({
      success: true,
      order: {
        ...order,
        payment_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${uuidv4()}`, // Mock
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Gagal buat order" });
  }
});

// GET /api/shop/orders/:orderNumber
router.get("/orders/:orderNumber", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = await query(
      `SELECT * FROM orders WHERE order_number = $1 AND user_id = $2`,
      [req.params.orderNumber, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order tidak ditemukan" });
      return;
    }
    res.json({ order: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil order" });
  }
});

// POST /api/shop/midtrans/webhook
// Midtrans payment notification webhook
router.post("/midtrans/webhook", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      order_id,
      transaction_status,
      fraud_status,
      transaction_id,
    } = req.body;

    // TODO: Validate Midtrans signature key

    let paymentStatus = "pending";
    let orderStatus = "pending";

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || !fraud_status) {
        paymentStatus = "paid";
        orderStatus = "processing";
      }
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      paymentStatus = "failed";
      orderStatus = "cancelled";
    }

    // Find order by order_number (mapped from Midtrans order_id)
    const orderResult = await query(
      `UPDATE orders SET
        payment_status = $1,
        order_status = $2,
        midtrans_transaction_id = $3,
        paid_at = CASE WHEN $1 = 'paid' THEN NOW() ELSE paid_at END,
        updated_at = NOW()
       WHERE order_number = $4
       RETURNING id, user_id, package_type, total_price`,
      [paymentStatus, orderStatus, transaction_id, order_id]
    );

    if (orderResult.rows.length > 0 && paymentStatus === "paid") {
      const order = orderResult.rows[0];
      // Generate certificate for digital packages
      if (["starter", "growth"].includes(order.package_type)) {
        const user = await query(
          `SELECT mbti_type FROM test_records WHERE user_id = $1 ORDER BY test_date DESC LIMIT 1`,
          [order.user_id]
        );
        if (user.rows.length > 0) {
          const certCode = `CERT-${Date.now().toString(36).toUpperCase()}`;
          const verifyCode = uuidv4().replace(/-/g, "").substring(0, 16).toUpperCase();
          await query(
            `INSERT INTO certificates (order_id, user_id, certificate_code, certificate_type, mbti_type, verification_code)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [order.id, order.user_id, certCode, order.package_type, user.rows[0].mbti_type, verifyCode]
          );
        }
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook gagal" });
  }
});

export default router;
