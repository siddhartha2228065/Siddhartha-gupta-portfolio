import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Globe, Code, Sparkles, Check, Server, Cloud, 
  Database, Shield, ZoomIn, Eye, Activity, Terminal, X
} from 'lucide-react';
import { CaseStudy } from '../types';

interface ProjectDetailPageProps {
  project: CaseStudy;
  onBack: () => void;
  onDiscussClick: () => void;
}

export default function ProjectDetailPage({ project, onBack, onDiscussClick }: ProjectDetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="min-h-screen pb-20 bg-white text-neutral-900 dark:bg-zinc-950 dark:text-neutral-100 font-sans"
      id="project-detail-page"
    >
      {/* HEADER NAVIGATION BAR */}
      <div className="sticky top-0 z-40 w-full border-b backdrop-blur-md border-neutral-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="w-full flex h-16 items-center justify-between px-6 md:px-10 lg:px-16 xl:px-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-450 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer group focus:outline-none"
            id="btn-back-to-home"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-[10px] font-bold font-mono text-neutral-600 dark:text-neutral-300 uppercase">
              {project.category}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono text-neutral-400">DEPLOYED OK</span>
          </div>
        </div>
      </div>

      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        
        {/* LEFT COLUMN: HERO VISUALS & DETAILED SPECS */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* TITLE & HEADER */}
          <div className="space-y-4">
            <span className="text-xs font-semibold tracking-widest font-mono text-neutral-500 uppercase block">Project Blueprint</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-neutral-950 dark:text-white leading-[1.1]">
              {project.title}
            </h1>
            <p className="text-base md:text-lg text-neutral-550 dark:text-zinc-400 font-sans leading-relaxed">
              {project.desc}
            </p>
          </div>

          {/* SCREENSHOT GALLERY */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-4">
              {/* Active Image Box */}
              <div 
                className="relative w-full h-[240px] sm:h-[360px] md:h-[450px] lg:h-[500px] xl:h-[580px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-zinc-900 shadow-md group cursor-zoom-in"
                onClick={() => setZoomImage(project.images[activeImageIndex])}
              >
                <img 
                  src={project.images[activeImageIndex]} 
                  alt={`${project.title} Screenshot ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-101 transition-transform duration-500"
                />
                {/* Visual Overlay Decal */}
                <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                    <ZoomIn className="h-5 w-5" />
                  </div>
                </div>
                
                {/* Image Counter */}
                <div className="absolute right-4 bottom-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white tracking-widest font-bold">
                  {activeImageIndex + 1} / {project.images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {project.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {project.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer focus:outline-none shrink-0 ${
                        activeImageIndex === idx 
                          ? 'border-neutral-900 ring-2 ring-neutral-900/10 dark:border-white dark:ring-white/10 opacity-100' 
                          : 'border-neutral-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROJECT NARRATIVE SECTION */}
          <div className="space-y-4 bg-neutral-50 dark:bg-zinc-900/20 border border-neutral-200/50 dark:border-zinc-800/60 p-6 md:p-8 rounded-3xl">
            <h3 className="text-xl font-bold font-display text-neutral-950 dark:text-white border-b border-neutral-200 dark:border-zinc-800 pb-2">
              Development Objective
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed whitespace-pre-line text-justify font-sans">
              {project.detailedDesc}
            </p>
          </div>

          {/* CORE ARCHITECTURE FEATURES */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display text-neutral-950 dark:text-white">
                Technical Highlights
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 border border-neutral-150 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-2xl shadow-3xs"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mt-0.5">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-xs text-neutral-700 dark:text-neutral-350 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHALLENGES & SOLUTIONS */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display text-neutral-950 dark:text-white">
                Engineering Challenges & Solutions
              </h3>
              
              <div className="space-y-4">
                {project.challenges.map((c, index) => (
                  <div 
                    key={index}
                    className="border border-neutral-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-3xs"
                  >
                    {/* Challenge Box */}
                    <div className="bg-neutral-50 dark:bg-zinc-900/50 p-4 border-b border-neutral-200 dark:border-zinc-800 flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-mono text-[9px] font-bold uppercase mt-0.5">
                        CHALLENGE
                      </span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-sans leading-normal">
                        {c.challenge}
                      </span>
                    </div>
                    {/* Solution Box */}
                    <div className="bg-white dark:bg-zinc-950 p-4 flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-bold uppercase mt-0.5">
                        SOLUTION
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-sans">
                        {c.solution}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: STICKY METRIC SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            
            {/* BIG METRICS CARD */}
            <div className={`p-6 rounded-3xl bg-gradient-to-br ${project.gradient} text-white shadow-lg space-y-3 relative overflow-hidden`}>
              <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10 pointer-events-none">
                <Sparkles className="h-48 w-48" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest opacity-80 uppercase block">Impact Metric</span>
              <p className="text-3xl font-extrabold font-display leading-tight">{project.metrics}</p>
              <div className="pt-2 border-t border-white/20 text-xs opacity-90 leading-relaxed font-sans">
                Verified developer blueprint results achieved in live sandbox environment.
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-widest block">Deployment Status</span>
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-zinc-800/60 text-xs">
                <span className="text-neutral-500">Host Endpoint</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Deployed Cloud App</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-zinc-800/60 text-xs">
                <span className="text-neutral-500">Compile Environment</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">TypeScript / Vite</span>
              </div>

              {/* URL Actions */}
              <div className="space-y-2 pt-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Open Live Demo</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold border border-neutral-250 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Code className="h-4 w-4" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>

            {/* TECHNOLOGY PROFILE */}
            <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-widest block">Stack Configuration</span>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => {
                  return (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-zinc-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-zinc-800/80 shadow-3xs"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* SYSTEM ARCHITECTURE DETAIL */}
            <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-widest block flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" /> Architectural Notes
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed font-sans">
                {project.architecture}
              </p>
            </div>

            {/* CTA COLLABORATE DISCUSS */}
            <button
              onClick={onDiscussClick}
              className="w-full py-4 rounded-3xl bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/35 dark:hover:bg-indigo-900/30 dark:text-indigo-400 font-display font-semibold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Terminal className="h-4 w-4" />
              <span>Discuss Project Build &rarr;</span>
            </button>

          </div>
        </div>

      </div>

      {/* GALLERY LIGHTBOX ZOOM MODAL */}
      <AnimatePresence>
        {zoomImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md cursor-zoom-out"
            onClick={() => setZoomImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 flex"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={zoomImage} alt="zoomed screenshot" className="w-full h-full object-contain" />
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
