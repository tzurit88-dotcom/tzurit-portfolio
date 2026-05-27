import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize2, X, Upload, RefreshCw, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { Project } from '../types';
import SystemOverview from './SystemOverview';

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
}

export default function MindEdPage({ project, onBack }: MindEdPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-blue-100"
    >
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center px-6 md:px-12 bg-white/80 backdrop-blur-md z-50 justify-between transition-all">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-[10px] uppercase tracking-widest hover:opacity-100 opacity-60 transition-all font-bold"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 hidden md:block">
          MindEd — Case Study
        </div>
        <div className="w-10 h-10" />
      </header>

      <main className="pt-30 pb-64">
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
              className="text-xl md:text-2xl font-light leading-relaxed text-black/60 max-w-2xl"
            >
              {project.description}
            </motion.p>
          </div>
        </section>

        {/* Content Layers */}
        <div className="space-y-24 md:space-y-32 px-6 md:px-12">
          
          {/* Before & After Frames Visual Showcase */}
          <section className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:-mx-16 lg:-mx-24 xl:-mx-32">
              {/* Before Frame */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Before Redesign</span>
                </div>
                <div 
                  className="aspect-[15/7] bg-[#F7F5F2] rounded-2xl overflow-hidden border border-black/5 grid place-items-center relative shadow-sm hover:shadow-md transition-shadow group"
                  onClick={() => {
                    if (customBefore) {
                      setSelectedImage(customBefore.url);
                    } else {
                      setSelectedImage(project.galleryImages?.[1] || project.imageUrl || null);
                    }
                  }}
                >
                  {customBefore ? (
                    customBefore.type === 'video' ? (
                      <video 
                        src={customBefore.url}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in"
                      />
                    ) : (
                      <img 
                        src={customBefore.url} 
                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in" 
                        alt="MindEd Before Redesign Custom" 
                      />
                    )
                  ) : (
                    <>
                      <img 
                        src={project.galleryImages?.[1] || project.imageUrl} 
                        alt="MindEd Before Redesign"
                        className="max-w-full max-h-full object-contain block transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const label = (e.target as HTMLImageElement).parentElement?.querySelector('.placeholder-label');
                          if (label) label.removeAttribute('style');
                        }}
                      />
                      <div className="text-black/20 italic text-center text-xs px-8 hidden placeholder-label" style={{ display: 'block' }}>
                        [Before Redesign Image]
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center pointer-events-none">
                    <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              </div>

              {/* After Frame */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-black">After Redesign</span>
                </div>
                <div 
                  className="aspect-[15/7] bg-[#EEF7FF] rounded-2xl overflow-hidden border border-black/5 grid place-items-center relative shadow-sm hover:shadow-md transition-shadow group animate-fade-in"
                  onClick={() => {
                    if (customAfter) {
                      setSelectedImage(customAfter.url);
                    } else {
                      setSelectedImage(project.galleryImages?.[2] || project.imageUrl || null);
                    }
                  }}
                >
                  {customAfter ? (
                    customAfter.type === 'video' ? (
                      <video 
                        src={customAfter.url}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in"
                      />
                    ) : (
                      <img 
                        src={customAfter.url} 
                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in" 
                        alt="MindEd After Redesign Custom" 
                      />
                    )
                  ) : (
                    <>
                      <img 
                        src={project.galleryImages?.[2] || project.imageUrl} 
                        alt="MindEd After Redesign"
                        className="max-w-full max-h-full object-contain block transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const label = (e.target as HTMLImageElement).parentElement?.querySelector('.placeholder-label');
                          if (label) label.removeAttribute('style');
                        }}
                      />
                      <div className="text-black/20 italic text-center text-xs px-8 hidden placeholder-label" style={{ display: 'block' }}>
                        [After Redesign Image]
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center pointer-events-none">
                    <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Context & My Role */}
          <section className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {/* Left Column: Context */}
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Context</h2>
                <p className="text-lg font-light leading-relaxed text-black/80">
                  MindEd is a vibe coding platform for teachers, built at MindCET, Israel's EdTech innovation center. Unlike other tools, app building in MindEd works in structured stages rather than all at once. This lets users refine and monitor their tool as it's being built. To support this, a Roadmap feature was added to provide navigation and progress tracking.
                </p>
              </div>

              {/* Right Column: My Role */}
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">My role</h2>
                <p className="text-lg font-light leading-relaxed text-black/80">
                  I joined as the sole product designer after the initial pilot rounds. My focus was the Development Area — the critical stage where teachers turn a defined pedagogical idea into an interactive tool.
                </p>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">The problem</h2>
            <p className="text-lg font-light leading-relaxed text-black/80">
              Pilot data showed that while earlier stages went smoothly, the Development Area caused friction. Most teachers had no vibe coding background and found the interface unintuitive. Many were unsatisfied with the output and abandoned the flow entirely.
            </p>
          </section>

          {/* Research */}
          <section className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Research</h2>
            <p className="text-lg font-light leading-relaxed text-black/80">
              We conducted post-pilot interviews with 20 teachers and usability testing with five teachers, specifically targeting the Development Area.
            </p>
          </section>

          {/* What the research showed */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">What the research showed</h2>
              <p className="text-lg font-light leading-relaxed text-black/80">
                Teachers were skipping the introductory copy and missing the Roadmap entirely. Without that visual anchor, they assumed the first partial output was the final product. This led to:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black/80 font-light">
              <div className="space-y-2">
                <div className="font-bold">Broken Trust:</div>
                <p className="text-base leading-relaxed">The results felt insufficient and disconnected from their plan.</p>
              </div>
              <div className="space-y-2">
                <div className="font-bold">Redundant Requests:</div>
                <p className="text-base leading-relaxed">Teachers used the chat to ask for features already planned for later stages.</p>
              </div>
              <div className="space-y-2">
                <div className="font-bold">High Drop-off:</div>
                <p className="text-base leading-relaxed">Orientation was the primary bottleneck; users didn't know where they were or how much was left.</p>
              </div>
            </div>
          </section>

          {/* What I considered first */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">What I considered first</h2>
              <p className="text-lg font-light leading-relaxed text-black/80">
                I initially questioned the staged generation itself, as it differs from standard vibe coding patterns. However, this was a structural product constraint not open to change. The design had to solve the orientation problem within this multi-stage framework.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">A first, lighter attempt</h2>
                <p className="text-lg font-light leading-relaxed text-black/80">
                  I first tried a "low-effort" fix: increasing the Roadmap's visual prominence through color and neutralizing the surrounding palette. It wasn't enough. It became clear that visibility wasn't the only issue — the information hierarchy was.
                </p>
              </div>

              <div 
                className="aspect-[15/7] bg-[#F7F5F2] rounded-2xl overflow-hidden border border-black/5 grid place-items-center relative shadow-sm hover:shadow-md transition-shadow group"
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
                    <div className="text-black/20 italic text-center text-xs px-8 placeholder-label" style={{ display: 'none' }}>
                      [Placeholder: Image (1500x700)]
                    </div>
                  </>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center pointer-events-none">
                  <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                </div>

              </div>
            </div>
          </section>

          {/* The redesign */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">The redesign</h2>
              <p className="text-lg font-light leading-relaxed text-black/80">
                The goal was to reduce visual noise and establish a clear mental model for the process.
              </p>
            </div>

            <div 
              className="bg-[#F7F5F2] rounded-2xl overflow-hidden border border-black/5 group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:-mx-12 lg:-mx-20 w-full md:w-[calc(100%+6rem)] lg:w-[calc(100%+10rem)] max-w-none"
            >
              {/* Centered within the card at the top but not overlapping the image */}
              <div className="w-full py-5 flex justify-center items-center">
                <div 
                  className="inline-flex p-1 bg-[#EFECE6]/70 rounded-full border border-black/[0.03] select-none shadow-[inner_0_1px_3px_rgba(0,0,0,0.01)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setRedesignMode('after')}
                    className={`flex items-center justify-center px-4 py-2 rounded-full text-[8.5px] md:text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 relative z-10 cursor-pointer ${redesignMode === 'after' ? 'text-black font-extrabold' : 'text-black/40 hover:text-black/60 font-medium'}`}
                  >
                    After Redesign
                    {redesignMode === 'after' && (
                      <motion.div
                        layoutId="activeRedesignTabBg"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.02)] -z-10 border border-black/[0.01]"
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedesignMode('before')}
                    className={`flex items-center justify-center px-4 py-2 rounded-full text-[8.5px] md:text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 relative z-10 cursor-pointer ${redesignMode === 'before' ? 'text-black font-extrabold' : 'text-black/40 hover:text-black/60 font-medium'}`}
                  >
                    Before Redesign
                    {redesignMode === 'before' && (
                      <motion.div
                        layoutId="activeRedesignTabBg"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.02)] -z-10 border border-black/[0.01]"
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
                    setSelectedImage(customBefore?.url || project.galleryImages?.[1] || null);
                  } else {
                    setSelectedImage(customAfter?.url || project.galleryImages?.[2] || null);
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
                            className="max-w-full max-h-full object-contain transition-transform duration-700"
                          />
                        ) : (
                          <img 
                            src={customBefore.url} 
                            className="max-w-full max-h-full object-contain transition-transform duration-700" 
                            alt="MindEd Before Redesign Custom" 
                          />
                        )
                      ) : (
                        <img 
                          src={project.galleryImages?.[1]} 
                          alt="Before Redesign" 
                          className="max-w-full max-h-full object-contain transition-transform duration-700" 
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
                            className="max-w-full max-h-full object-contain transition-transform duration-700"
                          />
                        ) : (
                          <img 
                            src={customAfter.url} 
                            className="max-w-full max-h-full object-contain transition-transform duration-700" 
                            alt="After Redesign Custom" 
                          />
                        )
                      ) : (
                        <img 
                          src={project.galleryImages?.[2]} 
                          alt="After Redesign" 
                          className="max-w-full max-h-full object-contain transition-transform duration-700" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center pointer-events-none">
                  <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                </div>
              </div>
            </div>
          </section>

          {/* Redesign details & final mockups */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="space-y-4">
                <div className="font-bold text-lg">Established Master-Detail Hierarchy:</div>
                <p className="text-base font-light text-black/60 leading-relaxed">I flipped the Chat and Roadmap positions. In this RTL interface, placing the Chat (Master) on the right and the Roadmap (Detail) on the left creates a natural cause-and-effect flow.</p>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-lg">Simplified Roadmap Structure:</div>
                <p className="text-base font-light text-black/60 leading-relaxed">Condensed the Roadmap into three constant stages (Foundations, Main Features, Expansion). This provides a clear "beginning, middle, and end" to prevent cognitive overload, with titles visible at all times for constant orientation.</p>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-lg">Reduced Visual Load:</div>
                <p className="text-base font-light text-black/60 leading-relaxed">Neutralized the UI palette to minimize competing signals and keep the focus on the generated app.</p>
              </div>
              <div className="space-y-4">
                <div className="font-bold text-lg">Closed the Feedback Loop:</div>
                <p className="text-base font-light text-black/60 leading-relaxed">Allowed the Chat and Roadmap to be open simultaneously. This eliminates context switching and lets teachers see the Roadmap update in real-time as they interact with the Chat.</p>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="font-bold text-lg">Improved Discoverability:</div>
                <p className="text-base font-light text-black/60 leading-relaxed">Redesigned the drawer button to provide a clearer affordance, making the Roadmap functionality easier to find and access.</p>
              </div>
            </div>


          </section>

          {/* Project Status & Next Steps */}
          <section className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Project Status & Next Steps</h2>
            <p className="text-lg font-light leading-relaxed text-black/80">
              The project was closed at the concept stage, so this redesign wasn't validated in the field. If it had moved forward, the next step would have been a focused usability test with a prototype (5-6 teachers) to verify if this orientation-heavy approach effectively reduced the drop-off rates seen in the pilot.
            </p>
          </section>

        </div>
      </main>

      <SystemOverview images={project.galleryImages || []} />

      {/* Fullscreen Image Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-8 right-8 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} className="text-black" />
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

      <footer className="py-32 px-12 border-t border-black/5 text-center">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] font-bold opacity-30 hover:opacity-100 transition-opacity"
        >
          <span>Back to Top</span>
          <ArrowUp size={14} className="stroke-[2.5]" />
        </button>
      </footer>
    </motion.div>
  );
}
