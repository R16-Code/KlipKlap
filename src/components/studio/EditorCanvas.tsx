import React, { useRef, useEffect } from 'react';
import { useBoothStore } from '../../stores/useBoothStore';
import { composePhotostrip } from '../../utils/canvasComposer';

export const EditorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    capturedPhotos,
    layout,
    selectedFrame,
    customFrames,
    selectedFilter,
    studioSettings,
  } = useBoothStore();

  // Re-compose photostrip onto canvas whenever settings or photos update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;

    const render = async () => {
      const activeCustomFrame = customFrames.find((f) => f.id === selectedFrame);
      // Scale 1.5 gives crisp retina display rendering inside the UI container
      await composePhotostrip(canvas, {
        photos: capturedPhotos,
        layout,
        frameId: selectedFrame,
        customFrame: activeCustomFrame,
        filter: selectedFilter,
        settings: studioSettings,
        scale: 1.5,
      });
      if (!isMounted) return;
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [capturedPhotos, layout, selectedFrame, selectedFilter, studioSettings]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background Studio Light Accent */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-studio-blush/40 blur-3xl" />
      </div>

      {/* Photostrip Canvas Frame Wrapper (Realistic physical print feel) */}
      <div className="relative z-10 max-h-[92%] flex items-center justify-center transition-all duration-300 transform hover:scale-[1.005]">
        {/* Soft studio ambient drop shadow */}
        <div className="relative rounded-2xl shadow-photo overflow-hidden border border-black/[0.08] bg-white">
          <canvas
            ref={canvasRef}
            className="block max-h-[74vh] w-auto max-w-[85vw] object-contain transition-all"
            style={{ imageRendering: 'auto' }}
          />

          {/* Glossy Paper Sheen Overlay (Korean Photostrip paper finish) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />
        </div>
      </div>
    </div>
  );
};
