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
  'Social-light': 'bg-purple-500/20 text-purple-300',
  Language: 'bg-blue-500/20 text-blue-300',
  Creative: 'bg-orange-500/20 text-orange-300',
  Tech: 'bg-cyan-500/20 text-cyan-300',
  Study: 'bg-yellow-500/20 text-yellow-300',
  Active: 'bg-red-500/20 text-red-300',
  Calm: 'bg-green-500/20 text-green-300',
  Outdoors: 'bg-emerald-500/20 text-emerald-300',
  Games: 'bg-indigo-500/20 text-indigo-300',
  Dutch: 'bg-blue-400/20 text-blue-200',
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
    <div className="absolute inset-0 flex flex-col" style={{ background: '#0d0d12', paddingTop: 52 }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">
          Admin View
        </p>
        <h1 className="text-white font-bold text-xl">StadSpas Dashboard</h1>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-1 justify-center"
              style={{
                background: isActive ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? '#4ade80' : 'rgba(255,255,255,0.5)',
              }}
            >
              <Icon size={12} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className="ml-0.5 rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold"
                  style={{ background: isActive ? '#4ade80' : 'rgba(255,255,255,0.15)', color: isActive ? '#0a0a0f' : 'white' }}
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
                <div className="text-center py-12 text-white/30">
                  <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No pending suggestions</p>
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
                <div className="text-center py-12 text-white/30">
                  <CheckCircle size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No approved events yet</p>
                </div>
              ) : (
                approved.map((sug) => (
                  <div
                    key={sug.id}
                    className="rounded-2xl p-4 mb-3"
                    style={{
                      background: 'rgba(74,222,128,0.06)',
                      border: '1px solid rgba(74,222,128,0.2)',
                    }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle size={14} color="#4ade80" className="mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold text-sm">{sug.title}</h3>
                        <p className="text-white/40 text-xs mt-0.5">
                          {sug.location} · {sug.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sug.vibeTags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] px-2 py-0.5 rounded-full ${vibeColors[tag] || 'bg-white/10 text-white/50'}`}
                        >
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
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <p className="text-white/40 text-[10px] mb-1 leading-tight">{card.label}</p>
                    <p className="text-white font-bold text-lg">{card.value}</p>
                    <p className="text-[10px]" style={{ color: card.positive ? '#4ade80' : '#f87171' }}>
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
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <h3 className="text-white/60 text-xs font-medium mb-3 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {section.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70 text-xs">{stat.label}</span>
                          <span className="text-white/50 text-xs font-medium">{stat.value}%</span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.08)' }}
                        >
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
    'Social-light': 'bg-purple-500/20 text-purple-300',
    Language: 'bg-blue-500/20 text-blue-300',
    Creative: 'bg-orange-500/20 text-orange-300',
    Tech: 'bg-cyan-500/20 text-cyan-300',
    Study: 'bg-yellow-500/20 text-yellow-300',
    Active: 'bg-red-500/20 text-red-300',
    Calm: 'bg-green-500/20 text-green-300',
    Outdoors: 'bg-emerald-500/20 text-emerald-300',
    Games: 'bg-indigo-500/20 text-indigo-300',
    Dutch: 'bg-blue-400/20 text-blue-200',
  };

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-start gap-2 mb-2">
        <Sparkles size={14} color="#fbbf24" className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm">{suggestion.title}</h3>
          <p className="text-white/40 text-xs mt-0.5">
            {suggestion.location} · {suggestion.area}
          </p>
          <p className="text-white/40 text-xs">{suggestion.time} · {suggestion.language}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {suggestion.vibeTags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] px-2 py-0.5 rounded-full ${vibeColors2[tag] || 'bg-white/10 text-white/50'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="rounded-xl p-3 mb-3"
        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
      >
        <p className="text-white/50 text-[10px] font-medium uppercase tracking-wide mb-1">
          AI Reasoning
        </p>
        <p className="text-white/70 text-xs leading-relaxed">{suggestion.reason}</p>
      </div>

      <div
        className="rounded-xl p-3 mb-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-white/50 text-[10px] font-medium uppercase tracking-wide mb-1">
          Suggested Action
        </p>
        <p className="text-white/70 text-xs leading-relaxed">{suggestion.suggestedAction}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(74,222,128,0.15)',
            border: '1px solid rgba(74,222,128,0.3)',
            color: '#4ade80',
          }}
        >
          <Check size={13} />
          Approve
        </button>
        <button
          className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          <Edit3 size={13} />
        </button>
        <button
          onClick={onReject}
          className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.2)',
            color: '#f87171',
          }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
