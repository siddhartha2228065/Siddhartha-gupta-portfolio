import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, RotateCcw, HelpCircle, Code as CodeIcon, FastForward } from 'lucide-react';

// Interfaces for visualizer state frames
interface BSFrame {
  line: number;
  low: number;
  high: number;
  mid?: number;
  status: string;
  found: boolean;
  done: boolean;
}

interface BubbleFrame {
  line: number;
  arr: number[];
  i: number;
  j: number;
  status: string;
  swapping: boolean;
  comparing: boolean;
  sortedIndices: number[];
}

interface DFSFrame {
  line: number;
  currentNode?: string;
  visited: string[];
  stack: string[];
  status: string;
  done: boolean;
}

export default function CodeVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState<'binary' | 'bubble' | 'dfs'>('binary');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000); // speed in ms

  // Reference for play loop interval
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Inputs
  const bsArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const bsTarget = 23;
  const bubbleArrayStart = [29, 10, 14, 37, 13];

  // ----------------------------------------------------
  // TRACE SNAPSHOT GENERATORS
  // ----------------------------------------------------

  // 1. Binary Search snap-generator
  const generateBinarySearchFrames = (): BSFrame[] => {
    const frames: BSFrame[] = [];
    const arr = bsArray;
    const target = bsTarget;

    frames.push({ line: 1, low: 0, high: arr.length - 1, status: 'Initializing boundaries: low = 0, high = 9', found: false, done: false });
    
    let low = 0;
    let high = arr.length - 1;
    let found = false;

    while (low <= high) {
      frames.push({ line: 2, low, high, status: `Evaluating loop: low (${low}) <= high (${high}) (True)`, found: false, done: false });
      
      const mid = Math.floor((low + high) / 2);
      frames.push({ line: 3, low, high, mid, status: `Computing mid index: Math.floor((${low} + ${high}) / 2) = ${mid} (value: ${arr[mid]})`, found: false, done: false });
      
      frames.push({ line: 4, low, high, mid, status: `Checking comparison: arr[mid] (${arr[mid]}) === target (${target})`, found: false, done: false });
      
      if (arr[mid] === target) {
        frames.push({ line: 5, low, high, mid, status: `Match found! Element ${target} found at index ${mid}.`, found: true, done: true });
        found = true;
        break;
      }
      
      frames.push({ line: 6, low, high, mid, status: `Checking range partition: arr[mid] (${arr[mid]}) < target (${target})`, found: false, done: false });
      
      if (arr[mid] < target) {
        low = mid + 1;
        frames.push({ line: 7, low, high, mid, status: `Target is larger. Shift low pointer to mid + 1 = ${low}`, found: false, done: false });
      } else {
        high = mid - 1;
        frames.push({ line: 9, low, high, mid, status: `Target is smaller. Shift high pointer to mid - 1 = ${high}`, found: false, done: false });
      }
    }

    if (!found) {
      frames.push({ line: 12, low, high, status: `Loop exited. Target element ${target} not found in array.`, found: false, done: true });
    }

    return frames;
  };

  // 2. Bubble Sort snap-generator
  const generateBubbleSortFrames = (): BubbleFrame[] => {
    const frames: BubbleFrame[] = [];
    let arr = [...bubbleArrayStart];
    const n = arr.length;
    const sorted: number[] = [];

    frames.push({ line: 1, arr: [...arr], i: 0, j: 0, status: 'Initializing outer loop pointer i = 0', swapping: false, comparing: false, sortedIndices: [] });

    for (let i = 0; i < n - 1; i++) {
      frames.push({ line: 2, arr: [...arr], i, j: 0, status: `Outer loop iteration i = ${i}`, swapping: false, comparing: false, sortedIndices: [...sorted] });
      
      for (let j = 0; j < n - i - 1; j++) {
        frames.push({ 
          line: 3, 
          arr: [...arr], 
          i, 
          j, 
          status: `Comparing elements: arr[j] (${arr[j]}) and arr[j+1] (${arr[j+1]})`, 
          swapping: false, 
          comparing: true, 
          sortedIndices: [...sorted] 
        });

        if (arr[j] > arr[j+1]) {
          frames.push({ 
            line: 4, 
            arr: [...arr], 
            i, 
            j, 
            status: `Out of order swap required: ${arr[j]} > ${arr[j+1]}`, 
            swapping: true, 
            comparing: false, 
            sortedIndices: [...sorted] 
          });
          
          const temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;

          frames.push({ 
            line: 5, 
            arr: [...arr], 
            i, 
            j, 
            status: `Swapped index ${j} and ${j+1}. Array state: [${arr.join(', ')}]`, 
            swapping: false, 
            comparing: false, 
            sortedIndices: [...sorted] 
          });
        }
      }
      sorted.unshift(n - i - 1);
      frames.push({ line: 2, arr: [...arr], i, j: 0, status: `Sorted boundary locks index: ${n - i - 1}`, swapping: false, comparing: false, sortedIndices: [...sorted] });
    }
    sorted.unshift(0);
    frames.push({ line: 8, arr: [...arr], i: n - 1, j: 0, status: 'Bubble sort complete! Full array sorted.', swapping: false, comparing: false, sortedIndices: [...sorted] });

    return frames;
  };

  // 3. DFS Graph Traversal snap-generator
  // Node coordinates: A(40,60), B(120,25), C(120,95), D(200,25), E(200,95)
  const generateDfsFrames = (): DFSFrame[] => {
    const frames: DFSFrame[] = [];
    const adjList: Record<string, string[]> = {
      'A': ['B', 'C'],
      'B': ['D'],
      'C': ['E'],
      'D': [],
      'E': []
    };

    const visited: string[] = [];
    const stack: string[] = ['A'];

    frames.push({ line: 1, visited: [], stack: ['A'], status: 'Initializing traversal: Push start node A to stack', done: false });

    while (stack.length > 0) {
      frames.push({ line: 2, visited: [...visited], stack: [...stack], status: `Evaluating loop: stack is not empty (size: ${stack.length})`, done: false });
      
      const curr = stack.pop()!;
      frames.push({ line: 3, currentNode: curr, visited: [...visited], stack: [...stack], status: `Pop node ${curr} from stack top`, done: false });
      
      frames.push({ line: 4, currentNode: curr, visited: [...visited], stack: [...stack], status: `Check visited state: has node ${curr} been traversed?`, done: false });
      
      if (!visited.includes(curr)) {
        visited.push(curr);
        frames.push({ line: 5, currentNode: curr, visited: [...visited], stack: [...stack], status: `Mark node ${curr} as visited. Visited list: [${visited.join(', ')}]`, done: false });
        
        const neighbors = adjList[curr];
        frames.push({ line: 6, currentNode: curr, visited: [...visited], stack: [...stack], status: `Inspect neighbors of ${curr}: [${neighbors.join(', ')}]`, done: false });
        
        for (let idx = neighbors.length - 1; idx >= 0; idx--) {
          const neighbor = neighbors[idx];
          stack.push(neighbor);
          frames.push({ 
            line: 7, 
            currentNode: curr, 
            visited: [...visited], 
            stack: [...stack], 
            status: `Push unvisited neighbor ${neighbor} to Stack. Stack: [${stack.join(', ')}]`, 
            done: false 
          });
        }
      }
    }

    frames.push({ line: 10, visited: [...visited], stack: [], status: 'Traversal complete. DFS finished visits.', done: true });
    return frames;
  };

  // Compile frames on selection
  const bsFrames = generateBinarySearchFrames();
  const bubbleFrames = generateBubbleSortFrames();
  const dfsFrames = generateDfsFrames();

  const getFrames = () => {
    if (selectedAlgo === 'binary') return bsFrames;
    if (selectedAlgo === 'bubble') return bubbleFrames;
    return dfsFrames;
  };

  const frames = getFrames();

  // Reset/Change Algorithm handlers
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [selectedAlgo]);

  // Autoplay hook
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, frames.length, playSpeed]);

  const stepForward = () => {
    if (currentStep < frames.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetVisualizer = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // ----------------------------------------------------
  // ALGORITHM SOURCE CODE LINES DEFINITION
  // ----------------------------------------------------

  const bsCode = [
    'let low = 0, high = arr.length - 1;',
    'while (low <= high) {',
    '  let mid = Math.floor((low + high) / 2);',
    '  if (arr[mid] === target) {',
    '    return mid; // Match found',
    '  } else if (arr[mid] < target) {',
    '    low = mid + 1; // Search right half',
    '  } else {',
    '    high = mid - 1; // Search left half',
    '  }',
    '}',
    'return -1; // Not found'
  ];

  const bubbleCode = [
    'for (let i = 0; i < n - 1; i++) {',
    '  for (let j = 0; j < n - i - 1; j++) {',
    '    if (arr[j] > arr[j + 1]) {',
    '      // Swap elements',
    '      let temp = arr[j];',
    '      arr[j] = arr[j + 1];',
    '      arr[j + 1] = temp;',
    '    }',
    '  }',
    '}'
  ];

  const dfsCode = [
    'let visited = [], stack = [startNode];',
    'while (stack.length > 0) {',
    '  let curr = stack.pop();',
    '  if (!visited.includes(curr)) {',
    '    visited.push(curr);',
    '    for (let neighbor of adjList[curr]) {',
    '      stack.push(neighbor);',
    '    }',
    '  }',
    '}',
    'return visited;'
  ];

  const getSourceCode = () => {
    if (selectedAlgo === 'binary') return bsCode;
    if (selectedAlgo === 'bubble') return bubbleCode;
    return dfsCode;
  };

  const codeLines = getSourceCode();
  const activeFrame = frames[currentStep] || frames[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-900 border border-neutral-850 dark:bg-zinc-950/95 dark:border-zinc-900 rounded-xl p-4 font-mono text-xs overflow-hidden shadow-inner text-left text-[#38bdf8] select-none h-full min-h-[260px]">
      
      {/* Visualizer header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/80 pb-2 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <CodeIcon className="h-4 w-4 text-indigo-400" />
          <select 
            value={selectedAlgo} 
            onChange={(e) => setSelectedAlgo(e.target.value as any)}
            className="bg-neutral-800 dark:bg-zinc-900 border border-neutral-700/60 dark:border-zinc-800 text-neutral-200 text-[10px] font-bold rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
          >
            <option value="binary">Binary Search</option>
            <option value="bubble">Bubble Sort</option>
            <option value="dfs">DFS Graph Traversal</option>
          </select>
        </div>

        {/* Action button panel */}
        <div className="flex items-center gap-2">
          <button 
            onClick={stepBackward} 
            disabled={currentStep === 0}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 transition-all cursor-pointer"
            title="Step Backward"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 font-bold text-[9px] uppercase transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button 
            onClick={stepForward} 
            disabled={currentStep === frames.length - 1}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 transition-all cursor-pointer"
            title="Step Forward"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button 
            onClick={resetVisualizer}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Speed Toggle */}
          <button 
            onClick={() => setPlaySpeed(prev => prev === 1000 ? 400 : 1000)}
            className="px-1.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[9px] text-neutral-300 font-bold uppercase transition-all flex items-center gap-0.5 cursor-pointer"
            title="Speed Rate"
          >
            <FastForward className="h-3 w-3" />
            <span>{playSpeed === 1000 ? '1x' : '2.5x'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Panel Division */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0 overflow-y-auto max-h-[295px] pr-1">
        
        {/* LEFT CODE BOX (40% width) */}
        <div className="md:col-span-5 bg-neutral-950/80 rounded-lg p-2.5 border border-neutral-850/60 overflow-x-auto overflow-y-auto flex flex-col justify-start">
          <div className="flex items-center gap-1 text-[9px] text-neutral-500 font-bold uppercase mb-2 pb-1.5 border-b border-neutral-850">
            <span>Algorithm source trace</span>
          </div>
          <div className="space-y-0.5 font-mono text-[9px] text-[#a1a1aa] whitespace-pre min-w-max">
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = activeFrame.line === lineNum;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center px-1 py-0.5 rounded transition-all ${
                    isHighlighted 
                      ? 'bg-indigo-950/50 text-[#a5b4fc] font-bold border-l-2 border-indigo-500 pl-0.5 shadow-sm' 
                      : ''
                  }`}
                >
                  <span className={`w-4 text-[8.5px] select-none text-right mr-2 font-mono ${isHighlighted ? 'text-indigo-400' : 'text-neutral-600'}`}>
                    {lineNum}
                  </span>
                  <span className={isHighlighted ? 'text-[#e0e7ff]' : ''}>{lineText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT VISUAL DISPLAY (60% width) */}
        <div className="md:col-span-7 bg-neutral-950/30 rounded-lg p-3 border border-neutral-850/60 flex flex-col justify-between overflow-hidden min-h-[160px]">
          
          {/* Visual Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-1 overflow-x-auto">
            
            {/* Binary Search Visual Rendering */}
            {selectedAlgo === 'binary' && (() => {
              const frame = activeFrame as BSFrame;
              return (
                <div className="flex flex-col items-center gap-4 py-2 select-none min-w-max">
                  {/* Array Elements */}
                  <div className="flex gap-1">
                    {bsArray.map((val, idx) => {
                      const isLow = idx === frame.low;
                      const isHigh = idx === frame.high;
                      const isMid = idx === frame.mid;
                      const isMatched = frame.found && isMid;
                      const inRange = idx >= frame.low && idx <= frame.high;

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          {/* element box */}
                          <div 
                            className={`w-7 h-7 rounded-lg border font-bold font-mono text-[10px] flex items-center justify-center transition-all ${
                              isMatched 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 scale-105 shadow-md shadow-emerald-500/15'
                                : isMid
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-extrabold'
                                : inRange
                                ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                                : 'bg-neutral-900 border-neutral-850 text-neutral-600 opacity-35'
                            }`}
                          >
                            {val}
                          </div>
                          
                          {/* index box */}
                          <span className="text-[7.5px] text-neutral-600 mt-0.5">{idx}</span>

                          {/* indices pointer tags overlay */}
                          <div className="h-4 flex flex-col items-center justify-start text-[7.5px] font-bold mt-1 gap-0.5">
                            {isLow && <span className="text-cyan-400 font-mono">L</span>}
                            {isHigh && <span className="text-amber-400 font-mono">H</span>}
                            {isMid && <span className="text-indigo-400 font-mono">M</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Bubble Sort Visual Rendering */}
            {selectedAlgo === 'bubble' && (() => {
              const frame = activeFrame as BubbleFrame;
              return (
                <div className="flex items-end justify-center gap-3.5 h-[100px] w-full max-w-[280px] pt-4 select-none">
                  {frame.arr.map((val, idx) => {
                    const isComparing = frame.comparing && (idx === frame.j || idx === frame.j + 1);
                    const isSwapping = frame.swapping && (idx === frame.j || idx === frame.j + 1);
                    const isSorted = frame.sortedIndices.includes(idx);
                    
                    // Height proportion helper
                    const heightPercent = `${(val / 40) * 100}%`;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        {/* Bar */}
                        <div 
                          className={`w-5 rounded-t-md transition-all duration-300 border-t ${
                            isSwapping 
                              ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-500/15'
                              : isComparing 
                              ? 'bg-amber-500/10 border-amber-500'
                              : isSorted
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                              : 'bg-neutral-800 border-neutral-700'
                          }`}
                          style={{ height: heightPercent }}
                        />
                        {/* Value label */}
                        <span className={`text-[8.5px] font-mono font-bold ${
                          isSwapping ? 'text-red-400' : isComparing ? 'text-amber-400' : isSorted ? 'text-emerald-400' : 'text-neutral-400'
                        }`}>
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* DFS Graph Traversal Visual Rendering */}
            {selectedAlgo === 'dfs' && (() => {
              const frame = activeFrame as DFSFrame;
              
              // Helper status colors
              const getNodeBorder = (node: string) => {
                if (frame.currentNode === node) return '#818cf8'; // active: indigo
                if (frame.visited.includes(node)) return '#10b981'; // visited: green
                if (frame.stack.includes(node)) return '#f59e0b'; // in stack: yellow
                return '#3f3f46'; // default
              };

              const getNodeBg = (node: string) => {
                if (frame.currentNode === node) return 'rgba(129,140,248,0.15)';
                if (frame.visited.includes(node)) return 'rgba(16,185,129,0.1)';
                if (frame.stack.includes(node)) return 'rgba(245,158,11,0.05)';
                return 'rgba(24,24,27,0.8)';
              };

              const getNodeColor = (node: string) => {
                if (frame.currentNode === node) return '#818cf8';
                if (frame.visited.includes(node)) return '#10b981';
                if (frame.stack.includes(node)) return '#f59e0b';
                return '#71717a';
              };

              return (
                <div className="flex gap-4 items-center justify-between w-full select-none">
                  {/* SVG Graph diagram */}
                  <div className="w-[180px] h-[105px] relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 240 120">
                      {/* Graph Link lines */}
                      <line x1="40" y1="60" x2="120" y2="25" stroke={frame.visited.includes('B') ? '#10b981' : '#3f3f46'} strokeWidth="1.2" />
                      <line x1="40" y1="60" x2="120" y2="95" stroke={frame.visited.includes('C') ? '#10b981' : '#3f3f46'} strokeWidth="1.2" />
                      <line x1="120" y1="25" x2="200" y2="25" stroke={frame.visited.includes('D') ? '#10b981' : '#3f3f46'} strokeWidth="1.2" />
                      <line x1="120" y1="95" x2="200" y2="95" stroke={frame.visited.includes('E') ? '#10b981' : '#3f3f46'} strokeWidth="1.2" />

                      {/* Traversal bubble nodes */}
                      {/* Node A */}
                      <g transform="translate(25, 45)">
                        <circle cx="15" cy="15" r="14" fill={getNodeBg('A')} stroke={getNodeBorder('A')} strokeWidth="1.5" />
                        <text x="15" y="19" textAnchor="middle" fill={getNodeColor('A')} fontSize="10" fontWeight="bold">A</text>
                      </g>
                      {/* Node B */}
                      <g transform="translate(105, 10)">
                        <circle cx="15" cy="15" r="14" fill={getNodeBg('B')} stroke={getNodeBorder('B')} strokeWidth="1.5" />
                        <text x="15" y="19" textAnchor="middle" fill={getNodeColor('B')} fontSize="10" fontWeight="bold">B</text>
                      </g>
                      {/* Node C */}
                      <g transform="translate(105, 80)">
                        <circle cx="15" cy="15" r="14" fill={getNodeBg('C')} stroke={getNodeBorder('C')} strokeWidth="1.5" />
                        <text x="15" y="19" textAnchor="middle" fill={getNodeColor('C')} fontSize="10" fontWeight="bold">C</text>
                      </g>
                      {/* Node D */}
                      <g transform="translate(185, 10)">
                        <circle cx="15" cy="15" r="14" fill={getNodeBg('D')} stroke={getNodeBorder('D')} strokeWidth="1.5" />
                        <text x="15" y="19" textAnchor="middle" fill={getNodeColor('D')} fontSize="10" fontWeight="bold">D</text>
                      </g>
                      {/* Node E */}
                      <g transform="translate(185, 80)">
                        <circle cx="15" cy="15" r="14" fill={getNodeBg('E')} stroke={getNodeBorder('E')} strokeWidth="1.5" />
                        <text x="15" y="19" textAnchor="middle" fill={getNodeColor('E')} fontSize="10" fontWeight="bold">E</text>
                      </g>
                    </svg>
                  </div>

                  {/* Traversing visual call stack bar */}
                  <div className="w-[85px] border border-neutral-800 rounded-lg p-2 bg-neutral-900/60 flex flex-col justify-start h-[105px] overflow-hidden">
                    <span className="text-[7px] text-neutral-500 font-bold font-mono tracking-wider text-center block mb-1 border-b border-neutral-800 pb-0.5">CALL STACK</span>
                    <div className="flex-1 flex flex-col-reverse justify-start gap-1 items-stretch overflow-y-auto">
                      {frame.stack.map((item, idx) => (
                        <div key={idx} className="bg-amber-950/20 text-amber-500 border border-amber-900/40 text-[8.5px] font-bold text-center rounded py-0.5 font-mono select-none animate-pulse">
                          {item}
                        </div>
                      ))}
                      {frame.stack.length === 0 && (
                        <span className="text-[7.5px] text-neutral-600 italic text-center my-auto">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Bottom trace comment logs */}
          <div className="mt-2.5 pt-2 border-t border-neutral-900 flex items-start gap-1.5 select-none min-h-[38px]">
            <HelpCircle className="h-3.5 w-3.5 text-[#a5b4fc] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-[8px] font-mono tracking-wider text-neutral-500 uppercase block font-bold">Execution Logs</span>
              <p className="text-[9.5px] text-neutral-300 leading-normal font-mono">
                {activeFrame.status}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER STEP PERCENTAGE SLIDER */}
      <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-4 select-none">
        <span className="text-[8.5px] text-neutral-500 font-mono tracking-wide">
          Step {currentStep + 1} of {frames.length}
        </span>
        <div className="flex-1 h-1 bg-neutral-800 rounded-full relative overflow-hidden max-w-md">
          <div 
            className="h-full bg-indigo-500 transition-all duration-200" 
            style={{ width: `${((currentStep + 1) / frames.length) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
}
