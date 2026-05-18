import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, RotateCcw, User, Link2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { UserPreferences, AIProfile, Screen, AppMode, Connection } from '../types';

interface ProfileProps {
  userPreferences: UserPreferences | null;
  aiProfile: AIProfile | null;
  onEditPreferences: () => void;
  onReset: () => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
  connections: Connection[];
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
  connections,
}: ProfileProps) {
  const [tab, setTab] = useState<'overview' | 'connections'>('overview');

  const displayName =
    userPreferences?.firstName
      ? `${userPreferences.firstName}${userPreferences.lastName ? ' ' + userPreferences.lastName : ''}`
      : 'My Profile';

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
        <div className="px-5 pt-14 pb-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.05) 100%)',
                border: '1px solid rgba(74,222,128,0.3)',
              }}
            >
              <User size={24} color="#4ade80" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white leading-tight">{displayName}</h1>
              {userPreferences?.area && (
                <p className="text-white/40 text-sm">{userPreferences.area}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mb-4 flex gap-2">
          {(['overview', 'connections'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize"
              style={{
                background: tab === t ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${tab === t ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: tab === t ? '#4ade80' : 'rgba(255,255,255,0.45)',
              }}
            >
              {t === 'connections' && <Link2 size={12} />}
              {t === 'connections' ? `Connections${connections.length > 0 ? ` · ${connections.length}` : ''}` : 'Overview'}
            </button>
          ))}
        </div>

        <div className="px-5 flex flex-col gap-4">
          {tab === 'overview' && (
            <>
              {/* Interests */}
              {userPreferences && userPreferences.interests.length > 0 && (
                <div
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
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
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
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
                    ]
                      .filter((p) => p.value)
                      .map((pref) => (
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
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                    Your tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiProfile.tags.map((tag) => (
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
              <div className="flex gap-2 mt-1">
                <button
                  onClick={onEditPreferences}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <Edit3 size={14} /> Edit preferences
                </button>
                <button
                  onClick={onReset}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium"
                  style={{
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: '#f87171',
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </>
          )}

          {tab === 'connections' && (
            <>
              {connections.length === 0 ? (
                <div
                  className="rounded-2xl p-6 flex flex-col items-center text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(74,222,128,0.08)' }}>
                    <Link2 size={20} color="rgba(74,222,128,0.5)" />
                  </div>
                  <p className="text-white/50 text-sm font-medium mb-1">No connections yet</p>
                  <p className="text-white/25 text-xs leading-relaxed">
                    Connections appear after you meet people at events in person.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {connections.map((conn) => (
                    <div
                      key={conn.id}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}
                      >
                        {conn.firstName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/85 text-sm font-semibold">
                          {conn.firstName}{conn.lastName ? ' ' + conn.lastName : ''}
                        </p>
                        <p className="text-white/35 text-xs truncate">
                          Met at {conn.eventTitle}
                          {conn.connectedAt && ` · ${new Date(conn.connectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
