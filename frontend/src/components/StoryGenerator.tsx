"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestResult, DimensionScore, DIMENSION_INFO } from "@/lib/scoring";
import { MBTI_PROFILES, MBTIType, getSquadColor, getSquadEmoji } from "@/lib/mbtiData";
import type { MBTIDimension } from "@/lib/questions";

interface StoryGeneratorProps {
  mbtiType: MBTIType;
  identity: string;
  userName?: string;
  dimensions: DimensionScore[];
}

/* ─── Squad gradient maps ─── */
const SQUAD_GRADIENTS: Record<string, [string, string, string]> = {
  Explorer:   ["#1e3a5f", "#1a365d", "#0c4a6e"],
  Guardian:   ["#422006", "#451a03", "#78350f"],
  Visionary:  ["#2e1065", "#1e1b4b", "#312e81"],
  Harmonizer: ["#500724", "#4a044e", "#701a75"],
};

export function StoryGenerator({ mbtiType, identity, userName, dimensions }: StoryGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [storyDataUrl, setStoryDataUrl] = useState<string | null>(null);

  const profile = MBTI_PROFILES[mbtiType];
  const squadColor = getSquadColor(profile.squad);
  const fullType = `${mbtiType}-${identity}`;

  const generateStory = useCallback(async () => {
    setIsGenerating(true);
    setShowModal(true);

    const canvas = canvasRef.current;
    if (!canvas) { setIsGenerating(false); return; }

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // ─── Background gradient ───
    const gradColors = SQUAD_GRADIENTS[profile.squad] || SQUAD_GRADIENTS.Visionary;
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, gradColors[0]);
    bgGrad.addColorStop(0.5, gradColors[1]);
    bgGrad.addColorStop(1, gradColors[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ─── Decorative orbs ───
    const drawOrb = (x: number, y: number, r: number, color: string, alpha: number) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
      grad.addColorStop(1, color + "00");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    drawOrb(200, 300, 300, squadColor, 0.15);
    drawOrb(880, 800, 250, "#EC4899", 0.1);
    drawOrb(540, 1500, 400, squadColor, 0.08);

    // ─── Star decorations ───
    const drawStar = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.2, y - size * 0.2);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.2, y + size * 0.2);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.2, y + size * 0.2);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size * 0.2, y - size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawStar(180, 250, 12, 0.4);
    drawStar(900, 400, 8, 0.3);
    drawStar(150, 900, 10, 0.25);
    drawStar(920, 1100, 14, 0.35);
    drawStar(300, 1600, 9, 0.2);
    drawStar(800, 1700, 11, 0.3);

    // ─── Top branding ───
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("siapaku.id", W / 2, 80);

    // ─── Small divider line ───
    const lineGrad = ctx.createLinearGradient(W / 2 - 60, 0, W / 2 + 60, 0);
    lineGrad.addColorStop(0, "transparent");
    lineGrad.addColorStop(0.5, squadColor + "80");
    lineGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, 100);
    ctx.lineTo(W / 2 + 60, 100);
    ctx.stroke();

    // ─── User name ───
    if (userName) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "500 32px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(userName, W / 2, 170);
    }

    // ─── "Hasil Tes MBTI" label ───
    ctx.fillStyle = squadColor + "CC";
    ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("HASIL TES MBTI", W / 2, userName ? 230 : 190);

    // ─── Emoji ───
    ctx.font = "160px serif";
    ctx.fillText(profile.emoji, W / 2, userName ? 430 : 400);

    // ─── MBTI Type (big) ───
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 140px 'Playfair Display', serif";
    const typeY = userName ? 580 : 550;
    ctx.fillText(mbtiType, W / 2, typeY);

    // ─── Identity badge ───
    ctx.font = "bold 48px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = squadColor;
    ctx.fillText(`-${identity}`, W / 2, typeY + 60);

    // ─── Nickname ───
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "italic 36px 'Playfair Display', serif";
    ctx.fillText(`"${profile.nickname}"`, W / 2, typeY + 130);

    // ─── Squad badge ───
    const squadY = typeY + 190;
    const squadText = `${getSquadEmoji(profile.squad)} Squad ${profile.squad}`;
    ctx.font = "600 28px 'Plus Jakarta Sans', sans-serif";
    const tw = ctx.measureText(squadText).width;
    const pillW = tw + 50;
    const pillH = 50;
    ctx.fillStyle = squadColor + "25";
    roundRect(ctx, (W - pillW) / 2, squadY - 32, pillW, pillH, 25);
    ctx.fill();
    ctx.strokeStyle = squadColor + "40";
    ctx.lineWidth = 1.5;
    roundRect(ctx, (W - pillW) / 2, squadY - 32, pillW, pillH, 25);
    ctx.stroke();
    ctx.fillStyle = squadColor;
    ctx.fillText(squadText, W / 2, squadY + 2);

    // ─── Dimension bars ───
    const barStartY = squadY + 80;
    const barW = 700;
    const barH = 44;
    const barGap = 72;
    const barX = (W - barW) / 2;

    dimensions.forEach((dim, i) => {
      const info = DIMENSION_INFO[dim.dimension as MBTIDimension];
      const y = barStartY + i * barGap;

      // Labels
      ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(info.poleALabel, barX, y - 8);
      ctx.textAlign = "right";
      ctx.fillText(info.poleBLabel, barX + barW, y - 8);

      // Bar background
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, barX, y, barW, barH, barH / 2);
      ctx.fill();

      // Pole A fill
      const aWidth = (dim.percentA / 100) * barW;
      if (aWidth > 0) {
        ctx.fillStyle = dim.percentA >= dim.percentB ? info.color : info.color + "50";
        roundRect(ctx, barX, y, Math.max(aWidth, barH), barH, barH / 2);
        ctx.fill();
      }

      // Pole B fill
      const bWidth = (dim.percentB / 100) * barW;
      if (bWidth > 0) {
        ctx.fillStyle = dim.percentB > dim.percentA ? info.color : info.color + "50";
        roundRect(ctx, barX + barW - Math.max(bWidth, barH), y, Math.max(bWidth, barH), barH, barH / 2);
        ctx.fill();
      }

      // Percentage texts
      ctx.textAlign = "center";
      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#ffffff";
      if (dim.percentA >= 25) {
        ctx.textAlign = "left";
        ctx.fillText(`${dim.percentA}%`, barX + 14, y + barH / 2 + 7);
      }
      if (dim.percentB >= 25) {
        ctx.textAlign = "right";
        ctx.fillText(`${dim.percentB}%`, barX + barW - 14, y + barH / 2 + 7);
      }

      // Center divider
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(barX + barW / 2, y);
      ctx.lineTo(barX + barW / 2, y + barH);
      ctx.stroke();
    });

    // ─── Tagline at bottom ───
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "italic 26px 'Playfair Display', serif";
    ctx.fillText(`"${profile.tagline}"`, W / 2, H - 160);

    // ─── Bottom CTA ───
    ctx.fillStyle = squadColor + "90";
    ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Cek kepribadianmu di siapaku.id 🔮", W / 2, H - 80);

    // ─── Bottom bar ───
    const bottomBarGrad = ctx.createLinearGradient(0, H - 30, W, H - 30);
    bottomBarGrad.addColorStop(0, "transparent");
    bottomBarGrad.addColorStop(0.3, squadColor + "60");
    bottomBarGrad.addColorStop(0.7, squadColor + "60");
    bottomBarGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = bottomBarGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, H - 30);
    ctx.lineTo(W, H - 30);
    ctx.stroke();

    // Generate data URL
    const dataUrl = canvas.toDataURL("image/png");
    setStoryDataUrl(dataUrl);
    setIsGenerating(false);
  }, [mbtiType, identity, userName, dimensions, profile, squadColor]);

  const handleDownload = () => {
    if (!storyDataUrl) return;
    const link = document.createElement("a");
    link.download = `siapaku-${fullType}-story.png`;
    link.href = storyDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!storyDataUrl) return;

    try {
      const blob = await (await fetch(storyDataUrl)).blob();
      const file = new File([blob], `siapaku-${fullType}-story.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Aku ${fullType} — ${profile.nickname}!`,
          text: `✨ Hasil tes MBTI SiapAku: Aku adalah ${fullType}!\nCek kepribadianmu di siapaku.id 🔮`,
          files: [file],
        });
      } else {
        // Fallback: just download
        handleDownload();
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <>
      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Generate button */}
      <button
        onClick={generateStory}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 text-[#1A1025]/90 hover:text-[#6B1D5E] hover:bg-white/90 transition-all duration-300 group disabled:opacity-50"
      >
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        Buat Story IG/FB
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass rounded-3xl p-6 max-w-sm w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-[#1A1025]/50 hover:text-[#6B1D5E] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/90"
              >
                ✕
              </button>

              <h3 className="font-display text-xl font-bold text-white mb-4 text-center">
                Story {fullType}
              </h3>

              {/* Preview */}
              {isGenerating ? (
                <div className="aspect-[9/16] rounded-2xl bg-white/60 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#6B1D5E]/15 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[#1A1025]/50 text-sm">Generating story...</p>
                  </div>
                </div>
              ) : storyDataUrl ? (
                <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-4 ring-1 ring-white/10">
                  <img src={storyDataUrl} alt="Story preview" className="w-full h-full object-cover" />
                </div>
              ) : null}

              {/* Action buttons */}
              {!isGenerating && storyDataUrl && (
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 glass rounded-xl py-3 text-[#1A1025]/90 hover:text-[#6B1D5E] hover:bg-white/90 transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 btn-primary rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share Story
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Canvas rounded rectangle helper ─── */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
