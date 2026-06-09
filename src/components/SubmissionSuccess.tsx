import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Inquiry } from '../types';

interface SubmissionSuccessProps {
  inquiry: Inquiry;
  onReset: () => void;
  onViewBackstage: () => void;
}

export default function SubmissionSuccess({ inquiry, onReset, onViewBackstage }: SubmissionSuccessProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', damping: 20 }}
        className="bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/40 rounded-3xl p-8 md:p-12 shadow-sm space-y-6"
        id="success-alert-container"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            TICKET RECEIVED SECURELY IN COCKPIT
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-neutral-900 dark:text-neutral-50 tracking-tight">
            We're synched, {inquiry.fullName}!
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            Your inquiry for <strong className="text-neutral-800 dark:text-neutral-200">{inquiry.services.join(' & ')}</strong> has been registered. It has been pushed directly to Siddhartha's developer Backstage Dashboard for fast evaluation.
          </p>
        </div>

        {/* Copyable ticket index */}
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-neutral-100 dark:border-zinc-800 flex items-center justify-between text-left max-w-sm mx-auto">
          <div>
            <span className="text-[9px] font-semibold text-neutral-400 font-mono block">PORTFOLIO REFERENCE</span>
            <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 uppercase">{inquiry.id}</span>
          </div>
          <span className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-zinc-900 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            {inquiry.budget}
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onViewBackstage}
            className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-150 text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            id="success-view-backstage-btn"
          >
            Go to Ops Cockpit / Backstage Inbox
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={onReset}
            className="px-5 py-3 rounded-xl border border-neutral-250 hover:bg-neutral-50 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold uppercase tracking-wider font-mono text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            id="success-new-form-btn"
          >
            Submit Another Lead
          </button>
        </div>

        <div className="border-t border-emerald-100/50 dark:border-emerald-950/20 pt-6 mt-6 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
          <span>SIDDHARTHA GUPTA SYSTEMS</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE PIPELINE SYNCED
          </span>
        </div>
      </motion.div>
    </div>
  );
}
