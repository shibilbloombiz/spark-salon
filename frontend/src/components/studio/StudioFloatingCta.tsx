'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

interface StudioFloatingCtaProps {
  studioName: string;
  onRequest: () => void;
}

export default function StudioFloatingCta({ studioName, onRequest }: StudioFloatingCtaProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal floating CTA after scrolling down 240px
      if (window.scrollY > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* ==============================================================
          DESKTOP FLOATING PILL CTA (Hidden on mobile via CSS media query)
          ============================================================== */}
      <aside
        className="spark-desktop-floating-cta"
        aria-label="Quick Service Request"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '32px',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'sparkFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <button
          onClick={onRequest}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`Request service at ${studioName}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '13px 24px',
            borderRadius: '40px',
            background: isHovered
              ? 'linear-gradient(135deg, #fbf0c0 0%, #d4af37 50%, #aa8210 100%)'
              : 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
            color: '#08080c',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: isHovered
              ? '0 12px 36px rgba(212, 175, 55, 0.55), 0 0 20px rgba(212, 175, 55, 0.4)'
              : '0 8px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.28)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans-display)',
            fontSize: '0.84rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transform: isHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 8, 12, 0.15)',
            }}
          >
            <Sparkles size={14} color="#08080c" />
          </span>

          <span>Request This Service</span>

          <ArrowRight
            size={15}
            color="#08080c"
            style={{
              transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>
      </aside>

      {/* ==============================================================
          MOBILE FIXED BOTTOM REQUEST BAR (Safe-area inset aware)
          ============================================================== */}
      <aside
        className="spark-mobile-fixed-bottom-bar"
        aria-label="Mobile Quick Request Bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          backgroundColor: 'rgba(8, 8, 12, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '12px 16px max(12px, env(safe-area-inset-bottom)) 16px',
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.7)',
          display: 'none', // Managed via CSS below
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#c9a45c',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {studioName}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.68rem',
              color: '#8b8b98',
            }}
          >
            Direct WhatsApp Booking
          </div>
        </div>

        <button
          onClick={onRequest}
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
            color: '#08080c',
            border: 'none',
            fontFamily: 'var(--font-sans-display)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
          }}
        >
          <MessageCircle size={14} color="#08080c" />
          <span>Request Service</span>
        </button>
      </aside>

      <style jsx global>{`
        @media (max-width: 768px) {
          .spark-desktop-floating-cta {
            display: none !important;
          }
          .spark-mobile-fixed-bottom-bar {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .spark-mobile-fixed-bottom-bar {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

