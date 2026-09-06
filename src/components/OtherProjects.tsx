import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { PROJECTS } from '../constants';

interface OtherProjectsProps {
  currentProjectId: string;
  onNavigateProject: (project: Project) => void;
}

export default function OtherProjects({ currentProjectId, onNavigateProject }: OtherProjectsProps) {
  // ׳”׳¡׳¨׳× ׳”׳₪׳¨׳•׳™׳§׳˜ ׳”׳ ׳•׳›׳—׳™ ׳׳×׳•׳ ׳”׳׳₪׳©׳¨׳•׳™׳•׳× ׳”׳׳•׳¦׳¢׳•׳×
  const otherProjects = PROJECTS.filter((p) => p.id !== currentProjectId);

  return (
    <section className="border-t border-[#858E97]/20 pt-24 pb-16 max-w-5xl mx-auto px-6 sm:px-12 md:px-16">
      {/* ׳›׳•׳×׳¨׳× ׳”׳¡׳§׳©׳ */}
      <div className="text-center md:text-left mb-10">
        <h3 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[#858E97]/90">
          More of My Work
        </h3>
      </div>

      {/* ׳’׳¨׳™׳“ ׳‘׳¢׳ 3 ׳¢׳׳•׳“׳•׳× ׳¢׳ ׳¨׳™׳•׳•׳— ׳׳—׳™׳“ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {otherProjects.map((proj, idx) => {
          // ׳¦׳‘׳¢׳™ ׳”׳¨׳§׳¢ ׳”׳׳“׳•׳™׳§׳™׳ ׳׳—׳“ ׳׳׳—׳“ ׳׳₪׳™ ׳”׳₪׳¨׳•׳™׳§׳˜
          const bgClassName =
            proj.id === '1' ? 'bg-[#D2C7FF] hover:bg-[#F5F3FF]' :
            proj.id === '2' ? 'bg-[#E8FF77] hover:bg-[#FBFFDE]' :
            proj.id === '3' ? 'bg-[#BAE7FF] hover:bg-[#F0F9FF]' :
            proj.id === '4' ? 'bg-[#E6C9F7] hover:bg-[#eeddf9]' :
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
              {/* ׳׳™׳›׳ ׳”׳×׳׳•׳ ׳” ׳”׳§׳•׳׳₪׳§׳˜׳™ ׳¢׳ ׳’׳‘׳•׳׳•׳× ׳¢׳“׳™׳ ׳™׳ ׳•׳¨׳§׳¢ ׳¦׳‘׳¢׳•׳ ׳™ ׳”׳ ׳¡׳•׳’ ׳‘׳¢׳“׳™׳ ׳•׳× */}
              <div className={`relative overflow-hidden aspect-[4/3] rounded-xl border border-[#858E97]/15 ${bgClassName} transition-colors duration-300`}>
                {proj.thumbnailImages && proj.thumbnailImages.length > 0 ? (
                  <div className="relative w-full h-full p-6 flex items-center justify-center">
                    <motion.img
                      src={proj.thumbnailImages[0]}
                      alt={proj.title}
                      whileHover={proj.title === 'GUS' ? { x: '159.09%', y: 110, rotate: -3, scale: 1.02 } : { x: 38, y: 103, rotate: -2.5, scale: 1.01 }}
                      initial={proj.title === 'GUS' ? { x: '154.55%', y: 115, rotate: -4, scale: 1 } : { x: 32, y: 108, rotate: -4, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute shadow-2xl rounded-[8px] z-20 object-cover ${proj.title === 'GUS' ? 'w-[22%] aspect-[350/700]' : proj.id === '4' ? 'w-[80%]' : 'w-[80%] aspect-[15/7]'}`}
                    />
                    <motion.img
                      src={proj.thumbnailImages[1] || proj.thumbnailImages[0]}
                      alt={proj.title}
                      whileHover={proj.title === 'GUS' ? { x: '-7.5%', y: 15, rotate: 5, scale: 1.02 } : { x: -38, y: 26, rotate: 5.5 }}
                      initial={proj.title === 'GUS' ? { x: '-6.25%', y: 20, rotate: 4, scale: 1 } : { x: -32, y: 32, rotate: 4 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute shadow-2xl rounded-[8px] z-10 object-cover ${proj.title === 'GUS' ? 'w-[80%] aspect-[15/7]' : proj.id === '4' ? 'w-[80%]' : 'w-[80%] aspect-[15/7]'}`}
                    />
                  </div>
                ) : (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover rounded-lg shadow-sm group-hover:scale-[1.03] transition-transform duration-500"
                  />
                )}
              </div>

              {/* ׳›׳•׳×׳¨׳× ׳•׳×׳™׳׳•׳¨ ׳”׳₪׳¨׳•׳™׳§׳˜ ׳׳×׳—׳× ׳׳›׳¨׳˜׳™׳¡׳™׳™׳” */}
              <div className="pt-4 flex flex-col">
                <h4 className="text-base font-semibold text-[#1B232C] mt-1 group-hover:text-[#1B232C]/80 transition-colors">
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



