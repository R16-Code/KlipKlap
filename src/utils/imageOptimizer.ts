/**
 * Utility to optimize user-uploaded background images:
 * - Safely downscales the image so the maximum dimension is capped at 1600px.
 * - Compresses to JPEG (0.88 quality) to keep RAM usage low (~1-2MB) even on budget devices.
 * - Protects against memory leaks and browser crashes from 4K/8K mobile phone camera uploads.
 */

export async function optimizeBackgroundImage(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan format gambar yang valid.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Downscale while preserving aspect ratio
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(reader.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Clean JPEG compression: visually lossless for photostrip frames, tiny memory footprint
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(optimizedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

