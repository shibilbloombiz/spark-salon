'use client';

import React from 'react';
import { Sparkles, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import { StudioData } from '@/lib/data/studios';
import { SITE_CONFIG } from '@/config/site.config';
import { SectionCornerAccent } from '@/components/ui';

interface StudioFinalCtaProps {
  studio: StudioData;
  onRequest: () => void;
}

export default function StudioFinalCta({ studio, onRequest }: StudioFinalCtaProps) {
  return (
    <section
      id="studio-final-cta"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 9vw, 130px) 0',
        backgroundColor: '#040406',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      }}
    >
      <SectionCornerAccent corner="both" />

      {/* Background Visual Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.22,
          overflow: 'hidden',
        }}
      >
        <img
          src={studio.heroMedia.url}
          alt={studio.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 50%, rgba(4, 4, 6, 0.7) 0%, rgba(4, 4, 6, 0.98) 100%)',
          }}
        />
      </div>

      <div className="luxury-container" style={{ position: 'relative', zIndex: 3, margin: '0 auto' }}>
        <div
          className="squircle-lg"
          style={{
            position: 'relative',
            backgroundColor: 'rgba(12, 12, 18, 0.88)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '28px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.9), 0 0 45px rgba(212, 175, 55, 0.12)',
            padding: 'clamp(36px, 6vw, 68px)',
            textAlign: 'center',
            maxWidth: '920px',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          {/* Top Gold Specular Accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '40px',
              right: '40px',
              height: '1px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 25%, rgba(255, 248, 220, 0.9) 50%, rgba(212, 175, 55, 0.3) 75%, transparent 100%)',
            }}
          />

          {/* Capsule Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              backgroundColor: 'rgba(212, 175, 55, 0.14)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              color: '#f3e5ab',
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '22px',
            }}
          >
            <Sparkles size={13} color="#e5c158" />
            <span>Begin Your Personal Transformation</span>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: 'clamp(2.2rem, 4.4vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Experience the Artistry of {studio.name}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: 'clamp(0.96rem, 1.2vw, 1.1rem)',
              lineHeight: 1.65,
              color: '#d4d2d8',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
            }}
          >
            Our master stylists and directors are ready to craft your bespoke consultation. Inquire with one click to connect directly with our WhatsApp concierge.
          </p>

          {/* Primary Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button
              onClick={onRequest}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 36px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
                color: '#08080c',
                border: 'none',
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 12px 32px rgba(212, 175, 55, 0.45)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(212, 175, 55, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.45)';
              }}
            >
              <MessageCircle size={18} color="#08080c" />
              <span>Request Service via WhatsApp</span>
            </button>

            <a
              href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
            >
              <Phone size={16} color="#d4af37" />
              <span>Direct Call: {SITE_CONFIG.contact.phone}</span>
            </a>
          </div>

          {/* Quick Studio Coordinates Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.78rem',
              color: '#a0a0ae',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#d4af37" />
              <span>{SITE_CONFIG.contact.address.full}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#d4af37" />
              <span>{SITE_CONFIG.contact.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

