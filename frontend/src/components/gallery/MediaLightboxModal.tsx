'use client';

import React, { useEffect } from 'react';
import UniversalVideo from '@/components/video/UniversalVideo';
import { parseVideoUrl, resolveVideoPosterUrl } from '@/lib/videoUtils';

export interface LightboxMediaItem {
  id?: string;
  mediaType: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  caption?: string;
  category?: string;
  platformUrl?: string;
}

interface MediaLightboxModalProps {
  items: LightboxMediaItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
  fallbackSubtitle?: string;
}

export default function MediaLightboxModal({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
  fallbackSubtitle = 'Spark International Salon',
}: MediaLightboxModalProps) {
  const isOpen = activeIndex !== null && Boolean(items[activeIndex]);
  const item = isOpen && activeIndex !== null ? items[activeIndex] : null;
  const total = items.length;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && total > 1) {
        e.preventDefault();
        onChangeIndex((activeIndex + 1) % total);
      } else if (e.key === 'ArrowLeft' && total > 1) {
        e.preventDefault();
        onChangeIndex((activeIndex - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, activeIndex, total, onClose, onChangeIndex]);

  if (!isOpen || activeIndex === null || !item) return null;

  const isVideo = item.mediaType === 'video';
  const parsedVideo = isVideo ? parseVideoUrl(item.url) : null;
  const posterUrl = isVideo ? resolveVideoPosterUrl(item.url, item.thumbnail) : item.thumbnail || item.url;
  const externalLink =
    (parsedVideo && !parsedVideo.isDirect ? parsedVideo.url : item.platformUrl) || '';

  return (
    <>
      <div
        className="spark-lb-backdrop"
        data-lenis-prevent
        onClick={onClose}
        aria-hidden="true"
      />
      <dialog
        open
        className="spark-lb-dlg"
        aria-modal="true"
        aria-label={item.title || 'Media viewer'}
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="spark-lb-inner">
          <div className="spark-lb-topbar">
            <div className="spark-lb-badges">
              {item.category && <span className="spark-lb-chip">{item.category}</span>}
              {parsedVideo && !parsedVideo.isDirect && (
                <span className="spark-lb-chip spark-lb-chip-accent">{parsedVideo.platformLabel}</span>
              )}
              {parsedVideo && parsedVideo.isDirect && (
                <span className="spark-lb-chip spark-lb-chip-accent">Video</span>
              )}
            </div>
            <button
              type="button"
              className="spark-lb-close"
              onClick={onClose}
              aria-label="Close gallery viewer"
            >
              Close (ESC)
            </button>
          </div>

          <div className="spark-lb-stage">
            {!isVideo && (
              <img
                src={item.url || item.thumbnail}
                alt={item.title || 'Gallery photo'}
                className="spark-lb-img"
              />
            )}

            {isVideo && (
              <div
                className="spark-lb-video-wrap"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '1000px',
                  maxHeight: '75vh',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <UniversalVideo
                  key={item.url}
                  videoUrl={item.url}
                  poster={posterUrl || undefined}
                  objectFit="contain"
                  title={item.title || 'Gallery Video'}
                />
              </div>
            )}
          </div>

          <div className="spark-lb-foot">
            <div className="spark-lb-meta">
              <strong>{item.title || 'Studio Signature Look'}</strong>
              <span>{item.caption || fallbackSubtitle}</span>
            </div>

            <div className="spark-lb-actions">
              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spark-lb-ext-link"
                >
                  Open {parsedVideo?.platformLabel || 'Link'} &#8599;
                </a>
              )}
              {total > 1 && (
                <>
                  <span className="spark-lb-counter">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className="spark-lb-nav"
                    onClick={() => onChangeIndex((activeIndex - 1 + total) % total)}
                    aria-label="Previous media"
                  >
                    &#8592;
                  </button>
                  <button
                    type="button"
                    className="spark-lb-nav"
                    onClick={() => onChangeIndex((activeIndex + 1) % total)}
                    aria-label="Next media"
                  >
                    &#8594;
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </dialog>

      <style jsx>{`
        .spark-lb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(12, 12, 12, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99990;
        }
        .spark-lb-dlg {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          margin: 0 !important;
          width: min(1040px, 94vw);
          max-height: 94vh;
          padding: 0;
          background: #0c0c0c;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 16px;
          overflow: hidden;
          z-index: 100000 !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.65);
        }
        .spark-lb-inner {
          display: flex;
          flex-direction: column;
          padding: 20px 24px 22px;
          width: 100%;
          max-height: 94vh;
          overflow-y: auto;
          overscroll-behavior: contain;
          box-sizing: border-box;
        }
        .spark-lb-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .spark-lb-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .spark-lb-chip {
          font: 600 10px/1 var(--font-sans, system-ui, sans-serif);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.88);
        }
        .spark-lb-chip-accent {
          background: rgba(200, 16, 46, 0.25);
          border: 1px solid rgba(200, 16, 46, 0.5);
          color: #ff6b7d;
        }
        .spark-lb-close {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 999px;
          padding: 7px 14px;
          font: 600 10.5px/1 var(--font-sans, system-ui, sans-serif);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .spark-lb-close:hover {
          background: #c8102e;
          border-color: #c8102e;
        }
        .spark-lb-stage {
          width: 100%;
          height: min(68vh, 620px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          border-radius: 10px;
          overflow: hidden;
        }
        .spark-lb-img,
        .spark-lb-video {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }
        .spark-lb-video {
          width: 100%;
          height: 100%;
          background: #000;
        }
        .spark-lb-embed-wide {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spark-lb-embed-wide iframe {
          width: min(100%, calc(min(68vh, 620px) * 16 / 9));
          aspect-ratio: 16 / 9;
          height: auto;
          max-height: 100%;
          border: 0;
          border-radius: 8px;
          background: #000;
        }
        .spark-lb-embed-portrait {
          width: min(400px, 100%);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spark-lb-embed-portrait iframe {
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 8px;
          background: #141414;
        }
        .spark-lb-external-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          height: 100%;
          padding: 24px;
        }
        .spark-lb-external-thumb {
          max-width: 100%;
          max-height: calc(100% - 60px);
          object-fit: contain;
          border-radius: 8px;
        }
        .spark-lb-external-placeholder {
          font: 600 13px/1 var(--font-sans, system-ui, sans-serif);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.65);
        }
        .spark-lb-external-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 999px;
          background: #c8102e;
          color: #ffffff;
          text-decoration: none;
          font: 600 11px/1 var(--font-sans, system-ui, sans-serif);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .spark-lb-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 16px;
        }
        .spark-lb-meta strong {
          display: block;
          font: 600 16px/1.25 var(--font-sans, system-ui, sans-serif);
          color: #ffffff;
        }
        .spark-lb-meta span {
          display: block;
          margin-top: 3px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
        }
        .spark-lb-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .spark-lb-ext-link {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.28);
          padding: 8px 14px;
          border-radius: 999px;
          text-decoration: none;
          font: 600 10.5px/1 var(--font-sans, system-ui, sans-serif);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .spark-lb-ext-link:hover {
          background: #c8102e;
          border-color: #c8102e;
        }
        .spark-lb-counter {
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.72);
        }
        .spark-lb-nav {
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #ffffff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .spark-lb-nav:hover {
          background: #c8102e;
          border-color: #c8102e;
        }
        @media (max-width: 640px) {
          .spark-lb-inner {
            padding: 14px 16px 16px;
          }
          .spark-lb-stage {
            height: 58vh;
          }
        }
      `}</style>
    </>
  );
}

