'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
import { StudioGalleryMedia } from '@/lib/data/studios';
import UniversalVideo from '@/components/video/UniversalVideo';

interface StudioGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StudioGalleryMedia[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onRequestFromLook: (caption: string) => void;
}

export default function StudioGalleryModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  onRequestFromLook,
}: StudioGalleryModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Studio Gallery Fullscreen Lightbox"
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999998,
        backgroundColor: 'rgba(3, 3, 6, 0.96)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        display: 'flex',
        flexDirection: 'column',
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
      {/* Top Controls Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans-display)' }}>
            {currentItem.category}
          </span>
          <span style={{ color: '#888894', fontSize: '0.8rem', fontFamily: 'var(--font-sans-display)' }}>
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
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
          <X size={20} />
        </button>
      </div>

      {/* Main Media Container */}
      <div
        style={{
          position: 'relative',
          maxWidth: 'min(1100px, 92vw)',
          maxHeight: 'min(72vh, 760px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {currentItem.mediaType === 'video' ? (
          <div
            style={{
              width: 'min(92vw, 800px)',
              height: 'min(70vh, 520px)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <UniversalVideo
              videoUrl={currentItem.url}
              poster={currentItem.thumbnail}
              objectFit="contain"
              title={currentItem.title}
            />
          </div>
        ) : (
          <img
            src={currentItem.url}
            alt={currentItem.title}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          />
        )}
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
        aria-label="Previous Image"
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(12, 12, 16, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          color: '#f3e5ab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={() => onNavigate((currentIndex + 1) % items.length)}
        aria-label="Next Image"
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'rgba(12, 12, 16, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          color: '#f3e5ab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Bottom Info Bar & Action Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: 'rgba(12, 12, 16, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: '14px 22px',
          maxWidth: '980px',
          margin: '0 auto',
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 4px 0',
            }}
          >
            {currentItem.title}
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-sans-display)',
              fontSize: '0.8rem',
              color: '#b8b8c4',
              margin: 0,
            }}
          >
            {currentItem.caption}
          </p>
        </div>

        <button
          onClick={() => {
            onClose();
            onRequestFromLook(currentItem.title);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
            color: '#08080c',
            border: 'none',
            fontFamily: 'var(--font-sans-display)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={14} color="#08080c" />
          <span>Request This Look</span>
        </button>
      </div>
    </div>,
    document.body
  );
}

