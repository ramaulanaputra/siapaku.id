// ============================================================
// api/payment/route.js — Next.js App Router
// Midtrans Payment Integration + Credit System
// ============================================================
import { NextResponse } from "next/server";

// ── Paket definitions ─────────────────────────────────────────
const TEST_PACKAGES = {
  standar: {
    name: "Paket Standar MBTI",
    price: 99000,
    consultCredits: 0,
    type: "test",
  },
  premium: {
    name: "Paket Premium MBTI",
    price: 199000,
    consultCredits: 1,
    type: "test",
    unlockConsult: true,
  },
  ultimate: {
    name: "Paket Ultimate MBTI",
    price: 399000,
    consultCredits: 2,
    type: "test",
    unlockConsult: true,
  },
};

const CONSULT_PACKAGES = {
  "consult-basic": {
    name: "Basic Service Konsultasi",
    price: 299000,
    sessions: 2,
    type: "consult",
  },
  "consult-premium": {
    name: "Premium Service Konsultasi",
    price: 399000,
    sessions: 3,
    type: "consult",
  },
  "consult-ultimate": {
    name: "Ultimate Service Konsultasi",
    price: 499000,
    sessions: 4,
    type: "consult",
  },
};

const ALL_PACKAGES = { ...TEST_PACKAGES, ...CONSULT_PACKAGES };

// ── Lazy-load heavy deps (only in Node runtime) ──────────────
let _snap = null;
function getSnap() {
  if (!_snap) {
    const midtransClient = require("midtrans-client");
    _snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }
  return _snap;
}

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    const { createClient } = require("@supabase/supabase-js");
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return _supabase;
}

// ── POST /api/payment — Create Midtrans Transaction ──────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { packageId, userId, userEmail, userName, action } = body;

    // Webhook notification handler
    if (action === "notification") {
      return handleNotification(body);
    }

    const pkg = ALL_PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json(
        { error: "Paket tidak ditemukan" },
        { status: 400 }
      );
    }

    const snap = getSnap();
    const supabase = getSupabase();
    const orderId = `ORDER-${Date.now()}-${(userId || "guest").slice(0, 8)}`;

    // Save pending order to DB
    await supabase.from("orders").insert({
      id: orderId,
      user_id: userId,
      package_id: packageId,
      package_name: pkg.name,
      amount: pkg.price,
      status: "pending",
      consult_credits: pkg.consultCredits || pkg.sessions || 0,
      type: pkg.type,
      created_at: new Date().toISOString(),
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: pkg.price,
      },
      customer_details: {
        first_name: userName || "Pengguna",
        email: userEmail,
      },
      item_details: [
        {
          id: packageId,
          price: pkg.price,
          quantity: 1,
          name: pkg.name,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, orderId });
  } catch (err) {
    console.error("Midtrans error:", err);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}

// ── Webhook Notification Handler ─────────────────────────────
async function handleNotification(body) {
  try {
    const snap = getSnap();
    const supabase = getSupabase();

    const notification = await snap.transaction.notification(body);
    const { order_id, transaction_status, fraud_status, payment_type } =
      notification;

    let isPaid = false;
    if (transaction_status === "capture" && fraud_status === "accept")
      isPaid = true;
    if (transaction_status === "settlement") isPaid = true;

    if (!isPaid) {
      if (["cancel", "deny", "expire"].includes(transaction_status)) {
        await supabase
          .from("orders")
          .update({ status: transaction_status })
          .eq("id", order_id);
      }
      return NextResponse.json({ message: "Notification received" });
    }

    // ── Payment SUCCESS ──────────────────────────────────────
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order to paid
    await supabase
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_type,
      })
      .eq("id", order_id);

    // ── Update user profile / credits ────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", order.user_id)
      .single();

    if (profile) {
      const updates = {};
      const credits = order.consult_credits || 0;

      if (order.type === "test") {
        updates.test_package = order.package_id;
        updates.has_pdf_report = ["premium", "ultimate"].includes(
          order.package_id
        );
        updates.has_physical_merch = order.package_id === "ultimate";
        updates.consult_unlocked =
          ["premium", "ultimate"].includes(order.package_id) ||
          profile.consult_unlocked;
      }

      if (credits > 0) {
        updates.consult_credits = (profile.consult_credits || 0) + credits;
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from("profiles")
          .update(updates)
          .eq("id", order.user_id);
      }

      // ── Send confirmation email ──────────────────────────────
      try {
        await sendConfirmationEmail(order, profile, credits);
      } catch (emailErr) {
        console.error("Email error (non-blocking):", emailErr);
      }
    }

    return NextResponse.json({ message: "Payment processed successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// ── Email Sender ─────────────────────────────────────────────
async function sendConfirmationEmail(order, profile, consultCredits) {
  const nodemailer = require("nodemailer");
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const creditsHtml =
    consultCredits > 0
      ? `<p>✅ <strong>${consultCredits}× kredit konsultasi psikolog</strong> telah ditambahkan ke akun kamu! Kredit ini tidak hangus dan bisa digunakan kapan saja.</p>`
      : "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0D0D1A; color: #E5E7EB; }
        .container { max-width: 560px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 32px; text-align: center; }
        .header h1 { margin: 0; color: #fff; font-size: 24px; }
        .body { padding: 32px; }
        .detail-box { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .label { color: #9CA3AF; }
        .value { color: #fff; font-weight: 600; }
        .cta { display: block; background: linear-gradient(135deg, #7C3AED, #4F46E5); color: #fff; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 700; margin-top: 24px; }
        .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Pembayaran Berhasil!</h1>
          <p style="color:rgba(255,255,255,0.7); margin:8px 0 0">Terima kasih telah memilih layanan kami</p>
        </div>
        <div class="body">
          <p>Halo <strong>${profile.name || "Pengguna"}</strong>,</p>
          <p>Pembayaran kamu telah berhasil diverifikasi. Berikut detail pembelianmu:</p>
          
          <div class="detail-box">
            <div class="detail-row">
              <span class="label">Paket</span>
              <span class="value">${order.package_name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Order ID</span>
              <span class="value">${order.id}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Bayar</span>
              <span class="value">Rp ${order.amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          ${creditsHtml}
          
          <p>Kredit dan fitur telah otomatis aktif di akun kamu. Kamu bisa langsung menggunakannya!</p>
          
          <a href="${process.env.APP_URL || "https://siapaku.id"}/profile" class="cta">Lihat Profil Saya →</a>
        </div>
        <div class="footer">
          <p>Email ini dikirim otomatis. Jangan balas email ini.</p>
          <p>© 2025 SIAPA AKU. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"SIAPA AKU" <${process.env.SMTP_USER}>`,
    to: profile.email,
    subject: `✅ Konfirmasi Pembelian - ${order.package_name}`,
    html,
  });
}
