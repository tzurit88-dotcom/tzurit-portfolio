import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function MobilePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const dismissed = sessionStorage.getItem('mobile-popup-v2');

    if (isMobile && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('mobile-popup-v2', '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-[2px]"
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-6 left-4 right-4 z-[201] bg-[#FDFCFA] rounded-3xl shadow-2xl px-7 py-7 border border-[#858E97]/15"
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#32404F]/30 hover:text-[#32404F]/70 hover:bg-[#858E97]/10 transition-all"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Body text */}
            <p className="text-[15px] font-semibold text-[#32404F] leading-snug pr-6 mb-6">
              Hey there! The desktop version is way more fun, just saying... 😉
            </p>

            {/* CTA */}
            <button
              onClick={dismiss}
              className="w-full py-3.5 rounded-full border border-[#858E97]/40 text-[#32404F] text-[13px] font-medium tracking-wide hover:bg-[#858E97]/10 transition-all duration-200"
            >
              Staying here for now
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
