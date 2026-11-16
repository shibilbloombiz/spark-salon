'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Play, Move } from 'lucide-react';
import { parseVideoUrl, resolveVideoPosterUrl } from '@/lib/videoUtils';
import './StudioPlaygroundGallery.css';

export interface StudioGalleryInputItem {
  id?: string;
  mediaType?: 'image' | 'video';
  url?: string;
  thumbnail?: string;
  title?: string;
  caption?: string;
  category?: string;
}

export interface StudioPlaygroundGalleryProps {
  studioName?: string;
  studioSlug?: string;
  galleryImages?: StudioGalleryInputItem[];
  galleryItems?: StudioGalleryInputItem[];
  onSelectImage?: (index: number) => void;
}

interface ResolvedCard {
  id: string;
  url: string;
  title: string;
  isVideo: boolean;
  galleryIndex: number;
  col: number;
  row: number;
}

const FALLBACK_IMAGES = [
  '/images/services/hair-couture.jpg',
  '/images/gallery/signature-brunette.webp',
  '/images/services/bridal-masterpiece.jpg',
  '/images/gallery/regal-bridal-couture.webp',
  '/images/services/beard-grooming.jpg',
  '/images/gallery/glamour-makeup-portrait.webp',
  '/images/services/nail-detailing.jpg',
  '/images/gallery/luxury-marble-manicure.webp',
  '/images/services/skin-waxing.jpg',
  '/images/gallery/cellular-facial-mask.webp',
  '/images/services/spa-wellness.jpg',
  '/images/gallery/precision-shears-cutting.webp',
];

