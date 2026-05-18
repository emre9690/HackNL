import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EventRoutine } from '../types';

interface ArrivalBadgeProps {
  event: EventRoutine | null;
  onBack: () => void;
}

export default function ArrivalBadge({ event, onBack }: ArrivalBadgeProps) {
  const codeWord = event?.codeWord || 'LANTERN';
  const eventTitle = event?.title || 'Your Event';

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#0d1a12' }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-14 left-4 z-10 flex items-center gap-1 text-white/60 text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Pulsing glow rings */}
      <div className="relative flex items-center justify-center mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 160 + i * 50,
              height: 160 + i * 50,
              border: `1px solid rgba(74,222,128,${0.3 - i * 0.08})`,
              background: `rgba(74,222,128,${0.02 - i * 0.005})`,
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Center circle */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            width: 140,
            height: 140,
            background: 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.05) 100%)',
            border: '2px solid rgba(74,222,128,0.5)',
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span style={{ fontSize: 48 }}>📍</span>
        </motion.div>
      </div>

      {/* "I'm here" text */}
      <motion.div
        className="text-center px-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-white/60 text-sm font-medium mb-2 tracking-wider uppercase">
          I'm here with
        </p>
        <h1
          className="font-bold mb-4"
          style={{ fontSize: 36, color: '#4ade80', letterSpacing: -1 }}
        >
          StadSpas
        </h1>

        <div
          className="rounded-2xl px-8 py-5 mb-4 mx-auto"
          style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.3)',
          }}
        >
          <p className="text-white/40 text-xs mb-1 tracking-widest uppercase">Code word</p>
          <p
            className="font-black tracking-widest"
            style={{ fontSize: 38, color: '#ffffff', letterSpacing: 6 }}
          >
            {codeWord}
          </p>
        </div>

        <p className="text-white/40 text-xs mb-1">{eventTitle}</p>
        <p className="text-white/30 text-xs max-w-[240px] mx-auto leading-relaxed">
          Show this if finding the group feels awkward.
        </p>
      </motion.div>
    </div>
  );
}
