import type { LayoutType, FilterType, CapturedPhoto, StudioSettings, FrameOption } from '../types';
import { FRAME_OPTIONS } from './constants';

export interface ComposeOptions {
  photos: CapturedPhoto[];
  layout: LayoutType;
  frameId: string;
  customFrame?: FrameOption;
  filter: FilterType;
  settings: StudioSettings;
  scale?: number; // 1 for responsive preview, 2.5 for 300 DPI high-res export
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
      // 1. Draw 35mm film sprocket holes along left & right margins
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      const holeW = 10 * scale;
      const holeH = 16 * scale;
      const holeR = 3 * scale;
      const holeStep = 32 * scale;

      for (let y = 18 * scale; y < dim.height - 18 * scale; y += holeStep) {
        // Left sprocket hole
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(10 * scale, y, holeW, holeH, holeR);
          ctx.roundRect(dim.width - 20 * scale, y, holeW, holeH, holeR);
        } else {
          ctx.rect(10 * scale, y, holeW, holeH);
          ctx.rect(dim.width - 20 * scale, y, holeW, holeH);
        }
        ctx.fill();
      }

      // 2. Film roll edge text (Kodak / Fuji style)
      ctx.fillStyle = '#D4A373';
      ctx.font = `600 ${8.5 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('▶ 35MM NEGATIVE FILM', dim.outerMarginX, 22 * scale);

      ctx.textAlign = 'right';
      ctx.fillText('ISO 400 • 24 EXP', dim.width - dim.outerMarginX, 22 * scale);
      break;
    }

    case 'retro_newspaper': {
      // 1. Classic double pinstripe border
      ctx.strokeStyle = '#2B241E';
      ctx.lineWidth = 1.5 * scale;
      ctx.strokeRect(12 * scale, 12 * scale, dim.width - 24 * scale, dim.height - 24 * scale);

      ctx.lineWidth = 0.8 * scale;
      ctx.strokeRect(16 * scale, 16 * scale, dim.width - 32 * scale, dim.height - 32 * scale);

      // 2. Top editorial header
      ctx.fillStyle = '#2B241E';
      ctx.font = `700 ${8.5 * scale}px "Playfair Display", serif`;
      ctx.textAlign = 'center';
      ctx.fillText('— THE DAILY MEMORIES • SPECIAL EDITION —', dim.width / 2, 26 * scale);
      break;
    }

    case 'retro_vhs': {
      // 1. Neon rainbow tracking line bar across top
      const stripeH = 3 * scale;
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
      colors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.fillRect(
          dim.outerMarginX + idx * (50 * scale),
          16 * scale,
          48 * scale,
          stripeH
        );
      });

      // 2. VHS OSD timestamp & play icon
      ctx.fillStyle = '#38BDF8';
      ctx.font = `700 ${9.5 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('PLAY ▶ 0:00:24', dim.outerMarginX, 28 * scale);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#F472B6';
      ctx.fillText('SP MONO / HI-FI', dim.width - dim.outerMarginX, 28 * scale);
      break;
    }

    case 'cute_cherry': {
      // Helper function to draw a cute cherry pair with stem & leaf
      const drawCherry = (cx: number, cy: number, r: number) => {
        // Red cherries
        ctx.fillStyle = '#E63946';
        ctx.beginPath();
        ctx.arc(cx - r * 0.7, cy + r * 0.4, r, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.7, cy + r * 0.4, r, 0, Math.PI * 2);
        ctx.fill();

        // Glossy shine reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.9, cy + r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.5, cy + r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Green curved stems
        ctx.strokeStyle = '#40916C';
        ctx.lineWidth = 1.6 * scale;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, cy + r * 0.1);
        ctx.quadraticCurveTo(cx, cy - r * 1.1, cx, cy - r * 1.2);
        ctx.moveTo(cx + r * 0.6, cy + r * 0.1);
        ctx.quadraticCurveTo(cx, cy - r * 1.1, cx, cy - r * 1.2);
        ctx.stroke();

        // Tiny green leaf
        ctx.fillStyle = '#52B788';
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.5, cy - r * 1.1, r * 0.5, r * 0.25, Math.PI * 0.25, 0, Math.PI * 2);
        ctx.fill();
      };

      // Helper to draw mini hearts
      const drawHeart = (hx: number, hy: number, size: number, color = '#FF758F') => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(hx, hy + size * 0.3);
        ctx.bezierCurveTo(hx, hy, hx - size * 0.6, hy, hx - size * 0.6, hy + size * 0.4);
        ctx.bezierCurveTo(hx - size * 0.6, hy + size * 0.8, hx, hy + size, hx, hy + size * 1.2);
        ctx.bezierCurveTo(hx, hy + size, hx + size * 0.6, hy + size * 0.8, hx + size * 0.6, hy + size * 0.4);
        ctx.bezierCurveTo(hx + size * 0.6, hy, hx, hy, hx, hy + size * 0.3);
        ctx.fill();
      };

      // Draw cherries in top corners
      drawCherry(dim.outerMarginX + 10 * scale, 22 * scale, 6 * scale);
      drawCherry(dim.width - dim.outerMarginX - 10 * scale, 22 * scale, 6 * scale);

      // Scatter cute hearts along side margins
      drawHeart(14 * scale, dim.height * 0.3, 5 * scale, '#FF4D6D');
      drawHeart(dim.width - 20 * scale, dim.height * 0.35, 6 * scale, '#FF758F');
      drawHeart(14 * scale, dim.height * 0.65, 6 * scale, '#FF758F');
      drawHeart(dim.width - 20 * scale, dim.height * 0.7, 5 * scale, '#FF4D6D');

      // Top title doodle
      ctx.fillStyle = '#C9184A';
      ctx.font = `700 ${9 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('♥ SWEET CHERRY STUDIO ♥', dim.width / 2, 25 * scale);
      break;
    }

    case 'cute_daisy': {
      // Helper function to draw a daisy blossom
      const drawDaisy = (cx: number, cy: number, r: number) => {
        // 5-6 white petals
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const px = cx + Math.cos(angle) * r * 0.8;
          const py = cy + Math.sin(angle) * r * 0.8;
          ctx.beginPath();
          ctx.arc(px, py, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Golden center
        ctx.fillStyle = '#FFB703';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw daisies in corners and gaps
      drawDaisy(dim.outerMarginX, 22 * scale, 8 * scale);
      drawDaisy(dim.width - dim.outerMarginX, 22 * scale, 8 * scale);
      drawDaisy(16 * scale, dim.height * 0.5, 7 * scale);
      drawDaisy(dim.width - 16 * scale, dim.height * 0.5, 7 * scale);

      // Wavy cute border accent
      ctx.strokeStyle = '#F6BD60';
      ctx.lineWidth = 1.2 * scale;
      ctx.setLineDash([4 * scale, 4 * scale]);
      ctx.strokeRect(10 * scale, 10 * scale, dim.width - 20 * scale, dim.height - 20 * scale);
      ctx.setLineDash([]); // Reset
      break;
    }

    case 'cute_cloud': {
      // Helper function to draw fluffy cloud
      const drawCloud = (cx: number, cy: number, w: number) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(cx, cy, w * 0.35, 0, Math.PI * 2);
        ctx.arc(cx - w * 0.3, cy + w * 0.05, w * 0.25, 0, Math.PI * 2);
        ctx.arc(cx + w * 0.3, cy + w * 0.05, w * 0.25, 0, Math.PI * 2);
        ctx.fill();
      };

      // Helper function to draw 4-point sparkle star
      const drawStar = (sx: number, sy: number, size: number) => {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(sx, sy - size);
        ctx.quadraticCurveTo(sx, sy, sx + size, sy);
        ctx.quadraticCurveTo(sx, sy, sx, sy + size);
        ctx.quadraticCurveTo(sx, sy, sx - size, sy);
        ctx.quadraticCurveTo(sx, sy, sx, sy - size);
        ctx.fill();
      };

      // Clouds at top and margins
      drawCloud(dim.outerMarginX + 12 * scale, 22 * scale, 24 * scale);
      drawCloud(dim.width - dim.outerMarginX - 12 * scale, 22 * scale, 24 * scale);

      // Scattered sparkle stars
      drawStar(14 * scale, dim.height * 0.25, 6 * scale);
      drawStar(dim.width - 16 * scale, dim.height * 0.38, 7 * scale);
      drawStar(14 * scale, dim.height * 0.72, 7 * scale);
      drawStar(dim.width - 16 * scale, dim.height * 0.78, 6 * scale);
      break;
    }

    case 'cute_cat': {
      // Helper function to draw cute paw prints
      const drawPaw = (px: number, py: number, size: number) => {
        ctx.fillStyle = '#F4A261';
        // Main pad
        ctx.beginPath();
        ctx.ellipse(px, py + size * 0.2, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4 toes
        const toeAngles = [-0.6, -0.2, 0.2, 0.6];
        toeAngles.forEach((ang) => {
          const tx = px + Math.sin(ang) * size * 0.8;
          const ty = py - Math.cos(ang) * size * 0.6;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      // Cat paw steps walking up the margins
      drawPaw(16 * scale, dim.height * 0.22, 6 * scale);
      drawPaw(14 * scale, dim.height * 0.35, 6 * scale);
      drawPaw(dim.width - 15 * scale, dim.height * 0.6, 6 * scale);
      drawPaw(dim.width - 17 * scale, dim.height * 0.75, 6 * scale);

      // Top title
      ctx.fillStyle = '#6D5947';
      ctx.font = `700 ${9 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🐾 MEOW STUDIO ARCHIVE 🐾', dim.width / 2, 24 * scale);
      break;
    }

    default:
      break;
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
  const { photos, layout, frameId, filter, settings, scale = 1 } = options;
  const dim = getLayoutDimensions(layout, scale);

  canvas.width = dim.width;
  canvas.height = dim.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const frame = options.customFrame || FRAME_OPTIONS.find((f) => f.id === frameId) || FRAME_OPTIONS[0];

  // Preload custom frame image if uploaded from Figma/Canva
  let customFrameImg: HTMLImageElement | null = null;
  if (frame.customImageUrl) {
    try {
      customFrameImg = await loadImage(frame.customImageUrl);
    } catch (e) {
      console.error('Failed to load custom frame image:', e);
    }
  }

  // 1. Draw solid frame background
  ctx.fillStyle = frame.color || '#FFFFFF';
  ctx.fillRect(0, 0, dim.width, dim.height);

  // 2. Draw theme decorations (retro film sprockets, cherries, daisies, clouds, etc.)
  if (frame.category !== 'custom') {
    drawFrameThemedDecorations(ctx, frame.id, dim, scale);
  }

  // 3. Preload all available photo images
  const loadedImages: (HTMLImageElement | null)[] = await Promise.all(
    photos.map(async (photo) => {
      try {
        return await loadImage(photo.dataUrl);
      } catch {
        return null;
      }
    })
  );

  // 4. Render photo slots according to layout geometry with calibration support
  const totalSlots =
    layout === 'strip_1x4'
      ? 4
      : layout === 'strip_1x3'
      ? 3
      : layout === 'strip_1x2'
      ? 2
      : 4; // grid_2x2

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
    let dx = baseMarginX + scaleOffsetX;
    let dy = baseMarginTop + scaleOffsetY;

    if (layout === 'grid_2x2') {
      const col = i % 2;
      const row = Math.floor(i / 2);
      dx = baseMarginX + col * (dim.photoWidth + effectiveGapX) + scaleOffsetX;
      dy = baseMarginTop + row * (dim.photoHeight + effectiveGapY) + scaleOffsetY;
    } else {
      dy = baseMarginTop + i * (dim.photoHeight + effectiveGapY) + scaleOffsetY;
    }

    const img = loadedImages[i];

    if (img) {
      ctx.save();

      // Apply color grading filter
      if (filter === 'bw') {
        ctx.filter = 'grayscale(100%) contrast(120%) brightness(96%)';
      } else if (filter === 'sepia') {
        ctx.filter = 'sepia(45%) saturate(110%) contrast(98%) brightness(102%)';
      } else if (filter === 'grain') {
        ctx.filter = 'contrast(106%) saturate(92%) brightness(102%)';
      } else {
        ctx.filter = 'contrast(102%) saturate(104%)';
      }

      drawCoverImage(ctx, img, dx, dy, targetPhotoWidth, targetPhotoHeight, dim.photoRadius);
      ctx.restore();

      // Film grain overlay
      if (filter === 'grain') {
        drawFilmGrain(ctx, dx, dy, targetPhotoWidth, targetPhotoHeight, dim.photoRadius);
      }
    } else {
      // Empty slot placeholder
      ctx.save();
      ctx.fillStyle = frame.category === 'retro' && frame.id === 'retro_film'
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

  // Draw custom frame overlay if uploaded (from Figma / Canva)
  if (customFrameImg) {
    ctx.save();
    ctx.drawImage(customFrameImg, 0, 0, dim.width, dim.height);
    ctx.restore();
  }

  // 5. Render Studio Footer Stamp (Branding, Title, Date)
  // For custom Canva/Figma frames, only draw if user explicitly wants stamp
  if (frame.category !== 'custom' || settings.showDate) {
    const footerCenterY = dim.height - dim.footerHeight / 2;

    ctx.save();
    ctx.textAlign = 'center';

    if (frame.category !== 'custom') {
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
    }

    // Date Stamp
    if (settings.showDate) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
        today.getDate()
      ).padStart(2, '0')} • KLIPKLAP PHOTO`;
      ctx.fillStyle = frame.subtextColor || '#737373';
      ctx.font = `400 ${8.5 * scale}px "Plus Jakarta Sans", monospace`;
      ctx.letterSpacing = `${1 * scale}px`;
      ctx.fillText(formattedDate, dim.width / 2, footerCenterY + (frame.category === 'custom' ? 8 * scale : 22 * scale));
    }

    if (frame.category !== 'custom') {
      // Korean Studio signature at bottom right
      ctx.fillStyle = frame.subtextColor;
      ctx.font = `600 ${8 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText('클립클랩', dim.width - dim.outerMarginX, dim.height - 12 * scale);
    }

    ctx.restore();
  }

  // 6. Draw clean outer border around entire canvas perimeter
  // Guarantees photostrip edge is always distinct on any viewer / background!
  ctx.strokeStyle = frame.borderColor || 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(0.75 * scale, 0.75 * scale, dim.width - 1.5 * scale, dim.height - 1.5 * scale);

  ctx.restore();
}

