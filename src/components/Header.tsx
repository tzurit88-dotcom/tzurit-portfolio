import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header({
  onNavigate,
  currentView = 'home',
  onOpenContact,
  onNavigateToContact,
}: {
  onNavigate?: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
  currentView?: 'home' | 'about' | 'resume' | 'project-page' | 'contact';
  onOpenContact?: () => void;
  onNavigateToContact?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down — hide immediately
        if (showTimeout.current) clearTimeout(showTimeout.current);
        setIsVisible(false);
        setIsOpen(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up — show with delay
        if (showTimeout.current) clearTimeout(showTimeout.current);
        showTimeout.current = setTimeout(() => {
          setIsVisible(true);
        }, 250);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (showTimeout.current) clearTimeout(showTimeout.current);
    };
  }, []);

  const menuItems = [
    { label: 'my work', id: 'Projects', view: 'home' as const },
    { label: 'About', id: 'About', view: 'about' as const },
    { label: 'cv', id: 'Resume', view: 'resume' as const },
  ];

  return (
    <>
      <motion.header
        animate={{ y: isVisible ? 0 : -100 }}
        initial={{ y: -100 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCFA]/90 backdrop-blur-md border-b border-[#858E97]/20 px-6 sm:px-12 h-[86px] flex items-center"
      >
        <div className="w-full flex items-center justify-between">

          <div className="flex items-center gap-6">
            {/* Logo */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) {
                  onNavigate('home');
                } else {
                  window.location.hash = '';
                }
              }}
              className="flex flex-col items-start justify-center cursor-pointer border-none bg-transparent hover:opacity-75 transition-opacity text-left p-0 z-50"
            >
              <span className="font-semibold text-[20px] tracking-tight uppercase leading-none text-left text-[#32404F]">
                Tzurit Avraham
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#858E97] mt-1.5 text-left font-normal leading-none">
                Product Designer
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-[12px] uppercase tracking-[0.2em] font-medium text-[#32404F]">
            {menuItems.map((item) => {
              const isActive = item.view === 'current'
                 ? false
                 : currentView === item.view;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.view === 'current') {
                       const el = document.getElementById('Contact');
                       if (el) {
                         el.scrollIntoView({ behavior: 'smooth' });
                       } else if (onNavigate) {
                         onNavigate('home', 'Contact');
                       }
                    } else if (onNavigate) {
                      onNavigate(item.view, item.id);
                    }
                  }}
                  className={`transition-all duration-300 uppercase tracking-[0.2em] cursor-pointer border-none bg-transparent px-6 py-5 block text-[#32404F] relative group ${
                    isActive ? 'opacity-100 font-bold' : 'opacity-80 hover:opacity-100 font-medium'
                  }`}
                >
                  <span className="relative py-1">
                    {item.label}
                    {!isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

            {/* Desktop Contact Button */}
            <button
              onClick={onOpenContact}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 border border-[#32404F]/30 rounded-full text-[12px] uppercase tracking-[0.2em] font-medium text-[#32404F] hover:bg-[#32404F]/5 transition-all duration-300 cursor-pointer ml-4"
            >
              <span>contact</span>
              <ArrowUpRight size={13} strokeWidth={1.8} />
            </button>
          </nav>

          {/* Mobile Menu Action Toggle Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 -mr-3 flex items-center justify-center cursor-pointer border-none bg-transparent text-[#32404F] hover:opacity-70 transition-opacity"
              aria-label="Toggle Navigation Menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: isOpen ? -45 : 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isOpen ? 45 : -45 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={18} className="stroke-[1.8]" /> : <Menu size={18} className="stroke-[1.8]" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Dropdown Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[86px] z-[60] md:hidden bg-[#FDFCFA] border-b border-[#858E97]/20 shadow-lg"
          >
            <div className="flex flex-col py-6 px-10 space-y-2">
              {menuItems.map((item) => {
                const isActive = currentView === item.view;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => {
                        if (item.view === 'current') {
                          const el = document.getElementById('Contact');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          } else if (onNavigate) {
                            onNavigate('home', 'Contact');
                          }
                        } else if (onNavigate) {
                          onNavigate(item.view, item.id);
                        }
                      }, 100);
                    }}
                    className={`text-[12px] uppercase tracking-[0.25em] font-semibold text-left py-4 w-full border-b border-neutral-100/50 hover:bg-neutral-50/50 px-2 rounded-sm transition-all text-[#32404F] flex items-center justify-between ${
                      isActive ? 'opacity-100 font-bold bg-[#F5F4F0]/30' : 'opacity-70'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#32404F]" />
                    )}
                  </button>
                );
              })}
              {/* Contact tab — mobile only */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => { if (onNavigateToContact) onNavigateToContact(); }, 100);
                }}
                className={`text-[12px] uppercase tracking-[0.25em] font-semibold text-left py-4 w-full border-b border-neutral-100/50 hover:bg-neutral-50/50 px-2 rounded-sm transition-all text-[#32404F] flex items-center justify-between ${
                  currentView === 'contact' ? 'opacity-100 font-bold bg-[#F5F4F0]/30' : 'opacity-70'
                }`}
              >
                <span>Contact</span>
                {currentView === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-[#32404F]" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
