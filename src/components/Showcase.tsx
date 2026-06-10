import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Chrome, Server, Cloud } from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import { CaseStudy } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'kiit-connect',
    title: 'AI Screener',
    category: 'Full Stack',
    desc: 'AI Screener is an AI-powered interview screening platform that evaluates candidates through automated assessments and performance analysis.',
    detailedDesc: 'AI Screener is an AI-powered interview screening platform designed to simplify the recruitment process by automating candidate assessments and evaluations. It allows recruiters to conduct screening tests, analyze candidate performance, and efficiently shortlist applicants.\n\nThe platform uses AI-driven insights to provide detailed evaluation reports, helping recruiters make faster and more informed hiring decisions. Built with modern web technologies, AI Screener offers a secure, scalable, and user-friendly experience for both recruiters and candidates.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    gradient: 'from-indigo-600 to-indigo-700 dark:from-sky-500 dark:to-indigo-500',
    metrics: 'Real-Time AI Evaluation System',
    demoUrl: 'https://ai-tutor-seven-kappa.vercel.app',
    repoUrl: 'https://github.com/siddhartha2228065/AI_Tutor',
    images: ['/ai_screener_dashboard.png'],
    features: [
      'AI-powered candidate evaluation engine generating automated screening insights.',
      'Streamlined candidate assessment workflows for efficient screening.',
      'Automated performance analytics and detailed evaluation reports.',
      'Secure and scalable platform for recruitment and talent acquisition.'
    ],
    challenges: [
      {
        challenge: 'Managing AI evaluation workflows while maintaining low response times during high-volume recruitment drives.',
        solution: 'Optimized AI processing pipelines and implemented efficient caching strategies to handle concurrent screening tasks without performance degradation.'
      },
      {
        challenge: 'Ensuring data privacy and confidentiality for sensitive candidate information while processing assessments.',
        solution: 'Implemented strict access controls and data encryption protocols to safeguard sensitive candidate information during processing and storage.'
      }
    ],
    architecture: 'Classic 3-tier system: React client-side application, Express API middleware gateway, and MongoDB database storage collections.'
  },
  {
    id: 'athena-gateway',
    title: 'Educational Website',
    category: 'Full Stack',
    desc: 'Developed a freelance full-stack coaching institute website featuring course management, admission inquiries, and responsive user experience using React.js, Node.js, Express.js, and MongoDB.',
    detailedDesc: 'Developed a freelance full-stack coaching institute website designed to provide a seamless learning and management experience. It features course management tools for administrators, student admission inquiries, interactive course catalogs, and an optimized, fully responsive user experience. Built with the MERN stack, it ensures fast load times, robust data management, and secure operations.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    gradient: 'from-amber-500 to-orange-600 dark:from-yellow-500/80 dark:to-orange-500/80',
    metrics: 'Interactive Course Manager',
    demoUrl: 'https://athena.siddhartha.dev',
    repoUrl: 'https://github.com/siddhartha-gupta/athena-rest-gateway',
    images: ['/educational_website.png'],
    features: [
      'Course management system for publishing, editing, and listing courses.',
      'Admission inquiry form handling student registrations and admin reviews.',
      'Responsive UI/UX ensuring optimized rendering across desktop and mobile devices.'
    ],
    challenges: [
      {
        challenge: 'Handling complex student inquiry states and admin feedback workflows in real-time.',
        solution: 'Created custom inquiry schema architectures and streamlined MongoDB data collection updates for real-time tracking.'
      }
    ],
    architecture: 'Classic 3-tier MERN stack architecture: React.js SPA, Node/Express API server, and MongoDB for database storage.'
  },
  {
    id: 'car-rental',
    title: 'Car Rental Website',
    category: 'Full Stack',
    desc: 'Car Rental System - A robust full-stack application for car rentals with comprehensive user and admin management capabilities.',
    detailedDesc: 'Developed a full-stack car rental platform featuring car listing management, user authentication, rental booking flows, and an admin dashboard for managing operations. Built with modern web technologies for a seamless user experience.',
    tags: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
    gradient: 'from-emerald-500 to-teal-700 dark:from-emerald-400 dark:to-teal-500',
    metrics: '<500ms load time',
    demoUrl: 'car-rental-alpha-sooty.vercel.app',
    repoUrl: 'https://github.com/siddhartha2228065/CarRental',
    images: ['/car_rental_catalog.png'],
    features: [
      'Car listing management with image uploads and detailed vehicle information.',
      'User authentication and role-based access control for customers and admins.',
      'Booking and reservation system with calendar management and confirmation workflows.'
    ],
    challenges: [
      {
        challenge: 'Managing real-time booking availability across multiple users simultaneously.',
        solution: 'Implemented optimized database queries and transaction management to handle concurrent booking requests and prevent double bookings.'
      },
      {
        challenge: 'Designing an intuitive admin dashboard for efficient car and booking management.',
        solution: 'Developed a user-friendly admin interface with comprehensive CRUD operations, search filters, and status tracking for seamless management.'
      }
    ],
    architecture: 'Client-side React application with client-server communication over RESTful APIs and PostgreSQL database storage. Backend handles business logic, authentication, and database interactions while frontend manages user interface and user interactions.'
  }
];

