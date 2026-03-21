#!/bin/bash

# ===========================================
# SIAPA AKU — Setup Script
# ===========================================
# Jalankan: chmod +x setup.sh && ./setup.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔮  SIAPA AKU — Setup Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js tidak ditemukan. Install dulu: https://nodejs.org${NC}"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}❌ Node.js versi 18+ diperlukan. Versi kamu: $(node -v)${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) ditemukan${NC}"

# ===============================
# FRONTEND SETUP
# ===============================
echo ""
echo -e "${YELLOW}📦 Setup Frontend...${NC}"
cd frontend

if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo -e "${YELLOW}⚠️  File frontend/.env.local dibuat dari .env.example${NC}"
  echo -e "${YELLOW}   → Isi dengan credentials Google OAuth kamu!${NC}"
  echo -e "${YELLOW}   → Lihat SETUP_GOOGLE_OAUTH.md untuk panduan lengkap${NC}"
else
  echo -e "${GREEN}✅ frontend/.env.local sudah ada${NC}"
fi

echo -e "${YELLOW}   Installing frontend dependencies...${NC}"
npm install --silent
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd ..

# ===============================
# BACKEND SETUP
# ===============================
echo ""
echo -e "${YELLOW}📦 Setup Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${YELLOW}⚠️  File backend/.env dibuat dari .env.example${NC}"
  echo -e "${YELLOW}   → Isi DATABASE_URL dengan PostgreSQL kamu!${NC}"
else
  echo -e "${GREEN}✅ backend/.env sudah ada${NC}"
fi

echo -e "${YELLOW}   Installing backend dependencies...${NC}"
npm install --silent
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

cd ..

# ===============================
# GIT SETUP
# ===============================
echo ""
echo -e "${YELLOW}🔧 Setup Git repository...${NC}"

if [ ! -d ".git" ]; then
  git init
  echo -e "${GREEN}✅ Git initialized${NC}"
else
  echo -e "${GREEN}✅ Git sudah ter-initialize${NC}"
fi

# ===============================
# SUMMARY
# ===============================
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup selesai!${NC}"
echo ""
echo -e "${YELLOW}Langkah berikutnya:${NC}"
echo ""
echo -e "  1. ${BLUE}Isi credentials di frontend/.env.local${NC}"
echo -e "     (Google OAuth, lihat SETUP_GOOGLE_OAUTH.md)"
echo ""
echo -e "  2. ${BLUE}Isi DATABASE_URL di backend/.env${NC}"
echo -e "     (PostgreSQL local atau Railway)"
echo ""
echo -e "  3. ${BLUE}Jalankan database migration:${NC}"
echo -e "     cd backend && npm run db:migrate && npm run db:seed"
echo ""
echo -e "  4. ${BLUE}Jalankan development server:${NC}"
echo -e "     Terminal 1: cd frontend && npm run dev"
echo -e "     Terminal 2: cd backend && npm run dev"
echo ""
echo -e "  5. ${BLUE}Push ke GitHub:${NC}"
echo -e "     git add . && git commit -m '🚀 Initial commit'"
echo -e "     git remote add origin https://github.com/USERNAME/siapaku.git"
echo -e "     git push -u origin main"
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "  Buka: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""
