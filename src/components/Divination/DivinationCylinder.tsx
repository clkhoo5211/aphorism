import React from 'react';
import { motion } from 'framer-motion';

interface DivinationCylinderProps {
  isShaking: boolean;
  onComplete?: () => void;
}

export const DivinationCylinder: React.FC<DivinationCylinderProps> = ({ isShaking, onComplete }) => {
  return (
    <div className="relative w-48 h-64 sm:w-64 sm:h-80 flex items-center justify-center">
      {/* Cylinder Container */}
      <motion.div
        className="relative w-24 h-48 sm:w-32 sm:h-64"
        animate={isShaking ? {
          rotate: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0],
          y: [0, -2, 2, -2, 2, -1, 1, 0]
        } : {}}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
        }}
        onAnimationComplete={onComplete}
      >
        {/* Cylinder Body - Wooden texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-2xl border-4 border-amber-900 shadow-2xl overflow-hidden">
          {/* Wood grain effect */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-1 bg-amber-950"
                style={{ left: `${i * 12.5}%` }}
              />
            ))}
          </div>

          {/* Decorative bands */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-yellow-600 to-amber-700 border-b-2 border-amber-900" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-yellow-600 to-amber-700 border-t-2 border-amber-900" />

          {/* Chinese characters */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-red-700 opacity-80 rotate-90 writing-mode-vertical">
              灵签
            </span>
          </div>
        </div>

        {/* Bamboo Sticks */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8"
          initial={{ y: 0, opacity: 0 }}
          animate={isShaking ? {
            y: [-8, -12, -8],
            opacity: [0.5, 1, 0.5]
          } : { y: 0, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: isShaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Multiple sticks peeking out */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-16 bg-gradient-to-b from-amber-200 to-amber-400 rounded-full border border-amber-600"
              style={{
                left: `${(i - 2) * 6}px`,
                transform: `rotate(${(i - 2) * 3}deg)`,
                zIndex: 5 - Math.abs(i - 2)
              }}
            />
          ))}
        </motion.div>

        {/* Glow effect when shaking */}
        {isShaking && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(251, 191, 36, 0.3)',
                '0 0 40px rgba(251, 191, 36, 0.6)',
                '0 0 20px rgba(251, 191, 36, 0.3)'
              ]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Particle effects */}
      {isShaking && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
              initial={{
                x: '50%',
                y: '50%',
                scale: 0
              }}
              animate={{
                x: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 100)}%`,
                y: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 100)}%`,
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
