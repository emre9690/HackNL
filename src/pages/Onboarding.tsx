import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { UserPreferences, AIProfile, Screen } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences, profile: AIProfile) => void;
  onNavigate: (screen: Screen) => void;
}

const INTERESTS = [
  'Calm', 'Active', 'Creative', 'Study', 'Games', 'Outdoors',
  'Food & coffee', 'Language exchange', 'Music', 'Tech', 'Bouldering',
  'Walking', 'Reading',
];

const VIBES = ['Quiet', 'Social-light', 'Mixed', 'Energetic'];
const LANGUAGES = ['Dutch', 'English', 'Both'];
const AGE_RANGES = ['Under 18', '18–25', '26–40', '41–60', '60+'];
const AREAS = [
  'Erasmus University', 'Kralingen', 'Rotterdam Centrum',
  'Delfshaven', 'Noord', 'Zuid', 'Kop van Zuid',
];

export default function Onboarding({ onComplete, onNavigate }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [vibe, setVibe] = useState('');
  const [language, setLanguage] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [area, setArea] = useState('');
  const [freeText, setFreeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const prefs: UserPreferences = { interests, vibe, language, ageRange, area, freeText };

    try {
      const res = await fetch('/api/ai/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      const profile: AIProfile = await res.json();
      onComplete(prefs, profile);
    } catch {
      // Fallback mock
      onComplete(prefs, {
        archetype: 'The Curious Explorer',
        summary: 'You enjoy low-pressure creative and social spaces, particularly around games, study, and outdoor activities.',
        tags: ['games', 'study', 'outdoors', 'creative', 'calm'],
        recommendedCategories: ['Games', 'Study', 'Creative', 'Walking'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'What do you enjoy?', subtitle: 'Pick as many as you like.' },
    { title: 'Your preferences', subtitle: 'Help us find the right spaces.' },
    { title: 'Anything else?', subtitle: 'Optional — in your own words.' },
  ];

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#0d0d12', paddingTop: 60 }}
    >
      {/* Progress bar */}
      <div className="px-6 mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="text-white/40">
              <ArrowLeft size={18} />
            </button>
          )}
          {step === 0 && <div />}
          <p className="text-white/30 text-xs">{step + 1} / 3</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{
                background: i <= step ? '#4ade80' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
        <h2 className="text-white font-bold text-xl mt-4 mb-1">{steps[step].title}</h2>
        <p className="text-white/40 text-sm">{steps[step].subtitle}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                      style={{
                        background: selected ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${selected ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        color: selected ? '#4ade80' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <SelectGroup
                label="Vibe"
                options={VIBES}
                value={vibe}
                onChange={setVibe}
              />
              <SelectGroup
                label="Language"
                options={LANGUAGES}
                value={language}
                onChange={setLanguage}
              />
              <SelectGroup
                label="Age range"
                options={AGE_RANGES}
                value={ageRange}
                onChange={setAgeRange}
              />
              <SelectGroup
                label="Your area"
                options={AREAS}
                value={area}
                onChange={setArea}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Example: I like quiet cafés, board games, and I'm new to Rotterdam."
                className="w-full rounded-2xl p-4 text-sm text-white/80 resize-none outline-none"
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

      {/* Next / Submit button */}
      <div className="px-6 pb-10 flex-shrink-0">
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
              <>
                <Loader2 size={16} className="animate-spin" />
                Building your profile...
              </>
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
      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: selected ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${selected ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: selected ? '#4ade80' : 'rgba(255,255,255,0.6)',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
