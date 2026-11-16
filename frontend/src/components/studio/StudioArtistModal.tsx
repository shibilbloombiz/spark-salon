'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Award, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { StudioArtist } from '@/lib/data/studios';

interface StudioArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: StudioArtist | null;
  onRequestArtist: (artistName: string) => void;
}

export default function StudioArtistModal({
  isOpen,
  onClose,
  artist,
  onRequestArtist,
}: StudioArtistModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !artist) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${artist.name} Profile`}
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999998,
        backgroundColor: 'rgba(3, 3, 6, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        animation: 'sparkFadeIn 0.25s ease forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="squircle-lg"
        data-lenis-prevent
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          backgroundColor: '#0c0c10',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.14)',
          padding: 'clamp(24px, 5vw, 36px)',
          color: '#ffffff',
        }}
      >
        {/* Top Gold Specular Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '30px',
            right: '30px',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 25%, rgba(255, 248, 220, 0.9) 50%, rgba(212, 175, 55, 0.3) 75%, transparent 100%)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Profile"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
        >
          <X size={18} />
        </button>

        {/* Artist Profile Header */}
        <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
          <div
            style={{
              position: 'relative',
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              flexShrink: 0,
            }}
          >
            <img
              src={artist.profileImage}
              alt={artist.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div
              style={{
                color: '#d4af37',
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {artist.designation}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 4px 0',
              }}
            >
              {artist.name}
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#c9a45c',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-sans-display)',
              }}
            >
              <Clock size={13} />
              <span>{artist.experience}</span>
            </div>
          </div>
        </div>

        {/* Speciality Banner */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.06)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#c9a45c', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Artistic Speciality
          </div>
          <div style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>
            {artist.speciality}
          </div>
        </div>

        {/* Biography */}
        <div style={{ marginBottom: '22px' }}>
          <h4
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8b8b98',
              marginBottom: '8px',
            }}
          >
            Biography & Philosophy
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: '#d4d2d8',
              margin: 0,
            }}
          >
            {artist.biography}
          </p>
        </div>

        {/* Key Mastery Skills */}
        <div style={{ marginBottom: '28px' }}>
          <h4
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8b8b98',
              marginBottom: '10px',
            }}
          >
            Core Techniques
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {artist.skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  color: '#d4d2d8',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-sans-display)',
                }}
              >
                {i > 0 && <span style={{ marginRight: '8px', color: 'rgba(212, 175, 55, 0.4)' }}>•</span>}
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Request This Artist CTA Button */}
        <button
          onClick={() => {
            onClose();
            onRequestArtist(artist.name);
          }}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
            color: '#08080c',
            border: 'none',
            fontFamily: 'var(--font-sans-display)',
            fontSize: '0.88rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
            transition: 'transform 0.2s ease',
          }}
        >
          <UserCheck size={18} color="#08080c" />
          <span>Request Appointment With {artist.name}</span>
          <ArrowRight size={16} color="#08080c" />
        </button>
      </div>
    </div>,
    document.body
  );
}

