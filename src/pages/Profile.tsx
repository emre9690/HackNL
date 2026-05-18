import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, RotateCcw, User, Link2, Phone, Check } from 'lucide-react';
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
  onUpdateConnection: (id: string, status: 'accepted') => void;
}

const tagColors = [
  { bg: '#EBF0FB', text: '#1A52A8' },
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#F3EEFF', text: '#7C3AED' },
  { bg: '#F0FDF4', text: '#16A34A' },
  { bg: '#FFF0E8', text: '#E8651A' },
  { bg: '#FEF2F2', text: '#DC2626' },
];

export default function Profile({
  userPreferences, aiProfile, onEditPreferences, onReset,
  onNavigate, mode, currentScreen, connections, onUpdateConnection,
}: ProfileProps) {
  const [tab, setTab] = useState<'overview' | 'connections'>('overview');

  const displayName =
    userPreferences?.firstName
      ? `${userPreferences.firstName}${userPreferences.lastName ? ' ' + userPreferences.lastName : ''}`
      : 'My Profile';

  const accepted = connections.filter((c) => c.status === 'accepted');
  const pending = connections.filter((c) => c.status === 'pending');

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F7F3EE' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="px-5 pt-14 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #FFF0E8, #FFE0CC)',
                border: '1.5px solid rgba(232,101,26,0.3)',
              }}
            >
              <User size={24} color="#E8651A" />
            </div>
            <div>
              <h1 className="font-black text-xl leading-tight" style={{ color: '#1A1A2E', letterSpacing: -0.5 }}>
                {displayName}
              </h1>
              {userPreferences?.area && (
                <p className="text-sm" style={{ color: '#9CA3AF' }}>{userPreferences.area}</p>
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors capitalize"
              style={{
                background: tab === t ? '#1A1A2E' : 'white',
                border: `1px solid ${tab === t ? '#1A1A2E' : 'rgba(0,0,0,0.08)'}`,
                color: tab === t ? 'white' : '#6B7280',
                boxShadow: tab === t ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              {t === 'connections' && <Link2 size={12} />}
              {t === 'connections'
                ? `Connections${connections.length > 0 ? ` · ${connections.length}` : ''}`
                : 'Overview'}
            </button>
          ))}
        </div>

        <div className="px-5 flex flex-col gap-4">
          {tab === 'overview' && (
            <>
              {aiProfile && (
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, #FFF0E8 0%, #FFF8F2 100%)',
                    border: '1.5px solid rgba(232,101,26,0.25)',
                    boxShadow: '0 2px 8px rgba(232,101,26,0.1)',
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#E8651A' }}>
                    Your city profile
                  </p>
                  <p className="font-black text-lg leading-tight mb-2" style={{ color: '#1A1A2E', letterSpacing: -0.3 }}>
                    {aiProfile.archetype}
                  </p>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#4B5563' }}>
                    {aiProfile.summary}
                  </p>
                  {aiProfile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {aiProfile.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: 'rgba(232,101,26,0.12)', color: '#E8651A' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {userPreferences && userPreferences.interests.length > 0 && (
                <div className="rounded-2xl p-4"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
                    Your interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.interests.map((interest, i) => {
                      const c = tagColors[i % tagColors.length];
                      return (
                        <span key={interest} className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background: c.bg, color: c.text }}>
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {userPreferences && (
                <div className="rounded-2xl p-4"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
                    Preferences
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Vibe', value: userPreferences.vibe },
                      { label: 'Language', value: userPreferences.language },
                      { label: 'Age range', value: userPreferences.ageRange },
                      { label: 'Area', value: userPreferences.area },
                    ].filter((p) => p.value).map((pref) => (
                      <div key={pref.label} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#9CA3AF' }}>{pref.label}</span>
                        <span className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{pref.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-1">
                <button onClick={onEditPreferences}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', color: '#4B5563', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <Edit3 size={14} /> Edit preferences
                </button>
                <button onClick={onReset}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold"
                  style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626' }}>
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </>
          )}

          {tab === 'connections' && (
            <>
              {connections.length === 0 ? (
                <div className="rounded-2xl p-6 flex flex-col items-center text-center"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: '#FFF0E8' }}>
                    <Link2 size={20} color="#E8651A" />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#4B5563' }}>No connections yet</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
                    Connections appear after you meet people at events in person.
                  </p>
                </div>
              ) : (
                <>
                  {pending.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#E8651A' }}>
                        Pending · {pending.length}
                      </p>
                      <div className="flex flex-col gap-2">
                        {pending.map((conn) => (
                          <div key={conn.id}
                            className="flex items-center gap-3 rounded-2xl px-4 py-3"
                            style={{ background: '#FFF7F3', border: '1px solid rgba(232,101,26,0.15)' }}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                              style={{ background: 'rgba(232,101,26,0.12)', color: '#E8651A' }}>
                              {conn.firstName[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>
                                {conn.firstName}{conn.lastName ? ' ' + conn.lastName : ''}
                              </p>
                              <p className="text-xs" style={{ color: '#9CA3AF' }}>Met at {conn.eventTitle}</p>
                            </div>
                            <button
                              onClick={() => onUpdateConnection(conn.id, 'accepted')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
                              style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.3)', color: '#16A34A' }}
                            >
                              <Check size={10} /> Accept
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {accepted.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#16A34A' }}>
                        Connected · {accepted.length}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {accepted.map((conn) => (
                          <div key={conn.id}
                            className="rounded-2xl p-4"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black flex-shrink-0"
                                style={{ background: '#F0FDF4', color: '#16A34A' }}>
                                {conn.firstName[0]}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold leading-tight" style={{ color: '#1A1A2E' }}>
                                  {conn.firstName}{conn.lastName ? ' ' + conn.lastName : ''}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                                  Met at <span style={{ color: '#6B7280', fontWeight: 500 }}>{conn.eventTitle}</span>
                                  {conn.connectedAt && ` · ${new Date(conn.connectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                              style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.15)' }}>
                              <Phone size={13} color="#16A34A" />
                              <span className="text-sm font-bold tracking-wide" style={{ color: '#16A34A' }}>
                                {conn.phone || '—'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
