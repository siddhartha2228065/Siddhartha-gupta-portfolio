import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, Trash2, CheckCircle2, AlertCircle, RefreshCw, Eye, X, 
  MessageSquare, User, Building, Calendar, DollarSign, Mail, 
  PlusCircle, Sparkles, Filter, Copy, Check, Terminal as TerminalIcon,
  Lock, Unlock, Activity
} from 'lucide-react';
import { Inquiry } from '../types';
import { askAITwin, grillAITwin } from '../utils/gemini';
import TelemetryDashboard from './TelemetryDashboard';

interface BackstageInboxProps {
  inquiries: Inquiry[];
  onInquiriesChange: (inquiries: Inquiry[]) => void;
  highlightedId?: string;
  onClose?: () => void;
  onHideCockpit: () => void;
}

const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: 'lead_sample1',
    services: ['Hiring / Job Offer'],
    description: 'We are expanding our frontend development pods. Looking for a B.Tech Cs student based in India for an internship transitioning to full-time roles.',
    budget: 'Full-Time Compensation',
    timeline: 'Immediate (< 1 month)',
    fullName: 'Clara Oswald',
    email: 'clara@tardis-digital.com',
    companyName: 'Tardis Digital',
    phone: '+44 7911 123456',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(), // 2.5 hours ago
    status: 'Reviewing',
    notes: 'KIIT University graduating class matches. Strong potential match.'
  },
  {
    id: 'lead_sample2',
    services: ['Freelance Build'],
    description: 'Require a secure React custom client dashboard interfacing with existing Mongo databases. Groundwork must be completed with robust TS coverage.',
    budget: 'Project-Based Freelance',
    timeline: 'Next 1 – 3 months',
    fullName: 'Arthur Pendragon',
    email: 'arthur@camelot-labs.fi',
    companyName: 'Camelot Protocols Labs',
    phone: '+1 (555) 019-9988',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1.5).toISOString(), // 1.5 days ago
    status: 'Accepted',
    notes: 'Highly aligned with Full-stack skillset. Replied with briefing scheduler.'
  }
];

