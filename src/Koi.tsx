import React from 'react';
import { motion } from 'motion/react';

interface KoiProps {
  color?: string;
  size?: number;
}

export const Koi: React.FC<KoiProps> = ({ color = '#D94126', size = 120 }) => {
  return (
    <motion.div
      style={{
        width: size,
        height: size / 2,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
      }}
      animate={{
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Tail */}
        <motion.path
          d="M20 50 Q 0 30 0 50 Q 0 70 20 50"
          fill={color}
          animate={{
            d: [
              "M20 50 Q 0 30 0 50 Q 0 70 20 50",
              "M20 50 Q 0 45 0 65 Q 0 85 20 50",
              "M20 50 Q 0 15 0 35 Q 0 55 20 50",
              "M20 50 Q 0 30 0 50 Q 0 70 20 50",
            ]
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        {/* Body Shading Layer */}
        <path
          d="M20 50 C 40 20 120 20 180 50 C 120 80 40 80 20 50 Z"
          fill="url(#bodyGradient)"
        />
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" />
            <stop offset="50%" stopColor="#f8f8f8" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </linearGradient>
        </defs>
        {/* Body Outline */}
        <path
          d="M20 50 C 40 20 120 20 180 50 C 120 80 40 80 20 50 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.3"
        />
        {/* Patches (Kohaku) */}
        <path
          d="M60 35 Q 80 25 100 40 Q 80 55 60 45 Z"
          fill={color}
        />
        <path
          d="M130 45 Q 150 40 170 55 Q 150 70 130 60 Z"
          fill={color}
        />
        {/* Fins */}
        <motion.path
          d="M80 30 Q 70 10 90 25"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M80 70 Q 70 90 90 75"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Eyes */}
        <circle cx="170" cy="40" r="2" fill="#333" />
        <circle cx="170" cy="60" r="2" fill="#333" />
      </svg>
    </motion.div>
  );
};
