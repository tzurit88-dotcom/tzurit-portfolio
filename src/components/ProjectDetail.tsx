import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { X, ArrowRight, Calendar, User, Tag } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/80 backdrop-blur-xl"
      />

      {/* Content Container */}
      <motion.div
        layoutId={`project-${project.id}`}
        className="relative w-full max-w-6xl max-h-[90vh] bg-white border border-black/5 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-black/5 hover:bg-black hover:text-white rounded-full transition-all duration-300"
        >
          <X size={20} />
        </button>

        {/* Left Side: Images/Media Showcase */}
        <div className="w-full md:w-3/5 h-[50vh] md:h-full bg-[#f0eee9] overflow-y-auto custom-scrollbar p-6 md:p-12">
          <div className="flex flex-col gap-12 max-w-2xl mx-auto">
            {project.galleryImages && project.galleryImages.length > 0 ? (
              <>
                {/* Simulated Desktop/Tablet Frame */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="w-full aspect-[15/7] rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-white"
                >
                  <div className="h-8 bg-gray-100 border-b border-black/5 flex items-center px-4 gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
                    <img
                      src={project.id === '2' ? project.galleryImages[1] : project.galleryImages[0]}
                      alt={`${project.title} Desktop View`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </motion.div>

                {/* Simulated Mobile Frame Staggered */}
                {project.galleryImages[1] && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="w-[60%] self-end -mt-24 rounded-[3rem] p-3 shadow-2xl border-[8px] border-gray-900 bg-white aspect-[9/19.5] overflow-hidden"
                  >
                    <div className="w-full h-full rounded-[2.2rem] overflow-hidden">
                      <img
                        src={project.id === '2' ? project.galleryImages[0] : project.galleryImages[1]}
                        alt={`${project.title} Mobile View`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Additional Gallery Items */}
                {project.galleryImages.slice(2).map((img, idx) => (
                  <motion.img
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    src={img}
                    alt={`${project.title} detail ${idx + 1}`}
                    className="w-full h-auto rounded-2xl shadow-xl"
                  />
                ))}
              </>
            ) : (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            )}
            
            {(project.videoUrl || project.gifUrl) && (
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                 <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 backdrop-blur text-[8px] text-white uppercase rounded tracking-widest">
                   {project.videoUrl ? 'Video' : 'Interaction'}
                 </div>
                {project.videoUrl ? (
                  <video 
                    src={project.videoUrl}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    controls
                    className="w-full h-auto"
                  />
                ) : (
                  <img
                    src={project.gifUrl}
                    alt={`${project.title} interaction`}
                    className="w-full h-auto"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Info Content */}
        <div className="w-full md:w-2/5 p-8 md:p-14 overflow-y-auto space-y-12 bg-white flex flex-col justify-center">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40"
            >
              <span className="px-2 py-1 bg-black/5 rounded">{project.category}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight"
            >
              {project.title}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-8 py-8 border-y border-black/5"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-black/30">
                <Calendar size={12} /> Year
              </div>
              <div className="text-sm font-medium">{project.year}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-black/30">
                <User size={12} /> Role
              </div>
              <div className="text-sm font-medium">{project.role}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <p className="text-lg text-black/70 font-light leading-relaxed">
              {project.fullDescription}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-4">
              {project.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full text-xs font-medium">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-black text-white rounded-2xl font-medium flex items-center justify-center gap-2 group transition-all"
          >
            View Full Case Study
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
