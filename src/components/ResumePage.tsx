import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Compass, Award, ExternalLink } from 'lucide-react';
import Header from './Header';

interface ResumePageProps {
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
  isPrintOnlyMode?: boolean;
}

export default function ResumePage({ onBack, onNavigate, isPrintOnlyMode = false }: ResumePageProps) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPrintOnlyMode) return;
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
  }, [isPrintOnlyMode]);

  useEffect(() => {
    if (isPrintOnlyMode) {
      // Small timeout to allow styles and layout to settle before printing
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPrintOnlyMode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: isPrintOnlyMode ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isPrintOnlyMode ? 0 : -15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative min-h-screen font-sans text-neutral-800 bg-[#fdfdfd] print:pt-0 print:bg-white ${
        isPrintOnlyMode ? 'pt-4 sm:pt-10' : 'pt-44 md:pt-32'
      }`}
    >
      {!isPrintOnlyMode && (
        <div className="print:hidden">
          <Header
            currentView="resume"
            onNavigate={(view, targetId) => {
              if (view === 'home') {
                onNavigate('home', targetId);
              } else if (view === 'about') {
                onNavigate('about', targetId);
              }
            }}
          />
          {/* Full-width back bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[39] bg-[#fdfdfd]/80 backdrop-blur-sm print:hidden"
            initial={{ height: 154 }}
            animate={{ height: headerVisible ? 154 : 68 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Back button */}
          <motion.button
            onClick={onBack}
            animate={{ top: headerVisible ? 106 : 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-6 md:left-12 z-40 print:hidden group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-600 opacity-70 hover:opacity-100 transition-opacity px-3 py-2"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </motion.button>
        </div>
      )}

      <main className={`max-w-5xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 print:px-0 print:py-0 ${
        isPrintOnlyMode ? 'py-4' : 'py-12'
      }`}>
        {/* Desktop: back navigation */}
        {!isPrintOnlyMode && (
          <div className="print:hidden hidden">
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.5, x: 0 }}
              whileHover={{ opacity: 1, x: -4 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold mb-12 cursor-pointer border-none bg-transparent hover:opacity-100 transition-opacity"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              <span>Back to Home</span>
            </motion.button>
          </div>
        )}

        {/* Action Header block for web vs print view */}
        {!isPrintOnlyMode && (
          <div className="flex flex-row items-center justify-between border-b border-[#e0e0e0] pb-6 mb-12 gap-4 print:hidden">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">cv</h1>
            </div>
            <div className="flex gap-3">
              <a
                href="/CV-Tzurit-Avraham.pdf"
                download="CV-Tzurit-Avraham.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#32404F] hover:bg-[#32404F]/90 text-[#FDFCFA] rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer"
              >
                <span>Download CV</span>
                <Download size={13} />
              </a>
            </div>
          </div>
        )}

        {/* PDF Design Frame replica - Extreme High Fidelity matching actual resume */}
        <div className={`bg-white relative max-w-[850px] mx-auto print:border-none print:p-0 print:shadow-none print:rounded-none ${
          isPrintOnlyMode ? 'p-6 sm:p-10 md:p-14' : 'border border-neutral-100 rounded-lg p-10 sm:p-12 md:p-16 shadow-lg'
        }`}>
          
          {/* TOP HEADER: Name, Profession and Contact Details */}
          <div className="flex flex-col md:flex-row md:justify-between items-start border-b border-neutral-200/80 pb-8 mb-8 gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-[44px] font-bold tracking-tight text-neutral-900 leading-none">Tzurit Avraham</h1>
              <p className="text-lg text-neutral-500 font-light tracking-wide mt-2">Product Designer</p>
            </div>
            
            <div className="flex flex-col md:items-end text-xs font-light text-neutral-600 space-y-2 md:text-right select-none">
              <span className="underline decoration-neutral-300">
                tzurit88@gmail.com
              </span>
              <span className="underline decoration-neutral-300">
                +972 509 607 267
              </span>
              <span className="underline decoration-neutral-300">
                LinkedIn
              </span>
              <span className="underline decoration-neutral-300">
                Portfolio
              </span>
            </div>
          </div>

          {/* BIO SUMMARY STATEMENT */}
          <div className="mb-10">
            <p className="text-[13px] sm:text-[14px] text-neutral-700 leading-relaxed font-light text-justify">
              I am a product designer with 3 years of experience designing AI-powered SaaS products end to end, with a focus on B2B and B2B2C platforms. As the sole designer across multiple projects, I manage the entire lifecycle from initial research to final production. I bring a background in occupational therapy, adding a behavior-driven, human-centered lens to products by combining empathy with research-backed decision-making.
            </p>
          </div>

          {/* MAIN GRID BLOCK: Two columns like the physical PDF */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pt-2">
            
            {/* LEFT COLUMN: Experience & Volunteering (8/12 grid span) */}
            <div className="md:col-span-8 space-y-10">
              
              {/* EXPERIENCE */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400">Experience</h2>
                </div>

                <div className="space-y-8">
                  {/* WORK PLACE 1 */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <h3 className="font-bold text-neutral-950 text-sm">
                        Product Designer <span className="font-light text-neutral-400 mx-1">ג€¢</span> MindCET
                      </h3>
                      <span className="text-[11px] font-medium text-neutral-500 sm:ml-auto">2024ג€“2026</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 leading-relaxed mb-3">
                      Led end-to-end research, UX/UI, and product strategy for three B2C/B2B2C AI platforms developed in parallel, delivering multiple tailored interfaces for different user types across desktop and mobile.
                    </p>
                    <ul className="space-y-2 text-[12px] text-neutral-600 font-light leading-relaxed pl-1">
                      <li className="flex gap-2">
                        <span className="text-neutral-400 shrink-0 select-none">ג€¢</span>
                        <span>Led the research phase through interviews, surveys, usability testing, and insight synthesis to identify user needs and shape product direction.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-neutral-400 shrink-0 select-none">ג€¢</span>
                        <span>Defined core user flows and translated user needs, product goals, and technological constraints into clear UX structure.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-neutral-400 shrink-0 select-none">ג€¢</span>
                        <span>Led the UI design of the product and established its design guidelines. Collaborated closely with product, development to move ideas from concept to a coherent product experience.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-neutral-400 shrink-0 select-none">ג€¢</span>
                        <span>Applied AI tools throughout the design process and contributed to prompt engineering as part of the AI based product experience.</span>
                      </li>
                    </ul>
                  </div>

                  {/* WORK PLACE 2 */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <h3 className="font-bold text-neutral-950 text-sm">
                        Product Designer <span className="font-light text-neutral-400 mx-1">ג€¢</span> Freelance
                      </h3>
                      <span className="text-[11px] font-medium text-neutral-500 sm:ml-auto">2023ג€“2024</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 font-light leading-relaxed">
                      Designed a B2B SaaS AI platform for e-commerce sellers, establishing the core UX/UI infrastructure from early demo to a refined, high-fidelity product.
                    </p>
                  </div>

                  {/* WORK PLACE 3 */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <h3 className="font-bold text-neutral-950 text-sm">
                        Occupational Therapist
                      </h3>
                      <span className="text-[11px] font-medium text-neutral-500 sm:ml-auto">2013ג€“2022</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 font-light leading-relaxed">
                      Specialized in behavioral analysis, empathetic user interviewing, and driving data-backed decisions to translate complex human needs into actionable plans.
                    </p>
                  </div>
                </div>
              </div>

              {/* VOLUNTEERING */}
              <div className="space-y-4 pt-2">
                <div>
                   <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400">Volunteering</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                    <p className="text-[12px] text-neutral-600 font-light leading-relaxed">
                      Lead a non-profit community project for event-design equipment lending.
                    </p>
                    <span className="text-[11px] font-medium text-neutral-500 sm:ml-auto shrink-0 whitespace-nowrap">2013ג€“Present</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Education, Tools, Skills & Languages (4/12 grid span) */}
            <div className="md:col-span-4 space-y-8 font-light">
              
              {/* EDUCATION */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400">Education</h2>
                </div>
                <div className="space-y-4 text-[12px] text-neutral-600">
                  <div>
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-neutral-950">UX / Product Design</h4>
                      <span className="text-[10px] text-neutral-500 font-medium">2023</span>
                    </div>
                    <p className="mt-0.5">Codesigner</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-neutral-950">BA, Occupational Therapy</h4>
                      <span className="text-[10px] text-neutral-500 font-medium">2013</span>
                    </div>
                    <p className="mt-0.5">Hebrew University of Jerusalem</p>
                  </div>
                </div>
              </div>

              {/* TOOLS */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400">Tools</h2>
                </div>
                <div className="flex flex-col space-y-1.5 text-[12px] text-neutral-600">
                  {['Figma', 'Prototyping', 'Recraft', 'Google AI Studio', 'Claude Code'].map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>

              {/* SKILLS */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400">Skills</h2>
                </div>
                <div className="flex flex-col space-y-1.5 text-[12px] text-neutral-600">
                  {[
                    'User research',
                    'Usability testing',
                    'Product strategy',
                    'Vibe coding',
                    'AI feature design',
                    'Pilot management',
                    'Communication',
                    'Teamwork',
                    'Creativity & Innovation',
                    'Attention to details'
                  ].map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              {/* LANGUAGES */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-400">Languages</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[12px] text-neutral-600">
                  <div>
                    <h5 className="font-bold text-neutral-950">Hebrew</h5>
                    <p className="text-neutral-400 mt-0.5 font-light">native</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-neutral-950">English</h5>
                    <p className="text-neutral-400 mt-0.5 font-light">Professional</p>
                  </div>
                </div>
              </div>

            </div>

          </div>



        </div>

      </main>

      {/* Page Footer */}
      {!isPrintOnlyMode && (
        <div className="print:hidden">
          <footer id="Contact" className="h-32 flex items-center justify-end px-12 bg-[#fbfafa] border-t border-[#e0e0e0] mt-32">
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
        </div>
      )}
    </motion.div>
  );
}


