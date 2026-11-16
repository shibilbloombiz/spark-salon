'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { StudioGalleryMedia } from '@/lib/data/studios';
import UniversalVideo from '@/components/video/UniversalVideo';
import './ServiceGallery.css';

export interface ServiceGalleryProps {
  items: StudioGalleryMedia[];
  onOpenLightbox?: (index: number) => void;
  accentColor?: string;
  className?: string;
}

export default function ServiceGallery({
  items,
  onOpenLightbox,
  accentColor = '#d4af37',
  className = '',
}: ServiceGalleryProps) {
  if (!items || items.length === 0) return null;

  // Ensure 8 items for the layout; if fewer items exist, cycle through items
  const displayItems: StudioGalleryMedia[] = Array.from({ length: 8 }, (_, idx) => {
    return items[idx % items.length];
  });

  return (
    <section id="studio-gallery" className={`service-gallery-section ${className}`}>
      {/* Subtle Ambient Backlight Glow */}
      <div
        className="service-gallery-ambient"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}18 0%, transparent 70%)`,
        }}
      />

      <div className="service-gallery-container">
        {/* Luxury Bounded Editorial Frame */}
        <div className="service-gallery-frame">
          <div className="service-gallery-grid">
            {displayItems.map((item, index) => {
              const isDominant = index === 7;
              const isVideo = item.mediaType === 'video' || item.url.endsWith('.mp4');
              const originalIndex = index % items.length;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`service-gallery-item service-gallery-cell-${index}`}
                  onClick={() => onOpenLightbox && onOpenLightbox(originalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && onOpenLightbox) {
                      e.preventDefault();
                      onOpenLightbox(originalIndex);
                    }
                  }}
                  aria-label={`View media ${originalIndex + 1}`}
                >
                  {isVideo ? (
                    <UniversalVideo
                      videoUrl={item.url}
                      poster={item.thumbnail}
                      objectFit="cover"
                      className="service-gallery-media"
                      title={item.title || `Gallery look ${originalIndex + 1}`}
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      loading={isDominant || index === 1 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="service-gallery-media"
                    />
                  )}

                  {/* Subtle Cinematic Vignette Scrim */}
                  <div className="service-gallery-scrim" />

                  {/* Minimal Video Indicator if video */}
                  {isVideo && (
                    <div className="service-gallery-video-indicator" aria-hidden="true">
                      <Play size={11} fill="currentColor" style={{ marginLeft: '1px' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

