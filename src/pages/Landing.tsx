import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Screen } from '../types';

interface LandingProps {
  onNavigate: (screen: Screen) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8 select-none"
      style={{ background: 'linear-gradient(160deg, #0d1a12 0%, #0d0d12 60%, #0a0a0f 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo area */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}
          >
            <MapPin size={20} color="#4ade80" />
          </div>
        </div>

        <h1
          className="font-black tracking-tight mb-1"
          style={{ fontSize: 42, color: '#ffffff', letterSpacing: -2 }}
        >
          Stad
          <span style={{ color: '#4ade80' }}>Spas</span>
        </h1>

        <p className="font-semibold text-lg mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Discover Rotterdam.
        </p>

        <p className="text-sm leading-relaxed max-w-[220px] mx-auto" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Things worth showing up for.
        </p>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {['Board games', 'Study tables', 'Outdoor walks', 'Sketch cafés', 'Bouldering'].map(
          (item) => (
            <span
              key={item}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {item}
            </span>
          )
        )}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        onClick={() => onNavigate('onboarding')}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm w-full max-w-[280px] justify-center"
        style={{
          background: '#4ade80',
          color: '#0a0a0f',
          boxShadow: '0 0 30px rgba(74,222,128,0.3)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
      >
        Find my spaces
        <ArrowRight size={16} />
      </motion.button>

      <motion.p
        className="mt-4 text-[11px]"
        style={{ color: 'rgba(255,255,255,0.2)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Rotterdam · Free · No account needed
      </motion.p>
    </motion.div>
  );
}
