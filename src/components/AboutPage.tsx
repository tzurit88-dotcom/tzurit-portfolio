import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from './Header';

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
                src="/src/assets/images/regenerated_image_1779799286698.png"
                alt="Tzurit Avraham Portfolio Design Context"
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Bio text */}
          <div className="flex-grow space-y-6 md:pt-4 lg:pt-8">
            <h1 className="text-3xl font-light tracking-tight text-[#32404F] uppercase block">About Me</h1>
            <div className="text-sm md:text-base font-light leading-relaxed text-[#32404F]/90 space-y-5">
              <p>
                I am a Product Designer passionate about crafting innovative, minimalistic products that prioritize user experience.
              </p>
              <p>
                With 3 years of experience in B2B and B2B2C SaaS, I manage the entire product lifecycle as a sole designer—from early research to shipped MVPs.
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

      {/* Page Footer */}
      <footer id="Contact" className="h-32 flex items-center justify-end px-12 bg-[#FDFCFA] border-t border-[#858E97]/25 mt-32">
        <div className="flex gap-12 text-[10px] uppercase tracking-widest text-[#32404F] opacity-60">
          <a href="mailto:tzurit88@gmail.com" className="hover:opacity-100 hover:text-[#32404F] transition-all">tzurit88@gmail.com</a>
          <a href="#" className="hover:opacity-100 hover:text-[#32404F] transition-all">LinkedIn</a>
        </div>
      </footer>
    </motion.div>
  );
}
