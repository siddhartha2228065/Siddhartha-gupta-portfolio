import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Server, Cpu, Database, Zap, AlertTriangle, 
  CheckCircle2, RefreshCw, Sliders, Terminal as ShellIcon 
} from 'lucide-react';

interface TelemetryLog {
  timestamp: string;
  source: 'GATEWAY' | 'CACHE' | 'DATABASE' | 'AUTOSCALER';
  level: 'INFO' | 'WARN' | 'SUCCESS';
  message: string;
}

export default function TelemetryDashboard() {
  // Metric buffers (stores last 18 data points)
  const [latencyHistory, setLatencyHistory] = useState<number[]>([12, 15, 14, 11, 13, 16, 12, 14, 11, 15, 12, 13, 11, 14, 12]);
  const [cpuHistory, setCpuHistory] = useState<number[]>([22, 25, 24, 21, 28, 23, 22, 26, 21, 25, 23, 24, 22, 26, 23]);
  const [memHistory, setMemHistory] = useState<number[]>([45, 46, 45, 45, 46, 47, 46, 46, 47, 47, 48, 48, 48, 49, 49]);
  const [rpsHistory, setRpsHistory] = useState<number[]>([18, 22, 20, 24, 21, 19, 23, 25, 20, 22, 24, 21, 19, 23, 22]);
  const [hitRateHistory, setHitRateHistory] = useState<number[]>([94, 95, 94, 96, 95, 94, 95, 96, 95, 94, 96, 95, 94, 95, 95]);

  // Simulation parameters
  const [isTrafficSpike, setIsTrafficSpike] = useState(false);
  const [isCacheEvicted, setIsCacheEvicted] = useState(false);
  const [cacheEvictionTimer, setCacheEvictionTimer] = useState<number>(0);
  const [podCount, setPodCount] = useState(2);
  const [dashboardLogs, setDashboardLogs] = useState<TelemetryLog[]>([]);

  // Telemetry log output helper
  const addTelemetryLog = (source: TelemetryLog['source'], level: TelemetryLog['level'], message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setDashboardLogs(prev => [{ timestamp, source, level, message }, ...prev.slice(0, 24)]);
  };

  // Seeding initial logs
  useEffect(() => {
    addTelemetryLog('GATEWAY', 'INFO', 'Vanguard API routing pod initialized.');
    addTelemetryLog('CACHE', 'SUCCESS', 'Redis cache pool connected: 5 active connections.');
    addTelemetryLog('DATABASE', 'SUCCESS', 'MongoDB replica set online (Primary/Secondary/Arbiter).');
    addTelemetryLog('AUTOSCALER', 'INFO', 'Autoscaler group monitoring active. Current desired state: 2 instances.');
  }, []);

  // Cache Eviction Recovery Loop
  useEffect(() => {
    if (isCacheEvicted) {
      const timer = setInterval(() => {
        setCacheEvictionTimer(prev => {
          if (prev >= 100) {
            setIsCacheEvicted(false);
            addTelemetryLog('CACHE', 'SUCCESS', 'Cache state fully hydrated. Hit rate stabilized.');
            clearInterval(timer);
            return 0;
          }
          return prev + 12; // recover hit rate step
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCacheEvicted]);

  // Autoscaler Response to Traffic Spike
  useEffect(() => {
    if (isTrafficSpike) {
      addTelemetryLog('AUTOSCALER', 'WARN', 'RPS threshold breached (>300 RPS). Initiating horizontal pod scale-up...');
      const timer = setTimeout(() => {
        setPodCount(5);
        addTelemetryLog('AUTOSCALER', 'SUCCESS', 'Provisioned 3 additional gateway pods. Cluster topology updated: 5 active pods.');
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      if (podCount > 2) {
        addTelemetryLog('AUTOSCALER', 'INFO', 'Load normalized. Cooling down gateway pods back to baseline...');
        const timer = setTimeout(() => {
          setPodCount(2);
          addTelemetryLog('AUTOSCALER', 'INFO', 'Terminated inactive instances. Desired topology: 2 active pods.');
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isTrafficSpike]);

  // Primary Telemetry Loop (ticks every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate current tick metrics based on simulation state
      let currentRps = Math.floor(Math.random() * 8) + 18; // base RPS: 18 - 25
      let currentCpu = Math.floor(Math.random() * 6) + 20; // base CPU: 20 - 25%
      let currentMem = Math.floor(Math.random() * 2) + 48; // base MEM: 48 - 49%
      let currentLatency = Math.floor(Math.random() * 4) + 11; // base Latency: 11 - 15ms
      let currentHitRate = Math.floor(Math.random() * 3) + 94; // base hit rate: 94 - 96%

      // Traffic Spike overrides
      if (isTrafficSpike) {
        currentRps = Math.floor(Math.random() * 60) + 380; // spike RPS: 380 - 440
        // CPU spikes, but starts cooling down slightly once scaled up to 5 pods
        const cpuBase = podCount === 5 ? 55 : 85;
        currentCpu = Math.floor(Math.random() * 10) + cpuBase;
        currentMem = Math.floor(Math.random() * 3) + 76; // memory footprint increases
        
        // Latency spikes first, then drops as extra instances take load
        const latencyBase = podCount === 5 ? 22 : 95;
        currentLatency = Math.floor(Math.random() * 15) + latencyBase;
      }

      // Cache Eviction overrides
      if (isCacheEvicted) {
        // Recovery progression
        const recoveryProgress = cacheEvictionTimer / 100; // 0 to 1
        currentHitRate = Math.floor(15 + recoveryProgress * 75 + Math.random() * 4);
        
        // Eviction causes cache misses -> database overhead -> higher latency
        const databaseOverhead = Math.floor((1 - recoveryProgress) * 90);
        currentLatency += databaseOverhead;

        if (Math.random() > 0.6) {
          addTelemetryLog('DATABASE', 'WARN', `Cache eviction miss. Forwarding query workload to DB: +${databaseOverhead}ms latency overhead.`);
        }
      }

      // Update history arrays
      setRpsHistory(prev => [...prev.slice(1), currentRps]);
      setCpuHistory(prev => [...prev.slice(1), currentCpu]);
      setMemHistory(prev => [...prev.slice(1), currentMem]);
      setLatencyHistory(prev => [...prev.slice(1), currentLatency]);
      setHitRateHistory(prev => [...prev.slice(1), currentHitRate]);

      // Emit periodic logs to show activity
      if (!isTrafficSpike && !isCacheEvicted && Math.random() > 0.7) {
        const routes = ['/api/v1/projects', '/api/v1/inquiry', '/api/v1/skills', '/api/v1/ai-twin/ask'];
        const randomRoute = routes[Math.floor(Math.random() * routes.length)];
        addTelemetryLog('GATEWAY', 'INFO', `Incoming request: GET ${randomRoute} - status: 200 OK (${currentLatency}ms)`);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isTrafficSpike, isCacheEvicted, cacheEvictionTimer, podCount]);

  // Helper to construct SVG paths for charts
  const getSvgPathData = (data: number[], width: number, height: number, min: number = 0, max?: number) => {
    if (data.length === 0) return { line: '', area: '' };
    const maxVal = max ?? Math.max(...data, 1);
    const minVal = min;
    const valueRange = maxVal - minVal || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      // invert Y coordinates for SVG space
      const y = height - ((val - minVal) / valueRange) * (height - 12) - 6;
      return { x, y };
    });

    const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return { line: linePath, area: areaPath };
  };

  const chartW = 340;
  const chartH = 90;

  // Render metrics charts
  const latencyPaths = getSvgPathData(latencyHistory, chartW, chartH, 0, isTrafficSpike || isCacheEvicted ? 150 : 30);
  const rpsPaths = getSvgPathData(rpsHistory, chartW, chartH, 0, isTrafficSpike ? 500 : 50);
  const cpuPaths = getSvgPathData(cpuHistory, chartW, chartH, 0, 100);
  const memPaths = getSvgPathData(memHistory, chartW, chartH, 0, 100);
  const hitRatePaths = getSvgPathData(hitRateHistory, chartW, chartH, 0, 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1 text-left select-none font-sans">
      
      {/* LEFT COLUMN: LIVE CHARTS GRID */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Latency Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden h-[155px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-neutral-450 uppercase block">API Response Latency</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                {latencyHistory[latencyHistory.length - 1]}ms
              </span>
            </div>
            <Activity className="h-4 w-4 text-cyan-400/80" />
          </div>
          {/* SVG line chart */}
          <div className="w-full h-[90px] mt-2 relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1={chartH/2} x2={chartW} y2={chartH/2} stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1={chartH - 2} x2={chartW} y2={chartH - 2} stroke="#3f3f46" strokeWidth="0.5" />
              {/* Chart Paths */}
              <path d={latencyPaths.area} fill="url(#latencyGradient)" />
              <path d={latencyPaths.line} fill="none" stroke="#22d3ee" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Throughput (RPS) Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden h-[155px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-neutral-450 uppercase block">Request Throughput</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                {rpsHistory[rpsHistory.length - 1]} RPS
              </span>
            </div>
            <Zap className="h-4 w-4 text-amber-400/80" />
          </div>
          {/* SVG line chart */}
          <div className="w-full h-[90px] mt-2 relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="rpsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1={chartH/2} x2={chartW} y2={chartH/2} stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1={chartH - 2} x2={chartW} y2={chartH - 2} stroke="#3f3f46" strokeWidth="0.5" />
              {/* Chart Paths */}
              <path d={rpsPaths.area} fill="url(#rpsGradient)" />
              <path d={rpsPaths.line} fill="none" stroke="#fbbf24" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* CPU & Memory Utilization Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden h-[155px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-neutral-450 uppercase block">Host CPU / Memory load</span>
              <div className="flex gap-4 mt-1">
                <span className="text-sm font-bold font-mono text-violet-400">
                  CPU: {cpuHistory[cpuHistory.length - 1]}%
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  RAM: {memHistory[memHistory.length - 1]}%
                </span>
              </div>
            </div>
            <Cpu className="h-4 w-4 text-violet-400/80" />
          </div>
          {/* SVG line charts overlaid */}
          <div className="w-full h-[90px] mt-2 relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1={chartH/2} x2={chartW} y2={chartH/2} stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1={chartH - 2} x2={chartW} y2={chartH - 2} stroke="#3f3f46" strokeWidth="0.5" />
              {/* Memory line */}
              <path d={memPaths.line} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
              {/* CPU Line */}
              <path d={cpuPaths.line} fill="none" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Redis Cache Hit Rate Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden h-[155px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-neutral-450 uppercase block">Redis Cache Hit Rate</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                {hitRateHistory[hitRateHistory.length - 1]}%
              </span>
            </div>
            <Database className="h-4 w-4 text-emerald-400/80" />
          </div>
          {/* SVG line chart */}
          <div className="w-full h-[90px] mt-2 relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="hitRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Target Line (representing baseline SLA 95% target) */}
              <line x1="0" y1={chartH * 0.1} x2={chartW} y2={chartH * 0.1} stroke="#10b981" strokeWidth="0.75" strokeDasharray="4,4" opacity="0.4" />
              {/* Grid Lines */}
              <line x1="0" y1={chartH/2} x2={chartW} y2={chartH/2} stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1={chartH - 2} x2={chartW} y2={chartH - 2} stroke="#3f3f46" strokeWidth="0.5" />
              {/* Chart Paths */}
              <path d={hitRatePaths.area} fill="url(#hitRateGradient)" />
              <path d={hitRatePaths.line} fill="none" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: INFRASTRUCTURE CONTROL & STATUS MAP */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        
        {/* Chaos Engineering Simulation Controls */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2.5">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">Telemetry Controls</h4>
          </div>
          
          <div className="space-y-4">
            {/* Spike Switch */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-300 block">Trigger Traffic Spike</span>
                <span className="text-[9px] text-neutral-500 block leading-tight">Simulates high load of 400+ concurrent requests/sec</span>
              </div>
              <button
                onClick={() => {
                  setIsTrafficSpike(!isTrafficSpike);
                  addTelemetryLog('GATEWAY', 'WARN', isTrafficSpike ? 'Traffic load normalized manually.' : 'Simulating traffic load surge event.');
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer outline-none ${
                  isTrafficSpike ? 'bg-indigo-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isTrafficSpike ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Eviction Button */}
            <div className="flex items-center justify-between border-t border-neutral-800/60 pt-3">
              <div>
                <span className="text-xs font-bold text-neutral-300 block">Evict Redis Cache</span>
                <span className="text-[9px] text-neutral-500 block leading-tight">Purges cache, forcing query roundtrips to Database</span>
              </div>
              <button
                onClick={() => {
                  setIsCacheEvicted(true);
                  setCacheEvictionTimer(0);
                  addTelemetryLog('CACHE', 'WARN', 'Evicting memory pools. Flushing L1 Redis database keys.');
                }}
                disabled={isCacheEvicted}
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono tracking-wider uppercase border border-neutral-750 hover:bg-neutral-800 disabled:opacity-50 text-neutral-300 transition-all cursor-pointer"
              >
                Flush
              </button>
            </div>
          </div>
        </div>

        {/* Service Deployment Node Topology */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3.5">
          <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Topology Network Map</span>
          
          {/* Topology SVG Network Diagram */}
          <div className="w-full h-[120px] bg-neutral-950/60 border border-neutral-850 rounded-xl relative overflow-hidden flex items-center justify-center p-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 120">
              {/* Paths */}
              {/* Path 1: Client -> Gateway */}
              <path id="pathClientGateway" d="M 25,60 L 95,60" stroke="#3f3f46" strokeWidth="1.5" />
              {/* Path 2: Gateway -> Cache */}
              <path id="pathGatewayCache" d="M 125,45 L 185,25" stroke="#3f3f46" strokeWidth="1.5" />
              {/* Path 3: Gateway -> DB */}
              <path id="pathGatewayDb" d="M 125,75 L 185,95" stroke="#3f3f46" strokeWidth="1.5" />
              {/* Path 4: Cache -> DB */}
              <path id="pathCacheDb" d="M 205,45 L 205,75" stroke="#3f3f46" strokeWidth="1.5" />

              {/* Animated Request Dot Packets */}
              <circle r="2" fill={isTrafficSpike ? "#f59e0b" : "#67e8f9"}>
                <animateMotion dur={isTrafficSpike ? "0.4s" : "1.8s"} repeatCount="indefinite" path="M 25,60 L 95,60" />
              </circle>
              
              <circle r="1.5" fill="#10b981">
                <animateMotion dur={isTrafficSpike ? "0.6s" : "2.2s"} repeatCount="indefinite" path="M 125,45 L 185,25" />
              </circle>

              {!isCacheEvicted ? (
                <circle r="1.5" fill="#10b981">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 205,45 L 205,75" />
                </circle>
              ) : (
                <circle r="1.5" fill="#f43f5e">
                  <animateMotion dur="0.9s" repeatCount="indefinite" path="M 125,75 L 185,95" />
                </circle>
              )}

              {/* Node Icons and Label Overlays */}
              {/* Client */}
              <g transform="translate(10, 48)">
                <rect width="24" height="24" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
                <text x="12" y="15" textAnchor="middle" fill="#71717a" fontSize="8" fontWeight="bold">CLI</text>
              </g>
              
              {/* API Gateway */}
              <g transform="translate(95, 48)">
                <rect width="32" height="24" rx="6" fill="#1e1b4b" stroke={isTrafficSpike ? "#f59e0b" : "#4f46e5"} strokeWidth="1.5" />
                <text x="16" y="15" textAnchor="middle" fill="#e0e7ff" fontSize="8" fontWeight="bold">GTW</text>
                {/* Pod count label */}
                <text x="16" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontFamily="monospace">x{podCount}</text>
              </g>

              {/* Redis Cache */}
              <g transform="translate(185, 12)">
                <rect width="40" height="24" rx="6" fill="#022c22" stroke={isCacheEvicted ? "#f43f5e" : "#10b981"} strokeWidth="1.5" />
                <text x="20" y="15" textAnchor="middle" fill="#d1fae5" fontSize="8" fontWeight="bold">Redis</text>
              </g>

              {/* DB (MongoDB) */}
              <g transform="translate(185, 84)">
                <rect width="40" height="24" rx="6" fill="#1c1917" stroke="#78716c" strokeWidth="1.2" />
                <text x="20" y="15" textAnchor="middle" fill="#f5f5f4" fontSize="8" fontWeight="bold">Mongo</text>
              </g>
            </svg>
          </div>

          {/* Infrastructure Health Status Badges */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center bg-neutral-950/40 p-2 rounded-xl border border-neutral-850">
              <span className="text-neutral-400">gateway-rest-api</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                isTrafficSpike && podCount < 5 
                  ? 'bg-amber-950/30 text-amber-500 border border-amber-900/40 animate-pulse'
                  : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/40'
              }`}>
                {isTrafficSpike && podCount < 5 ? 'SCALING' : 'ONLINE'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-neutral-950/40 p-2 rounded-xl border border-neutral-850">
              <span className="text-neutral-400">redis-cache-cluster</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                isCacheEvicted 
                  ? 'bg-amber-950/30 text-amber-500 border border-amber-900/40 animate-pulse'
                  : 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/40'
              }`}>
                {isCacheEvicted ? 'REPOPULATING' : 'ONLINE'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-neutral-950/40 p-2 rounded-xl border border-neutral-850">
              <span className="text-neutral-400">mongodb-shard-0</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-500 border border-emerald-900/40 text-[8px] font-bold">
                ONLINE
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* FULL WIDTH BOTTOM SHELL LOGS WORKSPACE */}
      <div className="lg:col-span-12 bg-neutral-950 border border-neutral-850 rounded-2xl p-4 font-mono text-[10px] text-neutral-450 h-[170px] overflow-hidden flex flex-col justify-between shadow-inner">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <ShellIcon className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-bold text-neutral-350 uppercase tracking-wider">Live DevOps Shell Streams</span>
          </div>
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        
        {/* Logs content */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 font-mono text-[9px] text-left leading-relaxed">
          {dashboardLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <span className="text-neutral-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[7.5px] tracking-wide shrink-0 ${
                log.source === 'GATEWAY' ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/40' :
                log.source === 'CACHE' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' :
                log.source === 'DATABASE' ? 'bg-amber-950/30 text-amber-500 border border-amber-900/40' :
                'bg-violet-950/30 text-violet-400 border border-violet-900/40'
              }`}>
                {log.source}
              </span>
              <span className={`flex-1 ${
                log.level === 'WARN' ? 'text-amber-400 font-medium' :
                log.level === 'SUCCESS' ? 'text-emerald-400' :
                'text-neutral-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
