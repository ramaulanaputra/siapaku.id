import { query } from "./pool";

const seed = async () => {
  console.log("🌱 Seeding database...");

  // Certificate Packages
  await query(`
    INSERT INTO certificate_packages (name, slug, price, features) VALUES
    (
      'Starter', 'starter', 19000,
      '["Sertifikat online (PDF)", "Nama & MBTI type kamu", "Barcode verification", "Design shareable social media"]'
    ),
    (
      'Growth', 'growth', 59000,
      '["Sertifikat online (PDF)", "Interactive PDF Report", "Career & romance advice", "Practical planning & strategy", "Design premium", "Barcode verification"]'
    ),
    (
      'Premium', 'premium', 299000,
      '["Physical sertifikat premium", "Physical interactive report book", "1x Tas/Backpack custom", "1x T-Shirt custom", "1x Gelang/Wristband custom", "1x Tumbler custom", "Lifetime digital access"]'
    )
    ON CONFLICT (slug) DO NOTHING
  `);

  // Products / Merchandise
  await query(`
    INSERT INTO products (name, slug, description, category, price, weight_grams, is_customizable, images) VALUES
    (
      'Kartu Psikologi MBTI', 'kartu-psikologi',
      'Card deck berisi tips & insights untuk setiap personality type. 64 kartu berkualitas tinggi.',
      'card', 59000, 200, false,
      '["https://via.placeholder.com/400x400?text=Kartu+Psikologi"]'
    ),
    (
      'Tas/Backpack Custom MBTI', 'tas-backpack-custom',
      'Backpack premium dengan design eksklusif sesuai personality identity kamu.',
      'bag', 199000, 800, true,
      '["https://via.placeholder.com/400x400?text=Backpack+Custom"]'
    ),
    (
      'T-Shirt Custom MBTI', 'tshirt-custom',
      'Kaos comfortable dengan design unik per MBTI type. Material cotton premium.',
      'apparel', 79000, 250, true,
      '["https://via.placeholder.com/400x400?text=T-Shirt+Custom"]'
    ),
    (
      'Gelang/Wristband Custom', 'gelang-custom',
      'Gelang dengan MBTI type & squad color kamu. Bahan premium tahan lama.',
      'accessory', 49000, 50, true,
      '["https://via.placeholder.com/400x400?text=Gelang+Custom"]'
    ),
    (
      'Tumbler Custom MBTI', 'tumbler-custom',
      'Tumbler stainless dengan nama & MBTI identity. Design menarik untuk daily use.',
      'drinkware', 89000, 400, true,
      '["https://via.placeholder.com/400x400?text=Tumbler+Custom"]'
    ),
    (
      'Notebook Self-Discovery', 'notebook',
      'Notebook premium untuk journaling & self-discovery perjalananmu.',
      'stationery', 69000, 300, false,
      '["https://via.placeholder.com/400x400?text=Notebook"]'
    ),
    (
      'Phone Case Custom MBTI', 'phone-case-custom',
      'Phone case dengan design personality-specific yang unik dan personal.',
      'accessory', 79000, 100, true,
      '["https://via.placeholder.com/400x400?text=Phone+Case"]'
    )
    ON CONFLICT (slug) DO NOTHING
  `);

  console.log("✅ Seeding completed successfully");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
