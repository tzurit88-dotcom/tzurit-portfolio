import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize2, X, Upload, RefreshCw, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { Project } from '../types';
import Header from './Header';
import mindedBeforeNew from '../assets/images/minded_before_new.png';
import mindedAfterNew from '../assets/images/minded_after_new.png';

// Simple IndexedDB Cache for user-uploaded custom media to persist between reloads
const DB_NAME = 'minded-user-media';
const STORE_NAME = 'media-blobs';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveMedia(key: string, file: Blob): Promise<void> {
  return getDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

function getMedia(key: string): Promise<Blob | null> {
  return getDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  });
}

interface MindEdPageProps {
  project: Project;
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
}

export default function MindEdPage({ project, onBack, onNavigate }: MindEdPageProps) {
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

  const [customBefore, setCustomBefore] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customAfter, setCustomAfter] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customResearch1, setCustomResearch1] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customResearch2, setCustomResearch2] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customRedesignGif, setCustomRedesignGif] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customRedesignMock, setCustomRedesignMock] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customLighterAttempt, setCustomLighterAttempt] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [redesignMode, setRedesignMode] = useState<'after' | 'before'>('after');
  const [afterCarouselIdx, setAfterCarouselIdx] = useState(0);
  const [beforeCarouselIdx, setBeforeCarouselIdx] = useState(0);

  // Load custom media on mount
  useEffect(() => {
    getMedia('minded_lighter_attempt').then(blob => {
      if (blob) {
        setCustomLighterAttempt({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });
    getMedia('minded_before').then(blob => {
      if (blob) {
        setCustomBefore({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });

    getMedia('minded_after').then(blob => {
      if (blob) {
        setCustomAfter({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });

    getMedia('minded_research1').then(blob => {
      if (blob) {
        setCustomResearch1({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });

    getMedia('minded_research2').then(blob => {
      if (blob) {
        setCustomResearch2({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });

    getMedia('minded_redesign_gif').then(blob => {
      if (blob) {
        setCustomRedesignGif({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });

    getMedia('minded_redesign_mock').then(blob => {
      if (blob) {
        setCustomRedesignMock({
          url: URL.createObjectURL(blob),
          type: blob.type.startsWith('video/') ? 'video' : 'image'
        });
      }
    });
  }, []);

  const handleUploadBefore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_before', file);
      setCustomBefore({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetBefore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_before');
      setCustomBefore(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadAfter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_after', file);
      setCustomAfter({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetAfter = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_after');
      setCustomAfter(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadResearch1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_research1', file);
      setCustomResearch1({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetResearch1 = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_research1');
      setCustomResearch1(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadResearch2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_research2', file);
      setCustomResearch2({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetResearch2 = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_research2');
      setCustomResearch2(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadRedesignGif = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_redesign_gif', file);
      setCustomRedesignGif({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetRedesignGif = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_redesign_gif');
      setCustomRedesignGif(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadRedesignMock = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_redesign_mock', file);
      setCustomRedesignMock({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetRedesignMock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_redesign_mock');
      setCustomRedesignMock(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadLighterAttempt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia('minded_lighter_attempt', file);
      setCustomLighterAttempt({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetLighterAttempt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete('minded_lighter_attempt');
      setCustomLighterAttempt(null);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FDFCFA] text-[#32404F] font-sans selection:bg-[#BEC2C6]/30"
    >
      <Header currentView="project-page" onNavigate={onNavigate} />
      <motion.div
        className="fixed top-0 left-0 right-0 z-[39] bg-[#FDFCFA]/80 backdrop-blur-sm"
        initial={{ height: 154 }}
        animate={{ height: headerVisible ? 154 : 68 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.button
        onClick={onBack}
        animate={{ top: headerVisible ? 106 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-6 md:left-12 z-40 group flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#32404F] opacity-70 hover:opacity-100 transition-opacity px-3 py-2"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </motion.button>

      <main className="pt-44 pb-40">
        {/* Hero Section - Matching Home Style */}
        <section className="px-6 md:px-12 mb-20">
          <div className="max-w-4xl mx-auto space-y-8">
             {/* Removed top line with the colored dot as requested */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-light leading-tight tracking-tight max-w-3xl"
            >
              {project.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl font-light leading-relaxed text-[#32404F]/75 max-w-2xl"
            >
              {project.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12 pt-4"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">Role</div>
                <div className="text-sm font-medium">Sole Product Designer</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">Scope</div>
                <div className="text-sm font-medium">UX/UI Design, UX Research, Product Strategy</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">Timeline</div>
                <div className="text-sm font-medium">3 Months (2026)</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">Team</div>
                <div className="text-sm font-medium">Product Manager, 2 Pedagogical Advisors, AI Consultant, 3 Developers</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">Platforms</div>
                <div className="text-sm font-medium">Educator Desktop</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">Market</div>
                <div className="text-sm font-medium">B2B2C (Schools &amp; Ministry of Education)</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Layers */}
        <div className="space-y-24 md:space-y-32 px-6 md:px-12">
          
          {/* Before & After Frames Visual Showcase */}
          <section className="max-w-4xl mx-auto">
            <div className="md:-mx-24 lg:-mx-36 xl:-mx-52">
              <div className="bg-[#D2C7FF] rounded-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Frame */}
                  <div className="space-y-3">
                    <span className="block px-1 text-[12px] uppercase tracking-widest font-medium text-[#32404F]">Before Redesign</span>
                    <img
                      src={mindedBeforeNew}
                      alt="MindEd Before Redesign"
                      className="w-full h-auto block rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                    />
                  </div>

                  {/* After Frame */}
                  <div className="space-y-3">
                    <span className="block px-1 text-[12px] uppercase tracking-widest font-semibold text-[#32404F]">After Redesign</span>
                    <img
                      src={mindedAfterNew}
                      alt="MindEd After Redesign"
                      className="w-full h-auto block rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Background */}
          <section className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Background</h2>
            <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
              Built at MindCET, Israel's EdTech innovation center, MindEd is a vibe coding platform that empowers educators to build tailored educational apps and games. Instead of waiting for external, generic tech solutions, educators can use AI to solve their specific classroom micro-problems instantly.
            </p>
          </section>

          {/* Context & My Role */}
          <section className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {/* Left Column: Context */}
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Context</h2>
                <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
                  App creation in MindEd follows three stages: defining the problem, mapping the solution, and development. Unlike other tools, app building in MindEd works in structured stages rather than all at once. This lets users refine and monitor their tool as it's being built. To support this, a Roadmap feature was added to provide progress tracking and the ability to revert to previous versions.
                </p>
              </div>

              {/* Right Column: My Role */}
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">My Role</h2>
                <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
                  I joined the project as the sole product designer after the initial pilot, where the immediate priority was optimizing the Development Area - the stage where educators turn their pedagogical ideas into interactive tools.
                </p>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">The Problem</h2>
            <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
              While the first two stages went smoothly and left most educators satisfied, the Development Area proved confusing and less user-friendly. This led to:
            </p>
            <ul className="space-y-2 text-lg font-[370] text-[#32404F]/90">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-[#32404F]/90 shrink-0" />Inefficient use of the system</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-[#32404F]/90 shrink-0" />Lower satisfaction with the generated applications</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-[#32404F]/90 shrink-0" />User drop-off</li>
            </ul>
          </section>

          {/* Research & Insights */}
          <section className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Research &amp; Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                <div className="text-[10px] uppercase tracking-widest font-semibold text-[#32404F]">Goal</div>
                <div className="text-[#32404F]/90">Understand the root causes of user drop-off</div>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                <div className="text-[10px] uppercase tracking-widest font-semibold text-[#32404F]">Method</div>
                <div className="text-[#32404F]/90"><span className="font-semibold text-[#32404F]">20 In-depth interviews</span> with pilot educators</div>
              </div>
            </div>
            <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
              The interviews revealed that educators skipped the introductory text and missed the Roadmap entirely. Without this visual anchor, they mistook the first partial output for the final product, leading to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                <div className="font-semibold text-[#32404F]">Expectation Mismatch</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">The initial incomplete results felt disconnected from their goals, causing early frustration.</p>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                <div className="font-semibold text-[#32404F]">Redundant Requests</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">Educators used the chat to ask for features already planned for later stages.</p>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-2">
                <div className="font-semibold text-[#32404F]">Process Disorientation</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">The interface lacked clarity, making the workflow feel tedious and causing users to leave before realizing how much was left.</p>
              </div>
            </div>
          </section>

          {/* Constraints */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Constraints</h2>
              <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
                I initially questioned the decision of staged generation itself, as it differs from standard vibe coding patterns. However, this was a structural product constraint not open to change. The design had to solve the orientation problem within this multi-stage framework.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
              <div className="space-y-6 md:col-span-2">
                <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">A Lighter First Attempt</h2>
                <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
                  I first tried a tactical fix: increasing the Roadmap's visual prominence through color and neutralizing the surrounding palette.
                </p>
                <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
                  It wasn't enough. <strong className="font-semibold text-[#32404F]">Usability testing</strong> showed that 3 out of 5 educators still missed the Roadmap. It made me realize that visibility wasn't the only issue - there was a more fundamental problem.
                </p>
              </div>

              <div
                className="md:col-span-3 aspect-[15/7] bg-[#E5E6E6]/50 rounded-2xl overflow-hidden border border-[#BEC2C6]/40 grid place-items-center relative shadow-sm hover:shadow-md transition-shadow group"
                onClick={() => {
                  if (customLighterAttempt) {
                    setSelectedImage(customLighterAttempt.url);
                  } else {
                    setSelectedImage(project.galleryImages?.[3] || null);
                  }
                }}
              >
                {customLighterAttempt ? (
                  customLighterAttempt.type === 'video' ? (
                    <video 
                      src={customLighterAttempt.url}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in"
                    />
                  ) : (
                    <img 
                      src={customLighterAttempt.url} 
                      className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in" 
                      alt="Lighter attempt custom" 
                    />
                  )
                ) : (
                  <>
                    <img 
                      src={project.galleryImages?.[3]} 
                      alt="Lighter attempt" 
                      className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const label = (e.target as HTMLImageElement).parentElement?.querySelector('.placeholder-label');
                        if (label) label.removeAttribute('style');
                      }}
                    />
                    <div className="text-[#32404F]/20 italic text-center text-xs px-8 placeholder-label" style={{ display: 'none' }}>
                      [Placeholder: Image (1500x700)]
                    </div>
                  </>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                </div>

              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">The Solution</h2>
            </div>

            <div 
              className="bg-[#E5E6E6]/15 rounded-2xl overflow-hidden border border-[#BEC2C6]/25 group shadow-sm flex flex-col items-center md:-mx-12 lg:-mx-20 w-full md:w-[calc(100%+6rem)] lg:w-[calc(100%+10rem)] max-w-none"
            >
              {/* Centered within the card at the top but not overlapping the image */}
              <div className="w-full py-5 flex justify-center items-center">
                <div 
                  className="inline-flex p-1 bg-[#FDFCFA] rounded-full border border-[#BEC2C6]/40 select-none shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setRedesignMode('after')}
                    className={`flex items-center justify-center px-4 py-2 rounded-full text-[8.5px] md:text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 relative z-10 cursor-pointer ${redesignMode === 'after' ? 'text-[#FDFCFA] font-medium' : 'text-[#32404F]/40 hover:text-[#32404F]/60 font-medium'}`}
                  >
                    After Redesign
                    {redesignMode === 'after' && (
                      <motion.div
                        layoutId="activeRedesignTabBg"
                        className="absolute inset-0 bg-[#32404F] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.08)] -z-10"
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedesignMode('before')}
                    className={`flex items-center justify-center px-4 py-2 rounded-full text-[8.5px] md:text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 relative z-10 cursor-pointer ${redesignMode === 'before' ? 'text-[#FDFCFA] font-medium' : 'text-[#32404F]/40 hover:text-[#32404F]/60 font-medium'}`}
                  >
                    Before Redesign
                    {redesignMode === 'before' && (
                      <motion.div
                        layoutId="activeRedesignTabBg"
                        className="absolute inset-0 bg-[#32404F] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.08)] -z-10"
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div 
                className="w-full aspect-[15/5.8] flex items-center justify-center p-4 md:p-8 pb-8 md:pb-12 pt-0 md:pt-0 cursor-zoom-in relative"
                onClick={() => {
                  if (redesignMode === 'before') {
                    setSelectedImage(customBefore?.url || project.galleryImages?.[2] || null);
                  } else {
                    setSelectedImage(customAfter?.url || project.galleryImages?.[1] || null);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  {redesignMode === 'before' ? (
                    <motion.div
                      key="before"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {customBefore ? (
                        customBefore.type === 'video' ? (
                          <video
                            src={customBefore.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="max-w-full max-h-full object-contain transition-transform duration-700 rounded-xl border border-[#BEC2C6]/40 shadow-sm"
                          />
                        ) : (
                          <img
                            src={customBefore.url}
                            className="max-w-full max-h-full object-contain transition-transform duration-700 rounded-xl border border-[#BEC2C6]/40 shadow-sm"
                            alt="MindEd Before Redesign Custom"
                          />
                        )
                      ) : (
                        <img
                          src={project.galleryImages?.[2]}
                          alt="Before Redesign"
                          className="max-w-full max-h-full object-contain transition-transform duration-700 rounded-xl border border-[#BEC2C6]/40 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="after"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {customAfter ? (
                        customAfter.type === 'video' ? (
                          <video
                            src={customAfter.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="max-w-full max-h-full object-contain transition-transform duration-700 rounded-xl border border-[#BEC2C6]/40 shadow-sm"
                          />
                        ) : (
                          <img
                            src={customAfter.url}
                            className="max-w-full max-h-full object-contain transition-transform duration-700 rounded-xl border border-[#BEC2C6]/40 shadow-sm"
                            alt="After Redesign Custom"
                          />
                        )
                      ) : (
                        <img
                          src={project.galleryImages?.[1]}
                          alt="After Redesign"
                          className="max-w-full max-h-full object-contain transition-transform duration-700 rounded-xl border border-[#BEC2C6]/40 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Maximize2 className="text-[#32404F] opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                </div>
              </div>
            </div>
          </section>

          {/* Redesign details & final mockups */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-3">
                <div className="font-semibold text-[#32404F]">Established Master-Detail Hierarchy</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">I flipped the Chat and Roadmap positions. In this RTL interface, placing the Chat (Master) on the right and the Roadmap (Detail) on the left creates a <strong className="font-normal text-[#32404F]">natural cause-and-effect flow.</strong></p>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-3">
                <div className="font-semibold text-[#32404F]">Simplified Roadmap Structure</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">Condensed the Roadmap into three constant stages (Foundations, Main Features, Expansion). This provides a clear "beginning, middle, and end" to prevent cognitive overload, with titles visible at all times for <strong className="font-normal text-[#32404F]">constant orientation.</strong></p>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-3">
                <div className="font-semibold text-[#32404F]">Reduced Visual Load</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">Neutralized the UI palette to minimize competing signals and <strong className="font-normal text-[#32404F]">keep the focus on the generated app.</strong></p>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-3">
                <div className="font-semibold text-[#32404F]">Closed the Feedback Loop</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">Enabled the Chat and Roadmap to be open simultaneously. This <strong className="font-normal text-[#32404F]">eliminates context switching</strong> and lets educators see the Roadmap update in real-time as they interact with the Chat.</p>
              </div>
              <div className="bg-[#E5E6E6]/20 rounded-3xl p-6 border border-[#BEC2C6]/25 space-y-3">
                <div className="font-semibold text-[#32404F]">Improved Discoverability</div>
                <p className="font-[370] leading-relaxed text-[#32404F]/90">Redesigned the drawer button to provide a <strong className="font-normal text-[#32404F]">clearer affordance,</strong> making the Roadmap functionality easier to find and access.</p>
              </div>
            </div>


          </section>

          {/* Project Status & Next Steps */}
          <section className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#32404F]">Project Status & Next Steps</h2>
            <p className="text-lg font-[370] leading-relaxed text-[#32404F]/90">
              The project was closed at the concept stage, so this redesign wasn't validated in the field. If it had moved forward, the next step would have been a focused usability test with a prototype (5–6 educators) to verify if this orientation-heavy approach effectively reduced the drop-off rates seen in the pilot.
            </p>
          </section>

        </div>
      </main>


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
              {(
                selectedImage.endsWith('.mp4') || 
                selectedImage.endsWith('.webm') || 
                selectedImage.endsWith('.mov') || 
                selectedImage.includes('video') || 
                (selectedImage.startsWith('blob:') && (
                  customBefore?.url === selectedImage && customBefore?.type === 'video' ||
                  customAfter?.url === selectedImage && customAfter?.type === 'video' ||
                  customResearch1?.url === selectedImage && customResearch1?.type === 'video' ||
                  customResearch2?.url === selectedImage && customResearch2?.type === 'video' ||
                  customRedesignGif?.url === selectedImage && customRedesignGif?.type === 'video' ||
                  customRedesignMock?.url === selectedImage && customRedesignMock?.type === 'video' ||
                  customLighterAttempt?.url === selectedImage && customLighterAttempt?.type === 'video'
                ))
              ) ? (
                <video 
                  src={selectedImage}
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  controls
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                />
              ) : (
                <img 
                  src={selectedImage} 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                  alt="Selected preview"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center py-8"><div className="w-10 h-px bg-black/[0.18]" /></div>
      <footer className="py-16 px-12 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          <span>Back to Top</span>
          <ArrowUp size={14} className="stroke-[2.5]" />
        </button>
      </footer>
    </motion.div>
  );
}







