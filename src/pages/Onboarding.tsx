import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { UserPreferences, AIProfile, Screen } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences, profile: AIProfile) => void;
  onNavigate: (screen: Screen) => void;
  initialPrefs?: UserPreferences | null;
  isEditing?: boolean;
}

const INTEREST_CATEGORIES = [
  {
    label: 'Movement',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.15)',
    border: 'rgba(249,115,22,0.4)',
    items: ['Active', 'Bouldering', 'Walking', 'Outdoors'],
  },
  {
    label: 'Creative & Arts',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
    border: 'rgba(168,85,247,0.4)',
    items: ['Creative', 'Music', 'Sketching'],
  },
  {
    label: 'Mind & Learning',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.4)',
    items: ['Study', 'Tech', 'Reading'],
  },
  {
    label: 'Social & Games',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.15)',
    border: 'rgba(74,222,128,0.4)',
    items: ['Games', 'Food & coffee', 'Language exchange'],
  },
];

const VIBES = ['Quiet', 'Social-light', 'Mixed', 'Energetic'];
const LANGUAGES = ['Dutch', 'English', 'Both'];
const AGE_RANGES = ['Under 18', '18–25', '26–40', '41–60', '60+'];
const AREAS = [
  'Erasmus University', 'Kralingen', 'Rotterdam Centrum',
  'Delfshaven', 'Noord', 'Zuid', 'Kop van Zuid',
];

export default function Onboarding({ onComplete, onNavigate, initialPrefs, isEditing }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [vibe, setVibe] = useState('');
  const [language, setLanguage] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [area, setArea] = useState('');
  const [freeText, setFreeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialPrefs) {
      setFirstName(initialPrefs.firstName || '');
      setLastName(initialPrefs.lastName || '');
      setInterests(initialPrefs.interests || []);
      setVibe(initialPrefs.vibe || '');
      setLanguage(initialPrefs.language || '');
      setAgeRange(initialPrefs.ageRange || '');
      setArea(initialPrefs.area || '');
      setFreeText(initialPrefs.freeText || '');
    }
  }, [initialPrefs]);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleBack = () => {
    if (step === 0 && isEditing) {
      onNavigate('profile');
    } else if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const prefs: UserPreferences = {
      firstName, lastName, interests, vibe, language, ageRange, area, freeText,
    };
    try {
      const res = await fetch('/api/ai/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      const profile: AIProfile = await res.json();
      onComplete(prefs, profile);
    } catch {
      onComplete(prefs, {
        archetype: 'The Curious Explorer',
        summary: 'You enjoy low-pressure creative and social spaces.',
        tags: ['games', 'study', 'outdoors', 'creative'],
        recommendedCategories: ['Games', 'Study', 'Creative', 'Walking'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'What do you enjoy?', subtitle: 'Pick as many as you like.' },
    { title: 'About you', subtitle: 'Helps us find the right spaces.' },
    { title: 'Anything else?', subtitle: 'Optional — in your own words.' },
  ];

  const showBack = step > 0 || isEditing;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#0d0d12', paddingTop: 52 }}>
      {/* Header */}
      <div className="px-5 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          {showBack ? (
            <button onClick={handleBack} className="text-white/40 p-1">
              <ArrowLeft size={18} />
            </button>
          ) : <div className="w-7" />}
          <p className="text-white/30 text-xs">{step + 1} / 3</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
        <h2 className="text-white font-bold text-xl mt-4 mb-0.5">{steps[step].title}</h2>
        <p className="text-white/40 text-sm">{steps[step].subtitle}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-5"
            >
              {INTEREST_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2.5"
                    style={{ color: cat.color }}
                  >
                    {cat.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => {
                      const selected = interests.includes(item);
                      return (
                        <motion.button
                          key={item}
                          onClick={() => toggleInterest(item)}
                          whileTap={{ scale: 0.88 }}
                          whileHover={{ scale: 1.04 }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
                          style={{
                            background: selected ? cat.bg : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${selected ? cat.border : 'rgba(255,255,255,0.1)'}`,
                            color: selected ? cat.color : 'rgba(255,255,255,0.55)',
                          }}
                        >
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              <Check size={11} />
                            </motion.span>
                          )}
                          {item}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <AnimatePresence>
                {interests.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-white/30 text-xs"
                  >
                    {interests.length} selected
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2.5">
                  Your name
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-white/25"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-white/25"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  />
                </div>
              </div>

              <SelectGroup label="Vibe" options={VIBES} value={vibe} onChange={setVibe} />
              <SelectGroup label="Language" options={LANGUAGES} value={language} onChange={setLanguage} />
              <SelectGroup label="Age range" options={AGE_RANGES} value={ageRange} onChange={setAgeRange} />
              <SelectGroup label="Your area" options={AREAS} value={area} onChange={setArea} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Example: I like quiet cafés, board games, and I'm new to Rotterdam."
                className="w-full rounded-2xl p-4 text-sm resize-none outline-none placeholder:text-white/25"
                rows={5}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              />
              <p className="text-white/25 text-xs mt-2">
                Optional. Helps us tailor your suggestions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-5 pb-10 flex-shrink-0">
        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && interests.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
            style={{
              background: step === 0 && interests.length === 0 ? 'rgba(74,222,128,0.2)' : '#4ade80',
              color: '#0a0a0f',
              opacity: step === 0 && interests.length === 0 ? 0.4 : 1,
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
            style={{ background: '#4ade80', color: '#0a0a0f' }}
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Building your profile...</>
            ) : (
              <>Create my city profile <ArrowRight size={15} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface SelectGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function SelectGroup({ label, options, value, onChange }: SelectGroupProps) {
  return (
    <div>
      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <motion.button
              key={opt}
              onClick={() => onChange(opt)}
              whileTap={{ scale: 0.9 }}
              className="px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: selected ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${selected ? 'rgba(74,222,128,0.45)' : 'rgba(255,255,255,0.1)'}`,
                color: selected ? '#4ade80' : 'rgba(255,255,255,0.55)',
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
