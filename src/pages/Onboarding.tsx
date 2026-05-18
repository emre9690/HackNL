import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, Check, Plus, X } from 'lucide-react';

import { UserPreferences, AIProfile, Screen } from '../types';

function generateProfile(prefs: UserPreferences): AIProfile {
  const lower = prefs.interests.map((i) => i.toLowerCase());

  const MOVEMENT = ['running', 'cycling', 'bouldering', 'climbing', 'swimming', 'yoga', 'football', 'basketball', 'tennis', 'badminton', 'dance', 'martial arts', 'skateboarding', 'crossfit', 'volleyball', 'hiking', 'walking', 'sailing'];
  const CREATIVE = ['drawing', 'painting', 'sketching', 'photography', 'music', 'guitar', 'piano', 'singing', 'dj-ing', 'film', 'theatre', 'improv', 'writing', 'poetry', 'ceramics', 'knitting', 'graphic design', 'street art'];
  const MIND = ['study', 'coding', 'reading', 'languages', 'philosophy', 'debating', 'science', 'history', 'mathematics', 'trivia', 'puzzles', 'astronomy', 'psychology', 'investing'];
  const GAMES = ['board games', 'card games', 'chess', 'catan', 'd&d', 'tabletop rpg', 'warhammer', 'magic: the gathering', 'go', 'backgammon', 'escape rooms', 'trivia nights', 'strategy games'];
  const SOCIAL = ['food & coffee', 'cooking', 'baking', 'wine', 'craft beer', 'language exchange', 'volunteering', 'community garden', 'movie nights', 'karaoke', 'concerts', 'museums', 'open mic', 'cultural events'];

  const hasMovement = lower.some((i) => MOVEMENT.includes(i));
  const hasCreative = lower.some((i) => CREATIVE.includes(i));
  const hasMind = lower.some((i) => MIND.includes(i));
  const hasGames = lower.some((i) => GAMES.includes(i));
  const hasSocial = lower.some((i) => SOCIAL.includes(i));
  const typeCount = [hasMovement, hasCreative, hasMind, hasGames, hasSocial].filter(Boolean).length;

  let archetype: string;
  let summary: string;
  let recommendedCategories: string[];

  if (hasGames && hasMind && !hasMovement && !hasSocial) {
    archetype = 'The Thoughtful Strategist';
    summary = 'You gravitate towards intellectually stimulating spaces — board games, study sessions, and strategy nights are your natural habitat. You prefer depth over breadth.';
    recommendedCategories = ['Board games', 'Study', 'Chess'];
  } else if (hasCreative && hasSocial && !hasGames) {
    archetype = 'The Creative Connector';
    summary = 'You thrive where creativity meets community. Art sessions, cultural events, and food-focused meetups feel natural to you.';
    recommendedCategories = ['Drawing', 'Photography', 'Language exchange'];
  } else if (hasMovement && !hasCreative && !hasMind && !hasSocial) {
    archetype = 'The Active Explorer';
    summary = 'Movement is your way into the city. You prefer routines with a physical element — walks, climbs, or cycling with people going your pace.';
    recommendedCategories = ['Walking', 'Bouldering', 'Running'];
  } else if (hasMind && hasSocial && !hasGames && !hasMovement) {
    archetype = 'The Curious Networker';
    summary = 'Conversations that go somewhere are your thing. Study groups, language exchanges, and knowledge-sharing events are where you connect best.';
    recommendedCategories = ['Study', 'Language exchange', 'Tech'];
  } else if (hasCreative && hasMovement) {
    archetype = 'The Expressive Mover';
    summary = 'You blend creativity with activity — dance, photography walks, or outdoor sketching sessions suit you well.';
    recommendedCategories = ['Dance', 'Photography', 'Walking'];
  } else if (hasGames && hasSocial) {
    archetype = 'The Social Game-Changer';
    summary = 'You enjoy spaces that mix play with connection. Game nights, trivia evenings, and casual meetups are where you feel at home.';
    recommendedCategories = ['Board games', 'Language exchange', 'Food & coffee'];
  } else if (typeCount >= 3) {
    archetype = 'The Urban Generalist';
    summary = 'You\'re at home in any corner of the city. Your wide range of interests means you find something worthwhile in almost any space you walk into.';
    recommendedCategories = prefs.interests.slice(0, 3);
  } else if (prefs.vibe === 'Quiet' || prefs.vibe === 'Social-light') {
    archetype = 'The Quiet Regular';
    summary = 'You prefer spaces where showing up is enough. Low-pressure, recurring routines where you can ease in at your own pace suit you best.';
    recommendedCategories = ['Study', 'Reading', 'Walking'];
  } else {
    archetype = 'The Curious Explorer';
    summary = 'You enjoy discovering what the city offers — one low-key routine at a time.';
    recommendedCategories = prefs.interests.slice(0, 3);
  }

  const tags = lower.slice(0, 6).map((i) => i.replace(/ & /g, '-').replace(/ /g, '-'));

  return { archetype, summary, tags, recommendedCategories };
}

