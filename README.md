# KlipKlap

A browser-based photo booth application that replicates the Korean photo booth (photobooth) experience. Users capture a sequence of photos through their device camera, then customize and export a composed photo strip in multiple layouts and styles.

[Live Demo](https://klipklap-studio.vercel.app/)

---

## Key Features

- **Multi-shot capture sequence** — Automated countdown timer (3, 5, or 10 seconds) triggers sequential captures across user-defined pose counts.
- **Seven layout presets** — Classic Strip 1x4, Trio Strip 1x3, Duo Strip 1x2, Solo Polaroid 1x1, Studio Grid 2x2, Portrait Grid 2x3, and Mega Collage 3x3.
- **Filter presets** — Applies CSS-based image filters (grayscale, sepia, vivid, muted, etc.) to the composed strip in real time.
- **Frame and color customization** — Selectable frame color, border width, and slot calibration per layout.
- **Photo reordering** — Drag or swap individual captured frames within the strip before export.
- **Live Motion mode** — Animates captured frames as a looping sequence, exportable as GIF (suitable for WhatsApp, X/Twitter) or MP4 (suitable for Instagram, TikTok).
- **MP4 export** — Deterministic frame-by-frame encoding via the WebCodecs API (`VideoEncoder`) and `mp4-muxer`, producing a 24 FPS video with zero frame drops.
- **GIF export** — Frame-by-frame palette quantization via `gifenc`, producing a compact looping animation.
- **Static strip export** — Composites the final photo strip to a `<canvas>` element and downloads it as a PNG.
- **Camera controls** — Mirror toggle, front/rear camera switching (on supported devices), simulated camera mode for development.
- **Fully responsive layout** — Dedicated desktop (12-column grid) and mobile (single-column dock) interfaces, with no shared component coupling between breakpoints.
- **No server dependency** — All capture, composition, and encoding logic runs entirely in the browser. No data is uploaded.

---

## Technology Stack

| Category | Technology |
|---|---|
| Language | TypeScript 6 |
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand 5 |
| GIF Encoding | gifenc 1.0 |
| MP4 Muxing | mp4-muxer 5.2 |
| Video Encoding | WebCodecs API (native browser) |
| Canvas Composition | HTML Canvas API (native browser) |
| Icons | lucide-react |
| Deployment | Vercel (SPA rewrite rules) |

---

## Project Structure

```
src/
  components/
    booth/          # Capture screen components (CameraView, ShutterControls, StripTray, MobileBoothDock)
    studio/         # Edit screen components (EditorCanvas, ExportSidebar, LayoutSelector, FramePicker, FilterPicker, PhotoReorderTray, MobileStudioEditor)
    common/         # Shared components (Header)
  hooks/
    useWebcam.ts    # Webcam lifecycle, frame capture, and video recording
  stores/
    useBoothStore.ts  # Global application state via Zustand
  utils/
    canvasComposer.ts  # Canvas composition, GIF encoding, and MP4 encoding logic
    constants.ts       # Layout configs, frame options, filter definitions
    audio.ts           # Shutter sound synthesis
  types/             # Shared TypeScript type definitions
```

---

## Application Flow

The application operates in two sequential screens controlled by `currentStep` in the global store.

1. **Booth** (`currentStep === 'booth'`) — User accesses the camera, sets a timer duration, and initiates a capture sequence. The application counts down and captures frames automatically, storing each as a base64-encoded data URL.
2. **Studio** (`currentStep === 'studio'`) — Captured frames are composed onto a canvas according to the selected layout. The user applies filters, adjusts the frame, reorders photos, and exports the final result.

---

## Local Development

**Prerequisites:** Node.js 18 or later.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Type-check and build for production
npm run build
```

The development server runs at `http://localhost:5173` by default.

Camera access requires a secure context (`localhost` or `https`). The application includes a simulated camera mode that can be toggled from the camera view for development without a physical camera.

---

## Browser Requirements

| Feature | Minimum Support |
|---|---|
| WebCodecs API (`VideoEncoder`) | Chrome 94+, Edge 94+ |
| Canvas API | All modern browsers |
| MediaDevices (`getUserMedia`) | All modern browsers over HTTPS |

GIF export is available on all modern browsers. MP4 export via WebCodecs is limited to Chromium-based browsers. Firefox and Safari users should use the GIF export path.

---

## License

This project is private and not licensed for public redistribution.
