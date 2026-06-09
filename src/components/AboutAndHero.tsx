import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown, Code, GraduationCap, MapPin,
  Sparkles, Cpu, FileText
} from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import Interactive3DSphere from './Interactive3DSphere';
import TerminalCLI from './TerminalCLI';
import CodeVisualizer from './CodeVisualizer';

interface AboutAndHeroProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
  darkMode?: boolean;
  onContactSubmit: (inquiry: any) => void;
  onThemeToggle: (dark: boolean) => void;
  onProjectSelect: (projectId: string) => void;
  onResumeClick: () => void;
  onRevealCockpit: () => void;
}

export default function AboutAndHero({ 
  onContactClick, 
  onProjectsClick, 
  darkMode = true,
  onContactSubmit,
  onThemeToggle,
  onProjectSelect,
  onResumeClick,
  onRevealCockpit
}: AboutAndHeroProps) {

  const [activeHeroTab, setActiveHeroTab] = useState<'console' | 'sphere' | 'visualizer'>('console');

  // Multi-phased precise typewriter logic for the custom developer display message
  const fullTypewriterText = "Hi, I'm Siddhartha Gupta";
  const [typedText, setTypedText] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);

  useEffect(() => {
    if (typeIndex < fullTypewriterText.length) {
      const char = fullTypewriterText.charAt(typeIndex);
      // Natural rhythm typing delay adjustments (e.g. slight delays on commas/apostrophes)
      const delay = char === ',' ? 250 : (char === ' ' ? 80 : 50);
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + char);
        setTypeIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [typeIndex, fullTypewriterText]);

  const highlights = [
    {
      icon: <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-sky-400" />,
      label: "Education",
      value: "KIIT University '26",
      sub: "B.Tech Computer Science"
    },
    {
      icon: <MapPin className="h-5 w-5 text-indigo-600 dark:text-sky-400" />,
      label: "Location",
      value: "India",
      sub: "Available for worldwide remote collaboration"
    },
    {
      icon: <Cpu className="h-5 w-5 text-indigo-600 dark:text-sky-400" />,
      label: "Interests",
      value: "Full Stack Systems",
      sub: "React, Node, Cloud Solutions"
    }
  ];

  // Divide typedText inline to preserve elegant primary text coloring + semantic colored developer gradient
  const typewriterFirstPart = typedText.substring(0, 9); // "Hi, I'm "
  const typewriterSecondPart = typedText.substring(9);   // "Siddhartha "

  return (
    <div className="relative overflow-hidden">

      {/* HERO SECTION */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center sm:text-left relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">

          {/* Hero Context Left */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">

            {/* Status Chip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-neutral-150 hover:bg-neutral-200/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/70 border border-neutral-300/65 dark:border-zinc-800/80 px-4 py-2 rounded-full cursor-pointer select-none"
              onClick={onContactClick}
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700 dark:text-neutral-300">
                Open to Software Engineer Opportunities
              </span>
            </motion.div>

            {/* Main Display Heading */}
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-zinc-400 block"
              >
                FULL STACK WEB DEVELOPER PORTFOLIO
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1] min-h-[96px] md:min-h-[140px]"
              >
                {typewriterFirstPart}
                {typewriterSecondPart && (
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-white dark:via-neutral-150 dark:to-neutral-400">
                    {typewriterSecondPart}
                  </span>
                )}
                {/* Responsive blinking caret cursor */}
                <span className="inline-block w-[3px] h-[0.75em] ml-1 bg-indigo-600 dark:bg-sky-400 animate-pulse align-middle" style={{ verticalAlign: 'middle' }} />
              </motion.h1>
            </div>

            {/* Subtitle with highly visible color contrast in light mode */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed font-sans"
            >
              Full Stack Web Developer passionate about building scalable and user-friendly web applications.
            </motion.p>

            {/* CTA controls */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
            >
              <button
                onClick={onProjectsClick}
                className="px-6 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-md shadow-neutral-900/10 dark:shadow-white/5"
                id="hero-view-work-btn"
              >
                View Projects
                <ArrowDown className="h-4.5 w-4.5 animate-bounce mt-0.5" />
              </button>

              <button
                onClick={onContactClick}
                className="px-6 py-3.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 dark:border-zinc-800 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-950 text-neutral-700 dark:text-neutral-300 text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                id="hero-contact-btn"
              >
                Contact Me
              </button>

              <button
                onClick={(e) => { e.preventDefault(); onResumeClick(); }}
                className="px-6 py-3.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 dark:border-zinc-800 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-950 text-neutral-700 dark:text-neutral-300 text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                id="hero-resume-btn"
              >
                <FileText className="h-4 w-4" />
                <span>Resume</span>
              </button>
            </motion.div>

          </div>

          {/* Hero Graphics Right */}
          <div className="lg:col-span-5 relative flex justify-center">
            <ThreeDCard className="w-full max-w-[360px] md:max-w-[400px] lg:max-w-[440px] xl:max-w-[480px] aspect-square rounded-3xl border border-neutral-200 dark:border-zinc-800 bg-gradient-to-tr from-neutral-50 to-neutral-200/40 dark:from-zinc-900/60 dark:to-zinc-950/40 p-5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between">

              {/* Terminal Tabs Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-zinc-800 pb-2 mb-2 select-none">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveHeroTab('console')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${activeHeroTab === 'console'
                        ? 'bg-neutral-900 text-white dark:bg-zinc-800 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                  >
                    siddhartha.json
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('sphere')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${activeHeroTab === 'sphere'
                        ? 'bg-neutral-900 text-white dark:bg-zinc-800 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                  >
                    3d_stack_mesh
                  </button>
                  <button
                    onClick={() => setActiveHeroTab('visualizer')}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${activeHeroTab === 'visualizer'
                        ? 'bg-neutral-900 text-white dark:bg-zinc-800 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                  >
                    algo_visualizer.js
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Tab Content Display Area */}
              <div className="relative flex-1 flex flex-col justify-center min-h-0 py-2">
                {activeHeroTab === 'console' ? (
                  <TerminalCLI
                    onThemeToggle={onThemeToggle}
                    onContactSubmit={onContactSubmit}
                    onProjectSelect={onProjectSelect}
                    onRevealCockpit={onRevealCockpit}
                    darkMode={darkMode}
                  />
                ) : activeHeroTab === 'sphere' ? (
                  <div className="flex-1 w-full relative min-h-[200px] lg:min-h-[250px]">
                    <Interactive3DSphere darkMode={darkMode} />
                  </div>
                ) : (
                  <CodeVisualizer />
                )}
              </div>

              {/* Showcase mini statistics card */}
              <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-200/50 dark:border-zinc-900/60 mt-1.5 select-none">
                <div className="h-8.5 w-8.5 rounded-full bg-indigo-50 dark:bg-zinc-900 border border-indigo-100/40 dark:border-zinc-800 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-indigo-500 dark:text-sky-400" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-wider text-neutral-400 dark:text-zinc-500 uppercase block">CORE COMPETENCY</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Sleek Interface Architecture</span>
                </div>
              </div>

            </ThreeDCard>
          </div>


        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about-section" className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 py-16 lg:py-24 border-t border-neutral-100 dark:border-zinc-900/60 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* Header Description Left */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 font-mono">BIOGRAPHY</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight">
              A computer science student building real digital footprints.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed font-sans max-w-md">
              Based in India, I engineer durable frontends paired with robust server routes, optimizing for fast responses and clean visual layouts.
            </p>
          </motion.div>

          {/* About Text and Highlights Right */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans space-y-4 text-justify"
            >
              <p>
                I am a Computer Science student at KIIT University graduating in 2026. I am passionate about web development and enjoy building modern, scalable, and user-friendly applications. My primary focus is full-stack development using React, Node.js, Express, and MongoDB. I continuously learn new technologies and currently focus on cloud computing with AWS. I am actively seeking opportunities where I can contribute, learn, and grow as a software engineer.
              </p>
            </motion.div>

            {/* Key Fact Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="h-full">
                  <ThreeDCard
                    className="p-5 rounded-2xl bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200/50 dark:border-zinc-800 flex flex-col gap-3 cursor-default h-full"
                  >
                    <div className="h-9 w-9 rounded-xl bg-white dark:bg-zinc-950 shadow-xs border border-neutral-200/20 dark:border-zinc-805 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-550 dark:text-neutral-400 uppercase tracking-widest block">{item.label}</span>
                      <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 block mt-0.5">{item.value}</span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 block">{item.sub}</span>
                    </div>
                  </ThreeDCard>
                </div>
              ))}
            </div>


          </div>

        </div>
      </section>

    </div>
  );
}
