import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import Header from './Header';
import tzuritPhoto from '../assets/images/tzurit_photo.png';

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
}

export default function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen font-sans text-[#32404F] bg-[#FDFCFA] pt-24"
    >
      <Header 
        currentView="about" 
        onNavigate={(view, targetId) => {
          onNavigate(view, targetId);
        }} 
      />

      <main className="max-w-7xl mx-auto px-6 sm:px-12 md:px-24 lg:px-36 xl:px-44 pt-6 pb-16">
        {/* Simple crisp back navigation */}
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.4, x: 0 }}
          whileHover={{ opacity: 1, x: -4 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold mb-10 cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>Back to Home</span>
        </motion.button>

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

          {/* Right Column: Bio text — same height as photo */}
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
      <footer id="Contact" className="h-32 flex items-center justify-end px-12 bg-[#FDFCFA] border-t border-[#858E97]/25">
        <div className="flex gap-12 text-[12px] uppercase tracking-widest text-[#32404F] opacity-60">
          <a href="mailto:tzurit88@gmail.com" className="hover:opacity-100 hover:text-[#32404F] transition-all">tzurit88@gmail.com</a>
          <a href="#" className="hover:opacity-100 hover:text-[#32404F] transition-all">LinkedIn</a>
        </div>
      </footer>
    </motion.div>
  );
}
