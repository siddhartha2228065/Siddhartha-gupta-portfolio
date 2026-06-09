import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Sparkles } from 'lucide-react';

interface TerminalCLIProps {
  onThemeToggle: (dark: boolean) => void;
  onContactSubmit: (inquiry: any) => void;
  onProjectSelect: (projectId: string) => void;
  onRevealCockpit: () => void;
  darkMode: boolean;
}

interface LogLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export default function TerminalCLI({ onThemeToggle, onContactSubmit, onProjectSelect, onRevealCockpit, darkMode }: TerminalCLIProps) {
  const [history, setHistory] = useState<LogLine[]>([
    { text: 'Siddhartha Gupta developer CLI v1.2.0 initialized.', type: 'system' },
    { text: 'Type "help" for a list of available systems commands.', type: 'system' },
    { text: '', type: 'output' },
    { text: 'Name: Siddhartha Gupta', type: 'success' },
    { text: 'Role: Full Stack Systems Developer', type: 'output' },
    { text: 'University: KIIT University, B.Tech CS Undergraduate \'26', type: 'output' },
    { text: 'Biography: Based in India, Siddhartha builds robust backend APIs and high-fidelity frontends. He optimizes for low latencies and clean directories.', type: 'output' },
    { text: 'Email: siddhartha@kiit.ac.in', type: 'output' },
    { text: '', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Contact form wizard state inside the terminal
  const [wizardStep, setWizardStep] = useState<number>(0); // 0: idle, 1: name, 2: email, 3: company, 4: message
  const [wizardData, setWizardData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    description: ''
  });

  // Scroll to bottom of terminal whenever history changes
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus terminal input when clicking the terminal container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      setInputValue('');
      if (!cmd) return;

      // Add input to command history
      setCommandHistory(prev => [cmd, ...prev]);
      setHistoryIndex(-1);

      // Add command to output log
      setHistory(prev => [...prev, { text: `$ ${cmd}`, type: 'input' }]);

      // Process command
      processCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const processCommand = (cmdText: string) => {
    // If we are currently running the contact form wizard, route input to wizard handler
    if (wizardStep > 0) {
      handleContactWizard(cmdText);
      return;
    }

    const tokens = cmdText.split(' ');
    const command = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    switch (command) {
      case 'help':
        setHistory(prev => [
          ...prev,
          { text: 'Available commands:', type: 'system' },
          { text: '  about        - Show Siddhartha\'s biography details', type: 'output' },
          { text: '  skills       - Print active skills metric board', type: 'output' },
          { text: '  projects     - List Featured Case Studies', type: 'output' },
          { text: '  project [id] - Open a project modal (e.g. project kiit-connect)', type: 'output' },
          { text: '  contact      - Initiate interactive CLI recruiter inquiry form', type: 'output' },
          { text: '  theme [opt]  - Toggle theme (e.g. theme dark, theme light)', type: 'output' },
          { text: '  secret       - Run decrypt sequence (matrix simulation)', type: 'output' },
          { text: '  clear        - Clear console buffers', type: 'output' }
        ]);
        break;

      case 'about':
        setHistory(prev => [
          ...prev,
          { text: 'Name: Siddhartha Gupta', type: 'success' },
          { text: 'Role: Full Stack Systems Developer', type: 'output' },
          { text: 'University: KIIT University, B.Tech CS Undergraduate \'26', type: 'output' },
          { text: 'Biography: Based in India, Siddhartha builds robust backend APIs and high-fidelity frontends. He optimizes for low latencies and clean directories.', type: 'output' },
          { text: 'Email: siddhartha@kiit.ac.in', type: 'output' }
        ]);
        break;

      case 'skills':
        setHistory(prev => [
          ...prev,
          { text: '+----------------------------------------+', type: 'output' },
          { text: '| TECHNICAL SKILLS INDEX                 |', type: 'success' },
          { text: '+----------------------------------------+', type: 'output' },
          { text: '|  React.js         | [||||||||||] 90%   |', type: 'output' },
          { text: '|  JavaScript (ES6) | [||||||||||] 92%   |', type: 'output' },
          { text: '|  Node.js/Express  | [||||||||| ] 88%   |', type: 'output' },
          { text: '|  MongoDB / MySQL  | [||||||||  ] 85%   |', type: 'output' },
          { text: '|  Tailwind CSS     | [||||||||||] 90%   |', type: 'output' },
          { text: '|  AWS Cloud (S3)   | [||||||    ] 55%   |', type: 'output' },
          { text: '+----------------------------------------+', type: 'output' }
        ]);
        break;

      case 'projects':
        setHistory(prev => [
          ...prev,
          { text: 'Active Portfolio Projects:', type: 'system' },
          { text: '  - kiit-connect: KIIT PeerConnect (Used by 450+ CS Students)', type: 'output' },
          { text: '  - athena-gateway: Athena REST Gateway (<15ms Routing latency)', type: 'output' },
          { text: '  - cloud-s3-pipeline: AWS S3 Automated Upload Pipe (Secure Presigned uploads)', type: 'output' },
          { text: 'Type "project [id]" (e.g. project kiit-connect) to inspect a project.', type: 'system' }
        ]);
        break;

      case 'project':
        if (args.length === 0) {
          setHistory(prev => [...prev, { text: 'Error: Please specify project ID. Type "projects" to view IDs.', type: 'error' }]);
        } else {
          const projId = args[0].toLowerCase();
          const validIds = ['kiit-connect', 'athena-gateway', 'cloud-s3-pipeline'];
          if (validIds.includes(projId)) {
            setHistory(prev => [...prev, { text: `Targeting [${projId}] modal portal. Dispatching view event...`, type: 'success' }]);
            onProjectSelect(projId);
          } else {
            setHistory(prev => [...prev, { text: `Error: Project ID "${projId}" not found. Type "projects" for a list.`, type: 'error' }]);
          }
        }
        break;

      case 'contact':
        setHistory(prev => [
          ...prev,
          { text: '--- Recruiter Inquiry CLI Form Wizard ---', type: 'success' },
          { text: 'This wizard will help you submit a ticket to Siddhartha\'s Inbox.', type: 'output' },
          { text: 'Please enter your Full Name:', type: 'system' }
        ]);
        setWizardStep(1);
        break;

      case 'theme':
        if (args.length === 0) {
          onThemeToggle(!darkMode);
          setHistory(prev => [...prev, { text: `Toggled dark mode status to: ${!darkMode}`, type: 'success' }]);
        } else {
          const opt = args[0].toLowerCase();
          if (opt === 'dark') {
            onThemeToggle(true);
            setHistory(prev => [...prev, { text: 'Applied dark mode theme.', type: 'success' }]);
          } else if (opt === 'light') {
            onThemeToggle(false);
            setHistory(prev => [...prev, { text: 'Applied light mode theme.', type: 'success' }]);
          } else {
            setHistory(prev => [...prev, { text: 'Usage: theme [dark / light]', type: 'error' }]);
          }
        }
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'secret':
        runSecretDecryption();
        break;

      case 'backstage':
      case 'cockpit':
        onRevealCockpit();
        setHistory(prev => [
          ...prev,
          { text: '✦ COCKPIT SYSTEM HANDSHAKE INITIATED ✦', type: 'success' },
          { text: 'Siddhartha\'s Operations Cockpit revealed in UI layouts.', type: 'success' },
          { text: 'Please scroll down to the Cockpit cockpit control bar.', type: 'system' }
        ]);
        break;

      default:
        setHistory(prev => [...prev, { text: `Command not found: "${command}". Type "help" for valid commands.`, type: 'error' }]);
    }
  };

  const handleContactWizard = (text: string) => {
    switch (wizardStep) {
      case 1: // Name
        if (text.length < 2) {
          setHistory(prev => [...prev, { text: 'Name too short. Please enter your Full Name:', type: 'error' }]);
          return;
        }
        setWizardData(prev => ({ ...prev, fullName: text }));
        setHistory(prev => [
          ...prev,
          { text: `Name recorded: ${text}`, type: 'success' },
          { text: 'Please enter your Email Address:', type: 'system' }
        ]);
        setWizardStep(2);
        break;

      case 2: // Email
        if (!/\S+@\S+\.\S+/.test(text)) {
          setHistory(prev => [...prev, { text: 'Invalid email format. Please enter your Email:', type: 'error' }]);
          return;
        }
        setWizardData(prev => ({ ...prev, email: text }));
        setHistory(prev => [
          ...prev,
          { text: `Email recorded: ${text}`, type: 'success' },
          { text: 'Please enter your Company / Affiliation name:', type: 'system' }
        ]);
        setWizardStep(3);
        break;

      case 3: // Company
        if (text.length < 2) {
          setHistory(prev => [...prev, { text: 'Company name too short. Please enter Company name:', type: 'error' }]);
          return;
        }
        setWizardData(prev => ({ ...prev, companyName: text }));
        setHistory(prev => [
          ...prev,
          { text: `Company recorded: ${text}`, type: 'success' },
          { text: 'Enter your brief message details (e.g. details of the role/project):', type: 'system' }
        ]);
        setWizardStep(4);
        break;

      case 4: // Message
        if (text.length < 10) {
          setHistory(prev => [...prev, { text: 'Message must be at least 10 chars. Please expand details:', type: 'error' }]);
          return;
        }
        const finalData = {
          ...wizardData,
          description: text,
          id: 'lead_' + Math.random().toString(36).substr(2, 9),
          services: ['CLI Terminal Form'],
          budget: 'Contract Scale',
          timeline: 'Flexible',
          createdAt: new Date().toISOString(),
          status: 'Received'
        };

        // Save to local storage
        const stored = localStorage.getItem('spade_inquiries');
        const existingList = stored ? JSON.parse(stored) : [];
        localStorage.setItem('spade_inquiries', JSON.stringify([finalData, ...existingList]));

        onContactSubmit(finalData);

        setHistory(prev => [
          ...prev,
          { text: `Message recorded: "${text}"`, type: 'success' },
          { text: '----------------------------------------', type: 'success' },
          { text: 'TICKET SUCCESSFULLY LOCKED & REGISTERED!', type: 'success' },
          { text: `Recruiter Log ID: ${finalData.id}`, type: 'success' },
          { text: 'Siddhartha\'s inbox dispatcher synced.', type: 'system' },
          { text: '----------------------------------------', type: 'success' }
        ]);
        setWizardStep(0);
        break;
    }
  };

  const runSecretDecryption = () => {
    setHistory(prev => [...prev, { text: 'INITIALIZING DECRYPTION SEQUENCE PROTOCOL...', type: 'error' }]);
    
    let iterations = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      const hex = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(':');
      setHistory(prev => [...prev, { text: `[DECRYPTING] ${hex} ... MATCHING DATA BLOCK: ${Math.floor(Math.random() * 100)}%`, type: 'system' }]);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setHistory(prev => [
          ...prev,
          { text: '✦ SUCCESSFUL DATASTREAM LINK ✦', type: 'success' },
          { text: 'SYSTEM EASTER EGG FOUND: "Siddhartha Gupta is looking for a Software Engineering Internship!"', type: 'success' }
        ]);
      }
    }, 250);
  };

  return (
    <div 
      className="flex-1 flex flex-col min-h-0 bg-neutral-900 border border-neutral-850 dark:bg-zinc-950/95 dark:border-zinc-900 rounded-xl p-4 font-mono text-xs overflow-hidden shadow-inner text-left text-[#38bdf8] select-text relative cursor-text h-full min-h-[260px]"
      onClick={handleContainerClick}
    >
      {/* Scrollable logs list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 mb-3 max-h-[300px]">
        {history.map((line, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-wrap">
            {line.type === 'input' && (
              <span className="text-[#a3a3a3] font-bold">{line.text}</span>
            )}
            {line.type === 'output' && (
              <span className="text-[#e5e5e5]">{line.text}</span>
            )}
            {line.type === 'error' && (
              <span className="text-red-400 font-semibold">{line.text}</span>
            )}
            {line.type === 'success' && (
              <span className="text-emerald-400 font-bold">{line.text}</span>
            )}
            {line.type === 'system' && (
              <span className="text-indigo-400 font-semibold">{line.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Console Input Bar */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-800/80">
        <span className="text-indigo-455 font-bold select-none">
          {wizardStep > 0 ? `[wizard-step-${wizardStep}] >` : 'siddhartha.g $'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-[#e5e5e5] p-0 font-mono text-xs focus:ring-0"
          autoFocus
          placeholder={wizardStep > 0 ? "Type here and press enter..." : "Type 'help'..."}
        />
        <span className="text-neutral-500 flex items-center select-none">
          <CornerDownLeft className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