interface OnboardingProps {
  onComplete: (prefs: UserPreferences, profile: AIProfile) => void;
  onNavigate: (screen: Screen) => void;
  initialPrefs?: UserPreferences | null;
  isEditing?: boolean;
}

// ── Interest categories ──
const CATEGORIES = [
  {
    key: 'movement',
    label: 'Movement & Sport',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.1)',
    border: 'rgba(220,38,38,0.35)',
    items: ['Running', 'Cycling', 'Bouldering', 'Climbing', 'Swimming', 'Yoga', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Dance', 'Martial arts', 'Skateboarding', 'CrossFit', 'Volleyball', 'Hiking', 'Walking', 'Sailing'],
  },
  {
    key: 'creative',
    label: 'Creative & Arts',
    color: '#E8651A',
    bg: 'rgba(232,101,26,0.1)',
    border: 'rgba(232,101,26,0.35)',
    items: ['Drawing', 'Painting', 'Sketching', 'Photography', 'Music', 'Guitar', 'Piano', 'Singing', 'DJ-ing', 'Film', 'Theatre', 'Improv', 'Writing', 'Poetry', 'Ceramics', 'Knitting', 'Graphic design', 'Street art'],
  },
  {
    key: 'mind',
    label: 'Mind & Learning',
    color: '#1A52A8',
    bg: 'rgba(26,82,168,0.1)',
    border: 'rgba(26,82,168,0.35)',
    items: ['Study', 'Coding', 'Reading', 'Languages', 'Philosophy', 'Debating', 'Science', 'History', 'Mathematics', 'Trivia', 'Puzzles', 'Astronomy', 'Psychology', 'Investing'],
  },
  {
    key: 'games',
    label: 'Board & Table Games',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.35)',
    items: ['Board games', 'Card games', 'Chess', 'Catan', 'D&D', 'Tabletop RPG', 'Warhammer', 'Magic: the Gathering', 'Go', 'Backgammon', 'Escape rooms', 'Trivia nights', 'Strategy games'],
  },
  {
    key: 'social',
    label: 'Food, Culture & Social',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.1)',
    border: 'rgba(22,163,74,0.35)',
    items: ['Food & coffee', 'Cooking', 'Baking', 'Wine', 'Craft beer', 'Language exchange', 'Volunteering', 'Community garden', 'Movie nights', 'Karaoke', 'Concerts', 'Museums', 'Open mic', 'Cultural events'],
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
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
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
      setPhone(initialPrefs.phone || '');
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

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests((prev) => [...prev, trimmed]);
    }
    setCustomInput('');
  };

  const removeInterest = (item: string) => setInterests((prev) => prev.filter((i) => i !== item));

  const handleBack = () => {
    if (step === 0 && isEditing) onNavigate('profile');
    else if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const prefs: UserPreferences = {
      firstName, lastName, phone, interests, vibe, language, ageRange, area, freeText,
    };
    await new Promise((r) => setTimeout(r, 520));
    const profile = generateProfile(prefs);
    onComplete(prefs, profile);
    setIsLoading(false);
  };

  const showBack = step > 0 || isEditing;

  const steps = [
    { title: 'What do you enjoy?', subtitle: 'Pick as many as you like.' },
    { title: 'About you', subtitle: 'Helps us find the right spaces.' },
    { title: 'Anything else?', subtitle: 'Optional — in your own words.' },
  ];

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F7F3EE', paddingTop: 52 }}
    >
      {/* Header */}
      <div className="px-5 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          {showBack ? (
            <button onClick={handleBack} className="p-1" style={{ color: '#6B7280' }}>
              <ArrowLeft size={18} />
            </button>
          ) : <div className="w-7" />}
          <p className="text-xs" style={{ color: '#9CA3AF' }}>{step + 1} / 3</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#E8651A' : 'rgba(0,0,0,0.1)' }}
            />
          ))}
        </div>
        <h2 className="font-bold text-xl mt-4 mb-0.5" style={{ color: '#1A1A2E' }}>
          {steps[step].title}
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>{steps[step].subtitle}</p>
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
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
{/* Selected chips (custom + all selected) */}
              {interests.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#9CA3AF' }}>
                    {interests.length} selected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((item) => (
                      <motion.span
                        key={item}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: '#1A1A2E', color: 'white' }}
                      >
                        {item}
                        <button onClick={() => removeInterest(item)} className="ml-0.5 opacity-60">
                          <X size={10} />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {CATEGORIES.map((cat) => (
                <div key={cat.key}>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-2.5"
                    style={{ color: cat.color }}
                  >
                    {cat.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => {
                      const selected = interests.includes(item);
                      return (
                        <motion.button
                          key={item}
                          onClick={() => toggleInterest(item)}
                          whileTap={{ scale: 0.88 }}
                          whileHover={{ scale: 1.03 }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                          style={{
                            background: selected ? cat.bg : 'white',
                            border: `1px solid ${selected ? cat.border : 'rgba(0,0,0,0.1)'}`,
                            color: selected ? cat.color : '#4B5563',
                            boxShadow: selected ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                          }}
                        >
                          {selected && <Check size={10} />}
                          {item}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Custom input */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#9CA3AF' }}>
                  Something else?
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                    placeholder="Type an interest and press enter..."
                    className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.1)',
                      color: '#1A1A2E',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  />
                  <button
                    onClick={addCustom}
                    disabled={!customInput.trim()}
                    className="px-3 py-2.5 rounded-xl font-medium text-sm"
                    style={{
                      background: customInput.trim() ? '#E8651A' : 'rgba(0,0,0,0.07)',
                      color: customInput.trim() ? 'white' : '#9CA3AF',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* Name — stacked */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#6B7280' }}>
                  Your name
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.1)',
                      color: '#1A1A2E',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.1)',
                      color: '#1A1A2E',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#6B7280' }}>
                  Phone number <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                </p>
                <input
                  type="tel"
                  placeholder="+31 6 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.1)',
                    color: '#1A1A2E',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>
                  Shared only with connections you accept.
                </p>
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
              transition={{ duration: 0.2 }}
            >
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Example: I like quiet cafés, board games, and I'm new to Rotterdam."
                className="w-full rounded-2xl p-4 text-sm resize-none outline-none"
                rows={5}
                style={{
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#1A1A2E',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              />
              <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
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
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
            style={{
              background: step === 0 && interests.length === 0
                ? 'rgba(232,101,26,0.2)'
                : 'linear-gradient(135deg, #E8651A, #FF8C42)',
              color: step === 0 && interests.length === 0 ? '#E8651A' : 'white',
              boxShadow: step === 0 && interests.length === 0
                ? 'none'
                : '0 6px 20px rgba(232,101,26,0.35)',
              opacity: step === 0 && interests.length === 0 ? 0.5 : 1,
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #E8651A, #FF8C42)',
              color: 'white',
              boxShadow: '0 6px 20px rgba(232,101,26,0.35)',
            }}
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
      <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#6B7280' }}>
        {label}
      </p>
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
                background: selected ? '#1A1A2E' : 'white',
                border: `1px solid ${selected ? '#1A1A2E' : 'rgba(0,0,0,0.1)'}`,
                color: selected ? 'white' : '#4B5563',
                boxShadow: selected ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
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
