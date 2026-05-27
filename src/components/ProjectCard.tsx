import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  key?: string | number;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layoutId={`project-${project.id}`}
      onClick={() => onClick(project)}
      initial="initial"
      whileHover="hover"
      className="flex flex-col h-full group cursor-pointer bg-[#FDFCFA] border border-[#858E97]/35 rounded-2xl overflow-hidden hover:shadow-[0_12px_44px_rgba(50,64,79,0.06)] hover:border-[#32404F]/30 transition-all duration-500"
    >
      <div className={cn(
        "relative overflow-hidden aspect-[4/3] md:h-[345px] lg:h-[385px] transition-colors duration-300",
        project.id === '1' ? 'bg-[#D2C7FF] group-hover:bg-[#F5F3FF]' : 
        project.id === '2' ? 'bg-[#E8FF77] group-hover:bg-[#FBFFDE]' : 
        project.id === '3' ? 'bg-[#BAE7FF] group-hover:bg-[#F0F9FF]' : 
        project.id === '4' ? 'bg-[#b1b1ff] group-hover:bg-[#c2c2ff]' : 
        'bg-[#EAE8E4] group-hover:bg-[#FBFBFB]'
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent z-10" />
        {project.thumbnailImages && project.thumbnailImages.length > 0 ? (
          <div className="relative w-full h-full p-8 flex items-center justify-center">
            <motion.img
              src={project.thumbnailImages[0]}
              alt={project.title}
              variants={{
                initial: project.id === '2'
                  ? { x: "154.55%", y: 115, rotate: -4, scale: 1 }
                  : { x: 32, y: 108, rotate: -4, scale: 1 },
                hover: project.id === '2'
                  ? { x: "159.09%", y: 110, rotate: -3, scale: 1.02 }
                  : { x: 38, y: 103, rotate: -2.5, scale: 1.01 }
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute shadow-2xl rounded-[8px] z-20 object-cover",
                project.id === '2' ? "w-[22%] aspect-[350/700]" : 
                project.id === '4' ? "w-[80%] aspect-[1920/1080]" : "w-[80%] aspect-[15/7]"
              )}
            />
            <motion.img
              src={project.thumbnailImages[1] || project.thumbnailImages[0]}
              alt={project.title}
              variants={{
                initial: project.id === '2'
                  ? { x: "-6.25%", y: 20, rotate: 4, scale: 1 }
                  : { x: -32, y: 32, rotate: 4 },
                hover: project.id === '2'
                  ? { x: "-7.5%", y: 15, rotate: 5, scale: 1.02 }
                  : { x: -38, y: 26, rotate: 5.5 }
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute shadow-2xl rounded-[8px] z-10 object-cover",
                project.id === '2' ? "w-[80%] aspect-[15/7]" : 
                project.id === '4' ? "w-[80%] aspect-[1920/1080]" : "w-[80%] aspect-[15/7]"
              )}
            />
          </div>
        ) : project.galleryImages && project.galleryImages.length > 0 ? (
          <div className="relative w-full h-full p-8 flex items-center justify-center">
            <motion.img
              src={project.galleryImages[0]}
              alt={project.title}
              variants={{
                initial: project.id === '2'
                  ? { x: "154.55%", y: 115, rotate: -4, scale: 1 }
                  : { x: 32, y: 108, rotate: -4, scale: 1 },
                hover: project.id === '2'
                  ? { x: "159.09%", y: 110, rotate: -3, scale: 1.02 }
                  : { x: 38, y: 103, rotate: -2.5, scale: 1.01 }
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute shadow-2xl rounded-[8px] z-20 object-cover",
                project.id === '2' ? "w-[22%] aspect-[350/700]" : 
                project.id === '4' ? "w-[80%] aspect-[1920/1080]" : "w-[80%] aspect-[15/7]"
              )}
            />
            <motion.img
              src={project.galleryImages[1] || project.galleryImages[0]}
              alt={project.title}
              variants={{
                initial: project.id === '2'
                  ? { x: "-6.25%", y: 20, rotate: 4, scale: 1 }
                  : { x: -32, y: 32, rotate: 4 },
                hover: project.id === '2'
                  ? { x: "-7.5%", y: 15, rotate: 5, scale: 1.02 }
                  : { x: -38, y: 26, rotate: 5.5 }
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute shadow-2xl rounded-[8px] z-10 object-cover",
                project.id === '2' ? "w-[80%] aspect-[15/7]" : 
                project.id === '4' ? "w-[80%] aspect-[1920/1080]" : "w-[80%] aspect-[15/7]"
              )}
            />
          </div>
        ) : (
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
        )}
        {/* Removed ID/Category indicator */}
      </div>
      
      <div className="p-8 flex flex-col gap-4 min-h-[175px] bg-[#FDFCFA] border-t border-[#858E97]/25 transition-colors duration-300">
        <h2 className="text-xl md:text-[24px] font-semibold tracking-tight text-[#32404F] leading-snug">
          {project.title}
        </h2>
        <p className="text-[15px] md:text-[15.5px] leading-relaxed text-[#858E97] font-light line-clamp-2">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
