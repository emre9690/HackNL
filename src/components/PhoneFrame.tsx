import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,222,128,0.06) 0%, rgba(10,10,15,0) 70%)',
        }}
      />

      {/* Phone shell */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow:
            '0 0 0 1px rgba(0,0,0,0.8), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(74,222,128,0.04)',
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
            background: '#0a0a0f',
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
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}
