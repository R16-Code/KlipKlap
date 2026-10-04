import React from 'react';
import { Header } from './components/common/Header';
import { CameraView } from './components/booth/CameraView';
import { ShutterControls } from './components/booth/ShutterControls';
import { StripTray } from './components/booth/StripTray';
import { MobileBoothDock } from './components/booth/MobileBoothDock';
import { LayoutSelector } from './components/studio/LayoutSelector';
import { PhotoReorderTray } from './components/studio/PhotoReorderTray';
import { FramePicker } from './components/studio/FramePicker';
import { FilterPicker } from './components/studio/FilterPicker';
import { EditorCanvas } from './components/studio/EditorCanvas';
import { ExportSidebar } from './components/studio/ExportSidebar';
import { MobileStudioEditor } from './components/studio/MobileStudioEditor';
import { useBoothStore } from './stores/useBoothStore';
import { useWebcam } from './hooks/useWebcam';

export const App: React.FC = () => {
  const { currentStep, isMirrored } = useBoothStore();
  const webcam = useWebcam();

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-studio-milk text-studio-graphite font-sans select-none overscroll-none">
      {/* Editorial Header (Hidden on mobile Studio Editor to give maximum canvas space) */}
      <div className={currentStep === 'studio' ? 'hidden lg:block' : 'block'}>
        <Header />
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 p-2 sm:p-4 lg:px-6 lg:py-4 overflow-hidden flex flex-col min-h-0">
        {currentStep === 'booth' ? (
          <>
            {/* ========================================================
               DESKTOP: SCREEN 1 (lg: min-width 1024px)
               Split view: 70% live camera & shutter, 30% strip roll tray
               ======================================================== */}
            <div className="hidden lg:grid flex-1 grid-cols-12 gap-5 h-full min-h-0 overflow-hidden">
              {/* Left 70% (col-span-8 or 9) - Live Camera View & Shutter */}
              <section aria-label="Webcam Capture Studio" className="col-span-8 lg:col-span-9 flex flex-col gap-3 h-full min-h-0 overflow-hidden">
                {/* Live Webcam Feed */}
                <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                  <CameraView
                    videoRef={webcam.videoRef}
                    isLoading={webcam.isLoading}
                    error={webcam.error}
                    hasPermission={webcam.hasPermission}
                    startCamera={webcam.startCamera}
                    isSimulated={webcam.isSimulated}
                    toggleSimulationMode={webcam.toggleSimulationMode}
                    syncVideoRef={webcam.syncVideoRef}
                    facingMode={webcam.facingMode}
                    toggleFacingMode={webcam.toggleFacingMode}
                    hasMultipleCameras={webcam.hasMultipleCameras}
                  />
                </div>

                {/* Shutter & Timer Controls Bar */}
                <div className="shrink-0">
                  <ShutterControls
                    onCaptureFrame={() => webcam.captureFrame(isMirrored, 4 / 3)}
                    startVideoRecording={webcam.startVideoRecording}
                    stopVideoRecording={webcam.stopVideoRecording}
                    isMirrored={isMirrored && webcam.facingMode === 'user'}
                  />
                </div>
              </section>

              {/* Right 30% (col-span-4 or 3) - Strip Roll Thumbnail Tray */}
              <div className="col-span-4 lg:col-span-3 h-full min-h-0 overflow-hidden">
                <StripTray />
              </div>
            </div>

            {/* ========================================================
               MOBILE & TABLET: SCREEN 1 (< 1024px)
               Vertical stack: 60-65% Viewfinder, 35-40% Ergonomic Bottom Dock
               ======================================================== */}
            <div className="flex lg:hidden flex-col h-full min-h-0 overflow-hidden gap-2">
              {/* Top Viewfinder */}
              <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                <CameraView
                  videoRef={webcam.videoRef}
                  isLoading={webcam.isLoading}
                  error={webcam.error}
                  hasPermission={webcam.hasPermission}
                  startCamera={webcam.startCamera}
                  isSimulated={webcam.isSimulated}
                  toggleSimulationMode={webcam.toggleSimulationMode}
                  syncVideoRef={webcam.syncVideoRef}
                  facingMode={webcam.facingMode}
                  toggleFacingMode={webcam.toggleFacingMode}
                  hasMultipleCameras={webcam.hasMultipleCameras}
                />
              </div>

              {/* Tactile Mobile Bottom Dock */}
              <div className="shrink-0">
                <MobileBoothDock
                  onCaptureFrame={() => webcam.captureFrame(isMirrored, 4 / 3)}
                  startVideoRecording={webcam.startVideoRecording}
                  stopVideoRecording={webcam.stopVideoRecording}
                  isMirrored={isMirrored && webcam.facingMode === 'user'}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ========================================================
               DESKTOP: SCREEN 2 (lg: min-width 1024px)
               3-column studio layout (Left tools, Center canvas, Right export)
               ======================================================== */}
            <div className="hidden lg:grid flex-1 grid-cols-12 gap-5 h-full min-h-0 overflow-hidden">
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

                {/* 2. Photo Reorder & Swap Tray */}
                <PhotoReorderTray />

                {/* 3. Frame Color Picker & Slot Calibrator */}
                <FramePicker />

                {/* 4. Filter Preset Picker */}
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

            {/* ========================================================
               MOBILE & TABLET: SCREEN 2 (< 1024px)
               Mobile Studio Editor with compact bar, pinchable canvas & drawer
               ======================================================== */}
            <div className="flex lg:hidden flex-col h-full min-h-0 overflow-hidden">
              <MobileStudioEditor />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
