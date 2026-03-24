# 🔑 Setup Google OAuth (Aktifkan Login Google)

## Step 1: Buat Google OAuth Credentials

1. Buka https://console.cloud.google.com/
2. Buat project baru atau pilih yang sudah ada
3. Pergi ke **APIs & Services → Credentials**
4. Klik **Create Credentials → OAuth 2.0 Client IDs**
5. Pilih **Web Application**
6. Isi:
   - **Name**: SIAPA AKU
   - **Authorized JavaScript origins**:
     ```
     https://siapaku.id
     https://your-vercel-app.vercel.app
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     https://siapaku.id/api/auth/callback/google
     https://your-vercel-app.vercel.app/api/auth/callback/google
     http://localhost:3000/api/auth/callback/google
     ```
7. Klik **Create** → copy **Client ID** dan **Client Secret**

---

## Step 2: Set Environment Variables di Vercel

1. Buka https://vercel.com → pilih project frontend kamu
2. Pergi ke **Settings → Environment Variables**
3. Tambahkan:

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `your-client-secret` |
| `NEXTAUTH_SECRET` | Generate dengan: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-vercel-app.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://your-railway-app.railway.app` |

4. Klik **Save** dan **Redeploy**

---

## Step 3: Verifikasi

Buka website → klik login → tombol "Lanjut dengan Google" harus muncul dan berfungsi ✅

---

## ⚠️ Catatan Penting

- `NEXTAUTH_URL` harus sama persis dengan domain produksi kamu
- Jika pakai custom domain (siapaku.id), tambahkan juga ke Google Console
- Jangan lupa tambahkan redirect URI setiap kali domain berubah
