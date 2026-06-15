import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { PROJECTS } from '../constants';

interface OtherProjectsProps {
  currentProjectId: string;
  onNavigateProject: (project: Project) => void;
}

export default function OtherProjects({ currentProjectId, onNavigateProject }: OtherProjectsProps) {
  // הסרת הפרויקט הנוכחי מתוך האפשרויות המוצעות
  const otherProjects = PROJECTS.filter((p) => p.id !== currentProjectId);

  return (
    <section className="border-t border-[#858E97]/20 pt-24 pb-16 max-w-5xl mx-auto px-6 sm:px-12 md:px-16">
      {/* כותרת הסקשן */}
      <div className="text-center md:text-left mb-10">
        <h3 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[#858E97]/90">
          Explore Other Projects
        </h3>
      </div>

      {/* גריד בעל 3 עמודות עם ריווח אחיד */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {otherProjects.map((proj, idx) => {
          // צבעי הרקע המדויקים אחד לאחד לפי הפרויקט
          const bgClassName =
            proj.id === '1' ? 'bg-[#D2C7FF] hover:bg-[#F5F3FF]' :
            proj.id === '2' ? 'bg-[#E8FF77] hover:bg-[#FBFFDE]' :
            proj.id === '3' ? 'bg-[#BAE7FF] hover:bg-[#F0F9FF]' :
            proj.id === '4' ? 'bg-[#b1b1ff] hover:bg-[#c2c2ff]' :
            'bg-[#EAE8E4] hover:bg-[#FBFBFB]';

          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              onClick={() => {
                onNavigateProject(proj);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col cursor-pointer"
            >
              {/* מיכל התמונה הקומפקטי עם גבולות עדינים ורקע צבעוני הנסוג בעדינות */}
              <div className={`relative overflow-hidden aspect-[16/10] rounded-xl border border-[#858E97]/15 ${bgClassName} transition-colors duration-300 p-3 flex items-center justify-center`}>
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover rounded-lg shadow-sm group-hover:scale-[1.03] transition-transform duration-500 whitespace-nowrap"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* כותרת ותיאור הפרויקט מתחת לכרטיסייה */}
              <div className="pt-4 flex flex-col">
                <h4 className="text-base font-semibold text-[#32404F] mt-1 group-hover:text-[#32404F]/80 transition-colors">
                  {proj.title}
                </h4>
                <p className="text-xs text-[#858E97] mt-1 text-light leading-relaxed line-clamp-2">
                  {proj.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
