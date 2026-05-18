import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Star, UserPlus, LogOut, ChevronUp, Phone } from 'lucide-react';
import { EventRoutine, Connection } from '../types';

interface ArrivalBadgeProps {
  event: EventRoutine | null;
  onBack: () => void;
  connections: Connection[];
  onAddConnection: (conn: Connection) => void;
}

type BadgeView = 'badge' | 'join' | 'leave';

const FAKE_PHONES: Record<string, string> = {
  Sophie: '+31 6 12 34 56 78',
  Liam: '+31 6 23 45 67 89',
  Yuki: '+31 6 34 56 78 90',
  Marco: '+31 6 45 67 89 01',
  David: '+31 6 56 78 90 12',
  Emma: '+31 6 67 89 01 23',
  Noah: '+31 6 78 90 12 34',
  Anika: '+31 6 89 01 23 45',
  Jin: '+31 6 90 12 34 56',
  Jake: '+31 6 11 22 33 44',
  Priya: '+31 6 22 33 44 55',
  Finn: '+31 6 33 44 55 66',
  Sara: '+31 6 44 55 66 77',
  Ana: '+31 6 55 66 77 88',
  Tom: '+31 6 66 77 88 99',
  Mei: '+31 6 77 88 99 00',
  Iris: '+31 6 88 99 00 11',
};

const INCOMING_REQUEST = { id: 'req1', fromName: 'Yuki', phone: '+31 6 34 56 78 90', eventTitle: 'Sketch Café' };

