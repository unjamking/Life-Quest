import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Confetto: React.FC<{ initialX: number; initialY: number; color: string }> = ({ initialX, initialY, color }) => {
  const duration = useMemo(() => Math.random() * 4 + 5, []); // 5-9 seconds
  const finalX = useMemo(() => initialX + (Math.random() - 0.5) * 400, [initialX]);
  const rotate = useMemo(() => Math.random() * 360, []);

  return (
    <motion.div
      style={{
        backgroundColor: color,
        width: '8px',
        height: '8px',
        borderRadius: '4px',
        position: 'absolute',
        left: `${initialX}vw`,
        top: `${initialY}vh`,
      }}
      animate={{
        y: '110vh',
        x: finalX,
        rotate: rotate + Math.random() * 360,
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    />
  );
};

const Confetti: React.FC = () => {
  const colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#f59e0b', '#fbbf24'];
  const numConfetti = 50;

  const confetti = useMemo(() => {
    return Array.from({ length: numConfetti }).map((_, i) => {
      const initialX = Math.random() * 100;
      const initialY = -10 - Math.random() * 20; // Start off-screen
      const color = colors[i % colors.length];
      return <Confetto key={i} initialX={initialX} initialY={initialY} color={color} />;
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {confetti}
    </div>
  );
};

export default Confetti;
