import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Sparkles, Send, RefreshCw, Layers, ExternalLink, Calendar, DollarSign, User, Mail, MessageSquare, Building2, Phone } from 'lucide-react';
import { Inquiry } from '../types';

interface LeadInquiryFormProps {
  onSubmissionSuccess: (inquiry: Inquiry) => void;
}

const SERVICE_OPTIONS = [
  { id: 'hiring', label: 'Hiring / Job Offer', description: 'Full-time role, internship, or consulting' },
  { id: 'freelance', label: 'Freelance Build', description: 'React interfaces, full-stack suites, API routes' },
  { id: 'collab', label: 'OSS Collaboration', description: 'Open-source software, study sprints, hackathons' },
  { id: 'chat', label: 'General Greeting', description: 'A quick hello, networking, student discourse' }
];

const BUDGET_OPTIONS = [
  { value: 'Full-time Scale', label: 'Full-Time Compensation', desc: 'Standard engineering salary schedules' },
  { value: 'Contract Scale', label: 'Part-Time / Retainer', desc: 'Hourly consultancies, short-term sprints' },
  { value: 'Freelance Tier', label: 'Project-Based Freelance', desc: 'Targeted MVPs, custom dashboards' },
  { value: 'None (OS / Collab)', label: 'Uncompensated / Academic', desc: 'Open source work, peer study groups' }
];

const TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'Immediate (< 1 month)', desc: 'High priority onboarding' },
  { value: 'soon', label: 'Next 1 – 3 months', desc: 'Standard project layout window' },
  { value: 'flexible', label: 'Flexible / General Chat', desc: 'General exploration query' }
];

