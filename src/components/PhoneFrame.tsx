import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0F172A' }}
    >
      {/* Radial glow — Dutch orange tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,101,26,0.07) 0%, rgba(15,23,42,0) 70%)',
        }}
      />

      {/* Phone shell */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          background: '#F7F3EE',
          border: '1px solid rgba(0,0,0,0.25)',
          boxShadow:
            '0 0 0 8px #2D2D35, 0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(232,101,26,0.06)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50"
          style={{
            width: 120,
            height: 34,
            background: '#1A1A1A',
            borderRadius: 20,
          }}
        />

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 44 }}>
          {children}
        </div>

        {/* Home indicator bar */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50"
          style={{
            width: 134,
            height: 5,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}
