'use client';

import React from 'react';
import { Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { StudioData } from '@/lib/data/studios';
import { SectionCornerAccent } from '@/components/ui';

interface StudioIntroProps {
  studio: StudioData;
  onRequest: () => void;
}

export default function StudioIntro({ studio, onRequest }: StudioIntroProps) {
  const intro = studio.introduction;

  return (
    <section
      id="studio-intro"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 9vw, 130px) 0',
        backgroundColor: '#07070a',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <SectionCornerAccent corner="both" />

      {/* Subtle gold background sheen */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="luxury-container" style={{ position: 'relative', zIndex: 2, margin: '0 auto' }}>
        {/* Asymmetrical Editorial 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 'clamp(40px, 6vw, 84px)',
            alignItems: 'center',
          }}
        >
          {/* Column 1: Philosophy & Editorial Narrative */}
          <div>
            {/* Section Eyebrow */}
            <div
              style={{
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#d4af37',
                textTransform: 'uppercase',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={13} color="#d4af37" />
              <span>Studio Philosophy & Artistry</span>
            </div>

            {/* Editorial Title */}
            <h2
              style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '0.02em',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: '0 0 24px 0',
              }}
            >
              {intro.title}
            </h2>

            {/* Philosophy Narrative */}
            <p
              style={{
                fontFamily: 'var(--font-sans-display)',
                fontSize: 'clamp(0.96rem, 1.15vw, 1.08rem)',
                lineHeight: 1.75,
                color: '#d4d2d8',
                margin: '0 0 28px 0',
              }}
            >
              {intro.philosophy}
            </p>

            {/* Speciality Badge Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                marginBottom: '36px',
              }}
            >
              <Award size={22} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#c9a45c',
                    marginBottom: '3px',
                  }}
                >
                  Signature Atelier Distinction
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.4,
                  }}
                >
                  {intro.speciality}
                </div>
              </div>
            </div>

            {/* Key Atelier Stats Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '36px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {intro.stats.map((stat, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif-display)',
                      fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                      fontWeight: 800,
                      color: '#d4af37',
                      lineHeight: 1,
                      marginBottom: '6px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#9e9ea8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Request CTA Button */}
            <button
              onClick={onRequest}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
                color: '#08080c',
                border: 'none',
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span>Book An In-Studio Consultation</span>
              <ArrowRight size={15} color="#08080c" />
            </button>
          </div>

          {/* Column 2: Large Asymmetrical Supporting Image with Specular Border */}
          <div style={{ position: 'relative' }}>
            {/* Ambient Backlight */}
            <div
              style={{
                position: 'absolute',
                inset: '-15px',
                borderRadius: '32px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                filter: 'blur(20px)',
                zIndex: 1,
              }}
            />

            <div
              className="squircle-lg"
              style={{
                position: 'relative',
                zIndex: 2,
                borderRadius: '26px',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 28px 70px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.15)',
              }}
            >
              <img
                src={intro.image}
                alt={intro.title}
                style={{
                  width: '100%',
                  height: 'clamp(380px, 45vw, 540px)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