export default function LeadInquiryForm({ onSubmissionSuccess }: LeadInquiryFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');

  // Client side validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // 1: focus category choose, 2: context text details, 3: personal contact info

  const handleServiceToggle = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
    // Clear custom errors
    if (errors.services) {
      const newErrors = { ...errors };
      delete newErrors.services;
      setErrors(newErrors);
    }
  };

  const validateStep1 = () => {
    if (selectedServices.length === 0) {
      setErrors({ services: 'Please select at least one contact channel focus' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!description || description.trim().length < 10) {
      newErrors.description = 'Please tell Siddhartha a bit about your goals or reasons (min 10 characters)';
    }
    if (!budget) {
      newErrors.budget = 'Please select a compensation / project category';
    }
    if (!timeline) {
      newErrors.timeline = 'Please select a target timeline';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName || fullName.trim().length < 2) {
      newErrors.fullName = 'Your Full Name is required';
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'A valid Work or personal Email is required';
    }
    if (!companyName || companyName.trim().length < 2) {
      newErrors.companyName = 'Company or Organization name is required (use "Solo/Personal" if independent)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) return;
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setSimulatedProgress(10);

    const timeouts = [
      setTimeout(() => setSimulatedProgress(35), 400),
      setTimeout(() => setSimulatedProgress(65), 1000),
      setTimeout(() => setSimulatedProgress(90), 1600),
      setTimeout(() => {
        setSimulatedProgress(100);
        const mappedServices = selectedServices.map(s => {
          const opt = SERVICE_OPTIONS.find(o => o.id === s);
          return opt ? opt.label : s.toUpperCase();
        });

        const newInquiry: Inquiry = {
          id: 'lead_' + Math.random().toString(36).substr(2, 9),
          services: mappedServices,
          description,
          budget,
          timeline: TIMELINE_OPTIONS.find(t => t.value === timeline)?.label || timeline,
          fullName,
          email,
          companyName,
          phone: phone || undefined,
          createdAt: new Date().toISOString(),
          status: 'Received'
        };

        // Persist to localStorage
        const stored = localStorage.getItem('spade_inquiries');
        const existingList = stored ? JSON.parse(stored) : [];
        localStorage.setItem('spade_inquiries', JSON.stringify([newInquiry, ...existingList]));

        // Dispatch real email if Formspree is integrated
        const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL;
        if (formspreeUrl) {
          fetch(formspreeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              fullName: newInquiry.fullName,
              email: newInquiry.email,
              companyName: newInquiry.companyName,
              phone: newInquiry.phone || 'N/A',
              services: newInquiry.services.join(', '),
              budget: newInquiry.budget,
              timeline: newInquiry.timeline,
              description: newInquiry.description,
              createdAt: newInquiry.createdAt
            })
          })
          .then(res => {
            if (res.ok) {
              console.log('Formspree notification successfully dispatched.');
            } else {
              console.error('Formspree dispatch failed with status:', res.status);
            }
          })
          .catch(err => {
            console.error('Error dispatching Formspree notification:', err);
          });
        }

        onSubmissionSuccess(newInquiry);
        
        // Reset states
        setSelectedServices([]);
        setDescription('');
        setBudget('');
        setTimeline('');
        setFullName('');
        setEmail('');
        setCompanyName('');
        setPhone('');
        setCurrentStep(1);
        setIsSubmitting(false);
      }, 2300)
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  return (
    <section id="contact-section" className="mx-auto max-w-5xl px-6 md:px-10 lg:px-16 py-16 lg:py-24 transition-colors duration-300">
      
      {/* Dynamic Intro Block */}
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-display text-4.5xl md:text-6.5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.1] mb-6"
        >
          let's construct <br className="hidden sm:inline" />something together.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed"
        >
          Have potential employment, contract requirements, or creative ideas? Choose the correct channel focus, and drop a message into Siddhartha's dashboard queue to initiate engagement.
        </motion.p>
      </div>

      {/* Main inquiry multi-step form */}
      <div className="bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200/60 dark:border-zinc-800 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden backdrop-blur-md">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200/50 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-950 font-mono">
              {currentStep}
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 font-mono">
              {currentStep === 1 && 'Step 1: Contact Focus'}
              {currentStep === 2 && 'Step 2: Objective Details'}
              {currentStep === 3 && 'Step 3: Contact Details'}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((stepNum) => (
              <div 
                key={stepNum} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === stepNum 
                    ? 'w-6 bg-neutral-900 dark:bg-white' 
                    : stepNum < currentStep 
                    ? 'w-2 bg-emerald-500 dark:bg-emerald-400' 
                    : 'w-2 bg-neutral-200 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" id="inquiry-form">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SERVICE CHOICE */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900 dark:text-neutral-50" id="services-section-heading">
                    What sort of engagement?
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-zinc-400 mt-1">Select all that apply</p>
                </div>

                {/* Pill selectors with active layout options */}
                <div className="flex flex-wrap gap-3">
                  {SERVICE_OPTIONS.map((option) => {
                    const isSelected = selectedServices.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleServiceToggle(option.id)}
                        className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 flex items-center gap-2 cursor-pointer relative ${
                          isSelected
                            ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 font-semibold shadow-lg'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 dark:bg-zinc-950/60 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                        id={`btn-service-${option.id}`}
                      >
                        {option.label}
                        {isSelected && (
                          <motion.span 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-zinc-950"
                          >
                            <Check className="h-2.5 w-2.5 text-neutral-900 dark:text-white" strokeWidth={3} />
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Description helper matching helper warning "Please click to select services above" */}
                <div className="pt-2 min-h-[30px]" id="step1-helper">
                  <AnimatePresence mode="wait">
                    {selectedServices.length === 0 ? (
                      <motion.p
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-mono text-neutral-450 dark:text-zinc-500 italic"
                      >
                        Please click to select engagement channels above.
                      </motion.p>
                    ) : (
                      <motion.div
                        key="selected-list"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-1 bg-neutral-100/50 dark:bg-zinc-950/30 p-4 rounded-2xl border border-neutral-200/50 dark:border-zinc-800/50"
                      >
                        <span className="text-[10px] font-mono tracking-wider text-neutral-400 dark:text-zinc-500 uppercase font-bold">Selected Directions</span>
                        <div className="flex flex-col gap-1.5 mt-1">
                          {selectedServices.map(sId => {
                            const opt = SERVICE_OPTIONS.find(o => o.id === sId);
                            return (
                              <div key={sId} className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{opt?.label}</span>
                                <span className="text-[10px] text-neutral-500 dark:text-zinc-500">— {opt?.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {errors.services && (
                  <p className="text-xs text-red-500 font-medium" id="services-error-msg">{errors.services}</p>
                )}
              </motion.div>
            )}

            {/* STEP 2: DETAILS & BUDGET */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900 dark:text-neutral-50">
                    What does the project or role entail?
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-sans">Provide context about what you're planning or looking for</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-neutral-605 dark:text-neutral-300 uppercase font-mono block">
                    Brief Statement or Invitation details
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute top-3.5 left-3.5 h-4 w-4 text-neutral-400" />
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          const errs = { ...errors };
                          delete errs.description;
                          setErrors(errs);
                        }
                      }}
                      placeholder="e.g., We are recruiting Software Engineers for KIIT university placement campaigns or contract work on our team..."
                      rows={4}
                      className={`w-full rounded-2xl border bg-white dark:bg-zinc-955 p-4 pl-11 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all ${
                        errors.description ? 'border-red-400 dark:border-red-900/50 focus:ring-red-400' : 'border-neutral-200 dark:border-zinc-800'
                      }`}
                      id="input-brief-desc"
                    />
                  </div>
                  {errors.description && (
                    <p className="text-xs text-red-500 font-medium">{errors.description}</p>
                  )}
                </div>

                {/* Compensation preferences */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-neutral-605 dark:text-neutral-300 uppercase font-mono block">
                    Compensation structure
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUDGET_OPTIONS.map((opt) => {
                      const isSel = budget === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setBudget(opt.value);
                            if (errors.budget) {
                              const errs = { ...errors };
                              delete errs.budget;
                              setErrors(errs);
                            }
                          }}
                          className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
                            isSel
                              ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 font-medium'
                              : 'bg-white hover:bg-neutral-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-neutral-200 dark:border-zinc-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                          id={`btn-budget-${opt.value.replace(/[^a-zA-Z0-9]/g, '')}`}
                        >
                          <div className="flex items-center gap-2">
                            <DollarSign className={`h-4.5 w-4.5 ${isSel ? 'text-emerald-400 dark:text-emerald-600' : 'text-neutral-500'}`} />
                            <span className="font-bold text-sm">{opt.label}</span>
                          </div>
                          <span className={`text-xs mt-1 block font-normal leading-relaxed ${isSel ? 'text-neutral-200 dark:text-neutral-400 font-medium' : 'text-neutral-500 dark:text-neutral-400'}`}>
                            {opt.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.budget && (
                    <p className="text-xs text-red-500 font-medium">{errors.budget}</p>
                  )}
                </div>

                {/* Timeline preference */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-neutral-600 dark:text-neutral-300 uppercase font-mono block">
                    Urgency / Start Timeline
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TIMELINE_OPTIONS.map((opt) => {
                      const isSel = timeline === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setTimeline(opt.value);
                            if (errors.timeline) {
                              const errs = { ...errors };
                              delete errs.timeline;
                              setErrors(errs);
                            }
                          }}
                          className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
                            isSel
                              ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-955'
                              : 'bg-white hover:bg-neutral-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-neutral-200 dark:border-zinc-800 text-neutral-700 dark:text-neutral-300 font-sans'
                          }`}
                          id={`btn-timeline-${opt.value}`}
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-neutral-450" />
                            <span className="font-bold text-xs">{opt.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.timeline && (
                    <p className="text-xs text-red-500 font-medium">{errors.timeline}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONTACT INFORMATION */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900 dark:text-neutral-50">
                    Who should Siddhartha follow up with?
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Direct endpoints for Siddhartha to respond or submit templates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-450" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) {
                            const errs = { ...errors };
                            delete errs.fullName;
                            setErrors(errs);
                          }
                        }}
                        placeholder="Zack Snyder"
                        className={`w-full rounded-xl border bg-white dark:bg-zinc-955 p-3 pl-11 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-450 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all ${
                          errors.fullName ? 'border-red-400 focus:ring-red-450' : 'border-neutral-200 dark:border-zinc-800'
                        }`}
                        id="input-fullname"
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-455" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            const errs = { ...errors };
                            delete errs.email;
                            setErrors(errs);
                          }
                        }}
                        placeholder="zack@brandflow.io"
                        className={`w-full rounded-xl border bg-white dark:bg-zinc-955 p-3 pl-11 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-450 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all ${
                          errors.email ? 'border-red-400 focus:ring-red-450' : 'border-neutral-200 dark:border-zinc-800'
                        }`}
                        id="input-email"
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                      Company / Affiliation
                    </label>
                    <div className="relative">
                      <Building2 className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-455" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (errors.companyName) {
                            const errs = { ...errors };
                            delete errs.companyName;
                            setErrors(errs);
                          }
                        }}
                        placeholder="e.g. Solo, Google, KIIT Student"
                        className={`w-full rounded-xl border bg-white dark:bg-zinc-955 p-3 pl-11 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-450 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all ${
                          errors.companyName ? 'border-red-400 focus:ring-red-450' : 'border-neutral-200 dark:border-zinc-800'
                        }`}
                        id="input-company"
                      />
                    </div>
                    {errors.companyName && <p className="text-[11px] text-red-500">{errors.companyName}</p>}
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-455" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 (555) 019-2834"
                        className="w-full rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 pl-11 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-405 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all/300"
                        id="input-phone"
                      />
                    </div>
                  </div>

                </div>

                {/* Submitting Progress Indicator */}
                {isSubmitting && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 mt-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-neutral-200 dark:border-zinc-800"
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <RefreshCw className="h-3 w-3 animate-spin text-neutral-600 dark:text-neutral-400" />
                        {simulatedProgress < 30 && 'Packing portfolio telemetry parameter...'}
                        {simulatedProgress >= 30 && simulatedProgress < 65 && 'Aligning database transaction payload...'}
                        {simulatedProgress >= 65 && simulatedProgress < 90 && 'Locking ticket on Backstage queue...'}
                        {simulatedProgress >= 90 && 'Synching pipeline...'}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-200">{simulatedProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${simulatedProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200/50 dark:border-zinc-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono border border-neutral-200 hover:bg-neutral-100 dark:border-zinc-800 dark:hover:bg-zinc-800/60 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer disabled:opacity-50"
                id="btn-form-back"
              >
                Back
              </button>
            ) : (
              <div /> // placeholder for layout alignment
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-sm font-semibold tracking-wide flex items-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-sm"
                id="btn-form-next"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-sm font-semibold tracking-wide flex items-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-neutral-900/10 dark:shadow-white/5"
                id="btn-form-submit"
              >
                {isSubmitting ? 'Submitting Form' : 'Submit Target Lead'}
                {!isSubmitting && <Send className="h-4 w-4" />}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
