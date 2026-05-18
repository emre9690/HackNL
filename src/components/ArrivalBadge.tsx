import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Star, UserPlus, Check, LogOut, ChevronUp } from 'lucide-react';
import { EventRoutine, Connection } from '../types';

interface ArrivalBadgeProps {
  event: EventRoutine | null;
  onBack: () => void;
  connections: Connection[];
  onAddConnection: (conn: Connection) => void;
}

type BadgeView = 'badge' | 'join' | 'leave';

const INCOMING_REQUEST = { id: 'req1', fromName: 'Yuki', eventTitle: 'Sketch Café' };

export default function ArrivalBadge({ event, onBack, connections, onAddConnection }: ArrivalBadgeProps) {
  const [view, setView] = useState<BadgeView>('badge');
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [incomingHandled, setIncomingHandled] = useState<'none' | 'accepted' | 'declined'>('none');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoverStar, setHoverStar] = useState(0);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const codeWord = event?.codeWord || 'LANTERN';
  const participants = event?.participants || ['Sophie', 'Liam', 'Yuki', 'Marco'];

  const handleRequestContact = (name: string) => {
    setRequestedIds((prev) => [...prev, name]);
    const conn: Connection = {
      id: `conn-${Date.now()}`,
      firstName: name,
      lastName: '',
      eventId: event?.id || '',
      eventTitle: event?.title || '',
      connectedAt: new Date().toISOString().split('T')[0],
    };
    onAddConnection(conn);
  };

  const handleSubmitLeave = () => {
    setSubmitted(true);
    setTimeout(() => onBack(), 1800);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#060f09' }}>
      {/* ── LANDSCAPE BADGE ── */}
      <AnimatePresence>
        {view === 'badge' && (
          <motion.div
            key="badge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Back */}
            <button
              onClick={onBack}
              className="absolute top-12 left-4 z-20 flex items-center gap-1 text-white/40 text-sm"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            {/* Landscape content — 844×390 rotated -90deg to fill 390×844 */}
            <div
              style={{
                width: 844,
                height: 390,
                flexShrink: 0,
                transform: 'rotate(-90deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 48,
                paddingRight: 48,
                gap: 32,
              }}
            >
              {/* Left: glow rings + pin */}
              <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 160, height: 160 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 80 + i * 36,
                      height: 80 + i * 36,
                      border: `1px solid rgba(74,222,128,${0.35 - i * 0.1})`,
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
                <motion.div
                  className="relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: 68,
                    height: 68,
                    background: 'radial-gradient(circle, rgba(74,222,128,0.25) 0%, rgba(74,222,128,0.05) 100%)',
                    border: '2px solid rgba(74,222,128,0.6)',
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span style={{ fontSize: 30 }}>📍</span>
                </motion.div>
              </div>

              {/* Right: text */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-1">
                  I'm here with
                </p>
                <h1 className="font-black mb-4" style={{ fontSize: 42, color: '#4ade80', letterSpacing: -1, lineHeight: 1 }}>
                  StadSpas
                </h1>

                {/* Code word with shimmer */}
                <div
                  className="relative overflow-hidden rounded-2xl px-6 py-4 mb-3"
                  style={{
                    background: 'rgba(74,222,128,0.08)',
                    border: '2px solid rgba(74,222,128,0.35)',
                    display: 'inline-block',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl flex items-center overflow-hidden"
                    style={{ pointerEvents: 'none' }}
                  >
                    <motion.div
                      style={{
                        width: '60%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                      }}
                      animate={{ x: ['-120%', '280%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
                    />
                  </div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: 'rgba(74,222,128,0.6)', letterSpacing: 4 }}
                  >
                    — CODE WORD —
                  </p>
                  <p
                    className="font-black tracking-widest relative z-10"
                    style={{ fontSize: 46, color: '#ffffff', letterSpacing: 8, lineHeight: 1 }}
                  >
                    {codeWord}
                  </p>
                </div>

                <p className="text-white/30 text-xs">{event?.title}</p>
              </div>
            </div>

            {/* Join hint at bottom */}
            <motion.button
              onClick={() => setView('join')}
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronUp size={16} color="rgba(74,222,128,0.6)" />
              <span className="text-xs font-medium" style={{ color: 'rgba(74,222,128,0.6)' }}>
                Slide to join the space
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── JOIN PANEL (portrait) ── */}
      <AnimatePresence>
        {view === 'join' && (
          <motion.div
            key="join"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: '#0d0d12' }}
          >
            {/* Header */}
            <div className="px-5 pt-14 pb-4 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Here now</p>
                <h2 className="text-white font-bold text-lg">{event?.title}</h2>
              </div>
              <button
                onClick={() => setView('badge')}
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <X size={15} color="rgba(255,255,255,0.6)" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {/* Incoming request */}
              {incomingHandled === 'none' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 mb-5"
                  style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>
                    Contact request
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}
                      >
                        {INCOMING_REQUEST.fromName[0]}
                      </div>
                      <div>
                        <p className="text-white/85 text-sm font-medium">{INCOMING_REQUEST.fromName}</p>
                        <p className="text-white/35 text-xs">from {INCOMING_REQUEST.eventTitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIncomingHandled('declined')}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => {
                          setIncomingHandled('accepted');
                          onAddConnection({
                            id: `conn-inc-${Date.now()}`,
                            firstName: INCOMING_REQUEST.fromName,
                            lastName: '',
                            eventId: event?.id || '',
                            eventTitle: event?.title || '',
                            connectedAt: new Date().toISOString().split('T')[0],
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1"
                        style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}
                      >
                        <Check size={11} /> Accept
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {incomingHandled === 'accepted' && (
                <div className="rounded-2xl p-3 mb-5 flex items-center gap-2" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <Check size={14} color="#4ade80" />
                  <p className="text-sm" style={{ color: '#4ade80' }}>Connected with {INCOMING_REQUEST.fromName}</p>
                </div>
              )}

              {/* Participants */}
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                People here · {participants.length}
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {participants.map((name) => {
                  const requested = requestedIds.includes(name);
                  const alreadyConnection = connections.some((c) => c.firstName === name);
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-2xl px-4 py-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                        >
                          {name[0]}
                        </div>
                        <span className="text-white/75 text-sm font-medium">{name}</span>
                        {alreadyConnection && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                            Connection
                          </span>
                        )}
                      </div>
                      {!alreadyConnection && (
                        <button
                          onClick={() => !requested && handleRequestContact(name)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                          style={{
                            background: requested ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.07)',
                            border: `1px solid ${requested ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            color: requested ? '#4ade80' : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {requested ? <><Check size={11} /> Sent</> : <><UserPlus size={11} /> Connect</>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leave button */}
            <div className="px-5 pb-8 flex-shrink-0">
              <button
                onClick={() => setLeaveConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium"
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: '#f87171',
                }}
              >
                <LogOut size={14} /> Leave this event
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEAVE CONFIRM OVERLAY ── */}
      <AnimatePresence>
        {leaveConfirm && view === 'join' && (
          <motion.div
            key="leave"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{ background: 'rgba(13,13,18,0.97)' }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.4)' }}>
                  <Check size={24} color="#4ade80" />
                </div>
                <p className="text-white font-semibold text-lg">Thanks for coming.</p>
                <p className="text-white/40 text-sm">Your feedback will shape your suggestions.</p>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={() => setLeaveConfirm(false)}
                  className="absolute top-14 left-5 text-white/40"
                >
                  <ArrowLeft size={18} />
                </button>

                <h2 className="text-white font-bold text-xl mb-1">How was it?</h2>
                <p className="text-white/40 text-sm mb-6 text-center">Rate this space for yourself</p>

                {/* Stars */}
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setRating(s)}
                    >
                      <Star
                        size={32}
                        fill={(hoverStar || rating) >= s ? '#fbbf24' : 'none'}
                        color={(hoverStar || rating) >= s ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                      />
                    </button>
                  ))}
                </div>

                {/* Review */}
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Anything worth noting? (optional)"
                  rows={3}
                  className="w-full rounded-2xl p-4 text-sm resize-none outline-none placeholder:text-white/20 mb-3"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                />

                {/* Privacy notice */}
                <div className="w-full rounded-xl px-3 py-2.5 mb-5 flex items-start gap-2" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.12)' }}>
                  <span style={{ color: '#4ade80', fontSize: 12, marginTop: 1 }}>🔒</span>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(74,222,128,0.7)' }}>
                    Your rating and review are completely private — never shown to other users or on the event page. They help personalise your suggestions only.
                  </p>
                </div>

                <button
                  onClick={handleSubmitLeave}
                  disabled={rating === 0}
                  className="w-full py-4 rounded-2xl font-semibold text-sm"
                  style={{
                    background: rating > 0 ? '#4ade80' : 'rgba(74,222,128,0.2)',
                    color: '#0a0a0f',
                    opacity: rating === 0 ? 0.4 : 1,
                  }}
                >
                  Done
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
