import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Linkedin } from 'lucide-react';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[81] w-[380px] bg-[#FDFCFA] flex flex-col border-l border-[#858E97]/15"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#858E97]/15">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#32404F] tracking-tight">Contact</h2>
                  <p className="text-sm text-[#858E97] mt-1">Tzurit Avraham • Product Design</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#32404F]/30 hover:text-[#32404F]/70 transition-colors p-1 -mr-1 mt-0.5"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              <a
                href="mailto:tzurit88@gmail.com"
                className="text-[#32404F]/40 hover:text-[#32404F] transition-colors duration-300"
                aria-label="Email"
              >
                <Mail size={26} strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/972509607267"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#32404F]/40 hover:text-[#32404F] transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a
                href="https://linkedin.com/in/tzurit-avraham-886013104"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#32404F]/40 hover:text-[#32404F] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={26} strokeWidth={1.5} />
              </a>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-[#858E97]/15 text-center">
              <p className="text-sm text-[#858E97]/70 font-light">Lets talk:)</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
