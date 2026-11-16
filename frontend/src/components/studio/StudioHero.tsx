'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowDown, Sparkles, MessageCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { StudioData } from '@/lib/data/studios';
import { SectionCornerAccent } from '@/components/ui';

interface StudioHeroProps {
  studio: StudioData;
  onRequest: () => void;
}

export default function StudioHero({ studio, onRequest }: StudioHeroProps) {
  const heroImageRef = useRef<HTMLImageElement>(null);

  // Subtle entrance and parallax micro-animation
  useEffect(() => {
    const handleScroll = () => {
      if (!heroImageRef.current) return;
      const scrollY = window.scrollY;
      if (scrollY < 900) {
        heroImageRef.current.style.transform = `scale(${1 + scrollY * 0.00025}) translateY(${scrollY * 0.12}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToContent = () => {
    const el = document.getElementById('studio-intro');
    if (el) {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.scrollTo(el, { duration: 1.2, offset: -40 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="studio-hero"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 'clamp(48px, 8vw, 84px)',
        paddingTop: '120px',
        overflow: 'hidden',
        backgroundColor: '#040406',
      }}
    >
      {/* Background Media Container with Parallax Zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <img
          ref={heroImageRef}
          src={studio.heroMedia.url}
          alt={studio.heroMedia.alt}
          style={{
            width: '100%',
            height: '115%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            transform: 'scale(1)',
            transition: 'transform 0.15s ease-out',
            filter: 'brightness(0.72) contrast(1.08)',
          }}
        />

        {/* Sophisticated Luxury Scrim Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(4, 4, 6, 0.45) 0%, rgba(4, 4, 6, 0.25) 40%, rgba(4, 4, 6, 0.88) 80%, #040406 100%)',
          }}
        />

        {/* Warm Ambient Glow Radial */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <SectionCornerAccent corner="both" />

      {/* Hero Content Container */}
      <div
        className="luxury-container"
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Breadcrumb Navigation Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '24px',
            backgroundColor: 'rgba(8, 8, 12, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            marginBottom: '20px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans-display)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#b8b8c4',
          }}
        >
          <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Home</span>
          </Link>
          <ChevronRight size={12} color="#c9a45c" />
          <Link href="/#services" style={{ color: '#ffffff', textDecoration: 'none' }}>
            <span>Services</span>
          </Link>
          <ChevronRight size={12} color="#c9a45c" />
          <span style={{ color: '#d4af37', fontWeight: 700 }}>{studio.name.split(' ')[0]}</span>
        </div>

        {/* Studio Eyebrow Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <span style={{ width: '28px', height: '1.5px', backgroundColor: '#d4af37' }} />
          <span
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.3em',
              color: '#d4af37',
              textTransform: 'uppercase',
            }}
          >
            {studio.eyebrow}
          </span>
        </div>

        {/* Large Editorial Studio Title */}
        <h1
          style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: 'clamp(2.5rem, 5.8vw, 5.2rem)',
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: '-0.045em',
            color: '#ffffff',
            textTransform: 'uppercase',
            maxWidth: '1050px',
            margin: '0 0 18px 0',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.8)',
          }}
        >
          {studio.name}
        </h1>

        {/* Subtitle / Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-sans-display)',
            fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
            lineHeight: 1.5,
            color: '#f3e5ab',
            maxWidth: '780px',
            margin: '0 0 16px 0',
            fontWeight: 500,
          }}
        >
          {studio.tagline}
        </p>

        {/* Short Descriptive Overview */}
        <p
          style={{
            fontFamily: 'var(--font-sans-display)',
            fontSize: 'clamp(0.88rem, 1.05vw, 0.98rem)',
            lineHeight: 1.65,
            color: '#b8b8c4',
            maxWidth: '680px',
            margin: '0 0 32px 0',
          }}
        >
          {studio.description}
        </p>

        {/* Primary CTA & Interactive Indicator Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onRequest}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
              color: '#08080c',
              border: 'none',
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.45)',
              transition: 'transform 0.22s ease, box-shadow 0.22s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(212, 175, 55, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.45)';
            }}
          >
            <Sparkles size={16} color="#08080c" />
            <span>Request This Service</span>
          </button>

          <button
            onClick={handleScrollToContent}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.14)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
          >
            <span>Explore Studio Details</span>
            <ArrowDown size={15} color="#c9a45c" />
          </button>
        </div>
      </div>
    </section>
  );
}

