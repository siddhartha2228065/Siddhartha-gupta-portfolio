import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ThreeDCard({ children, className = '', id, onClick }: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values to keep track of cursor coordinates relative to card center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft elastic spring options for physically-accurate deceleration and inertia
  const springConfig = { damping: 25, stiffness: 180 };
  const getX = useSpring(x, springConfig);
  const getY = useSpring(y, springConfig);

  // Map normalized coordinates [-0.5, 0.5] to subtle rotations in degrees
  const rotateX = useTransform(getY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(getX, [-0.5, 0.5], [-12, 12]);

  // Map to soft responsive shadows and subtle high-frequency translateZ offsets
  const shadowX = useTransform(getX, [-0.5, 0.5], [-8, 8]);
  const shadowY = useTransform(getY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative offset of cursor within bounds
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates around zero center [-0.5, 0.5]
    const normX = mouseX / width - 0.5;
    const normY = mouseY / height - 0.5;

    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    // Smooth reset to neutral equilibrium
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`perspective-[1000px] transition-all duration-200 ease-out ${className}`}
      id={id}
    >
      {children}
    </motion.div>
  );
}
