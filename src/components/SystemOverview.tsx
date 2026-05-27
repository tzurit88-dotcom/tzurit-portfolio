import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronRight, ChevronLeft, Monitor, Smartphone } from 'lucide-react';

interface SystemOverviewProps {
  images: string[];
  isPressPective?: boolean;
}

type ViewMode = 'lecturer' | 'student-desktop' | 'student-mobile';

export default function SystemOverview({ images, isPressPective }: SystemOverviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(isPressPective ? 'student-desktop' : 'lecturer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Group images by mode (Mapping based on gallery structure)
  const modeImages: Record<ViewMode, string[]> = {
    lecturer: isPressPective 
      ? [images[5]] // Teacher Panel
      : [
          images[1] || images[0],
          images[2] || images[0],
          images[3] || images[0]
        ],
    'student-desktop': isPressPective
      ? [
          images[0], // Hero
          images[1], // Metaphor
          images[2], // Notepad
          images[3], // Room
          images[4], // Meter
        ]
      : [
          images[0] || images[1],
          images[3] || images[1]
        ],
    'student-mobile': isPressPective
      ? [images[0]] // Just a fallback for mobile in presspective context
      : [
          images[4] || images[0],
          images[5] || images[0],
          images[6] || images[0],
          images[7] || images[0]
        ]
  };

  const displayImages = images.length > 0 ? modeImages[viewMode] : [
    'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1500&h=700',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1500&h=700',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1500&h=700',
  ];

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentIndex(0);
    setDirection(0);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1); // Right arrow -> Current card slides RIGHT
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1); // Left arrow -> Current card slides LEFT
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      x: direction * 1000,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(5px)',
      zIndex: 50
    })
  };

  return (
    <section className="overflow-hidden bg-white border-y border-black/[0.03]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-16">
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.4em] font-bold opacity-30 mb-8">System Overview</h2>
          <h3 className="text-3xl md:text-6xl font-light tracking-tight text-black/90">A multi-surface ecosystem.</h3>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-2">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-gray-50/50 border border-black/5 rounded-full overflow-hidden shadow-sm backdrop-blur-sm">
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
                relative px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2
                ${viewMode === mode.value ? 'text-white' : 'text-black/40 hover:text-black/60'}
              `}
            >
              {viewMode === mode.value && (
                <motion.div
                  layoutId="active-pill-system"
                  className="absolute inset-0 bg-indigo-600 rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {!isPressPective && (mode.value === 'student-mobile' ? <Smartphone size={12} className="relative z-10" /> : <Monitor size={12} className="relative z-10" />)}
              <span className="relative z-10">
                {mode.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[400px] md:h-[600px] lg:h-[700px] max-w-7xl mx-auto flex items-center justify-center px-4">
        {/* Navigation Controls */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 z-50 pointer-events-none">
          <button 
            type="button"
            onClick={prevSlide}
            className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-black/5 flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-all text-black/40 hover:text-indigo-600 z-[100]"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            type="button"
            onClick={nextSlide}
            className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-black/5 flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-all text-black/40 hover:text-indigo-600 z-[100]"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* The Stack Container */}
        <div className="relative w-full max-w-5xl aspect-[15/7]">
          {/* Background Cards (Visual Stack) */}
          <div className="absolute inset-0">
             {[2, 1].map((offset) => {
                const index = (currentIndex + offset) % displayImages.length;
                return (
                  <motion.div
                    key={`bg-${viewMode}-${index}-${offset}`}
                    initial={false}
                    animate={{
                      scale: 1 - (offset * 0.05),
                      y: offset * 25,
                      opacity: 1 - (offset * 0.4),
                      rotate: offset * 0.5,
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 10 - offset }}
                  >
                    <div className="w-full h-full bg-white rounded-xl md:rounded-[2.5rem] shadow-xl border border-black/[0.03] overflow-hidden grayscale-[30%] opacity-80">
                      <img src={displayImages[index]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
                );
             })}
          </div>

          {/* Top Card Navigation (AnimatePresence) */}
          <div className="absolute inset-0">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={`${viewMode}-${currentIndex}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ 
                  x: { type: "spring", stiffness: 200, damping: 24, mass: 0.8 },
                  opacity: { duration: 0.3 },
                  filter: { duration: 0.3 }
                }}
                className="absolute inset-0 z-20 cursor-pointer group"
                onClick={() => setSelectedImage(displayImages[currentIndex])}
              >
                <div className="relative w-full h-full bg-white rounded-xl md:rounded-[2.5rem] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.2)] border border-black/5 overflow-hidden">
                  <img 
                    src={displayImages[currentIndex]} 
                    alt={`System Screen ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                  />
                  
                  {/* Actions for top card */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1, backgroundColor: '#f5f3ff' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(displayImages[currentIndex]);
                    }}
                    className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-2xl flex items-center justify-center text-indigo-600 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 size={24} />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mt-16 md:mt-24">
        {displayImages.map((_, i) => (
          <button 
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-black/10'}`}
          />
        ))}
      </div>
      
      <div className="max-w-lg mx-auto px-6 text-center mt-12 md:mt-16 space-y-4">
        <p className="text-[10px] tracking-[0.3em] font-bold uppercase opacity-30">
          Click the stack to flip or expand the view
        </p>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 lg:p-24 bg-black/95 backdrop-blur-2xl"
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
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full max-w-7xl aspect-[15/7] bg-white rounded-2xl md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Full View"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
