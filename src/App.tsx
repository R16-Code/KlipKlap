import React from 'react';
import { Header } from './components/common/Header';
import { CameraView } from './components/booth/CameraView';
import { ShutterControls } from './components/booth/ShutterControls';
import { StripTray } from './components/booth/StripTray';
import { LayoutSelector } from './components/studio/LayoutSelector';
import { FramePicker } from './components/studio/FramePicker';
import { FilterPicker } from './components/studio/FilterPicker';
import { EditorCanvas } from './components/studio/EditorCanvas';
import { ExportSidebar } from './components/studio/ExportSidebar';
import { useBoothStore } from './stores/useBoothStore';
import { useWebcam } from './hooks/useWebcam';

export const App: React.FC = () => {
  const { currentStep, isMirrored } = useBoothStore();
  const webcam = useWebcam();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-milk text-studio-graphite font-sans select-none">
      {/* Editorial Header */}
      <Header />

      {/* Main Workspace Container */}
      <main className="flex-1 px-6 py-4 overflow-hidden flex flex-col min-h-0">
        {currentStep === 'booth' ? (
          /* ========================================================
             SCREEN 1: BOOTH / LIVE CAPTURE
             Split view: 70% live camera & shutter, 30% strip roll tray
             ======================================================== */
          <div className="flex-1 grid grid-cols-12 gap-5 h-full min-h-0 overflow-hidden">
            {/* Left 70% (col-span-8 or 9) - Live Camera View & Shutter */}
            <section aria-label="Webcam Capture Studio" className="col-span-8 lg:col-span-9 flex flex-col gap-3 h-full min-h-0 overflow-hidden">
              {/* Live Webcam Feed */}
              <div className="flex-1 w-full min-h-0 relative">
                <CameraView
                  videoRef={webcam.videoRef}
                  isLoading={webcam.isLoading}
                  error={webcam.error}
                  hasPermission={webcam.hasPermission}
                  startCamera={webcam.startCamera}
                  isSimulated={webcam.isSimulated}
                  toggleSimulationMode={webcam.toggleSimulationMode}
                  syncVideoRef={webcam.syncVideoRef}
                />
              </div>

              {/* Shutter & Timer Controls Bar */}
              <div className="shrink-0">
                <ShutterControls
                  onCaptureFrame={() => webcam.captureFrame(isMirrored, 4 / 3)}
                />
              </div>
            </section>

            {/* Right 30% (col-span-4 or 3) - Strip Roll Thumbnail Tray */}
            <div className="col-span-4 lg:col-span-3 h-full min-h-0 overflow-hidden">
              <StripTray />
            </div>
          </div>
        ) : (
          /* ========================================================
             SCREEN 2: STUDIO EDITOR & EXPORT
             Left sidebar controls, Center canvas preview, Right export sidebar
             ======================================================== */
          <div className="flex-1 grid grid-cols-12 gap-5 h-full min-h-0 overflow-hidden">
            {/* Left Sidebar: Customization Controls (col-span-3) */}
            <aside aria-label="Customization Controls" className="col-span-3 h-full min-h-0 flex flex-col bg-white/75 backdrop-blur-md rounded-3xl p-4 border border-black/[0.06] shadow-soft overflow-y-auto no-scrollbar space-y-4">
              <div className="pb-2 border-b border-stone-200/60">
                <h2 className="text-xs font-bold tracking-wider text-studio-graphite uppercase font-sans">
                  Styling & Layout
                </h2>
                <p className="text-[11px] text-stone-600 font-medium">
                  Select your photostrip aesthetics
                </p>
              </div>

              {/* 1. Layout Selector */}
              <LayoutSelector />

              {/* 2. Frame Color Picker */}
              <FramePicker />

              {/* 3. Filter Preset Picker */}
              <FilterPicker />
            </aside>

            {/* Center Stage: Realistic Glossy Photostrip Canvas Preview (col-span-6) */}
            <section aria-label="Photostrip Preview Stage" className="col-span-6 h-full min-h-0 flex items-center justify-center overflow-hidden">
              <EditorCanvas />
            </section>

            {/* Right Sidebar: Date/Title Stamp & Download PNG (col-span-3) */}
            <div className="col-span-3 h-full min-h-0 overflow-hidden">
              <ExportSidebar />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
