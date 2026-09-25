'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastPosRef = useRef({ x: -100, y: -100 });

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring physics for outer ring
  const ringSpringConfig = { damping: 24, stiffness: 320, mass: 0.35 };
  const smoothRingX = useSpring(mouseX, ringSpringConfig);
  const smoothRingY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    // Only activate on pointer devices that support hover (desktops/laptops with mouse/trackpad)
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    setMounted(true);
    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Create occasional subtle trail sparkles when moving
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 24) {
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 3 + 2,
          opacity: 0.5,
        };

        setParticles((prev) => [...prev.slice(-5), newParticle]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Track hover over interactive elements and custom cursor text
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor-text]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor-text') || '');
        setIsHovered(true);
        return;
      } else {
        setCursorText('');
      }

      const isInteractive = target.closest(
        'a, button, input, select, textarea, [role="button"], .interactive, .cursor-pointer'
      );

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Particle cleanup interval
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.08, size: p.size * 0.9 }))
          .filter((p) => p.opacity > 0.05)
      );
    }, 50);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearInterval(interval);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Trailing Subtle Sparkles (Crisp vector points, no blur) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed top-0 left-0 rounded-full bg-amber-400 pointer-events-none"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            transition: 'opacity 0.1s linear, transform 0.1s linear',
          }}
        />
      ))}

      {/* 2. Outer Kinetic Ring (CRISP, SHARP, ZERO BLUR - Completely clear view through cursor) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none"
        style={{
          x: smoothRingX,
          y: smoothRingY,
          translateX: '-50%',
          translateY: '-50%',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          filter: 'none',
        }}
        animate={{
          width: cursorText ? 80 : isHovered ? 52 : isClicking ? 26 : 34,
          height: cursorText ? 80 : isHovered ? 52 : isClicking ? 26 : 34,
          borderColor: isHovered
            ? '#f59e0b'
            : 'rgba(255, 255, 255, 0.35)',
          borderWidth: isHovered ? '1.5px' : '1px',
          backgroundColor: cursorText ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 320, mass: 0.35 }}
      >
        {cursorText && (
          <span className="text-[10px] font-extrabold text-amber-300 font-mono tracking-wider uppercase select-none">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* 3. Click Shockwave Ring (Clean crisp border, zero blur) */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 rounded-full border border-amber-400 pointer-events-none"
          initial={{ scale: 0.6, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            width: 34,
            height: 34,
          }}
        />
      )}

      {/* 4. Center Laser-Sharp Indicator Dot (Zero lag, zero blur, pixel-perfect accuracy) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 7 : 5,
          height: isHovered ? 7 : 5,
          scale: isClicking ? 0.75 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-full h-full rounded-full bg-amber-400 flex items-center justify-center shadow-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-95" />
        </div>
      </motion.div>
    </div>
  );
}
