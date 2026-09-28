import type { LayoutType, FilterType, CapturedPhoto, StudioSettings } from '../types';
import { FRAME_OPTIONS } from './constants';

export interface ComposeOptions {
  photos: CapturedPhoto[];
  layout: LayoutType;
  frameId: string;
  filter: FilterType;
  settings: StudioSettings;
  scale?: number; // 1 for responsive preview, 2.5 or 3 for 300 DPI high-res export
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
      const outerMarginX = 28 * s;
      const outerMarginTop = 32 * s;
      const gapY = 16 * s;
      const footerHeight = 90 * s;
      const photoWidth = width - outerMarginX * 2;
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3 landscape ratio
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
      const outerMarginX = 30 * s;
      const outerMarginTop = 32 * s;
      const gapX = 16 * s;
      const gapY = 16 * s;
      const footerHeight = 90 * s;
      const photoWidth = Math.round((width - outerMarginX * 2 - gapX) / 2);
      const photoHeight = Math.round(photoWidth * 0.75); // 4:3 ratio
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
      const outerMarginX = 28 * s;
      const outerMarginTop = 32 * s;
      const gapY = 16 * s;
      const footerHeight = 85 * s;
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
      const outerMarginX = 28 * s;
      const outerMarginTop = 32 * s;
      const gapY = 16 * s;
      const footerHeight = 95 * s;
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
 * Loads an HTMLImageElement asynchronously from a data URL or image path
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
 * Draws image with object-fit: cover center-crop into the target rectangle
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
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws analog film grain noise over the photo
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

  // Create subtle grain procedural overlay
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
      data[i + 3] = 18; // Very subtle noise opacity
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

  const frame = FRAME_OPTIONS.find((f) => f.id === frameId) || FRAME_OPTIONS[0];

  // 1. Draw frame solid background
  ctx.fillStyle = frame.color;
  ctx.fillRect(0, 0, dim.width, dim.height);

  // 2. Preload all available photo images
  const loadedImages: (HTMLImageElement | null)[] = await Promise.all(
    photos.map(async (photo) => {
      try {
        return await loadImage(photo.dataUrl);
      } catch {
        return null;
      }
    })
  );

  // 3. Render photo slots according to layout geometry
  const totalSlots =
    layout === 'strip_1x4'
      ? 4
      : layout === 'strip_1x3'
      ? 3
      : layout === 'strip_1x2'
      ? 2
      : 4; // grid_2x2

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

    const img = loadedImages[i];

    if (img) {
      ctx.save();

      // Apply color grading filter directly to context
      if (filter === 'bw') {
        ctx.filter = 'grayscale(100%) contrast(120%) brightness(96%)';
      } else if (filter === 'sepia') {
        ctx.filter = 'sepia(45%) saturate(110%) contrast(98%) brightness(102%)';
      } else if (filter === 'grain') {
        ctx.filter = 'contrast(106%) saturate(92%) brightness(102%)';
      } else {
        ctx.filter = 'contrast(102%) saturate(104%)';
      }

      drawCoverImage(ctx, img, dx, dy, dim.photoWidth, dim.photoHeight, dim.photoRadius);
      ctx.restore();

      // Draw grain layer if vintage grain filter selected
      if (filter === 'grain') {
        drawFilmGrain(ctx, dx, dy, dim.photoWidth, dim.photoHeight, dim.photoRadius);
      }
    } else {
      // Empty slot placeholder
      ctx.save();
      ctx.fillStyle = frame.id === 'matte_charcoal' || frame.id === 'sage_olive'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.04)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(dx, dy, dim.photoWidth, dim.photoHeight, dim.photoRadius);
      } else {
        ctx.rect(dx, dy, dim.photoWidth, dim.photoHeight);
      }
      ctx.fill();

      // Slot index text
      ctx.fillStyle = frame.subtextColor;
      ctx.font = `500 ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`CUT 0${i + 1}`, dx + dim.photoWidth / 2, dy + dim.photoHeight / 2);
      ctx.restore();
    }
  }

  // 4. Render Studio Footer Stamp (Branding, Title, Date)
  const footerCenterY = dim.height - dim.footerHeight / 2;

  ctx.save();
  ctx.textAlign = 'center';

  // Title (Editorial Studio Branding)
  ctx.fillStyle = frame.textColor;
  ctx.font = `700 ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = `${2 * scale}px`;
  ctx.fillText(settings.title, dim.width / 2, footerCenterY - 10 * scale);

  // Subtitle / Korean studio tag
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
    ctx.fillStyle = frame.subtextColor;
    ctx.font = `400 ${8.5 * scale}px "Plus Jakarta Sans", monospace`;
    ctx.letterSpacing = `${1 * scale}px`;
    ctx.fillText(formattedDate, dim.width / 2, footerCenterY + 22 * scale);
  }

  // Subtle studio logo mark at bottom right
  ctx.fillStyle = frame.subtextColor;
  ctx.font = `600 ${8 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText('클립클랩', dim.width - dim.outerMarginX, dim.height - 12 * scale);

  ctx.restore();
}

/**
 * Generates and triggers high-resolution PNG download directly to laptop
 */
export async function downloadHighResPhotostrip(options: ComposeOptions): Promise<void> {
  const offscreenCanvas = document.createElement('canvas');
  // High-DPI scale (2.5x base scale ensures sharp 300 DPI print quality)
  await composePhotostrip(offscreenCanvas, { ...options, scale: 2.5 });

  const dataUrl = offscreenCanvas.toDataURL('image/png', 1.0);
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(
    2,
    '0'
  )}${String(now.getSeconds()).padStart(2, '0')}`;

  const link = document.createElement('a');
  link.download = `klipklap_studio_${options.layout}_${timestamp}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
