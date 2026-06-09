import React from 'react';

interface FooterProps {
  onContactClick: () => void;
  onViewBackstage: () => void;
  onResumeClick: () => void;
  isCockpitVisible: boolean;
}

export default function Footer({ onContactClick, onViewBackstage, onResumeClick, isCockpitVisible }: FooterProps) {
  return (
    <footer className="bg-neutral-50 dark:bg-zinc-955 border-t border-neutral-200/50 dark:border-zinc-900 transition-colors duration-300 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="font-display text-xl font-bold tracking-tight text-neutral-900 dark:text-white select-none">
              siddhartha<span className="text-zinc-400 dark:text-zinc-500 font-sans font-medium">.g</span>
            </a>
            <p className="text-xs text-neutral-400 dark:text-neutral-505 max-w-sm leading-relaxed">
              Full Stack Web Developer & Computer Science Student at KIIT Deemed to be University. Graduating class of 2026. Passionate about beautiful interfaces and scalable backends.
            </p>
            <div className="text-[10px] text-neutral-400 font-mono">
              PORTFOLIO CORE v1.2.0
            </div>
          </div>

          {/* Nav column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">Interactive Panel</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about-section" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Biography & About
                </a>
              </li>
              <li>
                <a href="#skills-section" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Technical Metrics
                </a>
              </li>
              <li>
                <a href="#projects-section" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Laboratory Projects
                </a>
              </li>
              <li>
                <button
                  onClick={(e) => { e.preventDefault(); onResumeClick(); }}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Interactive Resume
                </button>
              </li>
              {isCockpitVisible && (
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onViewBackstage(); }} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
                    Admin Ops Cockpit &rarr;
                  </a>
                </li>
              )}
            </ul>
          </div>


          {/* Contact / Action column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono font-bold">Contact Coordinates</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onContactClick}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-left font-semibold"
                >
                  Initiate Engagement &rarr;
                </button>
              </li>
              <li className="text-neutral-400 dark:text-neutral-600 font-mono text-[10px] pt-1">
                University: KIIT, India
              </li>
              <li className="text-neutral-400 dark:text-neutral-600 font-mono text-[10px]">
                Email: siddhartha@kiit.ac.in
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom banner block */}
        <div className="mt-12 pt-8 border-t border-neutral-200/50 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-450 dark:text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} Siddhartha Gupta. All rights reserved. Built with React & Tailwind.</p>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Security</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy Spec</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
