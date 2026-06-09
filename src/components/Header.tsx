import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, ChevronDown, Menu, X, ArrowUpRight, Code, Terminal, FileText } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onContactClick: () => void;
  onScrollToSection: (sectionId: string) => void;
  onResumeClick: () => void;
  isCockpitVisible: boolean;
}

export default function Header({ darkMode, setDarkMode, onContactClick, onScrollToSection, onResumeClick, isCockpitVisible }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'About', id: 'about-section' },
    { label: 'Skills', id: 'skills-section' },
    { label: 'Projects', id: 'projects-section' },
    ...(isCockpitVisible ? [{ label: 'Ops Cockpit', id: 'backstage-section' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 border-gray-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-display text-xl font-bold tracking-tight text-neutral-900 dark:text-white select-none flex items-center gap-2"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-zinc-950">
              <Terminal className="h-4 w-4" />
            </div>
            siddhartha<span className="text-zinc-400 dark:text-zinc-500 font-sans font-medium">.g</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onScrollToSection(item.id)}
              className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white cursor-pointer py-2 focus:outline-none transition-colors"
              id={`nav-link-${item.label.toLowerCase()}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-zinc-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer focus:outline-none"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="dark-mode-toggle"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Resume Download */}
          <button
            onClick={(e) => { e.preventDefault(); onResumeClick(); }}
            className="rounded-lg border border-neutral-200 dark:border-zinc-800 px-3.5 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
            id="header-resume-btn"
          >
            <FileText className="h-4 w-4" />
            <span>Resume</span>
          </button>

          {/* Contact Button */}
          <button
            onClick={onContactClick}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-sm transition-all cursor-pointer flex items-center gap-1"
            id="header-hire-btn"
          >
            Hire Siddhartha
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-zinc-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-neutral-600 dark:text-neutral-300 cursor-pointer focus:outline-none"
            id="mobile-dark-mode-toggle"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-zinc-800 text-neutral-605 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer focus:outline-none"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-200 dark:border-zinc-800 md:hidden bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onScrollToSection(item.id);
                  }}
                  className="w-full text-left py-2 border-b border-zinc-100 dark:border-zinc-905 pb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onResumeClick(); }}
                className="w-full rounded-xl border border-neutral-200 dark:border-zinc-800 py-3 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-1.5"
                id="mobile-resume-btn"
              >
                <FileText className="h-4 w-4" />
                <span>Download Resume</span>
              </button>


              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactClick();
                }}
                className="mt-2 w-full rounded-xl bg-neutral-900 py-3 text-center text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-950 active:scale-98 transition-transform"
                id="mobile-contact-sales-btn"
              >
                Hire Siddhartha
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