/**
 * Generates and triggers high-resolution PNG or JPG download directly to laptop
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
 * Generates and triggers download of a 1:1 blueprint template for Canva / Figma
 */
export function downloadStarterTemplateGuide(layout: LayoutType): void {
  const scale = 2.5; // High resolution matching 300 DPI export
  const dim = getLayoutDimensions(layout, scale);

  const canvas = document.createElement('canvas');
  canvas.width = dim.width;
  canvas.height = dim.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Blueprint paper background with subtle grid
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, dim.width, dim.height);

  // Subtle grid lines
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  const gridSize = 40 * scale;
  for (let x = 0; x < dim.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, dim.height);
    ctx.stroke();
  }
  for (let y = 0; y < dim.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(dim.width, y);
    ctx.stroke();
  }

  // Header banner
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, dim.width, 42 * scale);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${12 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `KLIPKLAP STARTER TEMPLATE GUIDE • ${layout.toUpperCase()} (${dim.width} × ${dim.height} PX • 300 DPI)`,
    dim.width / 2,
    21 * scale
  );

  // 2. Draw photo slot cutouts
  const totalSlots =
    layout === 'strip_1x4'
      ? 4
      : layout === 'strip_1x3'
      ? 3
      : layout === 'strip_1x2'
      ? 2
      : 4;

  for (let i = 0; i < totalSlots; i++) {
    let dx = dim.outerMarginX;
    let dy = dim.outerMarginTop;

    if (layout === 'grid_2x2') {
      const col = i % 2;
      const row = Math.floor(i / 2);
      dx = dim.outerMarginX + col * (dim.photoWidth + dim.gapX);
      dy = dim.outerMarginTop + row * (dim.photoHeight + dim.gapY);
    } else {
      dy = dim.outerMarginTop + i * (dim.photoHeight + dim.gapY);
    }

    // Fill slot box with clear blue guide tint
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(dx, dy, dim.photoWidth, dim.photoHeight, dim.photoRadius);
    } else {
      ctx.rect(dx, dy, dim.photoWidth, dim.photoHeight);
    }
    ctx.fill();

    // Dashed border for slot
    ctx.save();
    ctx.setLineDash([12 * scale, 8 * scale]);
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.restore();

    // Crosshair in center
    const cx = dx + dim.photoWidth / 2;
    const cy = dy + dim.photoHeight / 2;
    ctx.save();
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.3)';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - 24 * scale, cy);
    ctx.lineTo(cx + 24 * scale, cy);
    ctx.moveTo(cx, cy - 24 * scale);
    ctx.lineTo(cx, cy + 24 * scale);
    ctx.stroke();
    ctx.restore();

    // Text labels inside slot
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1D4ED8';
    ctx.font = `bold ${16 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`[ LUBANG FOTO / CUT 0${i + 1} ]`, cx, cy - 18 * scale);

    ctx.font = `600 ${11 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#3B82F6';
    ctx.fillText(`${dim.photoWidth} × ${dim.photoHeight} PX (RASIO 4:3)`, cx, cy + 4 * scale);

    ctx.font = `italic ${9 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.fillText(`Area ini dibuat transparan saat export dari Canva/Figma`, cx, cy + 22 * scale);
  }

  // 3. Footer safe zone
  const footerY = dim.height - dim.footerHeight;
  ctx.save();
  ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
  ctx.fillRect(dim.outerMarginX, footerY, dim.width - dim.outerMarginX * 2, dim.footerHeight - 16 * scale);
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(dim.outerMarginX, footerY, dim.width - dim.outerMarginX * 2, dim.footerHeight - 16 * scale);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#475569';
  ctx.font = `bold ${11 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(
    `AREA STAMP & LOGO STUDIO (${dim.footerHeight} PX)`,
    dim.width / 2,
    footerY + (dim.footerHeight - 16 * scale) / 2
  );
  ctx.restore();

  // 4. Instructions legend on the canvas border
  ctx.save();
  ctx.fillStyle = '#64748B';
  ctx.font = `500 ${8.5 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(
    `Panduan: 1. Impor template ke Canva/Figma  •  2. Hias tepi & bingkai  •  3. Bolongkan kotak biru  •  4. Export PNG Transparan`,
    dim.width / 2,
    dim.height - 8 * scale
  );
  ctx.restore();

  // 5. Outer border
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(scale, scale, dim.width - 2 * scale, dim.height - 2 * scale);

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `klipklap_starter_template_${layout}_blueprint_300dpi.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

