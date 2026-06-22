'use client';
// ============================================
// AirplaneAnimation — Flying Airplane SVG
// ============================================
import { motion } from 'framer-motion';

export default function AirplaneAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      <motion.div
        className="absolute"
        initial={{ x: '-150px', y: '40vh', rotate: -8 }}
        animate={{
          x: ['calc(-150px)', 'calc(50vw - 30px)', 'calc(100vw + 150px)'],
          y: ['40vh', '25vh', '15vh'],
          rotate: [-8, -3, -6],
        }}
        transition={{
          duration: 14,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 4,
        }}
      >
        {/* Airplane SVG */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path
            d="M58 28L40 24L28 4H22L28 24H12L8 18H4L8 28L4 38H8L12 32H28L22 52H28L40 32L58 28Z"
            fill="white"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Trail effect */}
          <line
            x1="4"
            y1="28"
            x2="-40"
            y2="28"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="4 6"
          />
        </svg>
        {/* Contrail */}
        <motion.div
          className="absolute top-1/2 right-full w-[120px] h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))',
            transform: 'translateY(-50%)',
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Second smaller airplane */}
      <motion.div
        className="absolute"
        initial={{ x: 'calc(100vw + 100px)', y: '60vh', rotate: 5 }}
        animate={{
          x: ['calc(100vw + 100px)', 'calc(50vw)', 'calc(-200px)'],
          y: ['60vh', '50vh', '45vh'],
          rotate: [5, 2, 4],
        }}
        transition={{
          duration: 20,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 8,
          delay: 6,
        }}
      >
        <svg
          width="35"
          height="35"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: 'scaleX(-1)' }}
          className="opacity-40"
        >
          <path
            d="M58 28L40 24L28 4H22L28 24H12L8 18H4L8 28L4 38H8L12 32H28L22 52H28L40 32L58 28Z"
            fill="white"
            stroke="#bae6fd"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
