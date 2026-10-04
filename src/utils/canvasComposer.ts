import type { LayoutType, FilterType, CapturedPhoto, StudioSettings } from '../types';
import { FRAME_OPTIONS, LAYOUT_CONFIGS } from './constants';

export interface ComposeOptions {
  photos: CapturedPhoto[];
  layout: LayoutType;
  frameId: string;
  filter: FilterType;
  settings: StudioSettings;
  scale?: number; // 1 for responsive preview, 2.5 for 300 DPI high-res export
  previewMode?: 'photo' | 'motion';
  videoElements?: Map<number, HTMLVideoElement>;
}

export interface LayoutDimensions {
  width: number;
  height: number;
  photoWidth: number;
  photoHeight: number;
  outerMarginX: number;
  outerMarginTop: number;
  gapY: number;
  gapX: number;
  footerHeight: number;
  photoRadius: number;
}

/**
 * Calculates canvas layout dimensions based on layout type and target scale
 */
export function getLayoutDimensions(layout: LayoutType, scale = 1): LayoutDimensions {
  const s = scale;

  switch (layout) {
    case 'strip_1x3': {
      const width = 480 * s;
      const outerMarginX = 32 * s;
      const outerMarginTop = 36 * s;
      const gapY = 16 * s;
      const footerHeight = 92 * s;
      const photoWidth = width - outerMarginX * 2;
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3
      const height = outerMarginTop + photoHeight * 3 + gapY * 2 + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX: 0,
        footerHeight,
        photoRadius: 8 * s,
      };
    }

    case 'grid_2x2': {
      const width = 760 * s;
      const outerMarginX = 34 * s;
      const outerMarginTop = 36 * s;
      const gapX = 16 * s;
      const gapY = 16 * s;
      const footerHeight = 92 * s;
      const photoWidth = Math.round((width - outerMarginX * 2 - gapX) / 2);
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3
      const height = outerMarginTop + photoHeight * 2 + gapY + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX,
        footerHeight,
        photoRadius: 8 * s,
      };
    }

    case 'grid_3x3': {
      const width = 840 * s;
      const outerMarginX = 28 * s;
      const outerMarginTop = 32 * s;
      const gapX = 14 * s;
      const gapY = 14 * s;
      const footerHeight = 84 * s;
      const photoWidth = Math.round((width - outerMarginX * 2 - gapX * 2) / 3);
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3
      const height = outerMarginTop + photoHeight * 3 + gapY * 2 + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX,
        footerHeight,
        photoRadius: 6 * s,
      };
    }

    case 'grid_2x3': {
      const width = 720 * s;
      const outerMarginX = 32 * s;
      const outerMarginTop = 36 * s;
      const gapX = 16 * s;
      const gapY = 16 * s;
      const footerHeight = 90 * s;
      const photoWidth = Math.round((width - outerMarginX * 2 - gapX) / 2);
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3
      const height = outerMarginTop + photoHeight * 3 + gapY * 2 + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX,
        footerHeight,
        photoRadius: 8 * s,
      };
    }

    case 'strip_1x2': {
      const width = 480 * s;
      const outerMarginX = 32 * s;
      const outerMarginTop = 36 * s;
      const gapY = 16 * s;
      const footerHeight = 88 * s;
      const photoWidth = width - outerMarginX * 2;
      const photoHeight = Math.round(photoWidth * 0.75);
      const height = outerMarginTop + photoHeight * 2 + gapY + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX: 0,
        footerHeight,
        photoRadius: 8 * s,
      };
    }

    case 'polaroid_1x1': {
      const width = 520 * s;
      const outerMarginX = 36 * s;
      const outerMarginTop = 36 * s;
      const gapX = 0;
      const gapY = 0;
      const footerHeight = 132 * s;
      const photoWidth = width - outerMarginX * 2;
      const photoHeight = Math.round(photoWidth * 0.88);
      const height = outerMarginTop + photoHeight + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX,
        footerHeight,
        photoRadius: 4 * s,
      };
    }

    case 'strip_1x4':
    default: {
      const width = 480 * s;
      const outerMarginX = 32 * s;
      const outerMarginTop = 36 * s;
      const gapY = 16 * s;
      const footerHeight = 96 * s;
      const photoWidth = width - outerMarginX * 2;
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3
      const height = outerMarginTop + photoHeight * 4 + gapY * 3 + footerHeight;

      return {
        width,
        height,
        photoWidth,
        photoHeight,
        outerMarginX,
        outerMarginTop,
        gapY,
        gapX: 0,
        footerHeight,
        photoRadius: 8 * s,
      };
    }
  }
}

