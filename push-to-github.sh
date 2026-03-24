#!/bin/bash

# ============================================
# SIAPA AKU — Push ke GitHub siapaku.id
# ============================================
# 1. Revoke token lama di: https://github.com/settings/tokens
# 2. Buat token baru (Settings → Developer settings → Personal access tokens → Fine-grained)
# 3. Isi GITHUB_TOKEN dan GITHUB_USERNAME di bawah
# 4. Jalankan: chmod +x push-to-github.sh && ./push-to-github.sh

set -e

# ── EDIT INI ─────────────────────────────────
GITHUB_TOKEN="ghp_TOKEN_BARU_KAMU_DISINI"
GITHUB_USERNAME="USERNAME_GITHUB_KAMU"
REPO_NAME="siapaku.id"
# ─────────────────────────────────────────────

BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${BLUE}🚀 Push SIAPA AKU → github.com/${GITHUB_USERNAME}/${REPO_NAME}${NC}"
echo ""

# Cek token diisi
if [[ "$GITHUB_TOKEN" == "ghp_TOKEN_BARU_KAMU_DISINI" ]]; then
  echo -e "${RED}❌ Isi GITHUB_TOKEN dulu di dalam script ini!${NC}"
  exit 1
fi

# Cek username diisi
if [[ "$GITHUB_USERNAME" == "USERNAME_GITHUB_KAMU" ]]; then
  echo -e "${RED}❌ Isi GITHUB_USERNAME dulu di dalam script ini!${NC}"
  exit 1
fi

REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Buat repo via GitHub API
echo -e "${YELLOW}📦 Membuat repository '${REPO_NAME}' di GitHub...${NC}"
HTTP_STATUS=$(curl -s -o /tmp/gh_response.json -w "%{http_code}" \
  -X POST \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"${REPO_NAME}\",
    \"description\": \"🔮 Kenal Diri, Baru Bisa Sayang Diri — Platform self-discovery MBTI\",
    \"private\": false,
    \"auto_init\": false
  }")

if [[ "$HTTP_STATUS" == "201" ]]; then
  echo -e "${GREEN}✅ Repository berhasil dibuat!${NC}"
elif [[ "$HTTP_STATUS" == "422" ]]; then
  echo -e "${YELLOW}⚠️  Repository sudah ada, lanjut push...${NC}"
else
  echo -e "${RED}❌ Gagal buat repo (HTTP $HTTP_STATUS). Cek token & username.${NC}"
  cat /tmp/gh_response.json
  exit 1
fi

# Init git & push
echo -e "${YELLOW}📤 Push ke GitHub...${NC}"

# Cek apakah sudah ada .git
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# Set atau update remote
if git remote get-url origin &>/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git add .
git commit -m "🚀 Initial commit — SIAPA AKU Phase 1 MVP

- Next.js 14 frontend dengan design system glassmorphism
- Express + PostgreSQL backend
- 16 profil MBTI dengan 8 dimensi psikologi
- 100 soal dari bank pertanyaan (60 per sesi, random)
- Google OAuth via NextAuth
- GitHub Actions CI/CD (Vercel + Railway)
- Rate limiting 1x per 7 hari" 2>/dev/null || git commit --allow-empty -m "🚀 Re-push SIAPA AKU"

git push -u origin main --force

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Berhasil push ke GitHub!           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  🔗 Repo: ${BLUE}https://github.com/${GITHUB_USERNAME}/${REPO_NAME}${NC}"
echo ""
echo -e "${YELLOW}Langkah berikutnya:${NC}"
echo -e "  1. Buka repo di GitHub"
echo -e "  2. Settings → Secrets → Actions → tambah secrets"
echo -e "     (lihat SETUP_GITHUB_ACTIONS.md)"
echo -e "  3. Vercel: vercel.com → Import repo → Deploy"
echo -e "  4. Railway: railway.app → New Project → GitHub"
echo ""

# Hapus token dari remote URL (keamanan)
git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
echo -e "${GREEN}🔒 Token dihapus dari git remote (keamanan)${NC}"
