/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import { PROJECTS } from './constants';
import { Project } from './types';
import MindEdPage from './components/MindEdPage';
import GusPage from './components/GusPage';
import PressPectivePage from './components/PressPectivePage';
import MyzonPage from './components/MyzonPage';
import AboutPage from './components/AboutPage';
import ResumePage from './components/ResumePage';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'resume' | 'project-page'>('home');
  const [pageProject, setPageProject] = useState<Project | null>(null);

  // Auto-redirect to print-only view if the query param is present
  const isPrintOnlyMode = typeof window !== 'undefined' && window.location.search.includes('cv-print');

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  const handleProjectClick = (project: Project) => {
    if (project.id === '1' || project.id === '2' || project.id === '3' || project.id === '4') {
      setPageProject(project);
      setCurrentView('project-page');
      window.scrollTo(0, 0);
    } else {
      setSelectedProject(project);
    }
  };

  const handleNavigation = (view: 'home' | 'about' | 'resume', targetId?: string) => {
    setCurrentView(view);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (isPrintOnlyMode) {
    return (
      <ResumePage 
        onBack={() => {}}
        onNavigate={() => {}}
        isPrintOnlyMode={true}
      />
    );
  }

  if (currentView === 'about') {
    return (
      <AboutPage 
        onBack={() => handleNavigation('home')}
        onNavigate={handleNavigation}
      />
    );
  }

  if (currentView === 'resume') {
    return (
      <ResumePage 
        onBack={() => handleNavigation('home')}
        onNavigate={handleNavigation}
      />
    );
  }

  if (currentView === 'project-page' && pageProject) {
    if (pageProject.id === '1') {
      return (
        <MindEdPage
          project={pageProject}
          onBack={() => handleNavigation('home', 'Projects')}
          onNavigate={handleNavigation}
        />
      );
    }
    if (pageProject.id === '2') {
      return (
        <GusPage
          project={pageProject}
          onBack={() => handleNavigation('home', 'Projects')}
          onNavigate={handleNavigation}
        />
      );
    }
    if (pageProject.id === '3') {
      return (
        <PressPectivePage
          project={pageProject}
          onBack={() => handleNavigation('home', 'Projects')}
          onNavigate={handleNavigation}
        />
      );
    }
    if (pageProject.id === '4') {
      return (
        <MyzonPage
          project={pageProject}
          onBack={() => handleNavigation('home', 'Projects')}
          onNavigate={handleNavigation}
        />
      );
    }
  }

  return (
    <div className="relative min-h-screen font-sans text-[#32404F] bg-[#FDFCFA]">
      <Header 
        currentView={currentView}
        onNavigate={handleNavigation} 
      />
      
      <main>
        <Hero />

        {/* Projects Grid */}
        <section id="Projects" className="px-6 sm:px-12 md:px-24 lg:px-36 xl:px-44 pt-10 pb-20 md:pt-14 md:pb-28 bg-[#FDFCFA] border-b border-[#858E97]/25">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {PROJECTS.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={handleProjectClick} 
              />
            ))}
          </div>
        </section>

        {/* Simple Footer */}
        <footer id="Contact" className="h-32 flex items-center justify-end px-12 bg-[#FDFCFA] border-t border-[#858E97]/25">
          <div className="flex gap-12 text-[11.5px] uppercase tracking-widest text-[#32404F]">
            <a 
              href="mailto:tzurit88@gmail.com" 
              className="opacity-60 hover:opacity-100 transition-all duration-300 relative py-1 group block"
            >
              <span>tzurit88@gmail.com</span>
              <span className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
            </a>
            <a 
              href="https://linkedin.com/in/tzurit-avraham-886013104" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="opacity-60 hover:opacity-100 transition-all duration-300 relative py-1 group block"
            >
              <span>LinkedIn</span>
              <span className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-[#32404F] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
            </a>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

