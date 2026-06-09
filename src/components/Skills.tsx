import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code, Server, Database, Settings, Cloud, 
  Terminal, Monitor, Sparkles, CheckCircle2 
} from 'lucide-react';

interface Skill {
  name: string;
  level: number; // 0 to 100
  note?: string;
}

interface SkillCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  skills: Skill[];
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState<string>('frontend');

  const categories: SkillCategory[] = [
    {
      id: 'frontend',
      label: 'Frontend Core',
      icon: <Monitor className="h-4.5 w-4.5" />,
      skills: [
        { name: 'React.js', level: 90, note: 'Client state management, Hooks, Motion context' },
        { name: 'JavaScript (ES6+)', level: 92, note: 'Asynchronous architectures, DOM engines' },
        { name: 'Responsive Design', level: 95, note: 'Mobile first grid pipelines, Fluid layouts' },
        { name: 'CSS / Tailwind CSS', level: 90, note: 'Utility architecture, custom themes' },
        { name: 'HTML', level: 95, note: 'Semantic structuring, layout standard compliance' }
      ]
    },
    {
      id: 'backend',
      label: 'Backend & Server',
      icon: <Server className="h-4.5 w-4.5" />,
      skills: [
        { name: 'Node.js', level: 85, note: 'Event loop structures, service scripting' },
        { name: 'Express.js', level: 88, note: 'API middleware, proxy routing' },
        { name: 'REST APIs', level: 90, note: 'Payload serialization, status compliance' }
      ]
    },
    {
      id: 'database',
      label: 'Database Systems',
      icon: <Database className="h-4.5 w-4.5" />,
      skills: [
        { name: 'MongoDB', level: 82, note: 'Aggregations, document indexes' },
        { name: 'MySQL', level: 85, note: 'Relational logic, joins' },
        { name: 'SQL', level: 85, note: 'Query tuning, table blueprints' }
      ]
    },
    {
      id: 'tools',
      label: 'Workflows & Tools',
      icon: <Settings className="h-4.5 w-4.5" />,
      skills: [
        { name: 'Git', level: 88, note: 'Branch rebases, merge controls' },
        { name: 'GitHub', level: 90, note: 'Action flows, remote repositories' },
        { name: 'VS Code', level: 95, note: 'Custom debugging, extension integrations' },
        { name: 'Postman', level: 88, note: 'Endpoint mock, payload inspection' }
      ]
    },
    {
      id: 'cloud',
      label: 'Cloud & Infrastructure',
      icon: <Cloud className="h-4.5 w-4.5" />,
      skills: [
        { name: 'AWS', level: 55, note: 'EC2, S3 bucket storage, cloud routing (Learning)' }
      ]
    }
  ];

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section id="skills-section" className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 py-16 lg:py-24 border-t border-neutral-100 dark:border-zinc-900/60 transition-colors duration-300">
      
      {/* Section Head */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mb-12"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 font-mono">TECHNICAL METRICS</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight">
          Sleek stack and tool configurations.
        </h2>
        <p className="text-sm mt-3 text-neutral-500 dark:text-zinc-400">
          Actively building full-stack applications with high modularity, structured database schemas, and responsive view layouts.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        
        {/* Left column - tab sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-950 font-semibold shadow-sm'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200 dark:bg-zinc-950/60 dark:hover:bg-zinc-900 dark:border-zinc-800 text-neutral-700 dark:text-neutral-300'
              }`}
              id={`tab-skills-${cat.id}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${activeTab === cat.id ? 'bg-white/20 dark:bg-zinc-950/10' : 'bg-neutral-100 dark:bg-zinc-900'}`}>
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold">{cat.label}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${activeTab === cat.id ? 'text-zinc-300 dark:text-zinc-600' : 'text-neutral-400 dark:text-zinc-500'}`}>
                {cat.skills.length} Items
              </span>
            </button>
          ))}
        </div>

        {/* Right column - details panel with custom animation */}
        <div className="lg:col-span-8 bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-200/60 dark:border-zinc-800 rounded-3xl p-6 md:p-8 relative min-h-[380px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 flex-1"
            >
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200/50 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold text-neutral-400 dark:text-zinc-500 tracking-wider uppercase">
                    ACTIVE DIRECTORY : {currentCategory.label.toUpperCase()}
                  </span>
                </div>
                {activeTab === 'cloud' && (
                  <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    ACTIVELY EXPLORING / LEARNING
                  </span>
                )}
              </div>

              {/* Skill Bars */}
              <div className="space-y-5">
                {currentCategory.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{skill.name}</span>
                        {skill.note && (
                          <span className="text-[10px] text-neutral-400 dark:text-zinc-500 ml-2 italic hidden sm:inline">
                            — {skill.note}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-500 dark:text-zinc-400">{skill.level}%</span>
                    </div>

                    <div className="h-2 w-full bg-neutral-200/50 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          activeTab === 'cloud' 
                            ? 'bg-amber-500' 
                            : 'bg-neutral-900 dark:bg-white'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Micro accent at bottom of skills card */}
          <div className="mt-8 pt-4 border-t border-neutral-200/50 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-neutral-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> All stacks strictly compiled in full TypeScript environments.
            </span>
            <span>VERIFIED SKILLBOARD v1.1</span>
          </div>

        </div>

      </div>

    </section>
  );
}
