'use client';

import React from 'react';
import { Award, Clock, ArrowRight, UserCheck, Sparkles, ExternalLink } from 'lucide-react';
import { StudioData, StudioArtist } from '@/lib/data/studios';
import { SectionCornerAccent } from '@/components/ui';

interface StudioArtistsProps {
  studio: StudioData;
  onSelectArtistProfile: (artist: StudioArtist) => void;
  onRequestArtist: (artistName: string) => void;
}

export default function StudioArtists({
  studio,
  onSelectArtistProfile,
  onRequestArtist,
}: StudioArtistsProps) {
  if (!studio.artists || studio.artists.length === 0) return null;

  return (
    <section
      id="studio-artists"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 9vw, 130px) 0',
        backgroundColor: '#050508',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <SectionCornerAccent corner="both" />

      <div className="luxury-container" style={{ position: 'relative', zIndex: 2, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.24em',
              color: '#d4af37',
              textTransform: 'uppercase',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ width: '24px', height: '1.5px', backgroundColor: '#d4af37' }} />
            <span>04 — ATELIER DIRECTORS & MASTER ARTISANS</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Meet the Artists
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: 'clamp(0.92rem, 1.1vw, 1.02rem)',
              lineHeight: 1.6,
              color: '#b8b8c4',
              margin: 0,
            }}
          >
            International academy certified master stylists, color alchemists, and aesthetic directors dedicated to personalized transformations. Tap any profile to view full credentials and portfolio.
          </p>
        </div>

        {/* Editorial Artist Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: '32px',
          }}
        >
          {studio.artists.map((artist) => (
            <div
              key={artist.id}
              className="squircle-lg"
              style={{
                position: 'relative',
                backgroundColor: '#0c0c11',
                borderRadius: '24px',
                border: '1px solid rgba(212, 175, 55, 0.28)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.55)';
                e.currentTarget.style.boxShadow =
                  '0 28px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 175, 55, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.28)';
                e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.7)';
              }}
            >
              {/* Portrait Image Container */}
              <div
                onClick={() => onSelectArtistProfile(artist)}
                style={{
                  position: 'relative',
                  height: '360px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={artist.profileImage}
                  alt={artist.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.05)',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Scrim Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 40%, rgba(8, 8, 12, 0.4) 65%, rgba(8, 8, 12, 0.95) 100%)',
                  }}
                />



                {/* Profile Expansion Hint Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(8, 8, 12, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ExternalLink size={15} />
                </div>

                {/* Name & Experience at Bottom of Portrait */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    right: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif-display)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
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
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <Clock size={12} />
                    <span>{artist.experience}</span>
                  </div>
                </div>
              </div>

              {/* Artist Card Body */}
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.84rem',
                      color: '#e4e2e8',
                      fontWeight: 600,
                      marginBottom: '10px',
                      lineHeight: 1.4,
                    }}
                  >
                    {artist.speciality}
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      color: '#9e9ea8',
                      margin: '0 0 16px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {artist.biography}
                  </p>

                  {/* Skills List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {artist.skills.slice(0, 3).map((sk, i) => (
                      <span
                        key={i}
                        style={{
                          color: '#b0afb8',
                          fontSize: '0.72rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {i > 0 && <span style={{ marginRight: '8px', color: 'rgba(212, 175, 55, 0.4)' }}>•</span>}
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Request Artist CTA Button */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                  <button
                    onClick={() => onRequestArtist(artist.name)}
                    style={{
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.45)',
                      color: '#f3e5ab',
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #aa8210 0%, #d4af37 100%)';
                      e.currentTarget.style.color = '#08080c';
                      e.currentTarget.style.borderColor = '#d4af37';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                      e.currentTarget.style.color = '#f3e5ab';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                    }}
                  >
                    <UserCheck size={14} />
                    <span>Request Artist</span>
                  </button>

                  <button
                    onClick={() => onSelectArtistProfile(artist)}
                    aria-label={`View full profile of ${artist.name}`}
                    style={{
                      padding: '11px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

