import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import Header from './Header';
import tzuritPhoto from '../assets/images/tzurit_photo.png';

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
}

export default function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        if (showTimeout.current) clearTimeout(showTimeout.current);
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        if (showTimeout.current) clearTimeout(showTimeout.current);
        showTimeout.current = setTimeout(() => setHeaderVisible(true), 250);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (showTimeout.current) clearTimeout(showTimeout.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen font-sans text-[#32404F] bg-[#FDFCFA] pt-44 md:pt-32"
    >
      <Header
        currentView="about"
        onNavigate={(view, targetId) => {
          onNavigate(view, targetId);
        }}
      />

      {/* Full-width back bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[39] bg-[#FDFCFA]/80 backdrop-blur-sm"
        initial={{ height: 154 }}
        animate={{ height: headerVisible ? 154 : 68 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Back button */}
      <motion.button
        onClick={onBack}
        animate={{ top: headerVisible ? 106 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-6 md:left-12 z-40 group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#32404F]/60 opacity-50 hover:opacity-100 transition-opacity px-3 py-2"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </motion.button>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 md:px-24 lg:px-36 xl:px-44 pt-6 md:pt-12 pb-16">

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12 items-start">
          {/* Left Column: Stylized high-end aspect ratio image */}
          <div className="flex-shrink-0">
            <div
              style={{ width: '245px', height: '416px' }}
              className="overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200/40 shadow-sm flex-shrink-0"
            >
              <img
                src={tzuritPhoto}
                alt="Tzurit Avraham Portfolio Design Context"
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Bio text */}
          <div className="flex-grow flex flex-col" style={{ height: '416px' }}>
            <h1 className="text-3xl font-light tracking-tight text-[#32404F] uppercase mb-5 block">About Me</h1>
            <div className="text-sm md:text-base font-light leading-relaxed text-[#32404F]/90 space-y-4 flex-1">
              <p>
                I am a Product Designer dedicated to building innovative, minimalistic products where the user's needs always drive the design.
              </p>
              <p>
                I have 3 years of experience designing for B2B and B2B2C SaaS platforms. As a sole designer, I lead the entire product lifecycle from early research to shipped MVPs.
              </p>
              <p>
                My background features a unique pivot: after 7 years as an occupational therapist, I took a leap to follow my passion for visuals and aesthetics. Today, I combine that deeply human-centered, research-backed foundation with my design work.
              </p>
              <p>
                I am a results-driven team player who constantly integrates new tools to make my workflow faster, smarter, and more efficient.
              </p>
            </div>

            <div className="mt-3">
              <motion.a
                href="mailto:tzurit88@gmail.com"
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FDFCFA] hover:bg-[#858E97]/10 text-[#32404F] border border-[#858E97]/60 rounded-full text-sm font-medium shadow-sm group cursor-pointer relative overflow-hidden transition-all duration-300"
              >
                <motion.div
                  variants={{
                    initial: { rotate: 0, y: 0 },
                    hover: { rotate: -12, y: -1.5, scale: 1.1 },
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                  className="text-[#858E97] group-hover:text-[#32404F] flex items-center justify-center relative z-10"
                >
                  <Mail size={13} />
                </motion.div>
                <span className="relative z-10 font-medium tracking-wide">Get in touch</span>
              </motion.a>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile spacer before footer — same height as footer (h-32) */}
      <div className="h-32 md:hidden" />

      <footer id="Contact" className="h-32 flex items-center justify-end px-12 bg-[#FDFCFA] border-t border-[#858E97]/25">
        <div className="flex gap-12 text-[12px] uppercase tracking-widest text-[#32404F]">
          <a
            href="mailto:tzurit88@gmail.com"
            className="opacity-60 hover:opacity-100 transition-all duration-300 relative py-1 group block"
          >
            <span>tzurit88@gmail.com</span>
            <span className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </a>
          <a
            href="https://linkedin.com/in/tzurit-avraham-886013104"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-all duration-300 relative py-1 group block"
          >
            <span>LinkedIn</span>
            <span className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </a>
        </div>
      </footer>
    </motion.div>
  );
}
