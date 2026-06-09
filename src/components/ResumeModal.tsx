import React, { useEffect } from 'react';
import { X, Printer, Download, MapPin, Mail, Phone, Globe, Award, GraduationCap, Briefcase, Code2 } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto no-print-backdrop">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-zinc-800 flex flex-col my-8 max-h-[90vh]"
        id="resume-modal-container"
      >
        {/* Modal Controls - Hidden when printing */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-neutral-150 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950 no-print">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-neutral-500 dark:text-zinc-400 uppercase">Interactive Developer Resume</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-98"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-800 text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-colors"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Print Styles Sheet (Embedded inside component) */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .no-print-backdrop, .no-print-backdrop * {
              background: transparent !important;
              backdrop-filter: none !important;
            }
            #resume-print-area, #resume-print-area * {
              visibility: visible;
            }
            #resume-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              color: #000000 !important;
              background-color: #ffffff !important;
              padding: 0px !important;
              margin: 0px !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
            .print-border-b {
              border-bottom: 1px solid #d1d5db !important;
            }
            .print-text-dark {
              color: #111827 !important;
            }
            .print-text-muted {
              color: #4b5563 !important;
            }
            .print-grid-columns {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }
            @page {
              size: A4 portrait;
              margin: 1.5cm;
            }
          }
        `}} />

        {/* Printable Resume Content Container */}
        <div 
          className="p-6 md:p-10 overflow-y-auto bg-white text-neutral-900 dark:bg-zinc-900 dark:text-neutral-100 font-sans"
          id="resume-print-area"
        >
          {/* Header */}
          <div className="pb-6 mb-6 border-b border-neutral-200 dark:border-zinc-800 print-border-b flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-display print-text-dark">
                Siddhartha
              </h1>
              <p className="text-sm md:text-base font-semibold text-indigo-650 dark:text-sky-450 mt-1 print-text-muted">
                Bachelor of Technology
              </p>
              <p className="text-xs text-neutral-550 dark:text-zinc-400 font-mono mt-0.5">
                Kalinga Institute of Industrial Technology
              </p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 no-print" /> siddharthagupta1275@gmail.com
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 no-print" /> +91-9161897770
                </span>
              </div>
              
              <div className="flex gap-4 mt-3 text-xs font-semibold text-indigo-600 dark:text-sky-400 font-mono">
                <a href="https://linkedin.com/in/siddhartha-gupta" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">LinkedIn</a>
                <a href="https://github.com/siddhartha2228065" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">GitHub</a>
                <a href="https://siddhartha.dev" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">Portfolio</a>
              </div>
            </div>
            
            <div className="text-left md:text-right text-xs space-y-1 text-neutral-450 dark:text-zinc-550 font-mono">
              <p>B.Tech Computer Science & Eng.</p>
              <p>KIIT University (2022 – 2026)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Core Info */}
            <div className="md:col-span-8 space-y-8">
              
              {/* Education Block */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-zinc-800/60 pb-1.5 print-border-b print-text-dark">
                  <GraduationCap className="h-4.5 w-4.5 text-indigo-600 dark:text-sky-400 no-print" />
                  Education
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 print-text-dark">
                        Bachelor of Technology in Computer Science and Engineering
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-350 print-text-muted">
                        Kalinga Institute of Industrial Technology, Bhubaneswar
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">2022 – 2026</span>
                  </div>

                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 print-text-dark">
                        Senior Secondary Examination
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-350 print-text-muted">
                        Sunbeam Mughalsarai, Mughalsarai
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">2020 – 2022</span>
                  </div>

                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 print-text-dark">
                        Secondary Examination
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-350 print-text-muted">
                        Sunbeam Mughalsarai, Mughalsarai
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">2007 – 2020</span>
                  </div>
                </div>
              </div>

              {/* Technical Experience / Projects */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-zinc-800/60 pb-1.5 print-border-b print-text-dark">
                  <Briefcase className="h-4.5 w-4.5 text-indigo-600 dark:text-sky-400 no-print" />
                  Personal Projects
                </h3>
                
                {/* Project 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 print-text-dark">
                      Educational Website
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-neutral-400">React.Js, Node.Js, Express.Js, MongoDB</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed print-text-muted">
                    An educational website focused on delivering clear, high-quality resources for effective learning.
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-neutral-500 dark:text-neutral-400 pl-2 space-y-0.5 print-text-muted">
                    <li>Developed a comprehensive educational platform offering structured tutorials and resources.</li>
                    <li>Designed a responsive user interface to ensure accessibility across a wide range of devices and screen sizes.</li>
                    <li>Implemented secure user authentication and personalized dashboards to enhance the learning experience.</li>
                  </ul>
                </div>

                {/* Project 2 */}
                <div className="space-y-1.5 pt-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 print-text-dark">
                      AI Tutor Screener
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-neutral-400">React.js, Node.js, Express.js, OpenAI API, MongoDB</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed print-text-muted">
                    An AI-powered platform to automate tutor screening through voice-based interviews.
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-neutral-500 dark:text-neutral-400 pl-2 space-y-0.5 print-text-muted">
                    <li>Developed a conversational AI to evaluate communication, teaching skills, and patience.</li>
                    <li>Integrated speech-to-text and text-to-speech for real-time interaction.</li>
                    <li>Implemented a feedback system highlighting strengths and improvement areas.</li>
                    <li>Managed data storage and retrieval using MongoDB, ensuring scalability.</li>
                  </ul>
                </div>
              </div>

              {/* Experience Block */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-zinc-800/60 pb-1.5 print-border-b print-text-dark">
                  <Award className="h-4.5 w-4.5 text-indigo-600 dark:text-sky-400 no-print" />
                  Experience
                </h3>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 print-text-dark">
                        AWS Cloud Virtual Internship
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-350 print-text-muted">
                        AICTE-Eduskills | Online
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">October - December 2024</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-neutral-500 dark:text-neutral-400 pl-2 space-y-0.5 print-text-muted">
                    <li>Gained foundational knowledge of AWS cloud computing services, including EC2, S3, RDS, and IAM.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Right Column - Tech Stack / Skills */}
            <div className="md:col-span-4 space-y-8">
              
              {/* Skills Area */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-zinc-800/60 pb-1.5 print-border-b print-text-dark">
                  <Code2 className="h-4.5 w-4.5 text-indigo-600 dark:text-sky-400 no-print" />
                  Technical Skills & Interests
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Languages</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      C/C++, Python, JAVA, Javascript, HTML+CSS
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Libraries & Frameworks</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      C++ STL, React.Js
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Web Dev Tools</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      Nodejs, VS Code, Git, Github
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Cloud & Databases</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      MongoDB, Relational Database (mySql)
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Relevant Coursework</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      Data Structures & Algorithms, Operating Systems, Object Oriented Programming, Database Management System, Software Engineering
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Areas of Interest</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      Web Design and Development, Cloud Computing
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Soft Skills</span>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 print-text-dark">
                      Problem Solving, Self-learning, Presentation, Adaptability, Public-Speaking
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer - Hidden when printing */}
        <div className="p-4 bg-neutral-50 dark:bg-zinc-950 border-t border-neutral-150 dark:border-zinc-800 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 cursor-pointer flex items-center gap-1 active:scale-98 transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
