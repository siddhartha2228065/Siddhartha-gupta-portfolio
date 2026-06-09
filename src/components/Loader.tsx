import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  key?: string;
  onComplete: () => void;
}

const WORDS = ["Create", "Inspire", "Design"];

export default function Loader({ onComplete }: LoaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < WORDS.length) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 900); // 900ms per word for a snappy yet smooth transition
      return () => clearTimeout(timer);
    } else {
      // Finished all words, trigger completion
      onComplete();
    }
  }, [index, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -50,
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-zinc-950/50 to-zinc-950 pointer-events-none" />

      {/* Decorative subtle lines/grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Word Showcase */}
      <div className="relative flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {index < WORDS.length && (
            <motion.h1
              key={index}
              className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tight font-display text-white"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }
              }}
              exit={{ 
                opacity: 0, 
                y: -40, 
                scale: 1.05,
                transition: { duration: 0.35, ease: [0.55, 0.055, 0.675, 0.19] }
              }}
            >
              <span className="inline-block relative">
                {WORDS[index]}
                {/* Accent glow dot */}
                <motion.span 
                  className="absolute -right-5 bottom-3 h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                />
              </span>
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Sleek Progress Bar Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-56 h-[3px] bg-zinc-900 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_8px_#6366f1]"
          initial={{ width: "0%" }}
          animate={{ 
            width: index >= WORDS.length ? "100%" : `${((index + 0.5) / WORDS.length) * 100}%` 
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
