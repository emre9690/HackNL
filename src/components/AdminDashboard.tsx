import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, BarChart2, Check, X, Edit3, TrendingUp } from 'lucide-react';
import { AISuggestion } from '../types';
import { insightSections, summaryCards } from '../data/insights';

interface AdminDashboardProps {
  suggestions: AISuggestion[];
  onUpdateSuggestion: (id: string, status: 'approved' | 'rejected') => void;
}

type AdminTab = 'suggestions' | 'approved' | 'insights';

const vibeColors: Record<string, string> = {
  'Social-light': 'bg-purple-100 text-purple-700',
  Language: 'bg-blue-100 text-blue-700',
  Creative: 'bg-orange-100 text-orange-700',
  Tech: 'bg-cyan-100 text-cyan-700',
  Study: 'bg-yellow-100 text-yellow-700',
  Active: 'bg-red-100 text-red-700',
  Calm: 'bg-green-100 text-green-700',
  Outdoors: 'bg-emerald-100 text-emerald-700',
  Games: 'bg-indigo-100 text-indigo-700',
  Dutch: 'bg-blue-50 text-blue-600',
};

export default function AdminDashboard({ suggestions, onUpdateSuggestion }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('suggestions');

  const pending = suggestions.filter((s) => s.status === 'pending');
  const approved = suggestions.filter((s) => s.status === 'approved');

  const tabs = [
    { id: 'suggestions' as AdminTab, label: 'Suggestions', icon: Sparkles, count: pending.length },
    { id: 'approved' as AdminTab, label: 'Approved', icon: CheckCircle, count: approved.length },
    { id: 'insights' as AdminTab, label: 'Insights', icon: BarChart2 },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#F7F3EE', paddingTop: 52 }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>
          Admin View
        </p>
        <h1 className="font-black text-xl" style={{ color: '#1A1A2E', letterSpacing: -0.5 }}>StadKompas Dashboard</h1>
      </div>

      {/* Tab bar */}
      <div className="flex px-4 gap-2 pb-3 flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-1 justify-center"
              style={{
                background: isActive ? '#1A1A2E' : 'white',
                border: `1px solid ${isActive ? '#1A1A2E' : 'rgba(0,0,0,0.08)'}`,
                color: isActive ? 'white' : '#6B7280',
                boxShadow: isActive ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <Icon size={12} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className="ml-0.5 rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#E8651A',
                    color: 'white',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {pending.length === 0 ? (
                <div className="text-center py-12" style={{ color: '#9CA3AF' }}>
                  <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No pending suggestions</p>
                </div>
              ) : (
                pending.map((sug) => (
                  <SuggestionCard
                    key={sug.id}
                    suggestion={sug}
                    onApprove={() => onUpdateSuggestion(sug.id, 'approved')}
                    onReject={() => onUpdateSuggestion(sug.id, 'rejected')}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'approved' && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {approved.length === 0 ? (
                <div className="text-center py-12" style={{ color: '#9CA3AF' }}>
                  <CheckCircle size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No approved events yet</p>
                </div>
              ) : (
                approved.map((sug) => (
                  <div
                    key={sug.id}
                    className="rounded-2xl p-4 mb-3"
                    style={{
                      background: '#F0FDF4',
                      border: '1px solid rgba(22,163,74,0.2)',
                    }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle size={14} color="#16A34A" className="mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{sug.title}</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                          {sug.location} · {sug.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sug.vibeTags.map((tag) => (
                        <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${vibeColors[tag] || 'bg-gray-100 text-gray-500'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl p-3"
                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                  >
                    <p className="text-[10px] mb-1 leading-tight" style={{ color: '#9CA3AF' }}>{card.label}</p>
                    <p className="font-black text-lg" style={{ color: '#1A1A2E' }}>{card.value}</p>
                    <p className="text-[10px]" style={{ color: card.positive ? '#16A34A' : '#DC2626' }}>
                      <TrendingUp size={9} className="inline mr-0.5" />
                      {card.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bar chart sections */}
              {insightSections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl p-4 mb-3"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF' }}>
                    {section.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {section.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: '#4B5563' }}>{stat.label}</span>
                          <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>{stat.value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: stat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: AISuggestion;
  onApprove: () => void;
  onReject: () => void;
}

function SuggestionCard({ suggestion, onApprove, onReject }: SuggestionCardProps) {
  const vibeColors2: Record<string, string> = {
    'Social-light': 'bg-purple-100 text-purple-700',
    Language: 'bg-blue-100 text-blue-700',
    Creative: 'bg-orange-100 text-orange-700',
    Tech: 'bg-cyan-100 text-cyan-700',
    Study: 'bg-yellow-100 text-yellow-700',
    Active: 'bg-red-100 text-red-700',
    Calm: 'bg-green-100 text-green-700',
    Outdoors: 'bg-emerald-100 text-emerald-700',
    Games: 'bg-indigo-100 text-indigo-700',
    Dutch: 'bg-blue-50 text-blue-600',
  };

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-start gap-2 mb-2">
        <Sparkles size={14} color="#E8651A" className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{suggestion.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
            {suggestion.location} · {suggestion.area}
          </p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>{suggestion.time} · {suggestion.language}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {suggestion.vibeTags.map((tag) => (
          <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${vibeColors2[tag] || 'bg-gray-100 text-gray-500'}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="rounded-xl p-3 mb-3" style={{ background: '#FFF0E8', border: '1px solid rgba(232,101,26,0.15)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#E8651A' }}>
          AI Reasoning
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{suggestion.reason}</p>
      </div>

      <div className="rounded-xl p-3 mb-3" style={{ background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.06)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>
          Suggested Action
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{suggestion.suggestedAction}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.3)', color: '#16A34A' }}
        >
          <Check size={13} /> Approve
        </button>
        <button
          className="px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.08)', color: '#9CA3AF' }}
        >
          <Edit3 size={13} />
        </button>
        <button
          onClick={onReject}
          className="px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626' }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
