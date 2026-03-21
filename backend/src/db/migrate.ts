import { query } from "./pool";

const migrate = async () => {
  console.log("🔄 Running migrations...");

  // Enable UUID extension
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  // =====================
  // USERS TABLE
  // =====================
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      google_id     VARCHAR(255) UNIQUE NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      nama          VARCHAR(255) NOT NULL,
      no_hp         VARCHAR(20),
      alamat        TEXT,
      tentang_diri  TEXT,
      profile_picture_url TEXT,
      role          VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      is_active     BOOLEAN DEFAULT true,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // =====================
  // TEST RECORDS TABLE
  // =====================
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

  await query(`CREATE INDEX IF NOT EXISTS idx_test_records_user_id ON test_records(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_test_records_test_date ON test_records(test_date DESC)`);

  // =====================
  // ORDERS TABLE
  // =====================
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      order_number           VARCHAR(50) UNIQUE NOT NULL,
      package_type           VARCHAR(20) NOT NULL CHECK (package_type IN ('starter', 'growth', 'premium', 'merchandise')),
      items                  JSONB NOT NULL DEFAULT '[]',
      subtotal               DECIMAL(12,2) NOT NULL DEFAULT 0,
      shipping_cost          DECIMAL(12,2) NOT NULL DEFAULT 0,
      total_price            DECIMAL(12,2) NOT NULL,
      payment_status         VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'expired')),
      midtrans_transaction_id VARCHAR(255),
      midtrans_token         TEXT,
      midtrans_redirect_url  TEXT,
      shipping_name          VARCHAR(255),
      shipping_phone         VARCHAR(20),
      shipping_address       TEXT,
      shipping_city          VARCHAR(100),
      shipping_province      VARCHAR(100),
      shipping_postal_code   VARCHAR(10),
      shipping_courier       VARCHAR(50),
      tracking_number        VARCHAR(100),
      order_status           VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      notes                  TEXT,
      paid_at                TIMESTAMPTZ,
      shipped_at             TIMESTAMPTZ,
      delivered_at           TIMESTAMPTZ,
      created_at             TIMESTAMPTZ DEFAULT NOW(),
      updated_at             TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)`);

  // =====================
  // CERTIFICATES TABLE
  // =====================
  await query(`
    CREATE TABLE IF NOT EXISTS certificates (
      id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
      user_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      test_record_id    UUID REFERENCES test_records(id),
      certificate_code  VARCHAR(50) UNIQUE NOT NULL,
      certificate_type  VARCHAR(20) NOT NULL CHECK (certificate_type IN ('starter', 'growth', 'premium')),
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

  // =====================
  // PRODUCTS TABLE
  // =====================
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name          VARCHAR(255) NOT NULL,
      slug          VARCHAR(255) UNIQUE NOT NULL,
      description   TEXT,
      category      VARCHAR(50) NOT NULL,
      price         DECIMAL(12,2) NOT NULL,
      stock         INTEGER DEFAULT -1,
      images        JSONB DEFAULT '[]',
      is_customizable BOOLEAN DEFAULT false,
      is_active     BOOLEAN DEFAULT true,
      weight_grams  INTEGER DEFAULT 0,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // =====================
  // CERTIFICATE PACKAGES TABLE
  // =====================
  await query(`
    CREATE TABLE IF NOT EXISTS certificate_packages (
      id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name        VARCHAR(50) NOT NULL,
      slug        VARCHAR(50) UNIQUE NOT NULL,
      price       DECIMAL(12,2) NOT NULL,
      features    JSONB NOT NULL DEFAULT '[]',
      is_active   BOOLEAN DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // =====================
  // UPDATED_AT TRIGGER
  // =====================
  await query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql'
  `);

  const triggerTables = ["users", "orders", "products"];
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