export default function BackstageInbox({ inquiries, onInquiriesChange, highlightedId, onClose, onHideCockpit }: BackstageInboxProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'telemetry'>('telemetry');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Received' | 'Reviewing' | 'Accepted'>('All');
  const [copied, setCopied] = useState(false);
  
  // Security Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('siddhartha_cockpit_auth') === 'true';
  });
  const [passcodeField, setPasscodeField] = useState('');
  const [authError, setAuthError] = useState('');

  // Real-time telemetry log feed
  const [logs, setLogs] = useState<string[]>([]);

  // Initialize logs ticker
  useEffect(() => {
    const time = new Date().toLocaleTimeString();
    setLogs([
      `[${time}] [SYSTEM] Operations Cockpit v1.2 initialized.`,
      `[${time}] [DB] Connected to persistent local storage engine.`,
      `[${time}] [PORTFOLIO] 3D mesh active and awaiting triggers.`
    ]);
  }, []);

  // AI Twin states
  const [isGrillMode, setIsGrillMode] = useState(false);
  const [aiDraft, setAiDraft] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Job Description grilling states
  const [jobDescription, setJobDescription] = useState('');
  const [grillLoading, setGrillLoading] = useState(false);
  const [grillResult, setGrillResult] = useState<{
    matchPercentage: number;
    pitch: string;
    matchingKeywords: string[];
    missingKeywords: string[];
  } | null>(null);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 4)]);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin';
    if (passcodeField === correctPasscode) {
      setIsAuthenticated(true);
      localStorage.setItem('siddhartha_cockpit_auth', 'true');
      setAuthError('');
      setPasscodeField('');
      addLog(`[SECURITY] Handshake authorized. Admin session initialized.`);
    } else {
      setAuthError('INVALID CREDENTIAL SPECS. HANDSHAKE REJECTED.');
      addLog(`[WARNING] Failed login attempt from operator console.`);
    }
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('siddhartha_cockpit_auth');
    setSelectedInquiry(null);
    setIsGrillMode(false);
    addLog(`[SECURITY] Session closed. Locking database logs.`);
    onHideCockpit();
  };

  // Automatically fetch Gemini AI reply draft when selected inquiry changes
  useEffect(() => {
    if (!isAuthenticated || !selectedInquiry) {
      setAiDraft('');
      return;
    }

    const fetchAIDraft = async () => {
      setAiLoading(true);
      setAiDraft('');
      addLog(`[API] Initiating Gemini handshake for Inquiry: ${selectedInquiry.id}...`);

      const query = `A recruiter named ${selectedInquiry.fullName} from ${selectedInquiry.companyName} is interested in "${selectedInquiry.services.join(' / ')}" with a budget structure of "${selectedInquiry.budget}" and timeline of "${selectedInquiry.timeline}". Their message is: "${selectedInquiry.description}". Please write a personalized, professional, and enthusiastic email response speaking as Siddhartha Gupta, referencing how my projects (PeerConnect or Athena REST Gateway) solve their issues. Keep the signature simple.`;

      try {
        const result = await askAITwin(query);
        setAiDraft(result);
        addLog(`[API] Gemini response compiled successfully for ${selectedInquiry.companyName}.`);
      } catch (err) {
        addLog(`[ERROR] AI compilation failed. Loaded simulated draft.`);
        setAiDraft('Error compiling AI response. Double-check your GEMINI_API_KEY settings.');
      } finally {
        setAiLoading(false);
      }
    };

    fetchAIDraft();
  }, [selectedInquiry?.id, isAuthenticated]);

  const handleCopyDraft = () => {
    if (!aiDraft) return;
    navigator.clipboard.writeText(aiDraft);
    setCopied(true);
    addLog(`[SYSTEM] Response draft copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (statusFilter === 'All') return true;
    return inq.status === statusFilter;
  });

  const handleUpdateStatus = (id: string, newStatus: Inquiry['status']) => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { 
          ...inq, 
          status: newStatus,
          notes: newStatus === 'Accepted' ? 'Collaboration accepted. Scheduled direct code setup.' : inq.notes
        };
      }
      return inq;
    });

    onInquiriesChange(updated);
    localStorage.setItem('spade_inquiries', JSON.stringify(updated));
    addLog(`[DB] Inquiry ${id} status updated to: ${newStatus}`);
    
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(updated.find(i => i.id === id) || null);
    }
  };

  const handleDeleteInquiry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = inquiries.filter(inq => inq.id !== id);
    onInquiriesChange(updated);
    localStorage.setItem('spade_inquiries', JSON.stringify(updated));
    addLog(`[DB] Purged inquiry ticket: ${id}`);
    
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all stored recruiter lead tickets? This will purge local simulation state.')) {
      onInquiriesChange([]);
      localStorage.setItem('spade_inquiries', JSON.stringify([]));
      setSelectedInquiry(null);
      addLog(`[DB] Cleared all inquiries in registry.`);
    }
  };

  const handleLoadSamples = () => {
    const combined = [...SAMPLE_INQUIRIES, ...inquiries.filter(i => !i.id.startsWith('lead_sample'))];
    onInquiriesChange(combined);
    localStorage.setItem('spade_inquiries', JSON.stringify(combined));
    addLog(`[DB] Seeding logs database with demo recruiter inquiries.`);
  };

  const handleGrillAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setGrillLoading(true);
    setGrillResult(null);
    addLog(`[API] Uploading job description payload to Gemini for alignment parsing...`);

    try {
      const result = await grillAITwin(jobDescription);
      setGrillResult(result);
      addLog(`[API] Grill match analysis finished: ${result.matchPercentage}% alignment parsed.`);
    } catch (err) {
      addLog(`[ERROR] Match analysis failed. Loaded heuristics mock.`);
    } finally {
      setGrillLoading(false);
    }
  };

  // Auto-select highlighted inquiry if any is focused
  useEffect(() => {
    if (highlightedId) {
      const found = inquiries.find(inq => inq.id === highlightedId);
      if (found) {
        setSelectedInquiry(found);
        setIsGrillMode(false);
        setActiveTab('inbox');
      }
    }
  }, [highlightedId, inquiries]);

  // RENDER SECURITY PORTAL OVERLAY IF LOCK IS ON
  if (!isAuthenticated) {
    return (
      <section id="backstage-section" className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 py-16 lg:py-24 border-t border-neutral-105 dark:border-zinc-900 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-neutral-50 dark:bg-zinc-950 border border-neutral-250 dark:border-zinc-900 p-8 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden"
          >
            {/* Ambient decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
            
            <div className="h-14 w-14 rounded-2xl bg-neutral-900 dark:bg-zinc-900 border border-neutral-800 flex items-center justify-center text-indigo-500 dark:text-sky-400 shadow-md">
              <Lock className="h-6 w-6 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-red-500 dark:text-red-400 uppercase tracking-widest block flex items-center justify-center gap-1">
                ✦ Restricted Telemetry Terminal ✦
              </span>
              <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-50">
                Ops Cockpit Locked
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed font-sans max-w-xs mx-auto">
                Live database logs and AI recruiter twins require direct operator handshake. Please enter your passcode.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="w-full space-y-4 font-mono text-xs">
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-bold text-neutral-450 dark:text-zinc-550 uppercase tracking-wider block">
                  Console Key Passcode
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 inset-y-0 my-auto h-fit text-neutral-400 font-bold">$</span>
                  <input
                    type="password"
                    value={passcodeField}
                    onChange={(e) => setPasscodeField(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-250 dark:border-zinc-800 rounded-xl p-2.5 pl-8 text-neutral-850 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {authError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold text-red-500 text-left"
                >
                  [ERROR] {authError}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-semibold rounded-xl tracking-wider uppercase cursor-pointer transition-all active:scale-98"
              >
                Authenticate Handshake
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    );
  }

  // RENDER COMPLETE COCKPIT IF SECURELY AUTHENTICATED
  return (
    <section id="backstage-section" className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 py-16 lg:py-24 border-t border-neutral-105 dark:border-zinc-900 transition-colors duration-300">
      
      {/* Backstage header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] dark:text-zinc-500 uppercase">
              PORTFOLIO ADMIN OPERATIONS COCKPIT
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight flex items-center gap-3">
            Siddhartha's Ops Cockpit
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-300">
              {inquiries.length} inquiries
            </span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 mt-3 max-w-2xl leading-relaxed">
            This dashboard operates as a live admin dashboard. Recruiter tickets can be reviewed, approved, or matched with job descriptions using client-side Gemini AI operations.
          </p>
        </div>

        {/* Console control inputs */}
        <div className="flex items-center gap-3.5 flex-wrap md:mt-4">
          <button
            onClick={() => {
              setIsGrillMode(true);
              setSelectedInquiry(null);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-755 text-white dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-neutral-950 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Grill Siddhartha's AI Twin
          </button>

          <button
            onClick={handleLoadSamples}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-zinc-800 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Populate Demo Threads
          </button>

          {inquiries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100/30 dark:border-red-900/40 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Reset Cockpit Data
            </button>
          )}

          {/* SESSION LOCK BUTTON */}
          <button
            onClick={handleLockSession}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white dark:text-zinc-350 cursor-pointer flex items-center justify-center transition-colors shadow-sm"
            title="Lock Dashboard Session"
            id="btn-lock-cockpit"
          >
            <Lock className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Cockpit Workspace Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-zinc-800/80 pb-3.5 mb-8">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'telemetry'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
          id="btn-tab-telemetry"
        >
          <Activity className="h-4 w-4" />
          DevOps Telemetry
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'inbox'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
          id="btn-tab-inbox"
        >
          <Inbox className="h-4 w-4" />
          Recruiter Inbox Queue
        </button>
      </div>

      {activeTab === 'inbox' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        
        {/* LEFT COMPONENT: INQUIRY LISTING */}
        <div className={`${(selectedInquiry || isGrillMode) ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          
          {/* List Toolbar / Filters */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-150 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-500 tracking-wider">TICKET LOG REGISTRY</span>
            </div>
            
            <div className="flex gap-1">
              {(['All', 'Received', 'Reviewing', 'Accepted'] as const).map((filterOpt) => (
                <button
                  key={filterOpt}
                  onClick={() => setStatusFilter(filterOpt)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                    statusFilter === filterOpt
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                >
                  {filterOpt}
                </button>
              ))}
            </div>
          </div>

          {/* List display */}
          {filteredInquiries.length === 0 ? (
            <div className="border border-neutral-200/50 dark:border-zinc-800/40 rounded-3xl p-12 text-center bg-neutral-50/50 dark:bg-zinc-900/10">
              <Inbox className="h-10 w-10 text-neutral-300 dark:text-zinc-700 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 font-display">No proposals in queue</h3>
              <p className="text-xs text-neutral-400 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                Submit an inquiry in the form above or click "Populate Demo Threads" to seed realistic recruitment files.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              <AnimatePresence mode="popLayout">
                {filteredInquiries.map((inq) => {
                  const isCurSelected = selectedInquiry?.id === inq.id;
                  const isHighlighted = highlightedId === inq.id;
                  
                  return (
                    <motion.div
                      layout
                      key={inq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setIsGrillMode(false);
                      }}
                      className={`group border rounded-2xl p-5 text-left bg-white dark:bg-zinc-955/60 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                        isCurSelected 
                          ? 'border-neutral-900 ring-1 ring-neutral-900/10 dark:border-white dark:ring-white/10' 
                          : isHighlighted
                          ? 'border-emerald-500 animate-pulse'
                          : 'border-neutral-200 dark:border-zinc-800/85 hover:border-neutral-450 dark:hover:border-zinc-700'
                      }`}
                      id={`inq-row-${inq.id}`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-display text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white">
                            {inq.companyName}
                          </span>
                          <span className="text-neutral-300 dark:text-zinc-700 font-sans text-xs">|</span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">{inq.fullName}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap pb-1">
                          {inq.services.map((serv) => (
                            <span 
                              key={serv} 
                              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/10 text-neutral-500 dark:text-neutral-400 shadow-3xs"
                            >
                              {serv}
                            </span>
                          ))}
                          <span className="text-[10px] text-zinc-400 font-mono italic">
                            {inq.budget}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400 dark:text-neutral-455 line-clamp-1 leading-normal max-w-lg">
                          {inq.description}
                        </p>
                      </div>

                      {/* Right metadata and buttons */}
                      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-none pt-3 sm:pt-0 border-neutral-100 dark:border-zinc-900">
                        <span className="text-[11px] font-mono text-neutral-400 dark:text-zinc-555">
                          {new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 ${
                            inq.status === 'Received' 
                              ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/30'
                              : inq.status === 'Reviewing'
                              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100/30'
                              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30'
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${
                              inq.status === 'Received' 
                                ? 'bg-blue-500 animate-pulse'
                                : inq.status === 'Reviewing'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-emerald-500'
                            }`} />
                            {inq.status}
                          </div>

                          {/* Delete */}
                          <button
                            onClick={(e) => handleDeleteInquiry(inq.id, e)}
                            className="p-1.5 rounded-lg hover:bg-neutral-50 hover:text-red-600 dark:hover:bg-zinc-800 text-neutral-305 dark:text-neutral-600 transition-colors pointer-events-auto"
                            title="Purge ticket"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* RIGHT COMPONENT: DETAIL REVIEW */}
        <AnimatePresence mode="wait">
          
          {/* OPTION 1: INQUIRY SPECIFIC ACTIONS */}
          {selectedInquiry && !isGrillMode && (
            <motion.div
              key="ticket-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="lg:col-span-5 border border-neutral-200 dark:border-zinc-800 rounded-3xl bg-neutral-50 dark:bg-zinc-950 shadow-sm p-6 space-y-6 relative"
              id="backstage-inq-details"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-450 hover:text-neutral-850 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
                  SYSTEM OBJECTIVES DOSSIER
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-50" id="detail-company-heading">
                  {selectedInquiry.companyName}
                </h3>
                <p className="text-xs text-neutral-400 dark:text-zinc-500 font-mono">CODEID: {selectedInquiry.id}</p>
              </div>

              {/* Status Update Quick Bar */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 dark:text-zinc-500 uppercase block">Cockpit Status Actions</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Received', 'Reviewing', 'Accepted'] as const).map((statusValue) => (
                    <button
                      key={statusValue}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, statusValue)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase font-mono border cursor-pointer text-center transition-all ${
                        selectedInquiry.status === statusValue
                          ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-955 font-medium'
                          : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-neutral-300'
                      }`}
                      id={`action-status-${statusValue}`}
                    >
                      {statusValue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Meta Specs */}
              <div className="space-y-3.5 bg-white dark:bg-zinc-900/60 border border-neutral-150/40 dark:border-zinc-800 rounded-2xl p-4 text-xs">
                {/* Full client contact */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-zinc-800/40">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Recruiter / Author
                  </span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 text-right">{selectedInquiry.fullName}</span>
                </div>

                {/* Email link */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-zinc-800/40">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </span>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-semibold text-neutral-900 dark:text-sky-400 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-zinc-800/40">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Structure
                  </span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{selectedInquiry.budget}</span>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Expected Urgency
                  </span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{selectedInquiry.timeline}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 dark:text-zinc-500 uppercase block">MESSAGE BRIEF</span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans bg-white dark:bg-zinc-900/30 border border-neutral-100 dark:border-zinc-800 p-4 rounded-2xl italic">
                  "{selectedInquiry.description}"
                </p>
              </div>

              {/* Dynamic Auto Reply Proposal Generator */}
              <div className="bg-neutral-100 dark:bg-zinc-900/80 border border-neutral-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-sky-400" /> GEMINI AI TWIN DRAFT
                  </span>
                  
                  {aiDraft && (
                    <button
                      onClick={handleCopyDraft}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-705 text-[9px] font-mono font-bold uppercase flex items-center gap-1 transition-all cursor-pointer select-none focus:outline-none"
                      title="Copy response draft to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="h-2.5 w-2.5 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5 text-neutral-500" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-neutral-450 gap-2 font-mono text-[10px]">
                      <RefreshCw className="h-5 w-5 animate-spin text-indigo-550" />
                      <span>Gemini compiling response...</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-300 max-h-48 overflow-y-auto space-y-2 leading-relaxed font-sans bg-white dark:bg-zinc-955 p-3.5 rounded-xl border border-neutral-200/50 dark:border-zinc-900">
                      <div className="whitespace-pre-line">{aiDraft}</div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedInquiry.id, 'Reviewing');
                    alert(`Simulated Reply: Emailed successfully to ${selectedInquiry.email}!`);
                  }}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all duration-200 cursor-pointer text-center"
                >
                  Confirm simulated response
                </button>
              </div>

            </motion.div>
          )}

          {/* OPTION 2: GRILL SIDDHARTHA'S AI TWIN */}
          {isGrillMode && !selectedInquiry && (
            <motion.div
              key="grill-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="lg:col-span-5 border border-neutral-200 dark:border-zinc-800 rounded-3xl bg-neutral-50 dark:bg-zinc-950 shadow-sm p-6 space-y-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsGrillMode(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 hover:text-neutral-850 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-sky-400 uppercase tracking-widest block flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Real-time Gemini Integration
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-50">
                  Grill Siddhartha's AI Twin
                </h3>
                <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed font-sans">
                  Paste a Job Description (JD) below, and Siddhartha's AI twin will calculate fit metrics, highlight matching skills, and draft a tailored pitch.
                </p>
              </div>

              <form onSubmit={handleGrillAnalysis} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-neutral-400 dark:text-zinc-550 uppercase block">
                    Paste Job Requirements
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="We are looking for a Software Engineer Intern with experience in React, Node.js, RESTful APIs, and basic SQL knowledge..."
                    rows={6}
                    className="w-full text-xs rounded-xl border border-neutral-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-neutral-850 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={grillLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {grillLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Running Match Analysis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Run Match Analysis</span>
                    </>
                  )}
                </button>
              </form>

              {/* Grill Results Panel */}
              <AnimatePresence>
                {grillResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4 border-t border-neutral-200 dark:border-zinc-800"
                  >
                    {/* Match score bar */}
                    <div className="bg-white dark:bg-zinc-900/60 p-4 rounded-2xl border border-neutral-200/50 dark:border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold font-mono">
                        <span className="text-neutral-500">Matching Alignment</span>
                        <span className={`font-bold ${grillResult.matchPercentage >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {grillResult.matchPercentage}%
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${grillResult.matchPercentage}%` }}
                          className={`h-full rounded-full ${grillResult.matchPercentage >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>

                    {/* Keywords mapping */}
                    <div className="grid grid-cols-2 gap-3.5 text-[10px] font-mono">
                      <div className="space-y-1">
                        <span className="text-emerald-500 font-bold block">✓ MATCHING SKILLS</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {grillResult.matchingKeywords.map(k => (
                            <span key={k} className="px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-amber-500 font-bold block">? MISSING / ADAPTABLE</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {grillResult.missingKeywords.map(k => (
                            <span key={k} className="px-2 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Twin Cover Pitch */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-zinc-500 uppercase block">AI TWIN TAILORED PITCH</span>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-white dark:bg-zinc-950 p-4 rounded-2xl italic border border-neutral-200/50 dark:border-zinc-900 whitespace-pre-wrap font-sans">
                        {grillResult.pitch}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>

      </div>) : (
        <TelemetryDashboard />
      )}

      {/* FOOTER LIVE TELEMETRY SYSTEM LOGS FEED */}
      <div className="mt-12 p-3 rounded-2xl bg-neutral-900 dark:bg-zinc-950 border border-neutral-800/80 font-mono text-[10px] text-neutral-500 dark:text-zinc-550 select-none overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-2 mb-2">
          <div className="flex items-center gap-1.5 text-neutral-350 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">COCKPIT LIVE TELEMETRY LOGS</span>
          </div>
          <span className="text-[9px] text-neutral-600">Handshake Secure: TLS_AES_256_GCM_SHA384</span>
        </div>
        
        {/* Stack log lines */}
        <div className="space-y-1 flex flex-col justify-start h-16 overflow-y-auto font-mono text-[9.5px]">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2 items-start opacity-85">
              <span className="text-indigo-400 shrink-0">&gt;&gt;</span>
              <span className="text-neutral-300 dark:text-zinc-400 leading-none">{log}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