function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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
  const participants = event?.participants || ['Sophie', 'Liam', 'Marco', 'David'];

  const handleRequestContact = (name: string) => {
    setRequestedIds((prev) => [...prev, name]);
    const conn: Connection = {
      id: `conn-${Date.now()}`,
      firstName: name,
      lastName: '',
      phone: FAKE_PHONES[name] || '+31 6 00 00 00 00',
      eventId: event?.id || '',
      eventTitle: event?.title || '',
      connectedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    onAddConnection(conn);
  };

  const handleAcceptIncoming = () => {
    setIncomingHandled('accepted');
    onAddConnection({
      id: `conn-inc-${Date.now()}`,
      firstName: INCOMING_REQUEST.fromName,
      lastName: '',
      phone: INCOMING_REQUEST.phone,
      eventId: event?.id || '',
      eventTitle: event?.title || '',
      connectedAt: new Date().toISOString().split('T')[0],
      status: 'accepted',
    });
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
            <button
              onClick={onBack}
              className="absolute top-12 left-4 z-20 flex items-center gap-1 text-sm"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <ArrowLeft size={15} /> Back
            </button>

            {/* 844×390 landscape div, rotated -90deg, fills 390×844 phone */}
            <div
              style={{
                width: 844,
                height: 390,
                flexShrink: 0,
                transform: 'rotate(-90deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 56,
                paddingRight: 56,
                gap: 36,
              }}
            >
              {/* Left: glow rings + pin */}
              <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 180, height: 180 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 90 + i * 42,
                      height: 90 + i * 42,
                      border: `1.5px solid rgba(74,222,128,${0.4 - i * 0.12})`,
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
                <motion.div
                  className="relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: 78,
                    height: 78,
                    background: 'radial-gradient(circle, rgba(74,222,128,0.25) 0%, rgba(74,222,128,0.04) 100%)',
                    border: '2px solid rgba(74,222,128,0.6)',
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span style={{ fontSize: 36 }}>📍</span>
                </motion.div>
              </div>

              {/* Right: text + code word */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium tracking-widest uppercase mb-1.5"
                  style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', letterSpacing: 4 }}>
                  I'm here with
                </p>
                <h1 className="font-black mb-5"
                  style={{ fontSize: 58, color: '#4ade80', letterSpacing: -2, lineHeight: 0.95 }}>
                  StadKompas
                </h1>

                {/* Code word box with shimmer */}
                <div
                  className="relative overflow-hidden rounded-2xl px-7 py-5 mb-4"
                  style={{
                    background: 'rgba(74,222,128,0.08)',
                    border: '2.5px solid rgba(74,222,128,0.4)',
                    display: 'inline-block',
                    maxWidth: 420,
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
                    <motion.div
                      style={{
                        width: '55%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                      }}
                      animate={{ x: ['-120%', '280%'] }}
                      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
                    />
                  </div>
                  <p className="font-black uppercase tracking-widest mb-1"
                    style={{ fontSize: 11, color: 'rgba(74,222,128,0.55)', letterSpacing: 5 }}>
                    — CODE WORD —
                  </p>
                  <p className="font-black tracking-widest relative z-10"
                    style={{ fontSize: 64, color: '#ffffff', letterSpacing: 10, lineHeight: 1 }}>
                    {codeWord}
                  </p>
                </div>

                <p className="font-semibold" style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)' }}>
                  {event?.title}
                </p>
              </div>
            </div>

            {/* Join hint */}
            <motion.button
              onClick={() => setView('join')}
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronUp size={18} color="rgba(74,222,128,0.55)" />
              <span className="text-xs font-semibold tracking-wide" style={{ color: 'rgba(74,222,128,0.55)' }}>
                Slide to join the space
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── JOIN PANEL (portrait, not rotated) ── */}
      <AnimatePresence>
        {view === 'join' && (
          <motion.div
            key="join"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: '#F7F3EE' }}
          >
            <div className="px-5 pt-14 pb-4 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: '#9CA3AF' }}>
                  Here now
                </p>
                <h2 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>{event?.title}</h2>
              </div>
              <button
                onClick={() => setView('badge')}
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <X size={15} color="#6B7280" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {/* Incoming request */}
              {incomingHandled === 'none' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 mb-5"
                  style={{ background: '#FFF0E8', border: '1px solid rgba(232,101,26,0.25)' }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: '#E8651A' }}>
                    Contact request
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: '#FFF0E8', color: '#E8651A', border: '1.5px solid rgba(232,101,26,0.3)' }}>
                        {INCOMING_REQUEST.fromName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{INCOMING_REQUEST.fromName}</p>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>from {INCOMING_REQUEST.eventTitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIncomingHandled('declined')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={{ background: 'white', color: '#6B7280', border: '1px solid rgba(0,0,0,0.1)' }}
                      >
                        Decline
                      </button>
                      <button
                        onClick={handleAcceptIncoming}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                        style={{ background: '#E8651A', color: 'white' }}
                      >
                        <CheckIcon size={11} /> Accept
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {incomingHandled === 'accepted' && (
                <div className="rounded-2xl p-3 mb-5 flex items-center gap-2"
                  style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <CheckIcon size={14} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>
                      Connected with {INCOMING_REQUEST.fromName}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone size={11} color="#16A34A" />
                      <p className="text-xs" style={{ color: '#16A34A' }}>{INCOMING_REQUEST.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Participants */}
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
                People here · {participants.length}
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {participants.map((name) => {
                  const requested = requestedIds.includes(name);
                  const alreadyConn = connections.some((c) => c.firstName === name && c.status === 'accepted');
                  const pendingConn = connections.some((c) => c.firstName === name && c.status === 'pending');
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-2xl px-4 py-3"
                      style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: '#F3F4F6', color: '#6B7280' }}>
                          {name[0]}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{name}</span>
                        {alreadyConn && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: '#F0FDF4', color: '#16A34A' }}>
                            Connected
                          </span>
                        )}
                      </div>
                      {!alreadyConn && (
                        <button
                          onClick={() => !requested && !pendingConn && handleRequestContact(name)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
                          style={{
                            background: (requested || pendingConn) ? '#FFF0E8' : 'white',
                            border: `1px solid ${(requested || pendingConn) ? 'rgba(232,101,26,0.3)' : 'rgba(0,0,0,0.1)'}`,
                            color: (requested || pendingConn) ? '#E8651A' : '#6B7280',
                          }}
                        >
                          {(requested || pendingConn)
                            ? <>⏳ Pending</>
                            : <><UserPlus size={11} /> Connect</>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-5 pb-8 flex-shrink-0">
              <button
                onClick={() => setLeaveConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold"
                style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626' }}
              >
                <LogOut size={14} /> Leave this event
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEAVE FLOW ── */}
      <AnimatePresence>
        {leaveConfirm && view === 'join' && (
          <motion.div
            key="leave"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{ background: 'rgba(247,243,238,0.98)' }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: '#F0FDF4', border: '2px solid rgba(22,163,74,0.4)' }}>
                  <CheckIcon size={24} />
                </div>
                <p className="font-bold text-lg" style={{ color: '#1A1A2E' }}>Thanks for coming.</p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Your feedback will shape your suggestions.</p>
              </motion.div>
            ) : (
              <>
                <button onClick={() => setLeaveConfirm(false)} className="absolute top-14 left-5"
                  style={{ color: '#9CA3AF' }}>
                  <ArrowLeft size={18} />
                </button>
                <h2 className="font-black text-xl mb-1" style={{ color: '#1A1A2E' }}>How was it?</h2>
                <p className="text-sm mb-6 text-center" style={{ color: '#9CA3AF' }}>
                  Rate this space for yourself
                </p>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)} onClick={() => setRating(s)}>
                      <Star size={34}
                        fill={(hoverStar || rating) >= s ? '#E8651A' : 'none'}
                        color={(hoverStar || rating) >= s ? '#E8651A' : '#D1D5DB'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Anything worth noting? (optional)"
                  rows={3}
                  className="w-full rounded-2xl p-4 text-sm resize-none outline-none mb-3"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', color: '#1A1A2E', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                />
                <div className="w-full rounded-xl px-3 py-2.5 mb-5 flex items-start gap-2"
                  style={{ background: '#FFF0E8', border: '1px solid rgba(232,101,26,0.15)' }}>
                  <span style={{ color: '#E8651A', fontSize: 12, marginTop: 1 }}>🔒</span>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                    Your rating and review are completely private — never shown to other users or on the event page. They help personalise your suggestions only.
                  </p>
                </div>
                <button
                  onClick={handleSubmitLeave}
                  disabled={rating === 0}
                  className="w-full py-4 rounded-2xl font-bold text-sm"
                  style={{
                    background: rating > 0 ? 'linear-gradient(135deg, #E8651A, #FF8C42)' : 'rgba(232,101,26,0.2)',
                    color: rating > 0 ? 'white' : '#E8651A',
                    opacity: rating === 0 ? 0.5 : 1,
                    boxShadow: rating > 0 ? '0 4px 16px rgba(232,101,26,0.3)' : 'none',
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
