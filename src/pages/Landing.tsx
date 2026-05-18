import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Screen } from '../types';

interface LandingProps {
  onNavigate: (screen: Screen) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8 select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFF8F0 0%, #F7F3EE 60%, #EEF2FF 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background shape blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(232,101,26,0.12) 0%, transparent 70%)',
          top: '-60px', left: '50%', transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 240, height: 240,
          background: 'radial-gradient(circle, rgba(26,82,168,0.07) 0%, transparent 70%)',
          bottom: '80px', right: '-40px',
        }}
      />

      {/* Logo */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #E8651A, #FF8C42)',
              boxShadow: '0 8px 24px rgba(232,101,26,0.35)',
            }}
          >
            <MapPin size={22} color="white" />
          </div>
        </motion.div>

        <h1
          className="font-black tracking-tight mb-1"
          style={{ fontSize: 44, color: '#1A1A2E', letterSpacing: -2 }}
        >
          Stad<span style={{ color: '#E8651A' }}>Kompas</span>
        </h1>

        <p className="font-bold text-base mb-1" style={{ color: '#1A52A8' }}>
          Discover the city, discover the people.
        </p>

        <p className="text-sm" style={{ color: '#6B7280' }}>
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
        {[
          { label: 'Board games', color: '#1A52A8', bg: '#EBF0FB' },
          { label: 'Study tables', color: '#D97706', bg: '#FEF3C7' },
          { label: 'Outdoor walks', color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Bouldering', color: '#DC2626', bg: '#FEF2F2' },
          { label: 'Sketch cafés', color: '#E8651A', bg: '#FFF0E8' },
        ].map((item) => (
          <span
            key={item.label}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: item.bg, color: item.color }}
          >
            {item.label}
          </span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={() => onNavigate('onboarding')}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm w-full max-w-[280px] justify-center"
        style={{
          background: 'linear-gradient(135deg, #E8651A, #FF8C42)',
          color: 'white',
          boxShadow: '0 8px 28px rgba(232,101,26,0.4)',
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
        style={{ color: '#9CA3AF' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Rotterdam · Free · No account needed
      </motion.p>
    </motion.div>
  );
}
