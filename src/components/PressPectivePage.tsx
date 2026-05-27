import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize2, X, Quote, Upload, RefreshCw, ArrowUp } from 'lucide-react';
import { Project } from '../types';
import SystemOverview from './SystemOverview';

// Simple IndexedDB Cache for user-uploaded custom media to persist between reloads
const DB_NAME = 'perspective-user-media';
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

interface PressPectivePageProps {
  project: Project;
  onBack: () => void;
}

export default function PressPectivePage({ project, onBack }: PressPectivePageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customMedia, setCustomMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  const [customMedia2, setCustomMedia2] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customMedia4, setCustomMedia4] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [customMedia5, setCustomMedia5] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  // Load custom media on mount
  useEffect(() => {
    // Solution 1
    const savedUrl = localStorage.getItem('solution_1_url');
    if (savedUrl) {
      const isVideo = savedUrl.toLowerCase().endsWith('.mp4') || savedUrl.toLowerCase().endsWith('.webm') || savedUrl.includes('video');
      setCustomMedia({
        url: savedUrl,
        type: isVideo ? 'video' : 'image'
      });
    } else {
      getMedia('solution_1').then(blob => {
        if (blob) {
          setCustomMedia({
            url: URL.createObjectURL(blob),
            type: blob.type.startsWith('video/') ? 'video' : 'image'
          });
        }
      });
    }

    // Solution 2
    const savedUrl2 = localStorage.getItem('solution_2_url');
    if (savedUrl2) {
      const isVideo2 = savedUrl2.toLowerCase().endsWith('.mp4') || savedUrl2.toLowerCase().endsWith('.webm') || savedUrl2.includes('video');
      setCustomMedia2({
        url: savedUrl2,
        type: isVideo2 ? 'video' : 'image'
      });
    } else {
      getMedia('solution_2').then(blob => {
        if (blob) {
          setCustomMedia2({
            url: URL.createObjectURL(blob),
            type: blob.type.startsWith('video/') ? 'video' : 'image'
          });
        }
      });
    }

    // Solution 4
    const savedUrl4 = localStorage.getItem('solution_4_url');
    if (savedUrl4) {
      const isVideo4 = savedUrl4.toLowerCase().endsWith('.mp4') || savedUrl4.toLowerCase().endsWith('.webm') || savedUrl4.includes('video');
      setCustomMedia4({
        url: savedUrl4,
        type: isVideo4 ? 'video' : 'image'
      });
    } else {
      getMedia('solution_4').then(blob => {
        if (blob) {
          setCustomMedia4({
            url: URL.createObjectURL(blob),
            type: blob.type.startsWith('video/') ? 'video' : 'image'
          });
        }
      });
    }

    // Solution 5
    const savedUrl5 = localStorage.getItem('solution_5_url');
    if (savedUrl5) {
      const isVideo5 = savedUrl5.toLowerCase().endsWith('.mp4') || savedUrl5.toLowerCase().endsWith('.webm') || savedUrl5.includes('video');
      setCustomMedia5({
        url: savedUrl5,
        type: isVideo5 ? 'video' : 'image'
      });
    } else {
      getMedia('solution_5').then(blob => {
        if (blob) {
          setCustomMedia5({
            url: URL.createObjectURL(blob),
            type: blob.type.startsWith('video/') ? 'video' : 'image'
          });
        }
      });
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveMedia('solution_1', file);
      // Also clear any custom URL to prevent conflicts
      localStorage.removeItem('solution_1_url');
      const mediaUrl = URL.createObjectURL(file);
      setCustomMedia({
        url: mediaUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error('Error saving uploaded file:', err);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUrl.trim()) return;

    try {
      const trimmedUrl = tempUrl.trim();
      const isVideo = trimmedUrl.toLowerCase().endsWith('.mp4') || trimmedUrl.toLowerCase().endsWith('.webm') || trimmedUrl.includes('video');
      
      localStorage.setItem('solution_1_url', trimmedUrl);
      setCustomMedia({
        url: trimmedUrl,
        type: isVideo ? 'video' : 'image'
      });
      setIsUrlInputOpen(false);
      setTempUrl('');
    } catch (err) {
      console.error('Error saving URL:', err);
    }
  };

  const handleResetMedia = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('solution_1_url');
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete('solution_1');
      setCustomMedia(null);
      setIsUrlInputOpen(false);
      setTempUrl('');
    } catch (err) {
      console.error('Error deleting media:', err);
    }
  };

  const handleFileUpload2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveMedia('solution_2', file);
      // Also clear any custom URL to prevent conflicts
      localStorage.removeItem('solution_2_url');
      const mediaUrl = URL.createObjectURL(file);
      setCustomMedia2({
        url: mediaUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error('Error saving uploaded file for Solution 2:', err);
    }
  };

  const handleResetMedia2 = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('solution_2_url');
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete('solution_2');
      setCustomMedia2(null);
    } catch (err) {
      console.error('Error deleting media for Solution 2:', err);
    }
  };

  const handleFileUpload4 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveMedia('solution_4', file);
      // Also clear any custom URL to prevent conflicts
      localStorage.removeItem('solution_4_url');
      const mediaUrl = URL.createObjectURL(file);
      setCustomMedia4({
        url: mediaUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error('Error saving uploaded file for Solution 4:', err);
    }
  };

  const handleResetMedia4 = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('solution_4_url');
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete('solution_4');
      setCustomMedia4(null);
    } catch (err) {
      console.error('Error deleting media for Solution 4:', err);
    }
  };

  const handleFileUpload5 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveMedia('solution_5', file);
      // Also clear any custom URL to prevent conflicts
      localStorage.removeItem('solution_5_url');
      const mediaUrl = URL.createObjectURL(file);
      setCustomMedia5({
        url: mediaUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      console.error('Error saving uploaded file for Solution 5:', err);
    }
  };

  const handleResetMedia5 = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('solution_5_url');
      const db = await getDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete('solution_5');
      setCustomMedia5(null);
    } catch (err) {
      console.error('Error deleting media for Solution 5:', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-indigo-100"
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
          PressPective — Case Study
        </div>
        <div className="w-10 h-10" />
      </header>

      <main className="pt-30 pb-64">
        {/* Hero Section */}
        <section className="px-6 md:px-12 mb-20">
          <div className="max-w-4xl mx-auto space-y-8">
             {/* Removed top line with the colored dot as requested */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-light leading-tight tracking-tight max-w-3xl"
            >
              PressPective
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl font-light leading-relaxed text-black/60 max-w-2xl"
            >
              Designing and leading an experiential learning tool for middle school history classes.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12 pt-12 border-t border-black/5"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Role</div>
                <div className="text-sm font-medium">Sole Product Designer</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Scope</div>
                <div className="text-sm font-medium">UX UI, Research, Product Strategy</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Timeline</div>
                <div className="text-sm font-medium">3 Months (2026)</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Team</div>
                <div className="text-sm font-medium">Program Manager, Developer, Pedagogical Advisor</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Platforms</div>
                <div className="text-sm font-medium">Teacher & Student Desktop</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-30">Market</div>
                <div className="text-sm font-medium">B2B2C (Schools, Districts and Ministries of Education)</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Layers */}
        <div className="space-y-28 md:space-y-36 px-6 md:px-12 text-black/80">
          
          {/* Overview */}
          <section className="max-w-4xl mx-auto space-y-28">
            <div 
              className="rounded-2xl overflow-hidden border border-black/5 relative shadow-sm cursor-zoom-in group"
              onClick={() => setSelectedImage(project.galleryImages?.[0] || null)}
            >
              <img 
                src={project.galleryImages?.[0]} 
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]" 
                alt="Hero Shot - The Dual-Perspective Interview Room Interface"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Overview</h2>
              <div className="space-y-8">
                <p className="text-lg font-light leading-relaxed">
                  <span className="font-medium text-black">PressPective</span> is an EdTech platform designed to move students from passive fact-memorization to active historical inquiry. The product is built around the concept of "Learning Through Perspectives"—enabling students to investigate historical events through the worldviews of different groups prominent in that era, and analyze events from multiple angles by interviewing AI-driven figures.
                </p>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="max-w-4xl mx-auto space-y-12 font-light">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">The Problem</h2>
              <div className="space-y-8">
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black/80">Curriculum vs. Engagement</h3>
                <p className="text-lg font-light leading-relaxed">
                  Through a survey of 28 history teachers and 7 in-depth interviews, we surfaced three critical classroom tensions:
                </p>
                <div className="space-y-8 pt-4">
                  <div className="space-y-2">
                    <p className="text-lg font-light"><span className="font-bold">Shallow Comprehension:</span> Students memorize isolated dates and facts, failing to develop a deeper historical understanding.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-light"><span className="font-bold">The Skill vs. Knowledge Trade-off:</span> Teachers lack the time and resources to teach higher-order thinking skills, and worry that prioritizing them will jeopardize curriculum coverage—their primary evaluation metric.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-light"><span className="font-bold">The Engagement Gap:</span> Capturing and maintaining student attention in text-heavy history lessons is a constant uphill battle.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-12 border-t border-black/5">
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black/80">The Strategic Framework</h3>
              <p className="text-lg font-light leading-relaxed">To address these challenges, we defined three core pillars to guide the design of our solution:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
                 <div className="space-y-3">
                   <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">01</span>
                   <div className="text-lg font-bold">Higher-Order Skill Development</div>
                   <p className="text-base text-black/60 leading-relaxed">Focusing on critical thinking, deep questioning, and multi-perspective analysis.</p>
                 </div>
                 <div className="space-y-3">
                   <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">02</span>
                   <div className="text-lg font-bold">Core Knowledge Acquisition</div>
                   <p className="text-base text-black/60 leading-relaxed">Driving deep, contextual understanding rather than shallow memorization.</p>
                 </div>
                 <div className="space-y-3">
                   <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">03</span>
                   <div className="text-lg font-bold">Engaging Experience</div>
                   <p className="text-base text-black/60 leading-relaxed">Creating a motivating, active learning environment.</p>
                 </div>
              </div>
            </div>
          </section>

          {/* Research & The Pivot */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-12">

              
              <div className="space-y-6 pt-6 font-light">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">EARLY VALIDATION</span>
                  <h4 className="text-xl md:text-2xl font-light tracking-tight text-black/80">MVP Testing & Insights</h4>
                  <p className="text-lg text-black/60 italic">The first MVP featured a "Story" format (text and imagery) followed by a Q&A session. Testing this early version in three classrooms provided two critical insights:</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="font-bold text-indigo-600">01.</span>
                    <p className="text-lg"><span className="font-bold">Shift in Focus:</span> Survey and interview feedback revealed lukewarm motivation and low learning perception. However, a pattern emerged: students drifted off during the initial reading, but became noticeably more engaged during the question-asking phase.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-indigo-600">02.</span>
                    <p className="text-lg"><span className="font-bold">User Need:</span> Both teachers and students repeatedly asked for "the other side of the story," suggesting a need for comparative analysis.</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-12 pt-16 border-t border-black/5">
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">The Pivot</span>
                <p className="text-lg leading-relaxed font-light">
                  Based on these signals, we shifted the product’s gravity. We removed the "Story" component and made the interview the core experience. The model evolved into a Dual-Perspective Interview, allowing students to interact with two contradicting narratives simultaneously (e.g., an aristocrat vs. a revolutionary supporter during the French Revolution).
                </p>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">The Solution</h2>
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black/80">Designing the Experience</h3>
            </div>

            <div className="space-y-20 md:space-y-24">
              {/* Solution 1 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 lg:gap-x-16 items-center">
                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">Concept</span>
                    <h4 className="text-xl font-semibold text-black/85">1. The Journalistic Metaphor</h4>
                  </div>
                  <p className="text-lg font-light leading-relaxed text-black/80">
                    To create a unique experience that would pull students in, we wrapped the process in a "Journalistic Studio" metaphor. This storytelling framework was designed to spark curiosity and increase task-immersion.
                  </p>
                </div>
                <div 
                  className="md:col-span-7 md:-mr-12 lg:-mr-20 w-full md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] max-w-none aspect-[1906/914] bg-gray-50 rounded-2xl overflow-hidden border border-black/5 flex items-center justify-center group relative cursor-zoom-in"
                  onClick={() => {
                    if (customMedia) {
                      setSelectedImage(customMedia.url);
                    } else {
                      setSelectedImage(project.videoUrl || project.gifUrl || project.galleryImages?.[1] || null);
                    }
                  }}
                >
                  {customMedia ? (
                    customMedia.type === 'video' ? (
                      <video 
                        src={customMedia.url}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <img 
                        src={customMedia.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                        alt="Custom Journalistic Metaphor" 
                      />
                    )
                  ) : project.videoUrl ? (
                    <video 
                      src={project.videoUrl}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <img 
                      src={project.gifUrl || project.galleryImages?.[1]} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                      alt="Journalistic Metaphor" 
                      onError={(e) => {
                        if (project.gifUrl) {
                          // If gif fails, fallback to the PNG
                          (e.target as HTMLImageElement).src = project.galleryImages?.[1] || '';
                        }
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              </div>

              {/* Solution 2 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 lg:gap-x-16 items-center">
                <div className="md:col-span-5 space-y-6 order-1 md:order-2">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">Preparation</span>
                    <h4 className="text-xl font-semibold text-black/85">2. The Preparation Phase (Question Notepad)</h4>
                  </div>
                  <p className="text-lg font-light leading-relaxed text-black/80">
                    Recognizing that students needed a structured entry point before interacting with the AI, I designed a "Question Notepad" interface. This phase guides students to draft and refine their inquiries, ensuring the subsequent interview is focused and meaningful.
                  </p>
                </div>
                <div 
                   className="md:col-span-7 md:order-1 md:-ml-12 lg:-ml-20 w-full md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] max-w-none aspect-[1906/914] rounded-2xl overflow-hidden border border-black/5 relative shadow-sm cursor-zoom-in group flex items-center justify-center bg-gray-50"
                  onClick={() => {
                    if (customMedia2) {
                      setSelectedImage(customMedia2.url);
                    } else {
                      setSelectedImage(project.galleryImages?.[2] || null);
                    }
                  }}
                >
                  {customMedia2 ? (
                    customMedia2.type === 'video' ? (
                      <video 
                        src={customMedia2.url}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <img 
                        src={customMedia2.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                        alt="Custom Question Notepad" 
                      />
                    )
                  ) : (
                    <img src={project.galleryImages?.[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" alt="Question Notepad" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>


                </div>
              </div>

              {/* Solution 3 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 lg:gap-x-16 items-center">
                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">Interaction</span>
                    <h4 className="text-xl font-semibold text-black/85">3. The Dual-Perspective Interview Room</h4>
                  </div>
                  <p className="text-lg font-light leading-relaxed text-black/80">
                    The core UI features a split-screen interface for real-time interaction with two figures at once. The decision to use text-based chat rather than voice was made to better suit a noisy classroom environment and to manage technical complexity during the MVP stage.
                  </p>
                </div>
                <div 
                  className="md:col-span-7 md:-mr-12 lg:-mr-20 w-full md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] max-w-none aspect-[1906/914] rounded-2xl overflow-hidden border border-black/5 relative shadow-sm cursor-zoom-in group bg-gray-50 flex items-center justify-center"
                  onClick={() => setSelectedImage(project.galleryImages?.[3] || null)}
                >
                  <img 
                    src={project.galleryImages?.[3]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                    alt="Interview Room" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/1906/914/F7F5F2/1A1A1A?text=Interview+Room';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              </div>

              {/* Solution 4 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 lg:gap-x-16 items-center">
                <div className="md:col-span-5 space-y-6 order-1 md:order-2">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">Feedback Loop</span>
                    <h4 className="text-xl font-semibold text-black/85">4. Gamification & Quality Feedback</h4>
                  </div>
                  <p className="text-lg font-light leading-relaxed text-black/80">
                    We integrated a Rating Meter that provides real-time scores and written feedback on question quality, based on predefined criteria. This created a motivating feedback loop for students and provided the teacher with a clear signal of the classroom’s comprehension levels.
                  </p>
                </div>
                <div className="md:col-span-7 md:order-1 md:-ml-12 lg:-ml-20 w-full md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] max-w-none space-y-6 flex flex-col">
                  {/* First Image: Rating Meter */}
                  <div 
                    className="aspect-[1906/914] rounded-2xl overflow-hidden border border-black/5 relative shadow-sm cursor-zoom-in group bg-gray-50 flex items-center justify-center select-none"
                    onClick={() => {
                      if (customMedia4) {
                        setSelectedImage(customMedia4.url);
                      } else {
                        setSelectedImage(project.galleryImages?.[4] || null);
                      }
                    }}
                  >
                    {customMedia4 ? (
                      customMedia4.type === 'video' ? (
                        <video 
                          src={customMedia4.url}
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <img 
                          src={customMedia4.url} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                          alt="Custom Rating Meter" 
                        />
                      )
                    ) : (
                      <img 
                        src={project.galleryImages?.[4]} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                        alt="Rating Meter" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/1906/914/F7F5F2/1A1A1A?text=Rating+Meter';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                      <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                    </div>


                  </div>

                  {/* Second Image: Rating Meter Detail */}
                  <div 
                    className="aspect-[1906/914] rounded-2xl overflow-hidden border border-black/5 relative shadow-sm cursor-zoom-in group bg-gray-50 flex items-center justify-center select-none"
                    onClick={() => {
                      if (customMedia5) {
                        setSelectedImage(customMedia5.url);
                      } else {
                        setSelectedImage(project.galleryImages?.[3] || null);
                      }
                    }}
                  >
                    {customMedia5 ? (
                      customMedia5.type === 'video' ? (
                        <video 
                          src={customMedia5.url}
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <img 
                          src={customMedia5.url} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                          alt="Custom Rating Meter Detail" 
                        />
                      )
                    ) : (
                      <img 
                        src={project.galleryImages?.[3]} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                        alt="Rating Meter Detail" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/1906/914/F7F5F2/1A1A1A?text=Rating+Meter+Detail';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                      <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                    </div>


                  </div>
                </div>
              </div>

              {/* Solution 5 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 lg:gap-x-16 items-center">
                <div className="md:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 block">Teacher Interface</span>
                    <h4 className="text-xl font-semibold text-black/85">5. Teacher Control Panel</h4>
                  </div>
                  <p className="text-lg font-light leading-relaxed text-black/80">
                    A dedicated dashboard focused on real-time classroom management. It allows teachers to track each student's progress, manage session timing, and use a "Live-peek" feature to monitor ongoing interviews and ensure students remain focused on the task.
                  </p>
                </div>
                <div 
                  className="md:col-span-7 md:-mr-12 lg:-mr-20 w-full md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] max-w-none aspect-[1906/914] rounded-2xl overflow-hidden border border-black/5 relative shadow-sm cursor-zoom-in group bg-gray-50 flex items-center justify-center"
                  onClick={() => setSelectedImage(project.galleryImages?.[5] || null)}
                >
                  <img 
                    src={project.galleryImages?.[5]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                    alt="Teacher Panel" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/1906/914/F7F5F2/1A1A1A?text=Teacher+Panel';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-black opacity-0 group-hover:opacity-40 transition-opacity" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact & Outcomes */}
          <section className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Impact & Outcomes</h2>
              <p className="text-lg font-light leading-relaxed">
                The platform was tested across three pilot rounds involving 8 classes, approximately 160 students, and 6 teachers—delivering higher-than-expected results in student motivation, core knowledge acquisition, and higher-order thinking skills.
              </p>
            </div>

            <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
                  {[
                    <span>No solution I’ve tried so far has been as <span className="font-bold text-black underline decoration-indigo-500/20 underline-offset-4 not-italic">successful</span> as PressPective.</span>,
                    <span>Students actually <span className="font-bold text-black underline decoration-indigo-500/20 underline-offset-4 not-italic">refused to leave</span> for recess.</span>,
                    <span>Classroom discussions following just a <span className="font-bold text-black underline decoration-indigo-500/20 underline-offset-4 not-italic">single</span> session reflected an incredibly <span className="font-bold text-black underline decoration-indigo-500/20 underline-offset-4 not-italic">deep</span> understanding of the material.</span>,
                    <span>Students scored an average of <span className="font-bold text-black underline decoration-indigo-500/20 underline-offset-4 not-italic">20 points higher</span> on a test covering material studied in just a single PressPective session.</span>
                  ].map((quote, idx) => (
                    <div 
                      key={idx} 
                      className="p-8 md:p-10 bg-[#F9F9F9] rounded-[2rem] border border-black/[0.02] space-y-6 flex flex-col justify-between relative overflow-hidden"
                    >
                      <Quote 
                        className="absolute -top-4 -right-4 text-black/[0.03]" 
                        size={120} 
                        fill="currentColor"
                        stroke="none"
                      />
                      <p className="text-xl md:text-2xl font-light italic leading-relaxed text-black/80 relative z-10">
                        "{quote}"
                      </p>
                      <div className="flex items-center gap-3 pt-6 border-t border-black/[0.05] relative z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-30">Pilot Teacher</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-6 font-light pt-8">
                  <h3 className="text-xl md:text-2xl font-light tracking-tight text-black/80 animate-none">Market Validation</h3>
                  <p className="text-lg font-light leading-relaxed">
                    Although the department closed prior to a commercial launch, we identified strong signals of Product-Market Fit. Several schools expressed a formal intent to purchase, and teachers reported direct inquiries from parents interested in private access to the platform.
                  </p>
               </div>
            </div>
          </section>
        </div>
      </main>

      <SystemOverview images={project.galleryImages || []} isPressPective={true} />

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
                (selectedImage.startsWith('blob:') && (customMedia?.type === 'video' || customMedia2?.type === 'video' || customMedia4?.type === 'video' || customMedia5?.type === 'video'))
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
