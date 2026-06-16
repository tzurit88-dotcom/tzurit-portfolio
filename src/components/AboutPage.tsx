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
            <div className="text-sm md:text-base font-[370] leading-relaxed text-[#32404F]/90 space-y-4 flex-1">
              <p>
                I am a Product Designer dedicated to building innovative, minimalistic products where the user's needs always drive the design.
              </p>
              <p>
                I have 2 years of experience designing for B2B and B2B2C SaaS platforms. As a sole designer, I lead the entire product lifecycle from early research to shipped MVPs.
              </p>
              <p>
                My background features a unique pivot: after 7 years as an occupational therapist, I took a leap to follow my passion for visuals and aesthetics. Today, I combine that deeply human-centered, research-backed foundation with my design work.
              </p>
              <p>
                I am a results-driven team player who constantly integrates new tools to make my workflow faster, smarter, and more efficient.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile spacer before footer ג€” same height as footer (h-32) */}
      <div className="h-32 md:hidden" />

      <footer id="Contact" className="h-32 flex items-center justify-end px-12 bg-[#FDFCFA] border-t border-[#858E97]/25">
        <div className="flex gap-12 text-[12px] uppercase tracking-widest text-[#32404F]">
          <a
            href="mailto:tzurit88@gmail.com"
            className="opacity-80 hover:opacity-100 transition-all duration-300 relative py-1 group block"
          >
            <span>tzurit88@gmail.com</span>
            <span className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </a>
          <a
            href="https://linkedin.com/in/tzurit-avraham-886013104"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-all duration-300 relative py-1 group block"
          >
            <span>LinkedIn</span>
            <span className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </a>
        </div>
      </footer>
    </motion.div>
  );
}