/**
 * Loads an HTMLImageElement asynchronously
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Draws image with object-fit: cover center-crop into target rectangle
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number,
  radius: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = dWidth / dHeight;

  let sx = 0;
  let sy = 0;
  let sWidth = img.naturalWidth;
  let sHeight = img.naturalHeight;

  if (imgRatio > targetRatio) {
    sWidth = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sWidth) / 2;
  } else {
    sHeight = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sHeight) / 2;
  }

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(dx, dy, dWidth, dHeight, radius);
  } else {
    ctx.rect(dx, dy, dWidth, dHeight);
  }
  ctx.clip();

  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  // Subtle inner border for crisp photo edges
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws HTMLVideoElement with object-fit: cover center-crop into target rectangle,
 * with optional horizontal mirroring for selfie/front camera.
 */
function drawCoverVideo(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number,
  radius: number,
  isMirrored = false
) {
  const vWidth = video.videoWidth || 1280;
  const vHeight = video.videoHeight || 960;
  if (!vWidth || !vHeight) return;

  const videoRatio = vWidth / vHeight;
  const targetRatio = dWidth / dHeight;

  let sx = 0;
  let sy = 0;
  let sWidth = vWidth;
  let sHeight = vHeight;

  if (videoRatio > targetRatio) {
    sWidth = vHeight * targetRatio;
    sx = (vWidth - sWidth) / 2;
  } else {
    sHeight = vWidth / targetRatio;
    sy = (vHeight - sHeight) / 2;
  }

  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(dx, dy, dWidth, dHeight, radius);
  } else {
    ctx.rect(dx, dy, dWidth, dHeight);
  }
  ctx.clip();

  if (isMirrored) {
    ctx.translate(dx + dWidth, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
  } else {
    ctx.drawImage(video, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

  // Subtle inner border for crisp photo edges
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Applies color grading filter preset to canvas 2D rendering context
 */
export function applyFilterToContext(ctx: CanvasRenderingContext2D, filter: FilterType) {
  switch (filter) {
    case 'bw':
      ctx.filter = 'grayscale(100%) contrast(120%) brightness(96%)';
      break;
    case 'sepia':
      ctx.filter = 'sepia(45%) saturate(110%) contrast(98%) brightness(102%)';
      break;
    case 'grain':
      ctx.filter = 'contrast(106%) saturate(92%) brightness(102%)';
      break;
    case 'pastel':
      ctx.filter = 'contrast(96%) saturate(120%) brightness(106%) hue-rotate(-8deg)';
      break;
    case 'fuji':
      ctx.filter = 'contrast(112%) saturate(130%) brightness(98%) hue-rotate(4deg)';
      break;
    case 'cyber':
      ctx.filter = 'contrast(125%) saturate(140%) brightness(95%) hue-rotate(185deg)';
      break;
    case 'cinema':
      ctx.filter = 'contrast(115%) saturate(92%) brightness(96%) sepia(20%) hue-rotate(155deg)';
      break;
    case 'soft':
      ctx.filter = 'contrast(92%) saturate(108%) brightness(106%)';
      break;
    case 'kodak':
      ctx.filter = 'contrast(112%) saturate(135%) brightness(103%) sepia(18%)';
      break;
    case 'moody_noir':
      ctx.filter = 'grayscale(100%) contrast(140%) brightness(92%)';
      break;
    case 'haru_blue':
      ctx.filter = 'contrast(106%) saturate(108%) brightness(105%) hue-rotate(12deg)';
      break;
    case 'cherry_blossom':
      ctx.filter = 'contrast(100%) saturate(118%) brightness(108%) hue-rotate(-14deg)';
      break;
    case 'warm_latte':
      ctx.filter = 'contrast(95%) saturate(88%) brightness(103%) sepia(28%)';
      break;
    case 'vintage_90s':
      ctx.filter = 'contrast(120%) saturate(125%) brightness(100%) sepia(12%) hue-rotate(-5deg)';
      break;
    case 'normal':
    default:
      ctx.filter = 'contrast(102%) saturate(104%)';
      break;
  }
}

/**
 * Draws analog film grain noise overlay
 */
function drawFilmGrain(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number,
  radius: number
) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(dx, dy, dWidth, dHeight, radius);
  } else {
    ctx.rect(dx, dy, dWidth, dHeight);
  }
  ctx.clip();

  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 64;
  grainCanvas.height = 64;
  const gCtx = grainCanvas.getContext('2d');
  if (gCtx) {
    const imgData = gCtx.createImageData(64, 64);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 18;
    }
    gCtx.putImageData(imgData, 0, 0);

    const pattern = ctx.createPattern(grainCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(dx, dy, dWidth, dHeight);
    }
  }

  ctx.restore();
}

