import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize2, X, ArrowUp } from 'lucide-react';
import { Project } from '../types';
import SystemOverview from './SystemOverview';
import Header from './Header';

interface GusPageProps {
  project: Project;
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
}

export default function GusPage({ project, onBack, onNavigate }: GusPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FDFCFA] text-[#32404F] font-sans selection:bg-[#BEC2C6]/30"
    >
      <Header currentView="project-page" onNavigate={onNavigate} />
      <motion.div
        className="fixed left-0 right-0 h-12 z-[39] bg-[#FDFCFA]/80 backdrop-blur-sm md:hidden"
        animate={{ top: headerVisible ? 106 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.button
        onClick={onBack}
        animate={{ top: headerVisible ? 106 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-6 md:left-12 z-40 group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#32404F]/60 opacity-50 hover:opacity-100 transition-opacity bg-[#FDFCFA]/75 backdrop-blur-sm rounded-lg px-3 py-2"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </motion.button>

      <main className="pt-44 pb-16">
        {/* Hero Section */}
        <section className="px-6 md:px-12 mb-20">
          <div className="max-w-4xl mx-auto space-y-6">
             {/* Removed top line with the blue dot as requested */}

             <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-light leading-tight tracking-tight max-w-3xl"
             >
              GUS
             </motion.h1>
            
             <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl font-light leading-relaxed text-[#32404F]/60 max-w-2xl"
             >
              Designing an AI-powered, adaptive learning experience for higher education.
             </motion.p>

             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12 pt-4"
             >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Role</div>
                <div className="text-sm font-medium">Sole Product Designer</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Scope</div>
                <div className="text-sm font-medium">UX UI</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Timeline</div>
                <div className="text-sm font-medium">3 Months (2026)</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Team</div>
                <div className="text-sm font-medium">Product Manager, Developer</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Platforms</div>
                <div className="text-sm font-medium">Lecturer Desktop, Student Desktop, Student Mobile</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Market</div>
                <div className="text-sm font-medium">B2B2C</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Layers */}
        <div className="space-y-28 md:space-y-36 px-6 md:px-12 text-[#32404F]/80 font-light leading-relaxed">

          {/* Background */}
          <section className="max-w-4xl mx-auto space-y-28">
            <div className="space-y-4">
              <div
                className="rounded-2xl overflow-hidden border border-[#BEC2C6]/60 relative"
              >
                <img
                  src={project.galleryImages?.[0]}
                  alt="Mobile student screen showing a lesson with the active AI chat assistant"
                  className="w-full h-auto block"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Background</h2>
              <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
                Designed as an MVP for Global University Systems (GUS) - an international network of over 30 higher-education institutions worldwide - Gus transforms static academic content into dynamic, adaptive learning journeys. The platform empowers lecturers to design tailored lessons that adjust to each student's pace and responses, delivering a personalized experience while maintaining full pedagogical control.
              </p>
            </div>
          </section>

          {/* Challenge & Hypothesis */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Challenge</h2>
              <div className="space-y-4">
                <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
                  Traditional academic slide decks follow a "one-size-fits-all" approach - some students fall behind while others coast. Furthermore, lecturers lack the visibility to identify who is struggling with specific concepts until it is too late to intervene.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Solution</h2>
              <div className="space-y-4">
                <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
                  A system that adapts content to each student and surfaces "struggle signals" to the lecturer addresses both sides of the educational gap.
                </p>
              </div>
            </div>
          </section>

          {/* My Role & Scope */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">My Role & Scope</h2>
              <div className="space-y-6">
                <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
                  My work on the project was based on the PRD defined by the Product Manager. I owned the design process end to end across three distinct interfaces: Lecturer Desktop, Student Desktop, and Student Mobile.
                </p>
                <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
                  In the absence of direct user access for research and testing, design decisions were rooted in UX heuristics and mental models.
                </p>
              </div>
            </div>
          </section>

          {/* Guiding Principles */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Guiding Principles</h2>
              <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">The following core principles guided the design of the interfaces:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                  <div className="font-semibold text-[#32404F]">Lecturer Interface</div>
                  <p className="font-[320] leading-relaxed text-[#32404F]/70">Providing total control over the content, while reducing uncertainty regarding what students see on their end.</p>
                </div>
                <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                  <div className="font-semibold text-[#32404F]">Student Interface</div>
                  <p className="font-[320] leading-relaxed text-[#32404F]/70">Reducing cognitive load and encouraging steady progress through the learning material.</p>
                </div>
              </div>
          </section>

          <div className="max-w-4xl mx-auto my-20">
            <hr className="border-[#BEC2C6]/30" />
          </div>

          {/* The Lecturer Surface */}
          <section className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">The Lecturer Surface</h2>
              <h3 className="text-2xl md:text-3xl font-light text-[#32404F]/80">Bridging the gap between AI automation and pedagogical intent.</h3>
            </div>

            <div className="space-y-20 md:space-y-24">
               <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Revision Control</span>
                      <div className="text-xl font-bold">Confidence through Design</div>
                    </div>
                    <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">To encourage experimentation without the fear of data loss, lecturers can freely edit AI-generated fact sheets or instantly "Reset to Original." Visual indicators like "Edited" tags maintain clear validation by separating automated content from manual refinements.</p>
                  </div>
                  <div
                    className="w-full rounded-2xl overflow-hidden border border-[#BEC2C6]/60 group relative cursor-zoom-in"
                    onClick={() => setSelectedImage(project.galleryImages?.[1] || null)}
                  >
                    <img src={project.galleryImages?.[1]} alt="Revision control interface" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#BEC2C6]/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Error Prevention</span>
                      <div className="text-xl font-bold">Balancing Guidance with Autonomy</div>
                    </div>
                    <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">To prevent accidental publishing, the system alerts the lecturer if a module contains unapproved lessons. However, it does not block the action; instead, it introduces "friction" via a confirmation modal, allowing the lecturer to maintain full control in edge cases where a partial publication is preferred.</p>
                  </div>
                  <div
                    className="w-full rounded-2xl overflow-hidden border border-[#BEC2C6]/60 group relative cursor-zoom-in"
                    onClick={() => setSelectedImage(project.galleryImages?.[2] || null)}
                  >
                    <img src={project.galleryImages?.[2]} alt="Publish confirmation modal" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#BEC2C6]/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                    </div>
                  </div>
               </div>
            </div>
          </section>

          <div className="max-w-4xl mx-auto my-20">
            <hr className="border-[#BEC2C6]/30" />
          </div>

          {/* The Student Surface */}
          <section className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">The Student Surface</h2>
              <h3 className="text-2xl md:text-3xl font-light text-[#32404F]/80">Supporting various learning modes and utilizing "Nudges" to encourage engagement.</h3>
            </div>

            <div className="space-y-20 md:space-y-24">
               <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">AI Integration</span>
                      <div className="text-xl font-bold">Context-Aware Chat</div>
                    </div>
                    <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">The AI assistant adapts its behavior based on the lesson stage: it answers freely during instruction, switches to "Tutor Mode" (guiding the student without revealing the answer) during interactive challenges, and is disabled during assessments.</p>
                  </div>
                  <div
                    className="w-full rounded-2xl overflow-hidden border border-[#BEC2C6]/60 group relative cursor-zoom-in"
                    onClick={() => setSelectedImage(project.galleryImages?.[3] || null)}
                  >
                    <img src={project.galleryImages?.[3]} alt="Tutor Mode chat" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#BEC2C6]/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Progress Tracking</span>
                      <div className="text-xl font-bold">Pacing Indicators</div>
                    </div>
                    <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">Encouraging language and color-coded status badges (e.g., "Catch Up" in orange) help students orient themselves within the schedule without creating unnecessary stress.</p>
                  </div>
                  <div
                    className="w-full rounded-2xl overflow-hidden border border-[#BEC2C6]/60 group relative cursor-zoom-in"
                    onClick={() => setSelectedImage(project.galleryImages?.[4] || null)}
                  >
                    <img src={project.galleryImages?.[4]} alt="Mobile interface" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#BEC2C6]/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                    </div>
                  </div>
               </div>
            </div>
          </section>

          <div className="max-w-4xl mx-auto my-20">
            <hr className="border-[#BEC2C6]/30" />
          </div>

          {/* Persistent Feedback Bar */}
          <section className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Mobile Adaptability - 1</h2>
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-[#32404F]/80">The Persistent Feedback Bar</h3>
            </div>
              <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
                One of the primary challenges was managing feedback on mobile. Unlike "gated" learning apps, Gus allows students to navigate back to completed exercises to learn from their mistakes.
              </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">The Problem</div>
                <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80 text-[#32404F]/60">Keeping the feedback drawer open blocked both navigation and content.</p>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">The Solution</div>
                <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80 text-[#32404F]/60">A hierarchy that prioritizes navigation and content during movement, while keeping feedback accessible on demand. On mobile, the feedback collapses into a persistent floating bar at the bottom of the screen; if a student chooses to linger on a past question, the feedback can be expanded with a single tap without obstructing the context of the question.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[260px] md:max-w-3xl mx-auto">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className="md:aspect-[350/700] bg-[#E5E6E6]/40 rounded-[2rem] overflow-hidden flex items-center justify-center border border-[#BEC2C6]/60 relative group cursor-zoom-in"
                  onClick={() => setSelectedImage(project.galleryImages?.[i + 5] || null)}
                >
                  <img src={project.galleryImages?.[i + 5]} alt={`Mobile view ${i + 1}`} className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#BEC2C6]/10 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile Adaptability: Chat & Engagement */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Mobile Adaptability - 2</h2>
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-[#32404F]/80">Chat & Engagement</h3>
            </div>

            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-0 md:mb-[-1.5rem]">
               <div className="space-y-2">
                 <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Challenge 1</span>
                 <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">The mobile screen only had room for the lesson slide (text and image). However, to nudge students to ask questions, the team agreed the AI chat must remain highly accessible.</p>
               </div>
               <div className="space-y-2">
                 <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Solution</span>
                 <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">Contained the chat within a top action button, using an icon and clear microcopy to actively invite engagement.</p>
               </div>
               <div className="hidden md:block md:col-span-2 md:mb-10" />
               <div className="space-y-2 md:min-h-[160px]">
                 <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Challenge 2</span>
                 <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">The mobile chat drawer could not fit both the soft keyboard and the suggested questions simultaneously.</p>
               </div>
               <div className="space-y-2 md:min-h-[160px]">
                 <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Solution</span>
                 <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">Placed the suggested questions inside their own drawer, designed to be open by default.</p>
               </div>
            </div>

            <div className="h-4 md:hidden" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[260px] md:max-w-3xl mx-auto">
              {[8, 9, 10].map((idx) => (
                <div 
                  key={idx} 
                  className="md:aspect-[350/700] bg-[#E5E6E6]/40 rounded-[2rem] overflow-hidden flex items-center justify-center border border-[#BEC2C6]/60 relative group cursor-zoom-in"
                  onClick={() => setSelectedImage(project.galleryImages?.[idx] || null)}
                >
                  <img src={project.galleryImages?.[idx]} alt={`Mobile view adaptability ${idx - 7}`} className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#BEC2C6]/10 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Outcome */}
          <section className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Outcome</h2>
            <p className="text-lg font-[320] leading-relaxed text-[#32404F]/80">
              The MVP was successfully shipped and implemented. As analytics were not yet instrumented and user access for follow-up testing was unavailable, the design patterns remain unvalidated in the field. However, the project established the foundation for a scalable Design System for the product’s next phases of growth.
            </p>
          </section>

        </div>
      </main>

      <div className="mt-24" />
      <SystemOverview images={project.galleryImages || []} carouselImages={project.carouselImages} />

      {/* Fullscreen Image Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#FDFCFA]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-8 p-3 rounded-full bg-[#BEC2C6]/20 hover:bg-[#BEC2C6]/30 transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} className="text-[#32404F]" />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                alt="Selected preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center py-8"><div className="w-10 h-px bg-black/[0.18]" /></div>
      <footer className="py-16 px-12 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] font-bold opacity-30 hover:opacity-100 transition-opacity"
        >
          <span>Back to Top</span>
          <ArrowUp size={14} className="stroke-[2.5]" />
        </button>
      </footer>
    </motion.div>
  );
}

