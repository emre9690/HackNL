import { motion } from 'framer-motion';
import { Edit3, RotateCcw, User } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { UserPreferences, AIProfile, Screen, AppMode } from '../types';

interface ProfileProps {
  userPreferences: UserPreferences | null;
  aiProfile: AIProfile | null;
  onEditPreferences: () => void;
  onReset: () => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
}

const tagColors = [
  'bg-green-500/20 text-green-300',
  'bg-blue-500/20 text-blue-300',
  'bg-purple-500/20 text-purple-300',
  'bg-yellow-500/20 text-yellow-300',
  'bg-orange-500/20 text-orange-300',
  'bg-pink-500/20 text-pink-300',
];

export default function Profile({
  userPreferences,
  aiProfile,
  onEditPreferences,
  onReset,
  onNavigate,
  mode,
  currentScreen,
}: ProfileProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#0d0d12' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="px-5 pt-14 pb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.05) 100%)',
                border: '1px solid rgba(74,222,128,0.3)',
              }}
            >
              <User size={24} color="#4ade80" />
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Your profile</p>
              {aiProfile ? (
                <h1
                  className="font-bold text-lg leading-tight"
                  style={{ color: '#ffffff' }}
                >
                  {aiProfile.archetype}
                </h1>
              ) : (
                <h1 className="text-white font-bold text-lg">Resident</h1>
              )}
            </div>
          </div>

          {aiProfile && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.15)',
              }}
            >
              <p className="text-white/60 text-sm leading-relaxed">{aiProfile.summary}</p>
            </div>
          )}
        </div>

        <div className="px-5 flex flex-col gap-4">
          {/* Interests */}
          {userPreferences && userPreferences.interests.length > 0 && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                Your interests
              </p>
              <div className="flex flex-wrap gap-2">
                {userPreferences.interests.map((interest, i) => (
                  <span
                    key={interest}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${tagColors[i % tagColors.length]}`}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          {userPreferences && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                Preferences
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Vibe', value: userPreferences.vibe },
                  { label: 'Language', value: userPreferences.language },
                  { label: 'Age range', value: userPreferences.ageRange },
                  { label: 'Area', value: userPreferences.area },
                ].filter((p) => p.value).map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between">
                    <span className="text-white/35 text-sm">{pref.label}</span>
                    <span className="text-white/70 text-sm font-medium">{pref.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI tags */}
          {aiProfile && aiProfile.tags.length > 0 && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                Your tags
              </p>
              <div className="flex flex-wrap gap-2">
                {aiProfile.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(74,222,128,0.1)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      color: '#4ade80',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={onEditPreferences}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <Edit3 size={14} />
              Edit preferences
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171',
              }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
