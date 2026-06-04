import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Linkedin } from 'lucide-react';
import Header from './Header';

interface ContactPageProps {
  onBack: () => void;
  onNavigate: (view: 'home' | 'about' | 'resume', targetId?: string) => void;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function ContactPage({ onBack, onNavigate }: ContactPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#FDFCFA] font-sans text-[#32404F]"
    >
      <Header currentView="home" onNavigate={onNavigate} />

      <main className="max-w-sm mx-auto px-8 pt-36 pb-16 flex flex-col">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#32404F]/60 mb-12 w-fit"
        >
          <ArrowLeft size={13} />
          Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-[#32404F] tracking-tight mb-2">Contact</h1>
        <p className="text-sm text-[#858E97] mb-16">Tzurit Avraham • Product Design</p>

        {/* Contact links */}
        <div className="flex flex-col gap-10">
          <a
            href="mailto:tzurit88@gmail.com"
            className="flex items-center gap-5 text-[#32404F]/70 hover:text-[#32404F] transition-colors duration-300 group"
          >
            <Mail size={28} strokeWidth={1.5} className="shrink-0" />
            <span className="text-base font-light">tzurit88@gmail.com</span>
          </a>
          <a
            href="https://wa.me/972509607267"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 text-[#32404F]/70 hover:text-[#32404F] transition-colors duration-300 group"
          >
            <WhatsAppIcon />
            <span className="text-base font-light">+972 509 607 267</span>
          </a>
          <a
            href="https://linkedin.com/in/tzurit-avraham-886013104"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 text-[#32404F]/70 hover:text-[#32404F] transition-colors duration-300 group"
          >
            <Linkedin size={28} strokeWidth={1.5} className="shrink-0" />
            <span className="text-base font-light">LinkedIn</span>
          </a>
        </div>

        <p className="mt-auto pt-20 text-sm text-[#858E97]/70 font-light">Lets talk:)</p>
      </main>
    </motion.div>
  );
}
