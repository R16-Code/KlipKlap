import React, { useRef, useEffect, useState } from 'react';
import { Camera, RotateCcw, AlertCircle, ArrowLeftRight, Check, Sparkles, X, FlipHorizontal, Maximize2 } from 'lucide-react';
import { useBoothStore } from '../../stores/useBoothStore';
import { getLayoutDimensions, loadImage, renderPhotostripSync } from '../../utils/canvasComposer';
import { LAYOUT_CONFIGS, getFittingLayout } from '../../utils/constants';
import { preloadAllStickerImages } from '../../utils/stickers';

interface EditorCanvasProps {
  isDrawerOpen?: boolean;
}

interface DragState {
  pointerId: number;
  mode: 'move' | 'transform';
  stickerId: string;
  startClientX: number;
  startClientY: number;
  initialX: number;
  initialY: number;
  initialScale: number;
  initialRotation: number;
  centerClientX: number;
  centerClientY: number;
  startDist: number;
  startAngle: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ isDrawerOpen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const videoElementsRef = useRef<Map<number, HTMLVideoElement>>(new Map());
  const preloadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const customBgImageRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoadedKey, setImagesLoadedKey] = useState<number>(0);
  const [bgLoadedKey, setBgLoadedKey] = useState<number>(0);
  const [stickersLoadedKey, setStickersLoadedKey] = useState<number>(0);

  const {
    capturedPhotos,
    layout,
    setLayout,
    selectedFrame,
    customBackground,
    placedStickers,
    selectedStickerId,
    setSelectedStickerId,
    updateSticker,
    removeSticker,
    selectedFilter,
    studioSettings,
    setCurrentStep,
    swapPhotos,
    previewMode,
    setPreviewMode,
    setStudioVideoElements,
  } = useBoothStore();

  const [selectedSwapIndex, setSelectedSwapIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const layoutConfig = LAYOUT_CONFIGS[layout];
  const requiredCount = layoutConfig.photoCount;
  const missingCount = requiredCount - capturedPhotos.length;
  const isIncomplete = missingCount > 0;
  const fittingLayout = getFittingLayout(capturedPhotos.length);
  const hasLiveMotion = capturedPhotos.some((p) => Boolean(p.videoUrl));

  const handleSlotClick = (index: number) => {
    if (selectedSwapIndex === null) {
      setSelectedSwapIndex(index);
    } else if (selectedSwapIndex === index) {
      setSelectedSwapIndex(null);
    } else {
      swapPhotos(selectedSwapIndex, index);
      setSelectedSwapIndex(null);
    }
  };

  // Keep studio video elements registered in global store for export reuse
  useEffect(() => {
    setStudioVideoElements(videoElementsRef.current);
    return () => {
      setStudioVideoElements(null);
    };
  }, [capturedPhotos, setStudioVideoElements]);

  // Preload photo images once whenever capturedPhotos changes
  useEffect(() => {
    let isCurrent = true;
    const map = new Map<number, HTMLImageElement>();

    Promise.all(
      capturedPhotos.map(async (photo) => {
        try {
          const img = await loadImage(photo.dataUrl);
          if (isCurrent) {
            map.set(photo.poseIndex, img);
          }
        } catch {
          // ignore load failure
        }
      })
    ).then(() => {
      if (isCurrent) {
        preloadedImagesRef.current = map;
        setImagesLoadedKey((k) => k + 1);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [capturedPhotos]);

  // Preload custom background image whenever customBackground changes
  useEffect(() => {
    let isCurrent = true;
    if (customBackground?.type === 'upload' && customBackground.imageUrl) {
      loadImage(customBackground.imageUrl)
        .then((img) => {
          if (isCurrent) {
            customBgImageRef.current = img;
            setBgLoadedKey((k) => k + 1);
          }
        })
        .catch(() => {
          if (isCurrent) {
            customBgImageRef.current = null;
            setBgLoadedKey((k) => k + 1);
          }
        });
    } else {
      customBgImageRef.current = null;
      setBgLoadedKey((k) => k + 1);
    }

    return () => {
      isCurrent = false;
    };
  }, [customBackground?.type, customBackground?.imageUrl]);

  // Preload all SVG sticker images once into memory
  useEffect(() => {
    let isCurrent = true;
    preloadAllStickerImages().then(() => {
      if (isCurrent) {
        setStickersLoadedKey((k) => k + 1);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  // Pointer handlers for interactive sticker dragging, scaling & rotation
  const handleStickerPointerDown = (e: React.PointerEvent, stickerId: string) => {
    e.stopPropagation();
    const sticker = placedStickers.find((s) => s.id === stickerId);
    const overlay = overlayRef.current;
    if (!sticker || !overlay) return;

    setSelectedStickerId(stickerId);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const rect = overlay.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: e.pointerId,
      mode: 'move',
      stickerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialX: sticker.x,
      initialY: sticker.y,
      initialScale: sticker.scale,
      initialRotation: sticker.rotation,
      centerClientX: rect.left + sticker.x * rect.width,
      centerClientY: rect.top + sticker.y * rect.height,
      startDist: 1,
      startAngle: 0,
    };
  };

  const handleTransformPointerDown = (e: React.PointerEvent, stickerId: string) => {
    e.stopPropagation();
    const sticker = placedStickers.find((s) => s.id === stickerId);
    const overlay = overlayRef.current;
    if (!sticker || !overlay) return;

    setSelectedStickerId(stickerId);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const rect = overlay.getBoundingClientRect();
    const cx = rect.left + sticker.x * rect.width;
    const cy = rect.top + sticker.y * rect.height;
    const startDist = Math.max(8, Math.hypot(e.clientX - cx, e.clientY - cy));
    const startAngle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;

    dragStateRef.current = {
      pointerId: e.pointerId,
      mode: 'transform',
      stickerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialX: sticker.x,
      initialY: sticker.y,
      initialScale: sticker.scale,
      initialRotation: sticker.rotation,
      centerClientX: cx,
      centerClientY: cy,
      startDist,
      startAngle,
    };
  };

  const handleStickerPointerMove = (e: React.PointerEvent) => {
    const drag = dragStateRef.current;
    const overlay = overlayRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !overlay) return;

    e.stopPropagation();
    const rect = overlay.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (drag.mode === 'move') {
      const dx = (e.clientX - drag.startClientX) / rect.width;
      const dy = (e.clientY - drag.startClientY) / rect.height;
      const nextX = Math.max(0.04, Math.min(0.96, drag.initialX + dx));
      const nextY = Math.max(0.03, Math.min(0.97, drag.initialY + dy));
      updateSticker(drag.stickerId, { x: nextX, y: nextY });
    } else if (drag.mode === 'transform') {
      const currDist = Math.max(8, Math.hypot(e.clientX - drag.centerClientX, e.clientY - drag.centerClientY));
      const currAngle = (Math.atan2(e.clientY - drag.centerClientY, e.clientX - drag.centerClientX) * 180) / Math.PI;

      const scaleRatio = currDist / drag.startDist;
      const nextScale = Math.max(0.4, Math.min(2.5, Number((drag.initialScale * scaleRatio).toFixed(2))));

      let nextRot = Math.round(drag.initialRotation + (currAngle - drag.startAngle));
      while (nextRot > 180) nextRot -= 360;
      while (nextRot < -180) nextRot += 360;

      updateSticker(drag.stickerId, { scale: nextScale, rotation: nextRot });
    }
  };

  const handleStickerPointerUp = (e: React.PointerEvent) => {
    if (dragStateRef.current && dragStateRef.current.pointerId === e.pointerId) {
      dragStateRef.current = null;
    }
  };

  // Synchronize playback of in-DOM video elements with previewMode
  useEffect(() => {
    if (previewMode === 'motion') {
      videoElementsRef.current.forEach((v) => {
        v.play().catch(() => {});
      });
    } else {
      videoElementsRef.current.forEach((v) => {
        try {
          v.pause();
        } catch {
          // ignore
        }
      });
    }
  }, [previewMode]);

  // Re-compose photostrip onto canvas (single synchronous draw for photo, 60fps rAF loop for motion)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
    const previewScale = Math.min(dpr, 2.5);
    const dim = getLayoutDimensions(layout, previewScale);

    if (canvas.width !== dim.width || canvas.height !== dim.height) {
      canvas.width = dim.width;
      canvas.height = dim.height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (previewMode === 'motion') {
      let isMounted = true;
      let animationFrameId: number;

      // Start all in-DOM video elements playing
      videoElementsRef.current.forEach((v) => {
        v.play().catch(() => {});
      });

      const loop = () => {
        if (!isMounted) return;

        // When video export is active, pause preview loop to dedicate 100% CPU/GPU to export
        if (useBoothStore.getState().isExportingVideo) {
          animationFrameId = requestAnimationFrame(loop);
          return;
        }

        renderPhotostripSync(
          ctx,
          dim,
          {
            photos: capturedPhotos,
            layout,
            frameId: selectedFrame,
            filter: selectedFilter,
            settings: studioSettings,
            scale: previewScale,
            previewMode: 'motion',
            customBackground,
            customBgImage: customBgImageRef.current,
            placedStickers,
          },
          preloadedImagesRef.current,
          videoElementsRef.current
        );

        animationFrameId = requestAnimationFrame(loop);
      };

      animationFrameId = requestAnimationFrame(loop);

      return () => {
        isMounted = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } else {
      // Synchronous photo rendering
      renderPhotostripSync(
        ctx,
        dim,
        {
          photos: capturedPhotos,
          layout,
          frameId: selectedFrame,
          filter: selectedFilter,
          settings: studioSettings,
          scale: previewScale,
          previewMode: 'photo',
          customBackground,
          customBgImage: customBgImageRef.current,
          placedStickers,
        },
        preloadedImagesRef.current,
        videoElementsRef.current
      );
    }
  }, [
    capturedPhotos,
    layout,
    selectedFrame,
    customBackground,
    placedStickers,
    selectedFilter,
    studioSettings,
    previewMode,
    imagesLoadedKey,
    bgLoadedKey,
    stickersLoadedKey,
  ]);

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-1 sm:p-3 select-none relative overflow-y-auto lg:overflow-hidden no-scrollbar">
      {/* Background Studio Light Accent */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-studio-blush/40 blur-3xl" />
      </div>

      {/* Floating Missing Photos Notification Banner */}
      {isIncomplete && (
        <div className="w-full max-w-xl mb-2 z-30 bg-amber-50/95 backdrop-blur-md border border-amber-300/80 rounded-2xl p-2.5 sm:px-4 sm:py-2 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2 animate-in fade-in duration-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-950">
                  Foto Belum Lengkap ({capturedPhotos.length}/{requiredCount})
                </span>
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                  Kurang {missingCount}
                </span>
              </div>
              <p className="text-[10.5px] text-amber-900/80 leading-tight">
                Layout <strong>{layoutConfig.name}</strong> butuh {requiredCount} foto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Option 1: Back to Live Capture */}
            <button
              type="button"
              onClick={() => setCurrentStep('booth')}
              className="px-2.5 py-1 rounded-xl bg-studio-charcoal text-white hover:bg-black text-[11px] font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Camera className="w-3 h-3 text-amber-300" />
              <span>Ambil {missingCount} Lagi</span>
            </button>

            {/* Option 2: Switch to fitting layout */}
            {fittingLayout && fittingLayout !== layout && (
              <button
                type="button"
                onClick={() => setLayout(fittingLayout)}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300/90 text-amber-900 hover:bg-amber-100/70 text-[11px] font-semibold flex items-center gap-1 shadow-soft-sm active:scale-95 transition-all"
              >
                <RotateCcw className="w-3 h-3 text-amber-700" />
                <span>Gunakan {LAYOUT_CONFIGS[fittingLayout].name}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Preview Mode Switcher (Photo vs Live Motion) */}
      <div className="z-20 flex items-center justify-center gap-2 mb-1.5 sm:mb-2 shrink-0">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-black/[0.08] shadow-soft-sm">
          <button
            type="button"
            onClick={() => setPreviewMode('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              previewMode === 'photo'
                ? 'bg-studio-charcoal text-white shadow-soft-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto Klasik</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode('motion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              previewMode === 'motion'
                ? 'bg-studio-charcoal text-white shadow-soft-sm ring-1 ring-amber-400/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${previewMode === 'motion' ? 'text-amber-300 animate-spin' : 'text-amber-500'}`} />
            <span>Live Motion</span>
            {hasLiveMotion && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Photo Reorder Bar (Positioned cleanly ABOVE the photostrip frame) */}
      {capturedPhotos.length > 1 && (
        <div className="z-20 bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-soft-sm flex items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-2 shrink-0 max-w-[95%]">
          <div className="flex items-center gap-1 sm:gap-1.5 text-studio-graphite shrink-0">
            <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-500" />
            <span className="text-[10px] sm:text-[11px] font-bold text-studio-graphite whitespace-nowrap">
              Tukar Posisi:
            </span>
          </div>

          {/* Horizontal Thumbnail Slots */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {Array.from({ length: requiredCount }).map((_, slotIdx) => {
              const photo = capturedPhotos.find((p) => p.poseIndex === slotIdx);
              const isSelected = selectedSwapIndex === slotIdx;

              return (
                <div
                  key={slotIdx}
                  draggable={Boolean(photo)}
                  onDragStart={() => setDraggedIndex(slotIdx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null && draggedIndex !== slotIdx) {
                      swapPhotos(draggedIndex, slotIdx);
                      setDraggedIndex(null);
                    }
                  }}
                  onClick={() => handleSlotClick(slotIdx)}
                  className={`relative rounded-lg sm:rounded-xl overflow-hidden border transition-all cursor-pointer select-none flex items-center justify-center shrink-0 w-7 h-7 sm:w-10 sm:h-10 ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 shadow-md scale-105'
                      : photo
                      ? 'border-stone-200/90 bg-stone-900 hover:border-studio-graphite hover:scale-105'
                      : 'border-dashed border-stone-300 bg-stone-100/60 opacity-60'
                  }`}
                  title={
                    photo
                      ? `Slot 0${slotIdx + 1} - Klik atau seret untuk menukar posisi`
                      : `Slot 0${slotIdx + 1} Kosong`
                  }
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.dataUrl}
                        alt={`Cut ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 px-0.5 rounded bg-black/70 text-[7px] sm:text-[8px] font-mono font-bold text-white">
                        0{slotIdx + 1}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/35 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-[8.5px] sm:text-[9.5px] font-mono text-stone-400 font-bold">
                      0{slotIdx + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {selectedSwapIndex !== null && (
            <button
              type="button"
              onClick={() => setSelectedSwapIndex(null)}
              className="text-[9px] sm:text-[10px] text-blue-700 hover:text-blue-900 font-bold underline shrink-0 ml-1"
            >
              Batal
            </button>
          )}
        </div>
      )}

      {/* Photostrip Canvas Frame Wrapper (Realistic physical print feel) */}
      <div
        className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center transition-all duration-300"
        onClick={() => setSelectedStickerId(null)}
      >
        {/* Soft studio ambient drop shadow */}
        <div className="relative rounded-xl sm:rounded-2xl shadow-photo border border-black/[0.08] bg-white flex items-center justify-center p-0.5">
          <div ref={overlayRef} className="relative inline-block">
            <canvas
              ref={canvasRef}
              className={`block w-auto object-contain transition-all duration-300 max-w-[85vw] sm:max-w-[340px] lg:max-w-[420px] ${
                isDrawerOpen
                  ? 'max-h-[35dvh] sm:max-h-[46dvh] lg:max-h-[66vh]'
                  : 'max-h-[56dvh] sm:max-h-[62dvh] lg:max-h-[66vh]'
              }`}
              style={{ imageRendering: 'auto' }}
            />

            {/* Interactive Draggable / Resizable / Rotatable Sticker Overlay */}
            {placedStickers.length > 0 && (
              <div className="absolute inset-0 overflow-visible pointer-events-none z-20">
                {placedStickers.map((sticker) => {
                  const isSelected = selectedStickerId === sticker.id;
                  const boxWidthPercent = 20 * (sticker.scale || 1);

                  return (
                    <div
                      key={sticker.id}
                      onPointerDown={(e) => handleStickerPointerDown(e, sticker.id)}
                      onPointerMove={handleStickerPointerMove}
                      onPointerUp={handleStickerPointerUp}
                      onPointerCancel={handleStickerPointerUp}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        left: `${sticker.x * 100}%`,
                        top: `${sticker.y * 100}%`,
                        width: `${boxWidthPercent}%`,
                        aspectRatio: '1 / 1',
                        transform: `translate3d(-50%, -50%, 0) rotate(${sticker.rotation}deg)`,
                      }}
                      className={`absolute pointer-events-auto touch-none cursor-grab active:cursor-grabbing rounded-lg transition-shadow ${
                        isSelected
                          ? 'border-2 border-dashed border-amber-400 bg-amber-400/10 shadow-sm'
                          : 'border border-transparent hover:border-white/70'
                      }`}
                    >
                      {isSelected && (
                        <>
                          {/* Top-Right Delete Button */}
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSticker(sticker.id);
                            }}
                            title="Hapus Stiker"
                            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md flex items-center justify-center active:scale-90"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          {/* Top-Left Flip Button */}
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSticker(sticker.id, { flipX: !sticker.flipX });
                            }}
                            title="Balik Stiker"
                            className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-studio-charcoal hover:bg-black text-white shadow-md flex items-center justify-center active:scale-90"
                          >
                            <FlipHorizontal className="w-2.5 h-2.5" />
                          </button>

                          {/* Bottom-Right Resize & Rotate Drag Handle */}
                          <div
                            onPointerDown={(e) => handleTransformPointerDown(e, sticker.id)}
                            onPointerMove={handleStickerPointerMove}
                            onPointerUp={handleStickerPointerUp}
                            onPointerCancel={handleStickerPointerUp}
                            title="Tarik untuk Perbesar & Putar"
                            className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center justify-center cursor-nwse-resize touch-none"
                          >
                            <Maximize2 className="w-2.5 h-2.5" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Glossy Paper Sheen Overlay (Korean Photostrip paper finish) */}
          <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />
        </div>
      </div>

      {/* Active in-DOM video elements for Live Motion GPU decoding (non-throttled by browser) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '240px',
          zIndex: -9999,
          opacity: 0.01,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {capturedPhotos.map((photo) =>
          photo.videoUrl ? (
            <video
              key={`${photo.id}_${photo.videoUrl}`}
              ref={(el) => {
                if (el) {
                  videoElementsRef.current.set(photo.poseIndex, el);
                  if (previewMode === 'motion') {
                    el.play().catch(() => {});
                  }
                } else {
                  videoElementsRef.current.delete(photo.poseIndex);
                }
              }}
              src={photo.videoUrl}
              style={{ width: '320px', height: '240px', objectFit: 'cover' }}
              autoPlay
              loop
              muted
              playsInline
              crossOrigin="anonymous"
            />
          ) : null
        )}
      </div>
    </div>
  );
};