/**
 * Draws cute and retro decorative frame elements
 */
function drawFrameThemedDecorations(
  ctx: CanvasRenderingContext2D,
  frameId: string,
  dim: LayoutDimensions,
  scale: number
) {
  ctx.save();

  switch (frameId) {
    case 'retro_film': {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      const holeW = 10 * scale;
      const holeH = 16 * scale;
      const holeR = 3 * scale;
      const holeStep = 32 * scale;

      for (let y = 18 * scale; y < dim.height - 18 * scale; y += holeStep) {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(8 * scale, y, holeW, holeH, holeR);
          ctx.roundRect(dim.width - 18 * scale, y, holeW, holeH, holeR);
        } else {
          ctx.rect(8 * scale, y, holeW, holeH);
          ctx.rect(dim.width - 18 * scale, y, holeW, holeH);
        }
        ctx.fill();
      }

      ctx.fillStyle = '#D4A373';
      ctx.font = `600 ${8.5 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('▶ 35MM FILM ARCHIVE', dim.outerMarginX, 22 * scale);

      ctx.textAlign = 'right';
      ctx.fillText('ISO 400 • 24 EXP', dim.width - dim.outerMarginX, 22 * scale);
      break;
    }

    case 'retro_newspaper': {
      ctx.strokeStyle = '#2B241E';
      ctx.lineWidth = 1.5 * scale;
      ctx.strokeRect(12 * scale, 12 * scale, dim.width - 24 * scale, dim.height - 24 * scale);

      ctx.lineWidth = 0.8 * scale;
      ctx.strokeRect(16 * scale, 16 * scale, dim.width - 32 * scale, dim.height - 32 * scale);

      ctx.fillStyle = '#2B241E';
      ctx.font = `700 ${8.5 * scale}px "Playfair Display", serif`;
      ctx.textAlign = 'center';
      ctx.fillText('THE DAILY MEMORIES • SPECIAL EDITION', dim.width / 2, 26 * scale);
      break;
    }

    case 'retro_vhs': {
      const stripeH = 3 * scale;
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
      colors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.fillRect(
          dim.outerMarginX + idx * (46 * scale),
          16 * scale,
          44 * scale,
          stripeH
        );
      });

      ctx.fillStyle = '#38BDF8';
      ctx.font = `700 ${9.5 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('PLAY ▶ 0:00:24', dim.outerMarginX, 28 * scale);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#F472B6';
      ctx.fillText('SP MONO / HI-FI', dim.width - dim.outerMarginX, 28 * scale);
      break;
    }

    case 'retro_polaroid': {
      // Classic rainbow stripe in the corner
      const rx = dim.width - 64 * scale;
      const ry = 14 * scale;
      const rColors = ['#E11D48', '#EA580C', '#EAB308', '#16A34A', '#2563EB'];
      rColors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(rx + i * (8 * scale), ry, 8 * scale, 3 * scale);
      });
      break;
    }

    case 'retro_airmail': {
      // Diagonal red and blue airmail striped border
      const stripeW = 12 * scale;
      const stripeH = 6 * scale;
      for (let x = 0; x < dim.width; x += stripeW * 2) {
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(x, 0, stripeW, stripeH);
        ctx.fillRect(x + stripeW, dim.height - stripeH, stripeW, stripeH);

        ctx.fillStyle = '#2563EB';
        ctx.fillRect(x + stripeW, 0, stripeW, stripeH);
        ctx.fillRect(x, dim.height - stripeH, stripeW, stripeH);
      }
      break;
    }

    case 'cute_cherry': {
      const drawCherry = (cx: number, cy: number, r: number) => {
        ctx.fillStyle = '#E63946';
        ctx.beginPath();
        ctx.arc(cx - r * 0.7, cy + r * 0.4, r, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.7, cy + r * 0.4, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.9, cy + r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.5, cy + r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#40916C';
        ctx.lineWidth = 1.6 * scale;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, cy + r * 0.1);
        ctx.quadraticCurveTo(cx, cy - r * 1.1, cx, cy - r * 1.2);
        ctx.moveTo(cx + r * 0.6, cy + r * 0.1);
        ctx.quadraticCurveTo(cx, cy - r * 1.1, cx, cy - r * 1.2);
        ctx.stroke();

        ctx.fillStyle = '#52B788';
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.5, cy - r * 1.1, r * 0.5, r * 0.25, Math.PI * 0.25, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCherry(dim.outerMarginX + 16 * scale, 22 * scale, 5 * scale);
      drawCherry(dim.width - dim.outerMarginX - 16 * scale, 22 * scale, 5 * scale);
      break;
    }

    case 'cute_daisy': {
      const drawDaisy = (cx: number, cy: number, r: number) => {
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const px = cx + Math.cos(angle) * r * 0.9;
          const py = cy + Math.sin(angle) * r * 0.9;
          ctx.beginPath();
          ctx.arc(px, py, r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
        ctx.fill();
      };

      drawDaisy(dim.outerMarginX + 14 * scale, 22 * scale, 4.5 * scale);
      drawDaisy(dim.width - dim.outerMarginX - 14 * scale, 22 * scale, 4.5 * scale);
      break;
    }

    case 'cute_cloud': {
      const drawCloud = (cx: number, cy: number, w: number) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(cx - w * 0.3, cy, w * 0.3, 0, Math.PI * 2);
        ctx.arc(cx, cy - w * 0.15, w * 0.38, 0, Math.PI * 2);
        ctx.arc(cx + w * 0.3, cy, w * 0.3, 0, Math.PI * 2);
        ctx.fill();
      };

      drawCloud(dim.outerMarginX + 22 * scale, 22 * scale, 28 * scale);
      drawCloud(dim.width - dim.outerMarginX - 22 * scale, 22 * scale, 28 * scale);
      break;
    }

    case 'cute_cat': {
      const drawPaw = (cx: number, cy: number, s: number) => {
        ctx.fillStyle = '#D6CCC2';
        ctx.beginPath();
        ctx.ellipse(cx, cy + s * 0.2, s * 0.7, s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        const toeOffsets = [-0.6, -0.2, 0.2, 0.6];
        toeOffsets.forEach((to, idx) => {
          const dy = idx === 0 || idx === 3 ? 0 : -s * 0.15;
          ctx.beginPath();
          ctx.arc(cx + to * s, cy - s * 0.5 + dy, s * 0.25, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      drawPaw(dim.outerMarginX + 16 * scale, 22 * scale, 7 * scale);
      drawPaw(dim.width - dim.outerMarginX - 16 * scale, 22 * scale, 7 * scale);
      break;
    }

    case 'cute_bunny': {
      ctx.fillStyle = '#F472B6';
      ctx.font = `${14 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🐰', dim.outerMarginX + 14 * scale, 24 * scale);
      ctx.fillText('🎀', dim.width - dim.outerMarginX - 14 * scale, 24 * scale);
      break;
    }

    case 'cute_strawberry': {
      ctx.font = `${14 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🍓', dim.outerMarginX + 14 * scale, 24 * scale);
      ctx.fillText('🍓', dim.width - dim.outerMarginX - 14 * scale, 24 * scale);
      break;
    }

    case 'y2k_holo': {
      // Four-point chrome cyber stars
      const drawStar = (cx: number, cy: number, r: number) => {
        ctx.fillStyle = '#A5B4FC';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(cx, cy, cx + r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + r);
        ctx.quadraticCurveTo(cx, cy, cx - r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - r);
        ctx.fill();
      };
      drawStar(dim.outerMarginX + 14 * scale, 22 * scale, 9 * scale);
      drawStar(dim.width - dim.outerMarginX - 14 * scale, 22 * scale, 9 * scale);
      break;
    }

    case 'y2k_pixel': {
      ctx.fillStyle = '#C084FC';
      ctx.font = `bold ${10 * scale}px monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('★ 8-BIT PHOTO MEMORY', dim.outerMarginX, 22 * scale);
      ctx.textAlign = 'right';
      ctx.fillText('KLIPKLAP.EXE ★', dim.width - dim.outerMarginX, 22 * scale);
      break;
    }

    case 'y2k_bubblegum': {
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('💖', dim.outerMarginX + 14 * scale, 24 * scale);
      ctx.fillText('✨', dim.width - dim.outerMarginX - 14 * scale, 24 * scale);
      break;
    }

    case 'retro_cassette': {
      ctx.fillStyle = '#D4A373';
      ctx.font = `600 ${8.5 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('SIDE A • C-90 HI-BIAS', dim.outerMarginX, 22 * scale);
      ctx.textAlign = 'right';
      ctx.fillText('NR [ON] • 4.76 CM/S', dim.width - dim.outerMarginX, 22 * scale);
      ctx.fillStyle = '#E76F51';
      ctx.fillRect(dim.outerMarginX, 26 * scale, dim.width - dim.outerMarginX * 2, 2 * scale);
      break;
    }

    case 'retro_ticket': {
      ctx.fillStyle = '#6B584C';
      ctx.font = `700 ${8.5 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('★ ADMIT ONE • CINEMA ARCHIVE • NO. 84920 ★', dim.width / 2, 22 * scale);
      break;
    }

    case 'cute_bear': {
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🧸', dim.outerMarginX + 14 * scale, 24 * scale);
      ctx.fillText('🍯', dim.width - dim.outerMarginX - 14 * scale, 24 * scale);
      break;
    }

    case 'cute_heart_ribbon': {
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🎀', dim.outerMarginX + 14 * scale, 24 * scale);
      ctx.fillText('💕', dim.width - dim.outerMarginX - 14 * scale, 24 * scale);
      break;
    }

    case 'cute_dino': {
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🦖', dim.outerMarginX + 14 * scale, 24 * scale);
      ctx.fillText('⭐', dim.width - dim.outerMarginX - 14 * scale, 24 * scale);
      break;
    }

    case 'y2k_cyberpunk': {
      ctx.fillStyle = '#4ADE80';
      ctx.font = `700 ${8.5 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('// SYS.ON: MATRIX 2000', dim.outerMarginX, 22 * scale);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#22D3EE';
      ctx.fillText('CYBER_NODE //', dim.width - dim.outerMarginX, 22 * scale);
      break;
    }

    case 'y2k_glitter_star': {
      const drawChromeStar = (cx: number, cy: number, r: number) => {
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.quadraticCurveTo(cx, cy, cx + r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + r);
        ctx.quadraticCurveTo(cx, cy, cx - r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - r);
        ctx.fill();

        ctx.fillStyle = '#94A3B8';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      };
      drawChromeStar(dim.outerMarginX + 14 * scale, 22 * scale, 8 * scale);
      drawChromeStar(dim.width - dim.outerMarginX - 14 * scale, 22 * scale, 8 * scale);
      break;
    }
  }

  ctx.restore();
}

/**
 * Composes photos into the specified canvas element with frame, filters, and stamps
 */
export async function composePhotostrip(
  canvas: HTMLCanvasElement,
  options: ComposeOptions
): Promise<void> {
  const { photos, layout, frameId, filter, settings, scale = 1, previewMode = 'photo', videoElements } = options;
  const dim = getLayoutDimensions(layout, scale);

  canvas.width = dim.width;
  canvas.height = dim.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const frame = FRAME_OPTIONS.find((f) => f.id === frameId) || FRAME_OPTIONS[0];

  // 1. Draw solid frame background
  ctx.fillStyle = frame.color || '#FFFFFF';
  ctx.fillRect(0, 0, dim.width, dim.height);

  // 2. Draw theme decorations (retro film sprockets, cherries, daisies, clouds, etc.)
  drawFrameThemedDecorations(ctx, frame.id, dim, scale);

  // 3. Preload all available photo images mapped by poseIndex (for static mode or video fallback)
  const photoImageMap = new Map<number, HTMLImageElement>();
  await Promise.all(
    photos.map(async (photo) => {
      try {
        const img = await loadImage(photo.dataUrl);
        photoImageMap.set(photo.poseIndex, img);
      } catch {
        // ignore load failure
      }
    })
  );

  // 4. Render photo slots dynamically based on layout config
  const config = LAYOUT_CONFIGS[layout] || LAYOUT_CONFIGS['strip_1x4'];
  const totalSlots = config.photoCount;
  const cols = config.columns;

  const cal = settings.slotCalibration || {
    marginTopOffset: 0,
    gapOffset: 0,
    scaleFactor: 1,
    marginSideOffset: 0,
  };

  const scaleFactor = cal.scaleFactor || 1;
  const targetPhotoWidth = Math.round(dim.photoWidth * scaleFactor);
  const targetPhotoHeight = Math.round(dim.photoHeight * scaleFactor);
  const scaleOffsetX = Math.round((dim.photoWidth - targetPhotoWidth) / 2);
  const scaleOffsetY = Math.round((dim.photoHeight - targetPhotoHeight) / 2);

  const baseMarginTop = dim.outerMarginTop + Math.round(cal.marginTopOffset * scale);
  const baseMarginX = dim.outerMarginX + Math.round(cal.marginSideOffset * scale);
  const effectiveGapY = dim.gapY + Math.round(cal.gapOffset * scale);
  const effectiveGapX = dim.gapX + Math.round(cal.gapOffset * scale);

  for (let i = 0; i < totalSlots; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const dx = baseMarginX + col * (dim.photoWidth + effectiveGapX) + scaleOffsetX;
    const dy = baseMarginTop + row * (dim.photoHeight + effectiveGapY) + scaleOffsetY;

    const img = photoImageMap.get(i);
    const video = videoElements?.get(i);
    const photoItem = photos.find((p) => p.poseIndex === i);

    if (previewMode === 'motion' && video && video.readyState >= 2) {
      ctx.save();
      applyFilterToContext(ctx, filter);
      drawCoverVideo(
        ctx,
        video,
        dx,
        dy,
        targetPhotoWidth,
        targetPhotoHeight,
        dim.photoRadius,
        photoItem?.isMirrored ?? false
      );
      ctx.restore();

      // Film grain overlay
      if (filter === 'grain' || filter === 'vintage_90s' || filter === 'kodak') {
        drawFilmGrain(ctx, dx, dy, targetPhotoWidth, targetPhotoHeight, dim.photoRadius);
      }
    } else if (img) {
      ctx.save();
      applyFilterToContext(ctx, filter);
      drawCoverImage(ctx, img, dx, dy, targetPhotoWidth, targetPhotoHeight, dim.photoRadius);
      ctx.restore();

      // Film grain overlay
      if (filter === 'grain' || filter === 'vintage_90s' || filter === 'kodak') {
        drawFilmGrain(ctx, dx, dy, targetPhotoWidth, targetPhotoHeight, dim.photoRadius);
      }
    } else {
      // Empty slot placeholder
      ctx.save();
      const isDarkFrame =
        frame.id === 'matte_charcoal' ||
        frame.id === 'midnight_navy' ||
        frame.id === 'wine_bordeaux' ||
        frame.id === 'retro_film' ||
        frame.id === 'retro_cassette' ||
        frame.id === 'retro_vhs' ||
        frame.id === 'y2k_holo' ||
        frame.id === 'y2k_pixel' ||
        frame.id === 'y2k_cyberpunk' ||
        frame.id === 'y2k_glitter_star';

      ctx.fillStyle = isDarkFrame
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(dx, dy, targetPhotoWidth, targetPhotoHeight, dim.photoRadius);
      } else {
        ctx.rect(dx, dy, targetPhotoWidth, targetPhotoHeight);
      }
      ctx.fill();

      // Slot index text
      ctx.fillStyle = frame.subtextColor;
      ctx.font = `500 ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`CUT 0${i + 1}`, dx + targetPhotoWidth / 2, dy + targetPhotoHeight / 2);
      ctx.restore();
    }
  }

  // 5. Render Studio Footer Stamp (Branding, Title, Date)
  const footerCenterY = dim.height - dim.footerHeight / 2;

  ctx.save();
  ctx.textAlign = 'center';

  // Title
  ctx.fillStyle = frame.textColor;
  ctx.font = `700 ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = `${2 * scale}px`;
  ctx.fillText(settings.title, dim.width / 2, footerCenterY - 10 * scale);

  // Subtitle
  ctx.fillStyle = frame.subtextColor;
  ctx.font = `500 ${10 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = `${1.5 * scale}px`;
  ctx.fillText(settings.subtitle, dim.width / 2, footerCenterY + 7 * scale);

  // Date Stamp
  if (settings.showDate) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
      today.getDate()
    ).padStart(2, '0')} • KLIPKLAP PHOTO`;
    ctx.fillStyle = frame.subtextColor || '#737373';
    ctx.font = `400 ${8.5 * scale}px "Plus Jakarta Sans", monospace`;
    ctx.letterSpacing = `${1 * scale}px`;
    ctx.fillText(formattedDate, dim.width / 2, footerCenterY + 22 * scale);
  }

  // Korean Studio signature at bottom right
  ctx.fillStyle = frame.subtextColor;
  ctx.font = `600 ${8 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText('클립클랩', dim.width - dim.outerMarginX, dim.height - 12 * scale);

  // 6. Draw clean outer border around entire canvas perimeter
  ctx.strokeStyle = frame.borderColor || 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(0.75 * scale, 0.75 * scale, dim.width - 1.5 * scale, dim.height - 1.5 * scale);

  ctx.restore();
}

/**
 * Generates and triggers high-resolution PNG download directly to laptop
 */
export async function downloadHighResPhotostrip(
  options: ComposeOptions,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const offscreenCanvas = document.createElement('canvas');
  // High-DPI scale (2.5x base scale ensures 300 DPI print quality)
  await composePhotostrip(offscreenCanvas, { ...options, scale: 2.5 });

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = offscreenCanvas.toDataURL(mimeType, 0.98);

  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(
    2,
    '0'
  )}${String(now.getSeconds()).padStart(2, '0')}`;

  const link = document.createElement('a');
  link.download = `klipklap_${options.layout}_${options.frameId}_${timestamp}.${format === 'jpeg' ? 'jpg' : 'png'}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Records the animated Live Motion photostrip into an MP4 video file and triggers download
 */
export async function downloadLiveMotionVideo(
  options: ComposeOptions,
  onProgress?: (percent: number) => void
): Promise<void> {
  const { photos } = options;

  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder tidak didukung di browser ini.');
  }

  // Scale 2 is crisp (e.g. 960px or 1520px wide) and performs smoothly
  const scale = 2;
  const dim = getLayoutDimensions(options.layout, scale);

  const offscreenCanvas = document.createElement('canvas');
  // Enforce even dimensions for video codec compatibility
  offscreenCanvas.width = dim.width - (dim.width % 2);
  offscreenCanvas.height = dim.height - (dim.height % 2);

  // 1. Prepare video elements for each photo with a videoUrl
  const videoMap = new Map<number, HTMLVideoElement>();
  await Promise.all(
    photos.map(async (photo) => {
      if (!photo.videoUrl) return;
      const v = document.createElement('video');
      v.src = photo.videoUrl;
      v.crossOrigin = 'anonymous';
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;

      await new Promise<void>((resolve) => {
        v.onloadeddata = () => resolve();
        v.onerror = () => resolve();
        setTimeout(resolve, 2000); // 2s timeout safeguard
      });

      v.currentTime = 0;
      await v.play().catch(() => {});
      videoMap.set(photo.poseIndex, v);
    })
  );

  // 2. Prepare canvas stream and media recorder
  const stream = offscreenCanvas.captureStream(30);

  const types = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  let mimeType = '';
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      mimeType = t;
      break;
    }
  }

  const chunks: Blob[] = [];
  const recorderOptions: MediaRecorderOptions = {
    videoBitsPerSecond: 6_000_000,
  };
  if (mimeType) {
    recorderOptions.mimeType = mimeType;
  }

  const recorder = new MediaRecorder(stream, recorderOptions);

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  // 3. Render loop for 3.5 seconds
  const durationMs = 3500;
  const fps = 30;
  const totalFrames = Math.round((durationMs / 1000) * fps);

  recorder.start();

  let isRecording = true;
  let frameCount = 0;
  const startTime = Date.now();

  await new Promise<void>((resolve) => {
    const renderLoop = async () => {
      if (!isRecording) return;

      await composePhotostrip(offscreenCanvas, {
        ...options,
        scale,
        previewMode: 'motion',
        videoElements: videoMap,
      });

      frameCount++;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / durationMs) * 100));
      if (onProgress) onProgress(progress);

      if (elapsed >= durationMs || frameCount >= totalFrames) {
        isRecording = false;
        resolve();
      } else {
        requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();
  });

  // 4. Stop recorder and wait for final blob
  const videoBlob = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const finalMime = recorder.mimeType || mimeType || 'video/mp4';
      resolve(new Blob(chunks, { type: finalMime }));
    };
    try {
      recorder.stop();
    } catch {
      resolve(new Blob(chunks, { type: mimeType || 'video/mp4' }));
    }
  });

  // Pause and cleanup temporary video elements
  videoMap.forEach((v) => {
    try {
      v.pause();
      v.src = '';
    } catch {
      // ignore
    }
  });

  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(
    2,
    '0'
  )}${String(now.getSeconds()).padStart(2, '0')}`;

  const link = document.createElement('a');
  link.download = `klipklap_live_${options.layout}_${options.frameId}_${timestamp}.mp4`;
  const blobUrl = URL.createObjectURL(videoBlob);
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}