export default function StudioPlaygroundGallery({
  studioName = 'Studio',
  galleryImages = [],
  galleryItems,
  onSelectImage,
}: StudioPlaygroundGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const rawItems = useMemo(
    () => (galleryItems && galleryItems.length > 0 ? galleryItems : galleryImages || []),
    [galleryItems, galleryImages]
  );

  // Prepare a normalized pool of unique, high quality gallery items
  const normalizedItems = useMemo(() => {
    const list: { url: string; title: string; isVideo: boolean; originalIndex: number }[] = [];
    const seen = new Set<string>();

    rawItems.forEach((item, idx) => {
      const isVid = item.mediaType === 'video';
      const displayUrl = isVid
        ? resolveVideoPosterUrl(item.url, item.thumbnail)
        : (item.url || item.thumbnail || '').trim();

      if (displayUrl && !seen.has(displayUrl)) {
        seen.add(displayUrl);
        list.push({
          url: displayUrl,
          title: item.title || `${studioName} Portfolio`,
          isVideo: isVid,
          originalIndex: idx,
        });
      }
    });

    // Fill with curated studio visuals if needed to reach at least 12 cards
    let fallbackIdx = 0;
    while (list.length < 12 && fallbackIdx < FALLBACK_IMAGES.length) {
      const url = FALLBACK_IMAGES[fallbackIdx];
      if (!seen.has(url)) {
        seen.add(url);
        list.push({
          url,
          title: `${studioName} Signature Work`,
          isVideo: false,
          originalIndex: rawItems.length > 0 ? fallbackIdx % rawItems.length : 0,
        });
      }
      fallbackIdx++;
    }

    return list;
  }, [rawItems, studioName]);

  // Layout configuration: 4 columns × 3 rows = 12 cards (desktop) / 3 cols × 2 rows (mobile)
  const cards = useMemo<ResolvedCard[]>(() => {
    const cols = 4;
    const rows = 3;
    const count = cols * rows; // 12 cards
    const res: ResolvedCard[] = [];

    for (let i = 0; i < count; i++) {
      const item = normalizedItems[i % normalizedItems.length];
      const col = i % cols;
      const row = Math.floor(i / cols);
      res.push({
        id: `card-${col}-${row}`,
        url: item.url,
        title: item.title,
        isVideo: item.isVideo,
        galleryIndex: item.originalIndex,
        col,
        row,
      });
    }

    return res;
  }, [normalizedItems]);

  // Physics and drag state refs (avoid React re-render overhead during animation)
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    down: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    rafId: 0,
    movedDist: 0,
    cardEls: [] as HTMLDivElement[],
  });

  // Direct DOM render function for 60+ FPS compositor-driven transforms
  const renderTransforms = useCallback(() => {
    const s = stateRef.current;
    const isMobile = window.innerWidth <= 768;

    const cardW = isMobile ? 220 : 340;
    const cardH = isMobile ? 290 : 430;
    const gap = isMobile ? 16 : 24;

    const cols = 4;
    const rows = 3;
    const totalW = cols * (cardW + gap);
    const totalH = rows * (cardH + gap);

    const vpW = window.innerWidth;
    const vpH = isMobile ? 520 : 750;

    s.cardEls.forEach((el, idx) => {
      if (!el) return;
      const card = cards[idx];
      if (!card) return;

      const baseX = card.col * (cardW + gap);
      const baseY = card.row * (cardH + gap);

      // Seamless toroidal / modulo wrap around viewport dimensions
      let screenX = ((baseX + s.x) % totalW + totalW) % totalW - (cardW + gap);
      let screenY = ((baseY + s.y) % totalH + totalH) % totalH - (cardH + gap);

      // Keep cards centered across wide screens
      if (screenX < -(cardW + gap)) screenX += totalW;
      if (screenX > vpW + gap) screenX -= totalW;

      if (!isMobile) {
        if (screenY < -(cardH + gap)) screenY += totalH;
        if (screenY > vpH + gap) screenY -= totalH;
      }

      el.style.width = `${cardW}px`;
      el.style.height = `${cardH}px`;
      el.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)`;
    });
  }, [cards]);

  // Inertia momentum animation loop
  const startInertia = useCallback(() => {
    const s = stateRef.current;
    if (s.rafId) cancelAnimationFrame(s.rafId);

    const step = () => {
      if (s.down) return;

      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.92; // Friction damping
      s.vy *= 0.92;

      renderTransforms();

      if (Math.abs(s.vx) > 0.08 || Math.abs(s.vy) > 0.08) {
        s.rafId = requestAnimationFrame(step);
      } else {
        s.vx = 0;
        s.vy = 0;
        s.rafId = 0;
      }
    };

    s.rafId = requestAnimationFrame(step);
  }, [renderTransforms]);

  // Pointer event handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Cache card element references
    stateRef.current.cardEls = Array.from(el.querySelectorAll('.studio-pg-card'));
    renderTransforms();

    const handlePointerDown = (e: PointerEvent) => {
      // Allow primary button or touch only
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const s = stateRef.current;
      s.down = true;
      s.startX = e.clientX;
      s.startY = e.clientY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = performance.now();
      s.vx = 0;
      s.vy = 0;
      s.movedDist = 0;

      if (s.rafId) {
        cancelAnimationFrame(s.rafId);
        s.rafId = 0;
      }

      setIsDragging(true);
      el.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.down) return;

      const isMobile = window.innerWidth <= 768;
      const dx = e.clientX - s.lastX;
      const dy = isMobile ? 0 : e.clientY - s.lastY; // Restrict mobile to horizontal dragging

      s.movedDist += Math.hypot(dx, dy);
      s.x += dx;
      s.y += dy;

      const now = performance.now();
      const dt = Math.max(16, now - s.lastT);
      s.lastT = now;

      // Smoothed velocity
      s.vx = (dx / dt) * 16;
      s.vy = (dy / dt) * 16;

      s.lastX = e.clientX;
      s.lastY = e.clientY;

      renderTransforms();
    };

    const handlePointerUp = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.down) return;
      s.down = false;
      setIsDragging(false);

      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe ignore
      }

      // If user merely tapped/clicked without substantial drag (< 6px), trigger card click
      if (s.movedDist < 6) {
        const targetCard = (e.target as HTMLElement)?.closest('.studio-pg-card') as HTMLElement;
        if (targetCard && targetCard.dataset.idx !== undefined) {
          const gIdx = parseInt(targetCard.dataset.idx, 10);
          onSelectImage?.(gIdx);
          return;
        }
      }

      // Clamp max velocity to prevent uncontrolled spinning
      s.vx = Math.max(-28, Math.min(28, s.vx));
      s.vy = Math.max(-28, Math.min(28, s.vy));

      startInertia();
    };

    // Horizontal trackpad gesture support (without hijacking vertical page scroll)
    const handleWheel = (e: WheelEvent) => {
      // Only respond to horizontal trackpad wheel gestures
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
        const s = stateRef.current;
        s.x -= e.deltaX * 0.8;
        s.vx = -e.deltaX * 0.2;
        renderTransforms();
        startInertia();
      }
      // Never call e.preventDefault() on vertical wheel: let natural page scroll breathe!
    };

    const handleResize = () => {
      renderTransforms();
    };

    el.addEventListener('pointerdown', handlePointerDown);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', handlePointerUp);
    el.addEventListener('pointercancel', handlePointerUp);
    el.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
      el.removeEventListener('pointercancel', handlePointerUp);
      el.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (stateRef.current.rafId) cancelAnimationFrame(stateRef.current.rafId);
    };
  }, [cards, onSelectImage, renderTransforms, startInertia]);

  return (
    <section className="studio-pg-section" id="gallery" aria-label={`${studioName} Gallery`}>
      <div
        ref={containerRef}
        className={`studio-pg-viewport ${isDragging ? 'is-dragging' : ''}`}
        tabIndex={0}
        aria-label="Interactive draggable studio visual archive"
      >
        <div ref={worldRef} className="studio-pg-world" aria-hidden="true">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="studio-pg-card"
              data-idx={card.galleryIndex}
              role="button"
              aria-label={`View ${card.title}`}
            >
              <img
                src={card.url}
                alt={card.title}
                className="studio-pg-card-img"
                loading="eager"
                draggable={false}
              />

              {card.isVideo && (
                <span className="studio-pg-card-badge">
                  <Play size={10} fill="#ffffff" />
                  <span>Video</span>
                </span>
              )}

              <div className="studio-pg-card-info">
                <p className="studio-pg-card-title">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Minimalist interactive drag hint */}
        <div className="studio-pg-hint">
          <Move size={12} />
          <span>Drag to explore</span>
        </div>
      </div>
    </section>
  );
}
