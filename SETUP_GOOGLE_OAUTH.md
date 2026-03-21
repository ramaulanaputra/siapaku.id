# 🔑 Setup Google OAuth — Panduan Lengkap

## Langkah 1: Buat Google Cloud Project

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Klik **"Select a project"** → **"New Project"**
3. Nama project: `siapaku-prod` → Klik **Create**
4. Tunggu project dibuat, lalu pastikan sudah terpilih

---

## Langkah 2: Aktifkan Google+ API

1. Di sidebar, klik **"APIs & Services"** → **"Library"**
2. Search: `Google People API`
3. Klik **Enable**

---

## Langkah 3: Buat OAuth Consent Screen

1. Di sidebar, klik **"APIs & Services"** → **"OAuth consent screen"**
2. Pilih **External** → Klik **Create**
3. Isi form:
   - **App name**: `SIAPA AKU`
   - **User support email**: `hello@siapaku.id`
   - **App logo**: upload logo (opsional)
   - **App domain**: `siapaku.id`
   - **Authorized domains**: tambahkan `siapaku.id`
   - **Developer contact email**: email kamu
4. Klik **Save and Continue**
5. Di **Scopes**: klik **Add or Remove Scopes**
   - Centang: `email`, `profile`, `openid`
   - Klik **Update** → **Save and Continue**
6. Di **Test users** (untuk development): tambahkan email kamu
7. Klik **Save and Continue** → **Back to Dashboard**

---

## Langkah 4: Buat OAuth Client ID

1. Di sidebar, klik **"APIs & Services"** → **"Credentials"**
2. Klik **"+ Create Credentials"** → **"OAuth Client ID"**
3. **Application type**: `Web application`
4. **Name**: `SIAPA AKU Web`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://siapaku.id
   https://siapaku-xxx.vercel.app
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://siapaku.id/api/auth/callback/google
   https://siapaku-xxx.vercel.app/api/auth/callback/google
   ```
7. Klik **Create**

---

## Langkah 5: Simpan Credentials

Setelah create, kamu akan mendapat:
```
Client ID:     xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ JANGAN pernah commit credentials ini ke GitHub!**

---

## Langkah 6: Set Environment Variables

### Untuk Development (frontend/.env.local):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gunakan-openssl-rand-base64-32-untuk-generate-ini
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Generate NEXTAUTH_SECRET:
```bash
# Di terminal:
openssl rand -base64 32
# Atau online: https://generate-secret.vercel.app/32
```

### Untuk Production (di Vercel Dashboard):
```
NEXTAUTH_URL          = https://siapaku.id
NEXTAUTH_SECRET       = [generated secret]
GOOGLE_CLIENT_ID      = [dari Google Console]
GOOGLE_CLIENT_SECRET  = [dari Google Console]
NEXT_PUBLIC_API_URL   = https://api.siapaku.id
```

---

## Langkah 7: Test Login

1. Jalankan `npm run dev` di folder frontend
2. Buka `http://localhost:3000`
3. Klik "Masuk dengan Google"
4. Harus redirect ke Google login, lalu balik ke app

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
→ Pastikan URL di Google Console **persis sama** dengan yang di app

### Error: "invalid_client"
→ GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET salah

### Error: "access_blocked"
→ App masih "Testing". Tambahkan email kamu sebagai Test User, atau submit untuk verification

### Untuk Production
Setelah app siap, submit OAuth Consent Screen untuk Google verification:
1. Di OAuth Consent Screen → klik **"Publish App"**
2. Isi verification form
3. Tunggu review Google (biasanya 1-3 hari untuk app sederhana)
