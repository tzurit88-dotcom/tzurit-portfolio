import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  ArrowUp
} from 'lucide-react';
import { Project } from '../types';
import Header from './Header';

// Simple IndexedDB Cache for user-uploaded custom media to persist between reloads
const DB_NAME = 'myzon-user-media';
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

interface MyzonPageProps {
  project: Project;
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
}

export default function MyzonPage({ project, onBack, onNavigate }: MyzonPageProps) {
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
  const [imageError, setImageError] = useState(false);
  const [systemImageError, setSystemImageError] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const [customImages, setCustomImages] = useState<(string | null)[]>([null, null, null, null, null, null]);

  useEffect(() => {
    const loadAllMedia = async () => {
      const loaded = [null, null, null, null, null, null];
      for (let i = 0; i < 6; i++) {
        try {
          const blob = await getMedia(`myzon_slot_${i}`);
          if (blob) {
            loaded[i] = URL.createObjectURL(blob);
          }
        } catch (err) {
          console.error(`Error loading custom media for slot ${i}:`, err);
        }
      }
      setCustomImages(loaded);
    };

    loadAllMedia();
  }, []);

  const handleSlotUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await saveMedia(`myzon_slot_${index}`, file);
      const url = URL.createObjectURL(file);
      setCustomImages(prev => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSlotReset = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(`myzon_slot_${index}`);
      setCustomImages(prev => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const mainImage = project.imageUrl;

  const carouselImages = project.galleryImages || [];

  const slides = [
    {
      id: 'interactive-dashboard',
      type: 'component' as const,
      title: 'Interactive System Overview',
      render: () => (
        <div className="w-full h-full relative bg-[#F6F4F7] p-2 sm:p-3 flex flex-col justify-start select-none font-sans overflow-visible rounded-2xl">
          {/* Main Simulated Browser UI Frame - displaying the high fidelity dashboard visual representation */}
          <div className="w-full bg-[#FDFCFA] rounded-t-xl border border-[#BEC2C6]/30 shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col h-[70%] select-none relative overflow-hidden">
            <img 
              src={customImages[0] || project.galleryImages?.[1] || project.galleryImages?.[0] || project.imageUrl} 
              alt="Myzon Dashboard Presentation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          {/* Floating Products Panel! Overflows beyond the bottom boundary box and floats elegantly */}
          <div 
            className="absolute bottom-1 sm:bottom-2 left-4 right-4 z-40 bg-[#FDFCFA] rounded-xl shadow-[0_12px_32px_rgba(45,15,63,0.14)] border border-neutral-100 p-2 ml-1 sm:ml-2 mr-1 sm:mr-2 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(45,15,63,0.22)] transition-all duration-300 pointer-events-auto"
          >
            {/* Table top area */}
            <div className="flex flex-col gap-1.5 mb-2">
              <div className="flex items-center gap-1">
                <h4 className="text-[10px] sm:text-[11px] font-bold tracking-tight text-[#32404F]">Products</h4>
                <span className="bg-purple-100 text-purple-700 px-1 py-0.2 rounded text-[7px] font-extrabold">24</span>
              </div>
              <p className="text-[7.5px] text-neutral-400 -mt-2 leading-tight">Choose a product from the list below for in-depth insights and customized content generation.</p>

              {/* Filtering row */}
              <div className="flex flex-wrap items-center gap-1 scale-95 origin-left">
                {/* Input box */}
                <div className="relative max-w-[110px]">
                  <input 
                    type="text" 
                    placeholder="ASIN / product name" 
                    disabled
                    className="w-full bg-[#E5E6E6]/40 text-[7px] text-neutral-500 placeholder:text-neutral-300 pl-5 pr-1 py-1 rounded border border-neutral-200 outline-none"
                  />
                  <div className="absolute left-1.5 top-1.5 text-neutral-300">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                </div>

                {/* Filters */}
                {['Collection', 'Campaign status', 'Amazon rating', 'ACoS trend'].map((filter) => (
                  <div key={filter} className="text-[7px] font-medium bg-[#E5E6E6]/40 px-1.5 py-1 border border-neutral-200 rounded text-neutral-500 flex items-center gap-0.5">
                    <span>{filter}</span>
                    <span className="text-[5.5px] opacity-60">▼</span>
                  </div>
                ))}
                
                <span className="text-[7px] text-neutral-400 ml-auto">Clear all</span>
              </div>

              {/* Active list status */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-[#FAF8FC] text-purple-600 px-1.5 py-0.5 rounded-full text-[7px] font-semibold border border-purple-100 flex items-center gap-0.5">
                  Campaign status <span className="font-bold">Active</span> <span className="text-purple-300 hover:text-purple-600 cursor-pointer">✕</span>
                </span>
                <span className="text-[7px] text-neutral-450 ml-1">5 Results</span>
              </div>
            </div>

            {/* Products Interactive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-450 text-[7px] uppercase tracking-wider font-semibold">
                    <th className="pb-1 pl-1 w-[42%]">Name</th>
                    <th className="pb-1 text-right">Views</th>
                    <th className="pb-1 text-right">Orders</th>
                    <th className="pb-1 text-right">Rating</th>
                    <th className="pb-1 text-right">ACoS</th>
                    <th className="pb-1 text-right pr-1">Campaign status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100/30">
                  {[
                    { name: 'Paper towel holder under cabinet', views: '3,223', orders: '345', rating: '4.8', acos: '2.31%', status: 'Active', active: false },
                    { name: 'Yoga swing', views: '8,232', orders: '1,322', rating: '3.7', acos: '9.21%', status: 'Manage', active: true },
                    { name: 'Aitbay plush elephant music baby toy', views: '2,984', orders: '213', rating: '4.6', acos: '1.32%', status: 'Active', active: false },
                    { name: 'Bug zapper outdoor electric', views: '7,990', orders: '2,332', rating: '4.0', acos: '4.31%', status: 'Active', active: false },
                  ].map((row, index) => (
                    <tr 
                      key={index} 
                      className={`text-[7px] transition-colors border-b border-neutral-100/10 ${row.active ? 'bg-purple-50/40 text-purple-900 font-semibold border-y border-purple-100/50' : 'text-neutral-700 hover:bg-[#E5E6E6]/40'}`}
                    >
                      <td className="py-1.5 pl-1 font-medium flex items-center gap-1">
                        <div className={`w-3.5 h-3.5 rounded shadow-sm border border-neutral-200 flex items-center justify-center font-bold text-[5.5px] shrink-0 ${row.active ? 'bg-purple-100 text-purple-700' : 'bg-[#E5E6E6] text-neutral-500'}`}>
                          {row.name[0]}
                        </div>
                        <span className="truncate max-w-[120px]">{row.name}</span>
                      </td>
                      <td className="py-1.5 text-right">{row.views}</td>
                      <td className="py-1.5 text-right">{row.orders}</td>
                      <td className="py-1.5 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <span className="text-[#FBBF24]">★</span>
                          <span>{row.rating}</span>
                        </div>
                      </td>
                      <td className="py-1.5 text-right text-emerald-600 font-bold scale-95 origin-right">▲ {row.acos}</td>
                      <td className="py-1.5 text-right pr-1">
                        {row.active ? (
                          <div className="flex justify-end items-center relative">
                            {/* Manage Purple Button */}
                            <button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-none py-0.5 px-2.5 rounded text-[6.5px] font-semibold flex items-center gap-0.5 tracking-wide shadow-sm scale-95 md:scale-100 transition-all cursor-pointer">
                              Manage
                            </button>
                            {/* White cursor hover pointer replicating exact action shot */}
                            <div className="absolute right-[-4px] bottom-[-6px] pointer-events-none z-50">
                              <svg className="w-3.5 h-3.5 text-[#32404F] filter drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                <path stroke="white" strokeWidth="0.5" d="M4.5 1.5l15 15-4.5.8L19.5 24l-3 1.5-4.5-6.7-3.8 3.8z"/>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded text-[6.5px] font-bold">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )
    },
    ...carouselImages.map((img, i) => ({
      id: `img-slide-${i}`,
      type: 'image' as const,
      title: `System Screen ${i + 1}`,
      imageUrl: img,
      render: () => null
    }))
  ];

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slides.length === 0) return;
    setDirection(1);
    setCarouselIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slides.length === 0) return;
    setDirection(-1);
    setCarouselIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const carouselVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? -600 : 600,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(8px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      x: dir * 600,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(4px)',
      zIndex: 50
    })
  };

  const backgroundOffsets = slides.length > 2 ? [2, 1] : slides.length > 1 ? [1] : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FDFCFA] text-[#32404F] font-sans selection:bg-neutral-150"
    >
      <Header currentView="project-page" onNavigate={onNavigate} />
      <motion.button
        onClick={onBack}
        animate={{ top: headerVisible ? 106 : 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-6 md:left-12 z-40 group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#32404F] opacity-50 hover:opacity-100 transition-opacity bg-[#FDFCFA]/75 backdrop-blur-sm rounded-lg px-3 py-2"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </motion.button>

      <main className="pt-44 pb-40">
        {/* Project Hero Headings */}
        <section className="px-6 md:px-12 mb-20">
          <div className="max-w-4xl mx-auto space-y-8">
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
              className="text-xl md:text-2xl font-light leading-relaxed text-[#32404F]/60 max-w-3xl"
            >
              {project.description}
            </motion.p>
            
            {/* Metadata Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12 pt-4"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Role</div>
                <div className="text-sm font-medium">{project.role}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Timeline</div>
                <div className="text-sm font-medium">3 Months (2023)</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Market</div>
                <div className="text-sm font-medium">B2B SaaS (E-commerce)</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Layers with High-Quality Layout */}
        <div className="space-y-24 md:space-y-32 px-6 md:px-12 text-[#32404F]/80">
           {/* Visual Presentation Area - High-Fidelity UI Image */}
          <section className="max-w-4xl mx-auto">
            <div 
              id="mayzon-interactive-mockup"
              className="rounded-2xl overflow-hidden relative cursor-zoom-in bg-[#E5E6E6]/40 group border border-transparent transition-all duration-300 min-h-[180px] flex items-center justify-center p-0"
              onClick={() => {
                setSelectedImage(customImages[0] || mainImage);
              }}
            >
              <img 
                src={customImages[0] || mainImage} 
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.01]" 
                alt="Myzon Dashboard Presentation"
              />
            </div>
          </section>

          {/* Background */}
          <section className="max-w-4xl mx-auto space-y-12 font-light">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#32404F] tracking-tight">Background</h2>
              <p className="text-lg font-light leading-relaxed text-[#32404F]">
                The project started as a collaboration with a startup to build a high-fidelity interactive demo for potential clients and investors. After my involvement with the team ended, I decided to continue working on the project independently as a design challenge, focusing on refining the primary user flows and organizing the interface architecture.
              </p>
            </div>
          </section>

          {/* The Problem */}
          <section className="max-w-4xl mx-auto space-y-12 font-light">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#32404F] tracking-tight">The Problem</h2>
              <p className="text-lg font-light leading-relaxed text-[#32404F]">
                Amazon sellers often want to bring buyers from external platforms (like social media) to their product pages, but creating compliant and targeted marketing materials usually requires complex tools, a marketing budget, or manual design work that many sellers don't have the time or knowledge to handle.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="max-w-4xl mx-auto space-y-12 font-light">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#32404F] tracking-tight">The Solution</h2>
              <p className="text-lg font-light leading-relaxed text-[#32404F]">
                A desktop and mobile interface for an AI system that takes raw Amazon product data and automatically formats it into tailored marketing assets for different target audiences. The design focuses on making the process simple, so sellers can easily choose their audience, adjust the details, and get the correct formats for social media.
              </p>
            </div>
          </section>

          {/* Additional Platform Overview Images - 5 Sections Sequentially */}
          {[
            { tag: "1. Home page / Choosing product", defaultImg: project.galleryImages?.[0] || project.imageUrl, aspect: "aspect-[3800/2865]", slotIndex: 1 },
            { tag: "2.1 Product page", defaultImg: project.galleryImages?.[1] || project.imageUrl, aspect: "aspect-[3800/2779]", slotIndex: 2 },
            { tag: "2.2 Marketing analytics / Full reports", defaultImg: project.galleryImages?.[2] || project.imageUrl, aspect: "aspect-[3800/3160]", slotIndex: 3, style: { height: "653.959px" } },
            { tag: "3. Campaign Generation / Design and content", defaultImg: project.galleryImages?.[3] || project.imageUrl, aspect: "aspect-[3800/3419]", slotIndex: 4, style: { height: "804.564px" } },
            { tag: "4. Campaign generation / camption and publish", defaultImg: project.galleryImages?.[4] || project.imageUrl, aspect: "aspect-[3800/2865]", slotIndex: 5, style: { height: "804.564px" } }
          ].map((sec) => {
            const activeImg = customImages[sec.slotIndex] || sec.defaultImg;
            return (
              <section key={sec.slotIndex} className="max-w-4xl mx-auto space-y-8 pt-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base md:text-lg font-medium text-[#32404F] tracking-tight">{sec.tag}</h2>
                    </div>
                  </div>
                  
                  {/* Image Frame with proper custom height handling to avoid aspect ratio constraints */}
                  <div 
                    className={`rounded-2xl overflow-hidden relative cursor-zoom-in bg-[#E5E6E6]/40 group border border-transparent transition-all duration-300 ${sec.style?.height ? 'w-full' : sec.aspect}`}
                    style={sec.style?.height ? { height: sec.style.height } : undefined}
                    onClick={() => setSelectedImage(activeImg)}
                  >
                    <img 
                      src={activeImg} 
                      className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.01]" 
                      alt={`Myzon Platform Dashboard Overview - ${sec.tag}`}
                    />
                  </div>
                </div>
              </section>
            );
          })}

        </div>
      </main>

      {/* Fullscreen Image Overlay Setup */}
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
                alt="Enlarged Preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center py-8"><div className="w-10 h-px bg-black/[0.18]" /></div>
      <footer className="py-14 px-12 text-center bg-[#FDFCFA]">
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

