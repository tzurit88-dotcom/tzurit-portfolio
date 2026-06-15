import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail, Linkedin, ArrowDownRight } from 'lucide-react';

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.004 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.93.548 3.731 1.493 5.275L2 22l4.903-1.282c1.47.804 3.136 1.27 4.901 1.27 5.517 0 9.993-4.476 9.993-9.993S17.52 2 12.004 2zm0 1.662c4.6 0 8.331 3.731 8.331 8.331 0 4.6-3.731 8.331-8.331 8.331-1.616 0-3.118-.46-4.394-1.258l-.315-.19L4.4 19.645l.84-2.812-.209-.328c-.845-1.326-1.332-2.9-1.332-4.57 0-4.604 3.731-8.335 8.331-8.335" />
      <path d="M16.48 13.9c-.244-.122-1.442-.712-1.666-.793-.223-.081-.386-.122-.549.122-.163.244-.63.793-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.379-1.96-1.21-.724-.646-1.213-1.444-1.355-1.688-.142-.244-.015-.376.107-.497.11-.11.244-.285.366-.427.122-.142.163-.244.244-.407.081-.163.041-.305-.02-.427-.061-.122-.549-1.322-.752-1.815-.198-.476-.399-.412-.549-.42-.142-.007-.305-.008-.468-.008-.163 0-.427.061-.65.305-.224.244-.854.834-.854 2.035 0 1.2.875 2.36 1.0 2.522.122.163 1.724 2.632 4.175 3.691 1.458.625 2.029.664 2.753.556.467-.07 1.442-.59 1.646-1.16.204-.57.204-1.058.143-1.16-.061-.102-.224-.163-.468-.285z" />
    </svg>
  );
}

interface HeaderProps {
  onNavigate?: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
  currentView?: 'home' | 'about' | 'resume' | 'project-page' | 'contact';
  onNavigateToContact?: () => void;
  onContactMouseEnter?: () => void;
  onContactMouseLeave?: () => void;
}

export default function Header({
  onNavigate,
  currentView = 'home',
  onNavigateToContact,
  onContactMouseEnter,
  onContactMouseLeave,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        if (showTimeout.current) clearTimeout(showTimeout.current);
        setIsVisible(false);
        setIsOpen(false);
      } else if (currentScrollY < lastScrollY.current) {
        if (showTimeout.current) clearTimeout(showTimeout.current);
        showTimeout.current = setTimeout(() => setIsVisible(true), 250);
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
        className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCFA]/90 backdrop-blur-md border-b border-[#858E97]/20 px-6 sm:px-12 h-[84px] flex items-center"
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              setIsOpen(false);
              if (onNavigate) onNavigate('home');
              else window.location.hash = '';
            }}
            className="flex flex-col items-start justify-center cursor-pointer border-none bg-transparent hover:opacity-75 transition-opacity text-left p-0 z-50"
          >
            <span className="font-medium text-[20px] lg:text-[22px] tracking-tighter uppercase leading-none text-left text-[#32404F]">
              Tzurit Avraham
            </span>
            <span className="text-[12px] uppercase tracking-[0.15em] text-[#858E97] mt-1 text-left font-light leading-none">
              Product Designer
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-[12px] uppercase tracking-[0.2em] font-medium text-[#32404F]">
            <div className="flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => { if (onNavigate) onNavigate(item.view, item.id); }}
                    className={`transition-all duration-300 uppercase tracking-[0.2em] text-[12px] cursor-pointer border-none bg-transparent px-6 py-5 block text-[#32404F] relative group ${
                      isActive ? 'opacity-100 font-bold' : 'opacity-60 hover:opacity-100 font-medium'
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
            </div>

            {/* Desktop Contact Button */}
            <motion.button
              onClick={() => setIsDrawerOpen(true)}
              onMouseEnter={onContactMouseEnter}
              onMouseLeave={onContactMouseLeave}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center justify-center gap-1.5 px-[22px] h-[46px] bg-[#FDFCFA] hover:bg-[#858E97]/10 text-[#32404F] border border-[#858E97]/40 rounded-full font-sans text-[16px] font-medium tracking-wide shadow-[0_2px_6px_rgba(50,64,79,0.1)] group cursor-pointer transition-all duration-300"
            >
              <span>contact</span>
              <motion.div
                variants={{ initial: { x: 0, y: 0 }, hover: { x: 2, y: 2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="text-[#858E97] group-hover:text-[#32404F] flex items-center justify-center"
              >
                <ArrowDownRight size={15} />
              </motion.div>
            </motion.button>
          </nav>

          {/* Mobile hamburger */}
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

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[84px] z-[200] md:hidden bg-[#FDFCFA] border-b border-[#858E97]/20 shadow-lg"
          >
            <div className="flex flex-col py-6 px-10">
              <div className="flex flex-col space-y-2">
                {menuItems.map((item) => {
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => { if (onNavigate) onNavigate(item.view, item.id); }, 100);
                      }}
                      className={`text-[12px] uppercase tracking-[0.25em] font-semibold text-left py-4 w-full border-b border-neutral-100/50 hover:bg-neutral-50/50 px-2 rounded-sm transition-all text-[#32404F] flex items-center justify-between ${
                        isActive ? 'opacity-100 font-bold bg-[#F5F4F0]/30' : 'opacity-70'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#32404F]" />}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => { if (onNavigateToContact) onNavigateToContact(); }, 100);
                  }}
                  className={`text-[12px] uppercase tracking-[0.25em] font-semibold text-left py-4 w-full border-b border-neutral-100/50 hover:bg-neutral-50/50 px-2 rounded-sm transition-all text-[#32404F] flex items-center justify-between ${
                    currentView === 'contact' ? 'opacity-100 font-bold bg-[#F5F4F0]/30' : 'opacity-70'
                  }`}
                >
                  <span>contact</span>
                  {currentView === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-[#32404F]" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#32404F]/22 z-[100] cursor-pointer"
            />

            {/* Slide-out panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#FDFCFA] border-l border-[#858E97]/20 shadow-[0_0_50px_rgba(50,64,79,0.12)] z-[101] flex flex-col justify-between"
            >
              {/* Drawer header */}
              <div className="p-6 border-b border-[#858E97]/15 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-semibold text-[#32404F] leading-none font-sans">
                    Contact
                  </h2>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-[#858E97]/10 text-[#858E97] hover:text-[#32404F] transition-all cursor-pointer border-none bg-transparent"
                  aria-label="Close drawer"
                >
                  <X size={18} className="stroke-[1.8]" />
                </button>
              </div>

              {/* Icons */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-16">
                <motion.a
                  href="mailto:tzurit88@gmail.com"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[#32404F] hover:text-[#858E97] transition-colors duration-300 flex items-center justify-center"
                  title="tzurit88@gmail.com"
                  aria-label="Email"
                >
                  <Mail size={36} className="stroke-[1.2]" />
                </motion.a>

                <motion.a
                  href="https://wa.me/972509607267"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[#32404F] hover:text-[#858E97] transition-colors duration-300 flex items-center justify-center"
                  title="+972 509 607 267"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon size={36} />
                </motion.a>

                <motion.a
                  href="https://linkedin.com/in/tzurit-avraham-886013104"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[#32404F] hover:text-[#858E97] transition-colors duration-300 flex items-center justify-center"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={36} className="stroke-[1.2]" />
                </motion.a>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-[#858E97]/15 flex items-center justify-center bg-[#FDFCFA] w-full select-none">
                <span className="font-mono text-xl text-[#858E97] tracking-wider text-center">
                  Lets talk:)
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
