# ⚙️ Setup GitHub Actions — Panduan Lengkap

Setelah repo di-push ke GitHub, ikuti langkah ini agar auto-deploy jalan.

---

## 🔑 Daftar Secrets yang Diperlukan

| Secret | Contoh Nilai | Dari Mana |
|--------|-------------|-----------|
| `NEXTAUTH_URL` | `https://siapaku.vercel.app` | URL Vercel kamu |
| `NEXTAUTH_SECRET` | `abc123...` (32+ chars) | Generate sendiri |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Google Cloud Console |
| `NEXT_PUBLIC_API_URL` | `https://siapaku-backend.up.railway.app` | Railway |
| `VERCEL_TOKEN` | `xxx` | Vercel Dashboard |
| `RAILWAY_TOKEN` | `xxx` | Railway Dashboard |
| `DATABASE_URL` | `postgresql://...` | Railway PostgreSQL |

---

## Langkah 1 — Generate NEXTAUTH_SECRET

```bash
# Di terminal kamu:
openssl rand -base64 32

# Output contoh:
# K8mPqR2sT4vW6xY8zA0bC2dE4fG6hI8jK0lM2nO4pQ=
```

Atau pakai: https://generate-secret.vercel.app/32

---

## Langkah 2 — Dapat Vercel Token

1. Buka https://vercel.com/account/tokens
2. Klik **"Create Token"**
3. Name: `siapaku-github-actions`
4. Scope: **Full Account**
5. Expiration: **No expiration**
6. Copy token yang muncul (hanya tampil sekali!)

---

## Langkah 3 — Setup Vercel Project & Dapat Project ID

```bash
# Di folder frontend:
cd frontend
npm install -g vercel
vercel login
vercel link   # Ikuti prompt, buat project baru bernama "siapaku"
```

Setelah `vercel link`, buka file `.vercel/project.json`:
```json
{
  "orgId": "team_xxxxxxxxxxxx",    ← ini VERCEL_ORG_ID
  "projectId": "prj_xxxxxxxxxxxx"  ← ini VERCEL_PROJECT_ID
}
```

**Tambahkan ke GitHub Secrets:**
- `VERCEL_ORG_ID` = nilai `orgId`
- `VERCEL_PROJECT_ID` = nilai `projectId`

> ⚠️ File `.vercel/project.json` sudah di-gitignore, jadi aman

---

## Langkah 4 — Dapat Railway Token

1. Buka https://railway.app/account/tokens
2. Klik **"Create Token"**
3. Name: `siapaku-github-actions`
4. Copy token

---

## Langkah 5 — Setup Railway Project

1. Buka https://railway.app → **New Project**
2. **Deploy from GitHub Repo** → pilih `siapaku`
3. Root directory: `backend`
4. Klik **Add Variables** → masukkan semua vars dari `backend/.env.example`
5. Klik **+ New** → **Database** → **Add PostgreSQL**
6. Di PostgreSQL service → **Variables** → copy `DATABASE_URL`
7. Paste `DATABASE_URL` ke backend service variables

Dari Railway project URL kamu bisa dapat service name untuk workflow:
```
https://railway.app/project/xxx/service/yyy
```
Service name biasanya `siapaku-backend` (sesuaikan di `deploy.yml` jika berbeda).

---

## Langkah 6 — Tambah Semua Secrets ke GitHub

1. Buka repo di GitHub
2. Klik **Settings** (tab atas)
3. Sidebar kiri: **Secrets and variables** → **Actions**
4. Klik **"New repository secret"** untuk setiap secret:

```
NEXTAUTH_URL          = https://siapaku.vercel.app
NEXTAUTH_SECRET       = [hasil openssl rand]
GOOGLE_CLIENT_ID      = [dari Google Console]
GOOGLE_CLIENT_SECRET  = [dari Google Console]
NEXT_PUBLIC_API_URL   = https://siapaku-backend.up.railway.app
VERCEL_TOKEN          = [dari Vercel]
VERCEL_ORG_ID         = [dari .vercel/project.json]
VERCEL_PROJECT_ID     = [dari .vercel/project.json]
RAILWAY_TOKEN         = [dari Railway]
DATABASE_URL          = [dari Railway PostgreSQL]
```

---

## Langkah 7 — Test Workflow

```bash
# Push perubahan kecil ke main:
git add .
git commit -m "test: trigger CI/CD"
git push origin main
```

Buka **GitHub → Actions tab** → lihat workflow berjalan.

Urutan yang benar:
```
🔍 Lint Frontend  ─┐
🔍 Lint Backend   ─┤→ 🏗️ Build Frontend ─┐
                    └→ 🏗️ Build Backend  ─┤→ 🌐 Deploy Frontend → Vercel
                                           └→ 🛠️ Deploy Backend  → Railway
```

---

## Troubleshooting

### Error: "Invalid token" (Vercel)
→ Cek VERCEL_TOKEN sudah benar dan belum expired

### Error: "Project not found" (Vercel)  
→ Pastikan VERCEL_ORG_ID dan VERCEL_PROJECT_ID sudah diisi

### Error: "Service not found" (Railway)
→ Ganti `siapaku-backend` di `deploy.yml` dengan nama service kamu yang sebenarnya

### Error: TypeScript di CI tapi lokal fine
→ Pastikan `NEXTAUTH_SECRET` di secrets minimal 32 karakter

### Build gagal karena env vars
→ Semua vars dari `.env.example` harus ada di GitHub Secrets

---

## ✅ Checklist Final

- [ ] `NEXTAUTH_SECRET` sudah diisi (min 32 chars)
- [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` valid
- [ ] `VERCEL_TOKEN` diisi & project sudah di-link
- [ ] `VERCEL_ORG_ID` & `VERCEL_PROJECT_ID` dari `.vercel/project.json`
- [ ] `RAILWAY_TOKEN` diisi
- [ ] `DATABASE_URL` dari Railway PostgreSQL sudah dipaste ke backend service
- [ ] `NEXT_PUBLIC_API_URL` = URL Railway backend kamu
- [ ] Workflow pertama berhasil hijau ✅

---

## 🔄 Workflow Manual — Database Migration

Jika perlu jalankan migration secara manual (misal setelah schema berubah):

1. GitHub → **Actions** tab
2. Pilih **"Database Migration"** workflow
3. Klik **"Run workflow"**
4. Pilih `environment: production` dan `action: migrate`
5. Klik **Run workflow**

Migration akan jalan di Railway environment kamu secara aman.
