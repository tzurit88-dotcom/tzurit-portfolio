import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronRight, ChevronLeft, Monitor, Smartphone } from 'lucide-react';
import { CarouselImages } from '../types';

interface SystemOverviewProps {
  images: string[];
  isPressPective?: boolean;
  carouselImages?: CarouselImages;
}

type ViewMode = 'lecturer' | 'student-desktop' | 'student-mobile';

// Arrow button half-height (h-10 = 40px → half = 20px)
const ARROW_HALF = 20;

export default function SystemOverview({ images, isPressPective, carouselImages }: SystemOverviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(isPressPective ? 'student-desktop' : 'lecturer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIsMobile, setSelectedIsMobile] = useState(false);

  // Measured from the image area container
  const [arrowMarginTop, setArrowMarginTop] = useState(0);
  const [standardHeight, setStandardHeight] = useState(0); // height of the 15:7 frame
  const [mobileImgWidth, setMobileImgWidth] = useState(240);

  const imageAreaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isMobile = viewMode === 'student-mobile';

  // Recalculate on resize or mode change
  const recalc = () => {
    if (!imageAreaRef.current) return;
    const w = imageAreaRef.current.offsetWidth;
    // Standard desktop height (15:7 ratio)
    const h = w * (7 / 15);
    setStandardHeight(h);
    const mobileW = Math.round(h / 2);
    const headerH = headerRef.current?.offsetHeight ?? 0;
    // Position arrow at vertical center of the standard image area
    const arrowMT = isMobile
      ? Math.max(0, headerH + mobileW - ARROW_HALF)
      : Math.max(0, headerH + h / 2 - ARROW_HALF);
    setArrowMarginTop(arrowMT);
    setMobileImgWidth(mobileW);
  };

  useEffect(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [viewMode]);

  const modeImages: Record<ViewMode, string[]> = {
    lecturer: carouselImages
      ? carouselImages.lecturer
      : isPressPective
        ? [images[5]]
        : [images[1] || images[0], images[2] || images[0], images[3] || images[0]],
    'student-desktop': carouselImages
      ? carouselImages.studentDesktop
      : isPressPective
        ? [images[0], images[1], images[2], images[3], images[4]]
        : [images[0] || images[1], images[3] || images[1]],
    'student-mobile': carouselImages
      ? carouselImages.studentMobile
      : isPressPective
        ? [images[0]]
        : [images[4] || images[0], images[5] || images[0], images[6] || images[0], images[7] || images[0]]
  };

  const displayImages = images.length > 0 ? modeImages[viewMode] : [
    'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1500&h=700',
  ];

  const modeTitles: Record<ViewMode, string[]> = {
    lecturer: carouselImages?.titles?.lecturer || [],
    'student-desktop': carouselImages?.titles?.studentDesktop || [],
    'student-mobile': carouselImages?.titles?.studentMobile || [],
  };
  const currentTitle = modeTitles[viewMode][currentIndex] || '';

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentIndex(0);
  };

  const nextSlide = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrentIndex((p) => (p + 1) % displayImages.length); };
  const prevSlide = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrentIndex((p) => (p - 1 + displayImages.length) % displayImages.length); };

  const openLightbox = (img: string) => { setSelectedImage(img); setSelectedIsMobile(isMobile); };

  // Subtle outside border
  const outerBorderShadow = '0 0 0 1.5px rgba(0,0,0,0.10)';

  const ArrowButton = ({ onClick, children }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-[#FDFCFA] border-2 border-black/10 flex items-center justify-center
                 hover:scale-110 active:scale-95 transition-all text-[#32404F]/40 hover:text-[#32404F] z-20 shrink-0"
    >
      {children}
    </button>
  );

  return (
    <section className="hidden md:block bg-[#FDFCFA] pb-14">

      {/* Header + Toggle — sticky row */}
      <div className="pt-10 pb-6 mb-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 shrink-0" />
            <div className="flex-1 min-w-0 flex items-center justify-between">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#32404F]/90">System Overview</h2>
              <div className="inline-flex items-center gap-1 p-1 bg-gray-100/80 border border-[#BEC2C6]/40 rounded-full">
            {(isPressPective
              ? [
                  { value: 'student-desktop', label: 'Student Interface' },
                  { value: 'lecturer', label: 'Teacher Interface' }
                ]
              : [
                  { value: 'lecturer', label: 'Lecturer' },
                  { value: 'student-desktop', label: 'Student Desktop' },
                  { value: 'student-mobile', label: 'Student Mobile' }
                ]
            ).map((mode) => (
              <button
                key={mode.value}
                onClick={() => handleModeChange(mode.value as ViewMode)}
                className={`
                  px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold
                  flex items-center gap-1.5 transition-colors duration-200
                  ${viewMode === mode.value
                    ? 'bg-[#32404F] text-[#FDFCFA]'
                    : 'text-[#32404F]/40 hover:text-[#32404F]/60 bg-transparent'}
                `}
              >
                {!isPressPective && (mode.value === 'student-mobile' ? <Smartphone size={11} /> : <Monitor size={11} />)}
                {mode.label}
              </button>
            ))}
              </div>
            </div>
            <div className="w-10 shrink-0" />
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-start gap-3">

          <div style={{ marginTop: arrowMarginTop }}><ArrowButton onClick={prevSlide}><ChevronLeft size={20} /></ArrowButton></div>

          {/* Frame */}
          <div ref={imageAreaRef} className="flex-1 min-w-0 bg-[#FDFCFA] rounded-2xl">

            {/* Title header */}
            <div ref={headerRef} className="px-5 py-3 flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${viewMode}-${currentIndex}-title`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-[14px] font-medium text-[#32404F]"
                >
                  {currentTitle || ' '}
                </motion.p>
              </AnimatePresence>
              <span className="text-[11px] text-[#32404F]/25 font-medium shrink-0 ml-4">
                {currentIndex + 1} / {displayImages.length}
              </span>
            </div>

            {isMobile ? (
              /* ── MOBILE ── */
              <div className="flex justify-center py-3 bg-[#FDFCFA]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${viewMode}-${currentIndex}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative cursor-pointer group"
                    style={{ width: `${mobileImgWidth}px` }}
                    onClick={() => openLightbox(displayImages[currentIndex])}
                  >
                    <img
                      src={displayImages[currentIndex]}
                      alt={`Screen ${currentIndex + 1}`}
                      className="w-full h-auto rounded-xl border border-[#BEC2C6]/65"
                    />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDFCFA]/90 shadow-md
                                    flex items-center justify-center text-[#32404F]/60
                                    opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Maximize2 size={15} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              /* ── DESKTOP ── */
              <div className="p-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${viewMode}-${currentIndex}`}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative cursor-pointer group"
                    onClick={() => openLightbox(displayImages[currentIndex])}
                  >
                    {/* Ring border at fixed 15:7 — z-0 so the in-flow image at z-[1]
                        covers it where the image overflows past the frame bottom */}
                    <div className="absolute inset-x-0 top-0 aspect-[15/7] rounded-xl pointer-events-none z-0 ring-1 ring-[#BEC2C6]/65" />
                    {/* Image in-flow — pushes all content below, z-[1] to cover ring at overflow edge */}
                    <img
                      src={displayImages[currentIndex]}
                      alt={`Screen ${currentIndex + 1}`}
                      className="relative w-full h-auto block rounded-xl z-[1]"
                    />
                    <div
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FDFCFA]/90 shadow-md
                                  flex items-center justify-center text-[#32404F]/60
                                  opacity-0 group-hover:opacity-100 transition-opacity z-[2]"
                      onClick={(e) => { e.stopPropagation(); openLightbox(displayImages[currentIndex]); }}
                    >
                      <Maximize2 size={15} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          <div style={{ marginTop: arrowMarginTop }}><ArrowButton onClick={nextSlide}><ChevronRight size={20} /></ArrowButton></div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {displayImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              i === currentIndex ? 'w-7 bg-[#32404F]/60' : 'w-2 bg-[#BEC2C6]/30'
            }`}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16 bg-black/95 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full View"
                className="rounded-2xl"
                style={
                  selectedIsMobile
                    ? { maxHeight: '85vh', width: 'auto' }
                    : { maxWidth: '88vw', maxHeight: '85vh', width: 'auto', height: 'auto' }
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

