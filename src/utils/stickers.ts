import type { StickerDefinition, PlacedSticker } from '../types';

/**
 * Helper to encode raw SVG markup into a lightweight, zero-network data URL.
 * Pure vector SVG stickers ensure razor-sharp high-DPI exports while keeping memory footprint < 55 KB.
 */
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const STICKER_CATALOG: StickerDefinition[] = [
  // ==========================================
  // 1. CUTE CHARACTERS & COQUETTE
  // ==========================================
  {
    id: 'char_hello_kitty',
    name: 'Kitty Red Bow',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Die-cut white sticker border -->
          <path d="M22 48 L18 20 L46 30 Q60 26 74 30 L102 20 L98 48 C108 62, 106 94, 60 96 C14 94, 12 62, 22 48 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round"/>
          <!-- Kitty Head & Ears -->
          <path d="M24 50 L20 22 L46 32 Q60 28 74 32 L100 22 L96 50 C106 64, 102 92, 60 94 C18 92, 14 64, 24 50 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2" stroke-linejoin="round"/>
          <!-- Whiskers Left -->
          <line x1="10" y1="60" x2="26" y2="62" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <line x1="8" y1="70" x2="25" y2="70" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <line x1="12" y1="80" x2="27" y2="77" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <!-- Whiskers Right -->
          <line x1="110" y1="60" x2="94" y2="62" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <line x1="112" y1="70" x2="95" y2="70" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <line x1="108" y1="80" x2="93" y2="77" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <!-- Eyes & Yellow Nose -->
          <ellipse cx="41" cy="66" rx="4.2" ry="5.8" fill="#1E293B"/>
          <ellipse cx="79" cy="66" rx="4.2" ry="5.8" fill="#1E293B"/>
          <ellipse cx="60" cy="73" rx="5.5" ry="4" fill="#FACC15" stroke="#1E293B" stroke-width="2.5"/>
          <!-- Signature Red Bow on Right Ear -->
          <g transform="translate(82, 34) rotate(14)">
            <path d="M-4 0 C-18 -14, -24 6, -14 12 C-8 15, -4 8, -2 2 Z" fill="#EF4444" stroke="#1E293B" stroke-width="2.8"/>
            <path d="M4 0 C18 -14, 24 6, 14 12 C8 15, 4 8, 2 2 Z" fill="#EF4444" stroke="#1E293B" stroke-width="2.8"/>
            <circle cx="0" cy="2" r="5.5" fill="#EF4444" stroke="#1E293B" stroke-width="2.8"/>
          </g>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_snoopy',
    name: 'Snoopy Beagle',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- White Die-cut Outline -->
          <circle cx="60" cy="60" r="46" fill="#FFFFFF" opacity="0.01"/>
          <!-- Head & Snout -->
          <path d="M44 30 C26 30, 20 46, 26 62 C26 76, 36 86, 52 86 L68 86 C88 86, 104 76, 104 60 C104 46, 90 42, 76 44 C70 34, 58 30, 44 30 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2" stroke-linejoin="round"/>
          <!-- Floppy Black Ear -->
          <path d="M36 44 C22 48, 16 74, 28 88 C38 96, 48 82, 44 64 C42 54, 40 46, 36 44 Z" fill="#1E293B" stroke="#1E293B" stroke-width="2.5"/>
          <!-- Black Nose -->
          <ellipse cx="101" cy="56" rx="6.5" ry="5" fill="#1E293B"/>
          <!-- Happy Closed Eye & Eyebrow -->
          <path d="M58 48 Q64 43 70 48" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <path d="M54 38 Q60 34 66 37" fill="none" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Smile -->
          <path d="M62 72 Q78 78 90 68" fill="none" stroke="#1E293B" stroke-width="2.8" stroke-linecap="round"/>
          <!-- Red Collar & Gold Tag -->
          <rect x="44" y="85" width="30" height="7" rx="3.5" fill="#EF4444" stroke="#1E293B" stroke-width="2.5"/>
          <circle cx="60" cy="95" r="4.5" fill="#FACC15" stroke="#1E293B" stroke-width="2"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_cinnamoroll',
    name: 'Cinnamoroll',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <!-- Long Floppy Ears -->
          <path d="M40 44 C14 42, 4 68, 16 84 C26 94, 42 78, 44 60 Z" fill="#FFFFFF" stroke="#334155" stroke-width="3" stroke-linejoin="round"/>
          <path d="M100 44 C126 42, 136 68, 124 84 C114 94, 98 78, 96 60 Z" fill="#FFFFFF" stroke="#334155" stroke-width="3" stroke-linejoin="round"/>
          <!-- Chubby White Head -->
          <ellipse cx="70" cy="56" rx="34" ry="26" fill="#FFFFFF" stroke="#334155" stroke-width="3"/>
          <!-- Sky Blue Eyes -->
          <ellipse cx="54" cy="56" rx="3.8" ry="5" fill="#38BDF8"/>
          <ellipse cx="86" cy="56" rx="3.8" ry="5" fill="#38BDF8"/>
          <!-- Rosy Cheeks -->
          <ellipse cx="45" cy="63" rx="5.5" ry="3" fill="#FDA4AF" opacity="0.85"/>
          <ellipse cx="95" cy="63" rx="5.5" ry="3" fill="#FDA4AF" opacity="0.85"/>
          <!-- Cute W Mouth -->
          <path d="M64 60 Q67 64 70 60 Q73 64 76 60" fill="none" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_kuromi',
    name: 'Kuromi Cheeky',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <!-- Black Jester Hood with Pointy Ears -->
          <path d="M26 54 L14 14 L50 36 Q60 32 70 36 L106 14 L94 54 C104 68, 98 96, 60 98 C22 96, 16 68, 26 54 Z" fill="#1E293B" stroke="#0F172A" stroke-width="3.2" stroke-linejoin="round"/>
          <!-- Pom-poms on ear tips -->
          <circle cx="14" cy="14" r="5" fill="#1E293B"/>
          <circle cx="106" cy="14" r="5" fill="#1E293B"/>
          <!-- White Face Cutout -->
          <path d="M32 68 C32 52, 88 52, 88 68 C88 86, 76 92, 60 92 C44 92, 32 86, 32 68 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
          <!-- Jester Collar Points -->
          <path d="M46 54 L60 62 L74 54" fill="#1E293B"/>
          <!-- Pink Skull on Forehead -->
          <circle cx="60" cy="44" r="8" fill="#F472B6" stroke="#0F172A" stroke-width="2"/>
          <circle cx="57" cy="44" r="1.8" fill="#1E293B"/>
          <circle cx="63" cy="44" r="1.8" fill="#1E293B"/>
          <!-- Cheeky Eyes & Smirk -->
          <ellipse cx="46" cy="72" rx="3.5" ry="4.8" fill="#0F172A"/>
          <ellipse cx="74" cy="72" rx="3.5" ry="4.8" fill="#0F172A"/>
          <path d="M55 81 Q60 85 66 80" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="39" cy="77" rx="4" ry="2.2" fill="#F472B6" opacity="0.7"/>
          <ellipse cx="81" cy="77" rx="4" ry="2.2" fill="#F472B6" opacity="0.7"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_miffy',
    name: 'Miffy Bunny',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <!-- Tall Bunny Ears -->
          <path d="M38 56 L36 22 C36 10, 52 10, 52 22 L52 56 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M68 56 L68 22 C68 10, 84 10, 84 22 L82 56 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2" stroke-linejoin="round"/>
          <!-- Oval Head -->
          <ellipse cx="60" cy="74" rx="34" ry="28" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2"/>
          <!-- Dot Eyes -->
          <circle cx="44" cy="72" r="3.5" fill="#1E293B"/>
          <circle cx="76" cy="72" r="3.5" fill="#1E293B"/>
          <!-- Iconic X Mouth -->
          <line x1="56" y1="80" x2="64" y2="88" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <line x1="64" y1="80" x2="56" y2="88" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
          <!-- Soft Blush -->
          <ellipse cx="36" cy="78" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.75"/>
          <ellipse cx="84" cy="78" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.75"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_pompompurin',
    name: 'Purin Pudding',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Droopy Golden Ears -->
          <path d="M28 52 C10 56, 8 82, 22 88 C32 92, 36 74, 34 60 Z" fill="#FEF08A" stroke="#713F12" stroke-width="3" stroke-linejoin="round"/>
          <path d="M92 52 C110 56, 112 82, 98 88 C88 92, 84 74, 86 60 Z" fill="#FEF08A" stroke="#713F12" stroke-width="3" stroke-linejoin="round"/>
          <!-- Chubby Yellow Head -->
          <ellipse cx="60" cy="68" rx="34" ry="28" fill="#FEF08A" stroke="#713F12" stroke-width="3"/>
          <!-- Caramel Brown Beret Hat -->
          <ellipse cx="60" cy="40" rx="22" ry="9" fill="#78350F" stroke="#451A03" stroke-width="2.8"/>
          <path d="M60 31 L60 25" stroke="#451A03" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Eyes & Muzzle -->
          <circle cx="46" cy="66" r="3" fill="#451A03"/>
          <circle cx="74" cy="66" r="3" fill="#451A03"/>
          <ellipse cx="60" cy="70" rx="3" ry="2" fill="#78350F"/>
          <path d="M54 74 Q57 78 60 72 Q63 78 66 74" fill="none" stroke="#451A03" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_my_melody',
    name: 'Melody Bunny',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Pink Bunny Hood & Ears -->
          <path d="M36 46 L30 14 C28 6, 48 6, 50 18 L54 44 L66 44 L70 18 C72 6, 92 6, 90 14 L84 46 C100 56, 100 92, 60 96 C20 92, 20 56, 36 46 Z" fill="#F472B6" stroke="#831843" stroke-width="3" stroke-linejoin="round"/>
          <!-- White Inner Face -->
          <ellipse cx="60" cy="72" rx="26" ry="20" fill="#FFFFFF" stroke="#831843" stroke-width="2.5"/>
          <!-- Eyes & Yellow Nose -->
          <ellipse cx="48" cy="70" rx="3" ry="4.2" fill="#1E293B"/>
          <ellipse cx="72" cy="70" rx="3" ry="4.2" fill="#1E293B"/>
          <ellipse cx="60" cy="74" rx="3.5" ry="2.5" fill="#FACC15" stroke="#1E293B" stroke-width="1.8"/>
          <!-- Cute White Flower on Hood -->
          <g transform="translate(82, 46)">
            <circle cx="0" cy="-7" r="5" fill="#FFFFFF" stroke="#831843" stroke-width="1.8"/>
            <circle cx="7" cy="0" r="5" fill="#FFFFFF" stroke="#831843" stroke-width="1.8"/>
            <circle cx="0" cy="7" r="5" fill="#FFFFFF" stroke="#831843" stroke-width="1.8"/>
            <circle cx="-7" cy="0" r="5" fill="#FFFFFF" stroke="#831843" stroke-width="1.8"/>
            <circle cx="0" cy="0" r="4.5" fill="#FACC15" stroke="#831843" stroke-width="1.8"/>
          </g>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_keroppi',
    name: 'Keroppi Frog',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Green Frog Head -->
          <ellipse cx="60" cy="70" rx="36" ry="26" fill="#4ADE80" stroke="#14532D" stroke-width="3.2"/>
          <!-- Big Pop-out Eyes -->
          <circle cx="42" cy="42" r="15" fill="#FFFFFF" stroke="#14532D" stroke-width="3.2"/>
          <circle cx="78" cy="42" r="15" fill="#FFFFFF" stroke="#14532D" stroke-width="3.2"/>
          <circle cx="44" cy="42" r="6" fill="#14532D"/>
          <circle cx="76" cy="42" r="6" fill="#14532D"/>
          <!-- Big V Smile -->
          <path d="M42 68 L60 80 L78 68" fill="none" stroke="#14532D" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Pink Cheeks -->
          <ellipse cx="34" cy="68" rx="6" ry="3.5" fill="#FB7185" opacity="0.8"/>
          <ellipse cx="86" cy="68" rx="6" ry="3.5" fill="#FB7185" opacity="0.8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_pochacco',
    name: 'Pochacco Pup',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Floppy Black Ears -->
          <ellipse cx="22" cy="62" rx="10" ry="22" transform="rotate(20 22 62)" fill="#1E293B"/>
          <ellipse cx="98" cy="62" rx="10" ry="22" transform="rotate(-20 98 62)" fill="#1E293B"/>
          <!-- Pear-shaped White Head -->
          <path d="M36 46 C36 28, 84 28, 84 46 C94 64, 92 90, 60 92 C28 90, 26 64, 36 46 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2"/>
          <!-- Cute Fur Tuft on Forehead -->
          <path d="M56 32 L54 22 M60 31 L60 20 M64 32 L66 22" stroke="#1E293B" stroke-width="2.8" stroke-linecap="round"/>
          <!-- Eyes & Nose -->
          <circle cx="48" cy="62" r="3.2" fill="#1E293B"/>
          <circle cx="72" cy="62" r="3.2" fill="#1E293B"/>
          <ellipse cx="60" cy="68" rx="4.5" ry="3.2" fill="#1E293B"/>
          <ellipse cx="40" cy="68" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.75"/>
          <ellipse cx="80" cy="68" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.75"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'char_teddy_bear',
    name: 'Rila Bear',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Bear Ears -->
          <circle cx="28" cy="34" r="14" fill="#B45309" stroke="#451A03" stroke-width="3"/>
          <circle cx="28" cy="34" r="7" fill="#FDE047"/>
          <circle cx="92" cy="34" r="14" fill="#B45309" stroke="#451A03" stroke-width="3"/>
          <circle cx="92" cy="34" r="7" fill="#FDE047"/>
          <!-- Bear Head -->
          <ellipse cx="60" cy="64" rx="38" ry="32" fill="#B45309" stroke="#451A03" stroke-width="3.2"/>
          <!-- Cream Snout -->
          <ellipse cx="60" cy="70" rx="14" ry="11" fill="#FFFFFF" stroke="#451A03" stroke-width="2.2"/>
          <!-- Eyes & Nose -->
          <circle cx="43" cy="60" r="3.8" fill="#451A03"/>
          <circle cx="77" cy="60" r="3.8" fill="#451A03"/>
          <circle cx="60" cy="66" r="3.5" fill="#451A03"/>
          <path d="M60 69 L55 75 M60 69 L65 75" stroke="#451A03" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'bow_coquette',
    name: 'Coquette Bow',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.14))">
          <path d="M54 62 C38 82, 26 98, 18 108 L34 106 L44 92 C48 84, 54 72, 58 64 Z" fill="#F472B6" stroke="#9D174D" stroke-width="3" stroke-linejoin="round"/>
          <path d="M66 62 C82 82, 94 98, 102 108 L86 106 L76 92 C72 84, 66 72, 62 64 Z" fill="#F472B6" stroke="#9D174D" stroke-width="3" stroke-linejoin="round"/>
          <path d="M56 54 C32 24, 10 34, 14 58 C18 78, 42 74, 56 58 Z" fill="#FBCFE8" stroke="#9D174D" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M64 54 C88 24, 110 34, 106 58 C102 78, 78 74, 64 58 Z" fill="#FBCFE8" stroke="#9D174D" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M48 56 C34 46, 24 50, 26 58 C28 64, 40 62, 48 56 Z" fill="#F472B6" opacity="0.5"/>
          <path d="M72 56 C86 46, 96 50, 94 58 C92 64, 80 62, 72 56 Z" fill="#F472B6" opacity="0.5"/>
          <rect x="51" y="47" width="18" height="18" rx="7" fill="#F472B6" stroke="#9D174D" stroke-width="3.2"/>
          <circle cx="30" cy="44" r="3" fill="#FFFFFF" opacity="0.8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'heart_sparkle',
    name: 'Sparkle Heart',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <path d="M60 100 C60 100, 16 72, 16 42 C16 24, 32 14, 46 20 C54 23, 60 32, 60 32 C60 32, 66 23, 74 20 C88 14, 104 24, 104 42 C104 72, 60 100, 60 100 Z" fill="#FB7185" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
          <path d="M60 97 C60 97, 19 70, 19 42 C19 26, 33 17, 46 22 C53 25, 60 34, 60 34 C60 34, 67 25, 74 22 C87 17, 101 26, 101 42 C101 70, 60 97, 60 97 Z" fill="#FB7185" stroke="#881337" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M30 38 C30 30, 38 26, 44 28" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M92 22 L95 30 L103 33 L95 36 L92 44 L89 36 L81 33 L89 30 Z" fill="#FEF08A" stroke="#881337" stroke-width="1.5"/>
          <path d="M24 72 L26 77 L31 79 L26 81 L24 86 L22 81 L17 79 L22 77 Z" fill="#FEF08A" stroke="#881337" stroke-width="1.5"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'cherry_twin',
    name: 'Sweet Cherries',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 4px rgba(0,0,0,0.15))">
          <path d="M40 74 Q48 35 66 20 Q62 45 80 74" fill="none" stroke="#15803D" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M66 20 C82 14, 96 24, 86 34 C76 42, 68 30, 66 20 Z" fill="#4ADE80" stroke="#14532D" stroke-width="2.8" stroke-linejoin="round"/>
          <circle cx="38" cy="82" r="20" fill="#E11D48" stroke="#881337" stroke-width="3"/>
          <circle cx="80" cy="82" r="20" fill="#E11D48" stroke="#881337" stroke-width="3"/>
          <ellipse cx="31" cy="75" rx="5" ry="3" transform="rotate(-30 31 75)" fill="#FFFFFF" opacity="0.8"/>
          <ellipse cx="73" cy="75" rx="5" ry="3" transform="rotate(-30 73 75)" fill="#FFFFFF" opacity="0.8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'daisy_blossom',
    name: 'Smiley Daisy',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.14))" stroke="#422006" stroke-width="2.8">
          <circle cx="60" cy="24" r="16" fill="#FFFFFF"/>
          <circle cx="60" cy="96" r="16" fill="#FFFFFF"/>
          <circle cx="24" cy="60" r="16" fill="#FFFFFF"/>
          <circle cx="96" cy="60" r="16" fill="#FFFFFF"/>
          <circle cx="34" cy="34" r="16" fill="#FFFFFF"/>
          <circle cx="86" cy="34" r="16" fill="#FFFFFF"/>
          <circle cx="34" cy="86" r="16" fill="#FFFFFF"/>
          <circle cx="86" cy="86" r="16" fill="#FFFFFF"/>
          <circle cx="60" cy="60" r="22" fill="#FACC15"/>
          <circle cx="52" cy="56" r="2.6" fill="#422006" stroke="none"/>
          <circle cx="68" cy="56" r="2.6" fill="#422006" stroke="none"/>
          <path d="M52 65 Q60 72 68 65" fill="none" stroke="#422006" stroke-width="2.8" stroke-linecap="round"/>
          <ellipse cx="46" cy="61" rx="3.5" ry="2" fill="#F43F5E" opacity="0.55" stroke="none"/>
          <ellipse cx="74" cy="61" rx="3.5" ry="2" fill="#F43F5E" opacity="0.55" stroke="none"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'strawberry_pop',
    name: 'Berry Sweet',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <path d="M60 102 C34 102, 22 64, 30 42 C36 28, 84 28, 90 42 C98 64, 86 102, 60 102 Z" fill="#F43F5E" stroke="#881337" stroke-width="3.2"/>
          <path d="M36 34 Q48 46 60 36 Q72 46 84 34 Q70 22 60 26 Q50 22 36 34 Z" fill="#4ADE80" stroke="#14532D" stroke-width="2.8" stroke-linejoin="round"/>
          <path d="M60 26 L60 16" stroke="#14532D" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="46" cy="54" r="2.2" fill="#FEF08A"/>
          <circle cx="60" cy="50" r="2.2" fill="#FEF08A"/>
          <circle cx="74" cy="54" r="2.2" fill="#FEF08A"/>
          <circle cx="42" cy="70" r="2.2" fill="#FEF08A"/>
          <circle cx="60" cy="68" r="2.2" fill="#FEF08A"/>
          <circle cx="78" cy="70" r="2.2" fill="#FEF08A"/>
          <circle cx="52" cy="84" r="2.2" fill="#FEF08A"/>
          <circle cx="68" cy="84" r="2.2" fill="#FEF08A"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'cloud_dream',
    name: 'Fluffy Cloud',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.12))">
          <path d="M32 86 C18 86, 12 74, 18 62 C14 48, 28 36, 42 40 C50 26, 74 26, 82 40 C96 38, 108 50, 102 64 C108 76, 98 86, 86 86 Z" fill="#FFFFFF" stroke="#38BDF8" stroke-width="3.5" stroke-linejoin="round"/>
          <circle cx="48" cy="62" r="3" fill="#0F172A"/>
          <circle cx="72" cy="62" r="3" fill="#0F172A"/>
          <path d="M56 67 Q60 71 64 67" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="40" cy="65" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.75"/>
          <ellipse cx="80" cy="65" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.75"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'cake_shortcake',
    name: 'Berry Cake',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <path d="M22 60 L60 36 L98 60 L98 92 L22 92 Z" fill="#FEF3C7" stroke="#78350F" stroke-width="3" stroke-linejoin="round"/>
          <rect x="22" y="72" width="76" height="8" fill="#FDA4AF"/>
          <path d="M20 60 Q32 68 44 60 Q56 68 68 60 Q80 68 100 60 L60 34 Z" fill="#FFFFFF" stroke="#78350F" stroke-width="3" stroke-linejoin="round"/>
          <path d="M60 44 C50 44, 48 26, 60 22 C72 26, 70 44, 60 44 Z" fill="#F43F5E" stroke="#881337" stroke-width="2.5"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'tulip_pastel',
    name: 'Spring Tulip',
    category: 'cute',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.14))">
          <path d="M60 64 L60 104" stroke="#15803D" stroke-width="5" stroke-linecap="round"/>
          <path d="M60 94 C40 90, 34 74, 48 72 C56 72, 60 84, 60 94 Z" fill="#4ADE80" stroke="#14532D" stroke-width="2.5"/>
          <path d="M60 94 C80 90, 86 74, 72 72 C64 72, 60 84, 60 94 Z" fill="#4ADE80" stroke="#14532D" stroke-width="2.5"/>
          <path d="M36 34 L48 48 L60 28 L72 48 L84 34 C88 58, 76 68, 60 68 C44 68, 32 58, 36 34 Z" fill="#F472B6" stroke="#9D174D" stroke-width="3" stroke-linejoin="round"/>
        </g>
      </svg>
    `),
  },

  // ==========================================
  // 2. PHOTOBOOTH PROPS & ACCESSORIES
  // ==========================================
  {
    id: 'cat_ears',
    name: 'Cat Ears Bando',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <path d="M18 78 L12 22 L54 52 Z" fill="#1F2937" stroke="#111827" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M22 68 L18 32 L46 52 Z" fill="#F472B6"/>
          <path d="M122 78 L128 22 L86 52 Z" fill="#1F2937" stroke="#111827" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M118 68 L122 32 L94 52 Z" fill="#F472B6"/>
          <path d="M16 78 Q70 36 124 78" fill="none" stroke="#1F2937" stroke-width="6" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'bunny_ears',
    name: 'Bunny Ears',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <ellipse cx="44" cy="52" rx="16" ry="42" transform="rotate(-12 44 52)" fill="#FFFFFF" stroke="#F472B6" stroke-width="3.2"/>
          <ellipse cx="44" cy="54" rx="8" ry="28" transform="rotate(-12 44 54)" fill="#FBCFE8"/>
          <ellipse cx="96" cy="52" rx="16" ry="42" transform="rotate(12 96 52)" fill="#FFFFFF" stroke="#F472B6" stroke-width="3.2"/>
          <ellipse cx="96" cy="54" rx="8" ry="28" transform="rotate(12 96 54)" fill="#FBCFE8"/>
          <path d="M26 94 Q70 68 114 94" fill="none" stroke="#F472B6" stroke-width="5.5" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'crown_tiara',
    name: 'Royal Crown',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <path d="M16 78 L24 34 L46 56 L60 22 L74 56 L96 34 L104 78 Z" fill="#FACC15" stroke="#854D0E" stroke-width="3.2" stroke-linejoin="round"/>
          <rect x="16" y="74" width="88" height="10" rx="4" fill="#EAB308" stroke="#854D0E" stroke-width="3"/>
          <circle cx="60" cy="18" r="5" fill="#F43F5E" stroke="#854D0E" stroke-width="2"/>
          <circle cx="22" cy="30" r="4" fill="#38BDF8" stroke="#854D0E" stroke-width="2"/>
          <circle cx="98" cy="30" r="4" fill="#38BDF8" stroke="#854D0E" stroke-width="2"/>
          <circle cx="60" cy="62" r="5" fill="#F43F5E" stroke="#854D0E" stroke-width="2"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'props_heart_glasses',
    name: 'Heart Glasses',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <line x1="56" y1="36" x2="84" y2="36" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
          <path d="M36 62 C36 62, 10 44, 10 26 C10 14, 22 10, 30 16 C36 20, 36 24, 36 24 C36 24, 36 20, 42 16 C50 10, 62 14, 62 26 C62 44, 36 62, 36 62 Z" fill="#F43F5E" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>
          <path d="M104 62 C104 62, 78 44, 78 26 C78 14, 90 10, 98 16 C104 20, 104 24, 104 24 C104 24, 104 20, 110 16 C118 10, 130 14, 130 26 C130 44, 104 62, 104 62 Z" fill="#F43F5E" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>
          <line x1="22" y1="24" x2="30" y2="38" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
          <line x1="90" y1="24" x2="98" y2="38" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'sunglasses_cool',
    name: 'Retro Shades',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.2))">
          <path d="M8 28 L132 28" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
          <rect x="14" y="24" width="48" height="32" rx="10" fill="#1E293B" stroke="#0F172A" stroke-width="3.5"/>
          <rect x="78" y="24" width="48" height="32" rx="10" fill="#1E293B" stroke="#0F172A" stroke-width="3.5"/>
          <line x1="24" y1="30" x2="36" y2="48" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.65"/>
          <line x1="88" y1="30" x2="100" y2="48" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.65"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'props_pixel_shades',
    name: '8-Bit Shades',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70">
        <g filter="drop-shadow(0 3px 4px rgba(0,0,0,0.22))">
          <path d="M6 20 H134 V28 H126 V36 H118 V44 H86 V36 H78 V28 H62 V36 H54 V44 H22 V36 H14 V28 H6 Z" fill="#0F172A"/>
          <rect x="20" y="26" width="8" height="6" fill="#FFFFFF"/>
          <rect x="28" y="32" width="8" height="6" fill="#FFFFFF"/>
          <rect x="84" y="26" width="8" height="6" fill="#FFFFFF"/>
          <rect x="92" y="32" width="8" height="6" fill="#FFFFFF"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'party_hat',
    name: 'Party Cone',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <path d="M60 22 L24 96 Q60 108 96 96 Z" fill="#A855F7" stroke="#581C87" stroke-width="3.2" stroke-linejoin="round"/>
          <circle cx="52" cy="58" r="5" fill="#FEF08A"/>
          <circle cx="70" cy="70" r="5" fill="#F472B6"/>
          <circle cx="44" cy="82" r="5" fill="#38BDF8"/>
          <circle cx="76" cy="90" r="4.5" fill="#4ADE80"/>
          <circle cx="60" cy="18" r="10" fill="#F43F5E" stroke="#881337" stroke-width="2.8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'angel_halo',
    name: 'Angel Halo',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80">
        <g filter="drop-shadow(0 0 8px rgba(250,204,21,0.55))">
          <ellipse cx="70" cy="40" rx="48" ry="14" fill="none" stroke="#FACC15" stroke-width="8"/>
          <ellipse cx="70" cy="40" rx="48" ry="14" fill="none" stroke="#FEF9C3" stroke-width="2.5"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'props_devil_horns',
    name: 'Devil Horns',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 90">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <path d="M28 70 C10 48, 16 18, 36 14 C30 34, 38 50, 48 62 Z" fill="#EF4444" stroke="#7F1D1D" stroke-width="3" stroke-linejoin="round"/>
          <path d="M112 70 C130 48, 124 18, 104 14 C110 34, 102 50, 92 62 Z" fill="#EF4444" stroke="#7F1D1D" stroke-width="3" stroke-linejoin="round"/>
          <path d="M24 70 Q70 46 116 70" fill="none" stroke="#7F1D1D" stroke-width="5" stroke-linecap="round"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'props_flower_crown',
    name: 'Flower Crown',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80">
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.16))">
          <path d="M16 56 Q70 36 124 56" fill="none" stroke="#15803D" stroke-width="5" stroke-linecap="round"/>
          <circle cx="34" cy="46" r="11" fill="#FBCFE8" stroke="#9D174D" stroke-width="2.2"/>
          <circle cx="34" cy="46" r="4" fill="#FACC15"/>
          <circle cx="70" cy="40" r="13" fill="#FFFFFF" stroke="#422006" stroke-width="2.2"/>
          <circle cx="70" cy="40" r="5" fill="#FACC15"/>
          <circle cx="106" cy="46" r="11" fill="#FBCFE8" stroke="#9D174D" stroke-width="2.2"/>
          <circle cx="106" cy="46" r="4" fill="#FACC15"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'props_speech_love',
    name: 'Love Bubble',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <path d="M20 22 H100 A12 12 0 0 1 112 34 V68 A12 12 0 0 1 100 80 H48 L26 98 L30 80 H20 A12 12 0 0 1 8 68 V34 A12 12 0 0 1 20 22 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M60 68 C60 68, 40 54, 40 40 C40 32, 48 28, 54 32 C58 34, 60 38, 60 38 C60 38, 62 34, 66 32 C72 28, 80 32, 80 40 C80 54, 60 68, 60 68 Z" fill="#F43F5E"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'props_mustache',
    name: 'Dapper Stache',
    category: 'props',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <path d="M70 32 C56 18, 34 22, 22 36 C14 44, 6 38, 10 30 C4 42, 16 54, 34 50 C50 46, 62 38, 70 38 C78 38, 90 46, 106 50 C124 54, 136 42, 130 30 C134 38, 126 44, 118 36 C106 22, 84 18, 70 32 Z" fill="#1E293B" stroke="#FFFFFF" stroke-width="2.5"/>
        </g>
      </svg>
    `),
  },

  // ==========================================
  // 3. Y2K & CYBER SPARKLES
  // ==========================================
  {
    id: 'star_chrome',
    name: 'Y2K Chrome Star',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#F8FAFC"/>
            <stop offset="50%" stop-color="#94A3B8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        <g filter="drop-shadow(0 3px 6px rgba(0,0,0,0.22))">
          <path d="M60 8 Q60 60 112 60 Q60 60 60 112 Q60 60 8 60 Q60 60 60 8 Z" fill="url(#chrome)" stroke="#1E293B" stroke-width="2.5"/>
          <circle cx="60" cy="60" r="6" fill="#FFFFFF"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'butterfly_cyber',
    name: 'Cyber Butterfly',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <path d="M58 56 C36 20, 8 26, 14 54 C18 70, 44 68, 58 60 Z" fill="#60A5FA" stroke="#1E3A8A" stroke-width="3"/>
          <path d="M62 56 C84 20, 112 26, 106 54 C102 70, 76 68, 62 60 Z" fill="#60A5FA" stroke="#1E3A8A" stroke-width="3"/>
          <path d="M58 62 C38 68, 22 92, 38 100 C50 106, 56 82, 58 66 Z" fill="#A855F7" stroke="#1E3A8A" stroke-width="3"/>
          <path d="M62 62 C82 68, 98 92, 82 100 C70 106, 64 82, 62 66 Z" fill="#A855F7" stroke="#1E3A8A" stroke-width="3"/>
          <rect x="57" y="42" width="6" height="36" rx="3" fill="#1E293B"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'pixel_heart',
    name: '8-Bit Pixel Heart',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 4px rgba(0,0,0,0.2))">
          <path d="M24 24 h24 v12 h24 v-12 h24 v12 h12 v36 h-12 v12 h-12 v12 h-12 v12 h-24 v-12 h-12 v-12 h-12 v-12 h-12 v-36 h12 z" fill="#EC4899" stroke="#111827" stroke-width="4"/>
          <rect x="24" y="36" width="12" height="12" fill="#FFFFFF" opacity="0.8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'sparkle_trio',
    name: 'Glitter Trio',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))">
          <path d="M44 14 Q44 48 78 48 Q44 48 44 82 Q44 48 10 48 Q44 48 44 14 Z" fill="#FACC15" stroke="#713F12" stroke-width="2.2"/>
          <path d="M88 54 Q88 76 110 76 Q88 76 88 98 Q88 76 66 76 Q88 76 88 54 Z" fill="#F472B6" stroke="#831843" stroke-width="2.2"/>
          <path d="M36 74 Q36 90 52 90 Q36 90 36 106 Q36 90 20 90 Q36 90 36 74 Z" fill="#38BDF8" stroke="#0C4A6E" stroke-width="2"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'cd_holo',
    name: 'Holo Disc',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#A5F3FC"/>
            <stop offset="35%" stop-color="#F0ABFC"/>
            <stop offset="70%" stop-color="#FEF08A"/>
            <stop offset="100%" stop-color="#818CF8"/>
          </linearGradient>
        </defs>
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <circle cx="60" cy="60" r="46" fill="url(#holo)" stroke="#334155" stroke-width="3"/>
          <circle cx="60" cy="60" r="14" fill="#FFFFFF" stroke="#334155" stroke-width="3"/>
          <circle cx="60" cy="60" r="5" fill="#94A3B8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'y2k_tamagotchi',
    name: 'Tamagotchi Egg',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <circle cx="60" cy="14" r="7" fill="none" stroke="#94A3B8" stroke-width="3"/>
          <path d="M60 20 C34 20, 22 50, 24 76 C26 98, 42 108, 60 108 C78 108, 94 98, 96 76 C98 50, 86 20, 60 20 Z" fill="#F472B6" stroke="#831843" stroke-width="3.2"/>
          <rect x="38" y="42" width="44" height="34" rx="6" fill="#D9F99D" stroke="#365314" stroke-width="2.8"/>
          <!-- Pixel Pet Inside Screen -->
          <rect x="52" y="54" width="16" height="12" fill="#365314"/>
          <rect x="55" y="57" width="3" height="3" fill="#D9F99D"/>
          <rect x="62" y="57" width="3" height="3" fill="#D9F99D"/>
          <!-- 3 Buttons -->
          <circle cx="46" cy="88" r="4" fill="#FEF08A" stroke="#831843" stroke-width="2"/>
          <circle cx="60" cy="92" r="4" fill="#FEF08A" stroke="#831843" stroke-width="2"/>
          <circle cx="74" cy="88" r="4" fill="#FEF08A" stroke="#831843" stroke-width="2"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'y2k_flip_phone',
    name: 'Y2K Flip Phone',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))" transform="rotate(-12 60 60)">
          <line x1="74" y1="8" x2="74" y2="24" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
          <rect x="38" y="18" width="44" height="44" rx="10" fill="#F9A8D4" stroke="#831843" stroke-width="3"/>
          <rect x="45" y="25" width="30" height="28" rx="4" fill="#E0F2FE" stroke="#0369A1" stroke-width="2"/>
          <path d="M60 44 C60 44, 52 38, 52 33 C52 30, 56 29, 60 33 C64 29, 68 30, 68 33 C68 38, 60 44, 60 44 Z" fill="#EC4899"/>
          <rect x="38" y="64" width="44" height="46" rx="10" fill="#F472B6" stroke="#831843" stroke-width="3"/>
          <circle cx="60" cy="76" r="6" fill="#FBCFE8" stroke="#831843" stroke-width="2"/>
          <rect x="46" y="88" width="28" height="14" rx="3" fill="#FBCFE8"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'y2k_cassette',
    name: 'Retro Mixtape',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <rect x="14" y="18" width="112" height="68" rx="10" fill="#A855F7" stroke="#3B0764" stroke-width="3.2"/>
          <rect x="24" y="28" width="92" height="36" rx="5" fill="#FEF08A" stroke="#3B0764" stroke-width="2.5"/>
          <rect x="38" y="38" width="64" height="18" rx="9" fill="#3B0764"/>
          <circle cx="50" cy="47" r="6" fill="#FFFFFF"/>
          <circle cx="90" cy="47" r="6" fill="#FFFFFF"/>
          <path d="M34 86 L42 70 H98 L106 86 Z" fill="#7E22CE" stroke="#3B0764" stroke-width="2.5"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'y2k_saturn',
    name: 'Cyber Planet',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <circle cx="70" cy="50" r="24" fill="#F472B6" stroke="#831843" stroke-width="3"/>
          <ellipse cx="70" cy="52" rx="54" ry="14" transform="rotate(-16 70 52)" fill="none" stroke="#38BDF8" stroke-width="6"/>
          <ellipse cx="70" cy="52" rx="54" ry="14" transform="rotate(-16 70 52)" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'y2k_headphones',
    name: 'Y2K Headphones',
    category: 'y2k',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <path d="M24 68 C24 30, 96 30, 96 68" fill="none" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="24" cy="70" rx="12" ry="18" fill="#F472B6" stroke="#1E293B" stroke-width="3"/>
          <ellipse cx="96" cy="70" rx="12" ry="18" fill="#F472B6" stroke="#1E293B" stroke-width="3"/>
          <path d="M24 64 L26 70 L20 70 Z" fill="#FFFFFF" opacity="0.6"/>
        </g>
      </svg>
    `),
  },

  // ==========================================
  // 4. SCRAPBOOK STAMPS & BADGES
  // ==========================================
  {
    id: 'stamp_now_playing',
    name: 'Now Playing ♫',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 76">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <rect x="6" y="10" width="168" height="56" rx="16" fill="#18181B" stroke="#FFFFFF" stroke-width="3"/>
          <!-- Mini Album Disc -->
          <circle cx="34" cy="38" r="16" fill="#F472B6" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="34" cy="38" r="5" fill="#18181B"/>
          <!-- Track Info & Progress Bar -->
          <text x="58" y="30" font-family="Arial, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" letter-spacing="1">NOW PLAYING ♫</text>
          <rect x="58" y="37" width="100" height="4" rx="2" fill="#3F3F46"/>
          <rect x="58" y="37" width="62" height="4" rx="2" fill="#F472B6"/>
          <circle cx="120" cy="39" r="4" fill="#FFFFFF"/>
          <!-- Playback Controls -->
          <text x="108" y="56" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#FAFAFA" text-anchor="middle" letter-spacing="6">⏮ ▶ ⏭</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_core_memory',
    name: 'Core Memory Stamp',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Postage Stamp Perforated Outer Frame -->
          <rect x="14" y="12" width="112" height="86" rx="4" fill="#FFFFFF" stroke="#E11D48" stroke-width="3" stroke-dasharray="6 4"/>
          <rect x="22" y="20" width="96" height="70" rx="2" fill="#FFF1F2" stroke="#E11D48" stroke-width="2"/>
          <!-- Heart Emblem & Stamp Typography -->
          <path d="M70 58 C70 58, 52 46, 52 35 C52 28, 60 25, 65 29 C68 31, 70 34, 70 34 C70 34, 72 31, 75 29 C80 25, 88 28, 88 35 C88 46, 70 58, 70 58 Z" fill="#FB7185"/>
          <text x="70" y="72" font-family="Arial, sans-serif" font-weight="900" font-size="11.5" fill="#9F1239" text-anchor="middle" letter-spacing="1.2">CORE MEMORY</text>
          <text x="70" y="83" font-family="monospace, sans-serif" font-weight="700" font-size="9" fill="#E11D48" text-anchor="middle">★ SPECIAL EDITION ★</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_lucky_ticket',
    name: 'Lucky Ticket',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 84">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <!-- Ticket Body with Side Cutout Notches -->
          <path d="M14 16 H156 V32 A10 10 0 0 0 156 52 V68 H14 V52 A10 10 0 0 0 14 32 Z" fill="#FEF3C7" stroke="#92400E" stroke-width="3" stroke-linejoin="round"/>
          <line x1="122" y1="18" x2="122" y2="66" stroke="#92400E" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="68" y="38" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#78350F" text-anchor="middle" letter-spacing="1.5">LUCKY TICKET</text>
          <text x="68" y="54" font-family="monospace, sans-serif" font-weight="700" font-size="10" fill="#B45309" text-anchor="middle">★ ADMIT ONE ★</text>
          <text x="138" y="46" font-family="monospace, sans-serif" font-weight="900" font-size="12" fill="#92400E" text-anchor="middle">№77</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_besties',
    name: 'Besties Badge',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <rect x="8" y="16" width="144" height="48" rx="24" fill="#FFF1F2" stroke="#E11D48" stroke-width="4"/>
          <text x="80" y="46" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#E11D48" text-anchor="middle" letter-spacing="1.5">BESTIES ♡</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_xoxo',
    name: 'XOXO Love',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 80">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
          <rect x="10" y="16" width="130" height="48" rx="14" fill="#F43F5E" stroke="#FFFFFF" stroke-width="4"/>
          <text x="75" y="48" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">XOXO ♥</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_washi_tape',
    name: 'Pink Washi Tape',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 64">
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.14))" transform="rotate(-3 85 32)">
          <path d="M12 14 L158 14 L154 24 L160 32 L154 40 L158 50 L12 50 L16 40 L10 32 L16 24 Z" fill="#FBCFE8" opacity="0.92" stroke="#F472B6" stroke-width="2"/>
          <text x="85" y="37" font-family="Arial, sans-serif" font-weight="800" font-size="13" fill="#9D174D" text-anchor="middle" letter-spacing="1.5">♡ SWEET MOMENT ♡</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_smile_cam',
    name: 'REC Cam Stamp',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 76">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <rect x="10" y="14" width="140" height="48" rx="10" fill="#0F172A" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="34" cy="38" r="7" fill="#EF4444"/>
          <text x="88" y="44" font-family="monospace, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">REC • SMILE</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_angel_club',
    name: 'Angel Club',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 80">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))">
          <rect x="14" y="18" width="142" height="44" rx="22" fill="#E0F2FE" stroke="#0284C7" stroke-width="3.5"/>
          <text x="85" y="45" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="#0369A1" text-anchor="middle" letter-spacing="1.5">༺ ANGEL CLUB ༻</text>
        </g>
      </svg>
    `),
  },
  {
    id: 'stamp_barcode_love',
    name: 'Archive Barcode',
    category: 'stamps',
    svgDataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 80">
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.16))">
          <rect x="12" y="12" width="126" height="56" rx="8" fill="#FFFFFF" stroke="#1E293B" stroke-width="3"/>
          <path d="M26 22 v26 M32 22 v26 M36 22 v26 M44 22 v26 M48 22 v26 M56 22 v26 M64 22 v26 M68 22 v26 M76 22 v26 M84 22 v26 M90 22 v26 M98 22 v26 M104 22 v26 M112 22 v26 M118 22 v26 M124 22 v26" stroke="#1E293B" stroke-width="2.5"/>
          <text x="75" y="60" font-family="monospace, sans-serif" font-weight="800" font-size="10" fill="#1E293B" text-anchor="middle" letter-spacing="2">143-ARCHIVE-♡</text>
        </g>
      </svg>
    `),
  },
];

// Singleton cache of preloaded HTMLImageElement instances for 0ms synchronous Canvas drawing
const stickerImageCache = new Map<string, HTMLImageElement>();
let preloadPromise: Promise<Map<string, HTMLImageElement>> | null = null;

export function preloadAllStickerImages(): Promise<Map<string, HTMLImageElement>> {
  if (preloadPromise) return preloadPromise;

  preloadPromise = Promise.all(
    STICKER_CATALOG.map(
      (s) =>
        new Promise<void>((resolve) => {
          if (stickerImageCache.has(s.id)) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => {
            stickerImageCache.set(s.id, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = s.svgDataUrl;
        })
    )
  ).then(() => stickerImageCache);

  return preloadPromise;
}

export function getStickerImageMap(): Map<string, HTMLImageElement> {
  return stickerImageCache;
}

/**
 * Registers an uploaded custom sticker data URL into the synchronous cache for immediate canvas rendering.
 */
export function registerCustomStickerImage(id: string, dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    if (stickerImageCache.has(id)) {
      resolve(stickerImageCache.get(id)!);
      return;
    }
    const img = new Image();
    img.onload = () => {
      stickerImageCache.set(id, img);
      resolve(img);
    };
    img.onerror = () => resolve(img);
    img.src = dataUrl;
  });
}

/**
 * Ensures any user-uploaded custom stickers in placedStickers are preloaded into image cache
 * before export or canvas drawing.
 */
export async function preloadPlacedStickers(placedStickers?: PlacedSticker[]): Promise<void> {
  if (!placedStickers || placedStickers.length === 0) return;
  const promises = placedStickers
    .filter((s) => s.customDataUrl && !stickerImageCache.has(s.stickerId))
    .map((s) => registerCustomStickerImage(s.stickerId, s.customDataUrl!));
  await Promise.all(promises);
}
