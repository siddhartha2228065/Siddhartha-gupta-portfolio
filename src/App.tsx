import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AboutAndHero from './components/AboutAndHero';
import Skills from './components/Skills';
import Showcase, { CASE_STUDIES } from './components/Showcase';
import LeadInquiryForm from './components/LeadInquiryForm';
import SubmissionSuccess from './components/SubmissionSuccess';
import BackstageInbox from './components/BackstageInbox';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';
import ProjectDetailPage from './components/ProjectDetailPage';
import Loader from './components/Loader';
import { Inquiry, CaseStudy } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Activity, ArrowDown, HelpCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check local storage or standard system settings
    const stored = localStorage.getItem('siddhartha_dark');
    if (stored !== null) return stored === 'true';
    return true; // Default to sleek dark mode
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const stored = localStorage.getItem('spade_inquiries');
    return stored ? JSON.parse(stored) : [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [latestInquiry, setLatestInquiry] = useState<Inquiry | null>(null);
  const [focusedInquiryId, setFocusedInquiryId] = useState<string | undefined>(undefined);
  const [showBackstage, setShowBackstage] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeProjectPage, setActiveProjectPage] = useState<CaseStudy | null>(null);

  const [isCockpitVisible, setIsCockpitVisible] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('ops') === 'true') {
      localStorage.setItem('siddhartha_cockpit_visible', 'true');
      return true;
    }
    return localStorage.getItem('siddhartha_cockpit_visible') === 'true';
  });

  // Sync dark class to doc element for Tailwind classes
  useEffect(() => {
    localStorage.setItem('siddhartha_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleInquirySubmission = (inq: Inquiry) => {
    setLatestInquiry(inq);
    // Refresh local list state
    setInquiries(prev => [inq, ...prev]);
    // Highlight in backlog
    setFocusedInquiryId(inq.id);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToContact = () => {
    setLatestInquiry(null); // Reset success to let them see form again if they clicked contact
    setTimeout(() => {
      const el = document.getElementById('contact-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewBackstage = () => {
    setShowBackstage(true);
    setTimeout(() => {
      const el = document.getElementById('backstage-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'dark bg-zinc-950 text-neutral-100' : 'bg-white text-neutral-900'}`}>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        ) : activeProjectPage ? (
          <motion.div
            key="project-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ProjectDetailPage 
              project={activeProjectPage} 
              onBack={() => {
                setActiveProjectPage(null);
                // Scroll back to projects section
                setTimeout(() => {
                  const el = document.getElementById('projects-section');
                  if (el) el.scrollIntoView({ behavior: 'auto' });
                }, 100);
              }} 
              onDiscussClick={() => {
                setActiveProjectPage(null);
                // Scroll to contact form
                setTimeout(() => {
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  // Pre-populate contact description text
                  const txt = document.getElementById('input-brief-desc') as HTMLTextAreaElement;
                  if (txt) {
                    txt.value = `Hi Siddhartha, I saw your work on ${activeProjectPage.title} and would love to discuss collaborating!`;
                    txt.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }, 150);
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upper Announcement Bar */}
            <div className="bg-neutral-900 dark:bg-zinc-900/50 text-[#f5f5f5] text-[11px] font-mono py-2.5 px-4 text-center border-b border-neutral-800 flex items-center justify-center gap-2 select-none">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-neutral-100">Siddhartha Gupta:</span>
              <span className="text-neutral-400">Computer Science Undergraduate '26 | Actively seeking software internships or remote freelance!</span>
            </div>

            <Header 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              onContactClick={scrollToContact} 
              onScrollToSection={handleScrollToSection}
              onResumeClick={() => setIsResumeOpen(true)}
              isCockpitVisible={isCockpitVisible}
            />

            <main className="relative pb-12 overflow-hidden">
              
              {/* Abstract Background Accents */}
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-neutral-900/5 dark:bg-sky-500/5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-zinc-650/5 dark:bg-indigo-500/5 blur-3xl pointer-events-none translate-x-1/2" />

              {/* Hero & About Sections */}
              <AboutAndHero 
                onContactClick={scrollToContact}
                onProjectsClick={() => handleScrollToSection('projects-section')}
                darkMode={darkMode}
                onContactSubmit={handleInquirySubmission}
                onThemeToggle={setDarkMode}
                onProjectSelect={(id) => {
                  const found = CASE_STUDIES.find(cs => cs.id === id);
                  if (found) {
                    setActiveProjectPage(found);
                  }
                }}
                onResumeClick={() => setIsResumeOpen(true)}
                onRevealCockpit={() => {
                  localStorage.setItem('siddhartha_cockpit_visible', 'true');
                  setIsCockpitVisible(true);
                }}
              />

              {/* Skills Metrics Section */}
              <Skills />

              {/* Brand Showcase Portfolio Grid */}
              <Showcase onProjectSelect={setActiveProjectPage} />

              {/* Dynamic form block or Success board (Contact Me form) */}
              <AnimatePresence mode="wait">
                {!latestInquiry ? (
                  <motion.div
                    key="form-container"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <LeadInquiryForm onSubmissionSuccess={handleInquirySubmission} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SubmissionSuccess 
                      inquiry={latestInquiry} 
                      onReset={() => setLatestInquiry(null)} 
                      onViewBackstage={handleViewBackstage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cockpit Control Board */}
              {isCockpitVisible && (
                <>
                  <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 mt-12 pb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <Activity className="h-4.5 w-4.5 text-neutral-400 dark:text-zinc-505" />
                        <div>
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">Operator Cockpit Integration</span>
                          <span className="text-[10px] text-neutral-400 dark:text-zinc-500 leading-none">Inspect recruiter requests, statuses, and simulated reply algorithms in motion.</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setShowBackstage(!showBackstage)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-neutral-100 cursor-pointer transition-colors"
                        id="toggle-backstage-btn"
                      >
                        {showBackstage ? 'Collapse Operational Backlog' : 'Expand Live Operations Backlog'}
                      </button>
                    </div>
                  </div>

                  {/* Backstage Inbox Component */}
                  <AnimatePresence>
                    {showBackstage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <BackstageInbox 
                          inquiries={inquiries} 
                          onInquiriesChange={setInquiries} 
                          highlightedId={focusedInquiryId}
                          onClose={() => setShowBackstage(false)}
                          onHideCockpit={() => {
                            localStorage.removeItem('siddhartha_cockpit_visible');
                            setIsCockpitVisible(false);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

            </main>

            {/* Footer Block */}
            <Footer 
              onContactClick={scrollToContact} 
              onViewBackstage={handleViewBackstage}
              onResumeClick={() => setIsResumeOpen(true)}
              isCockpitVisible={isCockpitVisible}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Resume Modal Overlay */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

    </div>
  );
}