interface ShowcaseProps {
  onProjectSelect: (project: CaseStudy) => void;
}

export default function Showcase({ onProjectSelect }: ShowcaseProps) {
  const [filter, setFilter] = useState<'All' | 'Full Stack' | 'Backend Systems' | 'Cloud & Ops'>('All');

  const filteredStudies = filter === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(cs => cs.category === filter);

  return (
    <section id="projects-section" className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 py-16 lg:py-24 border-t border-neutral-100 dark:border-zinc-900/60 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12"
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 font-mono">PORTFOLIO PIECES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-neutral-900 dark:text-neutral-550 tracking-tight leading-none">
            Featured Projects & Labs.
          </h2>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 mt-3">
            Real full-stack architectures assembled with clean directories, precise API status codes, and durable data stores.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-1.5 mt-6 md:mt-0 p-1 border border-neutral-200/60 dark:border-zinc-800 rounded-xl bg-neutral-50 dark:bg-zinc-900/40 w-fit">
          {(['All', 'Full Stack', 'Backend Systems', 'Cloud & Ops'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filter === cat
                ? 'bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-sm font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              id={`filter-btn-${cat.toLowerCase().replace(/[^a-z]/g, '')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8" id="portfolio-grid">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study) => (
            <motion.div
              layout
              key={study.id}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="h-full"
            >
              <ThreeDCard
                onClick={() => onProjectSelect(study)}
                className="group border border-neutral-200/60 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 p-6 shadow-xs hover:border-neutral-400/80 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[380px] h-full relative"
                id={`portfolio-card-${study.id}`}
              >
                <div>
                  {/* Visual Accent Box with Translation Z Depth scale */}
                  <div
                    className={`w-full h-44 rounded-xl bg-gradient-to-br ${study.gradient} p-6 flex flex-col justify-between mb-6 relative overflow-hidden shadow-md`}
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-15 text-white pointer-events-none">
                      {study.category === 'Full Stack' && <Chrome className="h-44 w-44" />}
                      {study.category === 'Backend Systems' && <Server className="h-44 w-44" />}
                      {study.category === 'Cloud & Ops' && <Cloud className="h-44 w-44" />}
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                        {study.category}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white group-hover:scale-110 transition-transform">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-white/80 font-mono uppercase tracking-wider block">IMPACT SUMMARY</span>
                      <span className="text-sm font-bold text-white tracking-tight">{study.metrics}</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {study.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold tracking-wide font-mono px-2 py-0.5 rounded-md bg-neutral-150 dark:bg-zinc-900 text-neutral-700 dark:text-neutral-350 border border-neutral-355/35 dark:border-zinc-800">
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3
                    className="text-lg font-bold font-display text-neutral-900 dark:text-neutral-50 leading-snug group-hover:text-black dark:group-hover:text-white"
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    {study.title}
                  </h3>
                  <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {study.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-zinc-900/60 flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  <span className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-205 transition-colors">Study blueprint notes</span>
                  <span className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all font-mono text-[10px]">READ MORE &rarr;</span>
                </div>
              </ThreeDCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
