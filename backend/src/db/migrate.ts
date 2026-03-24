import { query } from "./pool";

const migrate = async () => {
  console.log("🔄 Running migrations...");

  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  // USERS
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      google_id             VARCHAR(255) UNIQUE NOT NULL,
      email                 VARCHAR(255) UNIQUE NOT NULL,
      nama                  VARCHAR(255) NOT NULL,
      no_hp                 VARCHAR(20),
      alamat                TEXT,
      tentang_diri          TEXT,
      profile_picture_url   TEXT,
      role                  VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      has_premium_package   BOOLEAN DEFAULT false,
      free_psikolog_session BOOLEAN DEFAULT false,
      consult_credits       INTEGER DEFAULT 0,
      consult_unlocked      BOOLEAN DEFAULT false,
      test_package          VARCHAR(30),
      has_pdf_report        BOOLEAN DEFAULT false,
      has_physical_merch    BOOLEAN DEFAULT false,
      is_active             BOOLEAN DEFAULT true,
      created_at            TIMESTAMPTZ DEFAULT NOW(),
      updated_at            TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Add new columns if upgrading from old schema
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_premium_package BOOLEAN DEFAULT false`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS free_psikolog_session BOOLEAN DEFAULT false`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS consult_credits INTEGER DEFAULT 0`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS consult_unlocked BOOLEAN DEFAULT false`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS test_package VARCHAR(30)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_pdf_report BOOLEAN DEFAULT false`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_physical_merch BOOLEAN DEFAULT false`);

  // Profile detail fields
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS tanggal_lahir DATE`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pekerjaan VARCHAR(100)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS hobby TEXT`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS setauku_aku_ini TEXT`);

  // TEST RECORDS
  await query(`
    CREATE TABLE IF NOT EXISTS test_records (
      id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mbti_type                CHAR(4) NOT NULL,
      squad                    VARCHAR(20) NOT NULL,
      score_ei                 JSONB NOT NULL DEFAULT '{}',
      score_sn                 JSONB NOT NULL DEFAULT '{}',
      score_tf                 JSONB NOT NULL DEFAULT '{}',
      score_jp                 JSONB NOT NULL DEFAULT '{}',
      questions_answered       JSONB NOT NULL DEFAULT '[]',
      detailed_results         JSONB NOT NULL DEFAULT '{}',
      test_date                TIMESTAMPTZ DEFAULT NOW(),
      next_test_available_date TIMESTAMPTZ NOT NULL,
      created_at               TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  // Add new columns for 5-dimension scoring (A/T identity)
  await query(`ALTER TABLE test_records ADD COLUMN IF NOT EXISTS score_at JSONB NOT NULL DEFAULT '{}'`);
  await query(`ALTER TABLE test_records ADD COLUMN IF NOT EXISTS identity CHAR(1) DEFAULT 'A'`);
  await query(`ALTER TABLE test_records ADD COLUMN IF NOT EXISTS full_type VARCHAR(6)`);

  await query(`CREATE INDEX IF NOT EXISTS idx_test_records_user_id ON test_records(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_test_records_test_date ON test_records(test_date DESC)`);

  // ORDERS — updated CHECK constraint to include new package types
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      order_number            VARCHAR(50) UNIQUE NOT NULL,
      package_type            VARCHAR(30) NOT NULL,
      items                   JSONB NOT NULL DEFAULT '[]',
      subtotal                DECIMAL(12,2) NOT NULL DEFAULT 0,
      shipping_cost           DECIMAL(12,2) NOT NULL DEFAULT 0,
      total_price             DECIMAL(12,2) NOT NULL,
      payment_status          VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'expired')),
      midtrans_transaction_id VARCHAR(255),
      midtrans_token          TEXT,
      midtrans_redirect_url   TEXT,
      shipping_name           VARCHAR(255),
      shipping_phone          VARCHAR(20),
      shipping_address        TEXT,
      shipping_city           VARCHAR(100),
      shipping_province       VARCHAR(100),
      shipping_postal_code    VARCHAR(10),
      shipping_courier        VARCHAR(50),
      tracking_number         VARCHAR(100),
      order_status            VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      notes                   TEXT,
      paid_at                 TIMESTAMPTZ,
      shipped_at              TIMESTAMPTZ,
      delivered_at            TIMESTAMPTZ,
      created_at              TIMESTAMPTZ DEFAULT NOW(),
      updated_at              TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Remove old CHECK constraint and make package_type flexible
  await query(`
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_package_type_check
  `).catch(() => {});

  // Migrate old package_type values if upgrading
  await query(`UPDATE orders SET package_type = 'standard' WHERE package_type = 'growth'`).catch(() => {});
  await query(`UPDATE orders SET package_type = 'standard' WHERE package_type = 'starter'`).catch(() => {});

  await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)`);

  // CERTIFICATES
  await query(`
    CREATE TABLE IF NOT EXISTS certificates (
      id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
      user_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      test_record_id    UUID REFERENCES test_records(id),
      certificate_code  VARCHAR(50) UNIQUE NOT NULL,
      certificate_type  VARCHAR(20) NOT NULL CHECK (certificate_type IN ('standard', 'premium')),
      pdf_url           TEXT,
      verification_code VARCHAR(100) UNIQUE NOT NULL,
      mbti_type         CHAR(4) NOT NULL,
      issued_date       TIMESTAMPTZ DEFAULT NOW(),
      valid_until       TIMESTAMPTZ,
      is_valid          BOOLEAN DEFAULT true,
      created_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code)`);

  // PSIKOLOG SESSIONS (used for booking individual sessions from credits)
  await query(`
    CREATE TABLE IF NOT EXISTS psikolog_sessions (
      id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      subscription_id  UUID,
      user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_free_session  BOOLEAN DEFAULT false,
      scheduled_at     TIMESTAMPTZ,
      duration_minutes INTEGER DEFAULT 60,
      status           VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
      notes            TEXT,
      created_at       TIMESTAMPTZ DEFAULT NOW(),
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_psikolog_sessions_user_id ON psikolog_sessions(user_id)`);

  // CONSULT CREDIT LOGS — tracks credit purchases
  await query(`
    CREATE TABLE IF NOT EXISTS consult_credit_logs (
      id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_id       UUID REFERENCES orders(id),
      package_type   VARCHAR(30) NOT NULL,
      credits_added  INTEGER NOT NULL,
      price_paid     DECIMAL(12,2) NOT NULL DEFAULT 0,
      source         VARCHAR(30) DEFAULT 'purchase',
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_consult_credit_logs_user_id ON consult_credit_logs(user_id)`);

  // PRODUCTS
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name            VARCHAR(255) NOT NULL,
      slug            VARCHAR(255) UNIQUE NOT NULL,
      description     TEXT,
      category        VARCHAR(50) NOT NULL,
      price           DECIMAL(12,2) NOT NULL,
      stock           INTEGER DEFAULT -1,
      images          JSONB DEFAULT '[]',
      is_customizable BOOLEAN DEFAULT false,
      is_active       BOOLEAN DEFAULT true,
      weight_grams    INTEGER DEFAULT 0,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Keep psikolog_subscriptions for backwards compat but we don't actively use it
  await query(`
    CREATE TABLE IF NOT EXISTS psikolog_subscriptions (
      id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_id          UUID REFERENCES orders(id),
      plan_type         VARCHAR(30) NOT NULL,
      sessions_per_month INTEGER NOT NULL,
      sessions_used     INTEGER DEFAULT 0,
      sessions_remaining INTEGER NOT NULL,
      period_start      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      period_end        TIMESTAMPTZ NOT NULL,
      is_active         BOOLEAN DEFAULT true,
      created_at        TIMESTAMPTZ DEFAULT NOW(),
      updated_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_psikolog_subs_user_id ON psikolog_subscriptions(user_id)`);

  // UPDATED_AT TRIGGER
  await query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ language 'plpgsql'
  `);

  const triggerTables = ["users", "orders", "products", "psikolog_subscriptions", "psikolog_sessions"];
  for (const table of triggerTables) {
    await query(`DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table}`);
    await query(`
      CREATE TRIGGER update_${table}_updated_at
      BEFORE UPDATE ON ${table}
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
  }

  console.log("✅ All migrations completed successfully");
  process.exit(0);
};

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
