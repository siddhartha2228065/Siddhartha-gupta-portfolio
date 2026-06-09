import React, { useRef, useEffect, useState } from 'react';

interface TechNode {
  x: number;
  y: number;
  z: number;
  label: string;
  color: string;
  importance: number; // For scaling dot sizes and line weights
}

const TECH_ITEMS = [
  { label: 'React.js', color: '#38bdf8', imp: 1 },
  { label: 'Node.js', color: '#22c55e', imp: 1 },
  { label: 'TypeScript', color: '#3b82f6', imp: 1 },
  { label: 'Express.js', color: '#a3a3a3', imp: 0.8 },
  { label: 'MongoDB', color: '#10b981', imp: 0.9 },
  { label: 'SQL', color: '#f59e0b', imp: 0.8 },
  { label: 'MySQL', color: '#0284c7', imp: 0.7 },
  { label: 'AWS Simple S3', color: '#ff9900', imp: 0.75 },
  { label: 'REST APIs', color: '#f43f5e', imp: 0.85 },
  { label: 'Tailwind CSS', color: '#06b6d4', imp: 0.9 },
  { label: 'Framer Motion', color: '#ec4899', imp: 0.8 },
  { label: 'Vite', color: '#8b5cf6', imp: 0.8 },
  { label: 'Git / GitHub', color: '#ef4444', imp: 0.7 },
];

export default function Interactive3DSphere({ darkMode = true }: { darkMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Normalized speed offsets based on automatic spin + mouse gravity
  const [speedX, setSpeedX] = useState(0.002);
  const [speedY, setSpeedY] = useState(0.002);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    // Distribute nodes roughly equidistant on a sphere bounding-box
    // Fibonacci sphere algorithm to distribute items evenly over an orbital sphere shells
    const radius = 110;
    const count = TECH_ITEMS.length;
    const nodes: TechNode[] = TECH_ITEMS.map((item, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        label: item.label,
        color: item.color,
        importance: item.imp,
      };
    });

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      width = rect?.width || 300;
      height = rect?.height || 300;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Track active interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Map to positive/negative values relative to central core
      const normX = (clientX / width) - 0.5;
      const normY = (clientY / height) - 0.5;

      mouseRef.current = { x: normX, y: normY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Spherical Matrix Rotations
    const rotateX = (node: TechNode, angle: number) => {
      const cosVal = Math.cos(angle);
      const sinVal = Math.sin(angle);
      const y1 = node.y * cosVal - node.z * sinVal;
      const z1 = node.z * cosVal + node.y * sinVal;
      node.y = y1;
      node.z = z1;
    };

    const rotateY = (node: TechNode, angle: number) => {
      const cosVal = Math.cos(angle);
      const sinVal = Math.sin(angle);
      const x1 = node.x * cosVal + node.z * sinVal;
      const z1 = node.z * cosVal - node.x * sinVal;
      node.x = x1;
      node.z = z1;
    };

    // Performance drawing frame loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine rotation speeds based on mouse target coordinates
      let sx = 0.003;
      let sy = 0.003;

      if (mouseRef.current.active) {
        // Bend orbit towards mouse vectors
        sx = mouseRef.current.y * 0.04;
        sy = -mouseRef.current.x * 0.04;
      }

      // Perform matrix rotations for overall node sets
      nodes.forEach(node => {
        rotateX(node, sx);
        rotateY(node, sy);
      });

      // Projection parameters
      const fov = 350; // Field of view depth scale
      const cx = width / 2;
      const cy = height / 2;

      // Sort nodes based on updated depth (Z-index) to render background components behind foreground components correctly!
      const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);

      // Connect proximal nodes to draw clean network constellation maps
      ctx.lineCap = 'round';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < sortedNodes.length; i++) {
        const nodeA = sortedNodes[i];
        const scaleA = fov / (fov + nodeA.z);
        const xA = cx + nodeA.x * scaleA;
        const yA = cy + nodeA.y * scaleA;

        for (let j = i + 1; j < sortedNodes.length; j++) {
          const nodeB = sortedNodes[j];
          const distSq = Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2) + Math.pow(nodeA.z - nodeB.z, 2);
          
          if (distSq < Math.pow(radius * 1.5, 2)) {
            const scaleB = fov / (fov + nodeB.z);
            const xB = cx + nodeB.x * scaleB;
            const yB = cy + nodeB.y * scaleB;

            // Translucent relative lines colored softly between points, scaling visual weight with closer depth coordinates
            const averageZ = (nodeA.z + nodeB.z) / 2;
            const opacity = Math.max(0.02, Math.min(0.28, (radius * 1.5 - Math.sqrt(distSq)) / (radius * 3.5))) * (averageZ < 0 ? 1 : 0.4);
            
            ctx.strokeStyle = darkMode 
              ? `rgba(255, 255, 255, ${opacity})` 
              : `rgba(0, 0, 0, ${opacity})`;
            
            ctx.beginPath();
            ctx.moveTo(xA, yA);
            ctx.lineTo(xB, yB);
            ctx.stroke();
          }
        }
      }

      // Draw Labels & Core Spherical Vertices
      sortedNodes.forEach(node => {
        // Perspective multiplier scaling size and clarity relative to distance
        const scale = fov / (fov + node.z);
        const screenX = cx + node.x * scale;
        const screenY = cy + node.y * scale;

        // Visual properties based on depth coordinate node.z
        // Closer nodes are larger, sharper, and solid; background nodes are faint and small
        const isForeground = node.z < 0; 
        const opacity = Math.max(0.18, Math.min(1, (radius + 20 - node.z) / (radius * 2)));
        
        // Node dot glow indicator
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(1.5, 4 * scale * node.importance), 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Label details text formatting
        ctx.font = `bold ${Math.max(8.5, Math.min(13, 11 * scale))}px JetBrains Mono, Inter, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Base label text
        ctx.fillStyle = darkMode 
          ? `rgba(245, 245, 245, ${opacity})` 
          : `rgba(38, 38, 38, ${opacity})`;
        
        // Offset simple label text vertically to clear dot
        ctx.fillText(node.label, screenX, screenY + 12);
        ctx.globalAlpha = 1; // restore defaults
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [darkMode]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center">
      <canvas ref={canvasRef} className="block select-none" />
      {/* 3D Core indicator decal */}
      <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none select-none">
        <span className="text-[9px] font-mono tracking-widest text-neutral-450 dark:text-zinc-550 uppercase">
          ✦ Click & Drag to Rotate Stack Mesh ✦
        </span>
      </div>
    </div>
  );
}
