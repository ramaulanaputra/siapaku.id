# 🔮 SIAPA AKU

<div align="center">

**Kenal Diri, Baru Bisa Sayang Diri**

[![Deploy](https://img.shields.io/github/actions/workflow/status/USERNAME/siapaku/deploy.yml?branch=main&label=deploy&logo=github)](https://github.com/USERNAME/siapaku/actions)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)

[🌐 Live](https://siapaku.id) · [🐛 Bug Report](https://github.com/USERNAME/siapaku/issues)

</div>

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🧪 Tes MBTI Interaktif | 60 soal random dari pool 100, scoring weighted |
| 🧠 8 Dimensi Psikologi | Shadow Work, Self-Love, Love Language, Purpose, dll |
| 👤 Profil Personal | Dashboard + history tes + countdown |
| 🔒 Google OAuth | Login 1 klik, tanpa password |
| ⏱️ Rate Limiting | 1x per 7 hari untuk refleksi bermakna |
| 🏆 Sertifikat Digital | PDF + barcode verification |
| 🛍️ Merchandise Custom | Tas, kaos, tumbler per tipe MBTI |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/USERNAME/siapaku.git
cd siapaku

# Setup otomatis
chmod +x setup.sh && ./setup.sh
```

Isi `frontend/.env.local` dan `backend/.env`, lalu:

```bash
# Terminal 1 — Backend
cd backend && npm run db:migrate && npm run db:seed && npm run dev

# Terminal 2 — Frontend  
cd frontend && npm run dev
```

Buka **http://localhost:3000** 🎉

> 📖 Setup Google OAuth: lihat [SETUP_GOOGLE_OAUTH.md](./SETUP_GOOGLE_OAUTH.md)

---

## ☁️ Deploy Production

### Frontend → Vercel

```bash
cd frontend
npm install -g vercel
vercel login && vercel link
# Tambah env vars di vercel.com dashboard
vercel --prod
```

### Backend → Railway

1. [railway.app](https://railway.app) → New Project → GitHub Repo
2. Root directory: `backend`
3. Add PostgreSQL service → copy `DATABASE_URL`
4. Tambah env vars dari `backend/.env.example`
5. Railway auto-deploy setiap push ✅

### GitHub Actions Auto-Deploy

Tambah secrets di **GitHub → Settings → Secrets → Actions**:

| Secret | Cara Dapat |
|--------|-----------|
| `NEXTAUTH_URL` | URL Vercel kamu |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console |
| `NEXT_PUBLIC_API_URL` | URL Railway backend |
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `RAILWAY_TOKEN` | [railway.app/account/tokens](https://railway.app/account/tokens) |
| `DATABASE_URL` | Dari Railway PostgreSQL service |

Setelah diisi → `git push main` = auto deploy frontend + backend! ✅

---

## 📁 Struktur Project

```
siapaku/
├── frontend/                  # Next.js 14
│   ├── src/app/
│   │   ├── page.tsx           # Homepage
│   │   ├── test/              # Tes MBTI + result
│   │   ├── profile/           # Dashboard user
│   │   ├── shop/              # Sertifikat & merchandise
│   │   ├── about/             # Brand story + FAQ
│   │   ├── verify/            # Verifikasi sertifikat
│   │   └── auth/              # Login + error
│   ├── src/lib/
│   │   ├── mbtiData.ts        # 16 profil MBTI lengkap
│   │   ├── questions.ts       # 100 soal MBTI
│   │   └── scoring.ts         # Weighted scoring algorithm
│   └── vercel.json
│
├── backend/                   # Express + PostgreSQL
│   ├── src/db/
│   │   ├── migrate.ts         # Schema migrations
│   │   └── seed.ts            # Data awal
│   ├── src/routes/
│   │   ├── auth.ts            # Google OAuth sync
│   │   ├── test.ts            # Tes MBTI API
│   │   ├── user.ts            # Profile CRUD
│   │   └── shop.ts            # Orders + webhook
│   └── railway.json
│
└── .github/workflows/
    ├── deploy.yml             # CI/CD (lint → build → deploy)
    └── migrate.yml            # Manual DB migration
```

---

## 🌐 API Endpoints

```
# Auth
POST /api/auth/google              Sync user Google → DB
GET  /api/auth/verify/:code        Verifikasi sertifikat

# Test MBTI
GET  /api/test/eligibility         Cek bisa tes? (auth)
POST /api/test/submit              Submit hasil tes
GET  /api/test/history             History tes user
GET  /api/test/stats               Statistik publik

# User
GET  /api/user/profile             Profil + history + certs
PUT  /api/user/profile             Update profil
GET  /api/user/orders              Riwayat order

# Shop
GET  /api/shop/products            Katalog merchandise
GET  /api/shop/packages            Paket sertifikat
POST /api/shop/orders              Buat order
POST /api/shop/midtrans/webhook    Payment notification
```

---

## 💰 Harga

| Paket | Harga | Isi |
|-------|-------|-----|
| 🎓 Starter | Rp 19.000 | Sertifikat PDF + barcode |
| 🌱 Growth | Rp 59.000 | Sertifikat + Interactive Report |
| 👑 Premium | Rp 299.000 | Physical + 4 merchandise custom |

---

## 🧬 MBTI + 4 Squad

| Squad | Warna | Types |
|-------|-------|-------|
| 🚀 Explorer | Biru Elektrik | ESTP, ESFP, ISTP, ISFP |
| 🛡️ Guardian | Kuning Hangat | ESTJ, ESFJ, ISTJ, ISFJ |
| 🎓 Visionary | Ungu Dalam | ENTJ, ENTP, INTJ, INTP |
| 🌟 Harmonizer | Rose Gold | ENFJ, ENFP, INFJ, INFP |

---

## 🗺️ Roadmap

- [x] Phase 1 — MVP (Tes, Profil, Shop, Auth, CI/CD)
- [ ] Phase 2 — Payment (Midtrans, PDF cert, Email)
- [ ] Phase 3 — Growth (Sharing, Analytics, Mobile App)

---

## 📞 Kontak

📧 hello@siapaku.id · 📸 @siapaku.id · 🌐 siapaku.id

---

<div align="center">
Dibuat dengan 💜 untuk Indonesia
</div>
