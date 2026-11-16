'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import './DouglusPlaygroundGallery.css';

export interface PlaygroundGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  matColor: string;
  row: number;
  col?: number;
}

interface DouglusPlaygroundGalleryProps {
  serviceSlug: string;
  serviceName: string;
  categoryName?: string;
  tagline?: string;
  items: PlaygroundGalleryItem[];
}

export default function DouglusPlaygroundGallery({
  serviceSlug,
  serviceName,
  categoryName = 'Curated Visual Portfolio',
  tagline = 'A curated visual exploration of master craft, editorial finesse, and transformative artistry.',
  items,
}: DouglusPlaygroundGalleryProps) {
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Drag & Scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Position & Physics references
  const animRef = useRef({
    currentY: 0,
    targetY: 0,
    currentX: 0,
    targetX: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    dragStartX: 0,
    dragStartY: 0,
    dragInitialX: 0,
    dragInitialY: 0,
    isPointerDown: false,
    maxScrollY: 0,
  });

  // Group items by row for the Douglus layout (Row 1..6)
  const rows = useMemo(() => {
    const rowMap: Record<number, PlaygroundGalleryItem[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };
    items.forEach((item) => {
      const r = item.row >= 1 && item.row <= 6 ? item.row : 1;
      rowMap[r].push(item);
    });
    return Object.entries(rowMap).map(([rowNum, rowItems]) => ({
      rowNum: Number(rowNum),
      items: rowItems,
    }));
  }, [items]);

  // Compute maximum scroll translation on desktop
  const updateMetrics = useCallback(() => {
    if (!stageRef.current || !viewportRef.current) return;
    const stageHeight = stageRef.current.offsetHeight;
    const viewportHeight = viewportRef.current.offsetHeight;
    // Maximum upward translation so the entire gallery passes through the screen
    animRef.current.maxScrollY = Math.max(0, stageHeight - viewportHeight * 0.7);
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [updateMetrics]);

  // Unified RequestAnimationFrame Physics Loop for Desktop
  useEffect(() => {
    let rafId: number;
    let isDesktop = window.innerWidth >= 1024;

    const handleResize = () => {
      isDesktop = window.innerWidth >= 1024;
    };
    window.addEventListener('resize', handleResize);

    const tick = () => {
      if (isDesktop && stageRef.current && pinTrackRef.current) {
        const state = animRef.current;

        // If user is not dragging, scroll position drives targetY
        if (!state.isPointerDown) {
          const rect = pinTrackRef.current.getBoundingClientRect();
          const trackHeight = pinTrackRef.current.offsetHeight;
          const windowHeight = window.innerHeight;

          // Scroll progress through the pinned track (0 to 1)
          const scrollProgress = Math.min(
            1,
            Math.max(0, -rect.top / (trackHeight - windowHeight))
          );

          // Map scroll progress to vertical travel
          const scrollTarget = -scrollProgress * state.maxScrollY;
          // Soft pull back to center on X
          state.targetX *= 0.95;
          state.targetY = scrollTarget;
        }

        // Smooth Lerp Momentum (Douglus inertia effect)
        const lerpFactor = state.isPointerDown ? 0.18 : 0.08;
        state.currentX += (state.targetX - state.currentX) * lerpFactor;
        state.currentY += (state.targetY - state.currentY) * lerpFactor;

        // Velocity computation for subtle tilt deformation
        state.vx = state.currentX - state.prevX;
        state.vy = state.currentY - state.prevY;
        state.prevX = state.currentX;
        state.prevY = state.currentY;

        // Subtle dynamic tilt / skew based on horizontal glide speed
        const tiltDeg = Math.min(3, Math.max(-3, state.vx * 0.04));

        stageRef.current.style.transform = `translate3d(${state.currentX.toFixed(2)}px, ${state.currentY.toFixed(2)}px, 0px) rotate(${tiltDeg.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Pointer Drag Handlers (Click & Drag in 2D space)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore clicks on links or buttons
    if ((e.target as HTMLElement).closest('button, a')) return;
    const state = animRef.current;
    state.isPointerDown = true;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    state.dragInitialX = state.targetX;
    state.dragInitialY = state.targetY;
    setIsDragging(true);
    setHasInteracted(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const state = animRef.current;
    if (!state.isPointerDown) return;
    const deltaX = e.clientX - state.dragStartX;
    const deltaY = e.clientY - state.dragStartY;

    // Constrain horizontal drag bounds (-180px to 180px)
    state.targetX = Math.min(180, Math.max(-180, state.dragInitialX + deltaX * 1.1));
    // Vertical drag with soft damping
    state.targetY = state.dragInitialY + deltaY * 1.1;
  }, []);

  const onPointerUp = useCallback(() => {
    const state = animRef.current;
    state.isPointerDown = false;
    setIsDragging(false);
  }, []);

  // Lightbox Navigation
  const openLightbox = (index: number) => {
    setActiveItemIndex(index);
  };

  const closeLightbox = () => {
    setActiveItemIndex(null);
  };

  const nextLightbox = () => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((activeItemIndex + 1) % items.length);
  };

  const prevLightbox = () => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((activeItemIndex - 1 + items.length) % items.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemIndex]);

  return (
    <section className="pgs-gallery" id="gallery" aria-label={`${serviceName} Playground Gallery`}>
      {/* Editorial Intro Section (Douglus .pg header) */}
      <div className="pg-intro">
        <p className="pg-intro__eyebrow">{categoryName}</p>
        <h2 className="pg-intro__title">
          <span>{serviceName} Playground</span>
        </h2>
        <div className="pg-intro__desc-wrap">
          <span className="pg-intro__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
          <p className="pg-intro__desc">{tagline}</p>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          1. Desktop Pinned Interactive Drag Stage (.pgd)
          Active on Desktop Viewports (>= 1024px)
          ---------------------------------------------------------------------- */}
      <div className="pgd-pin-track" ref={pinTrackRef} data-playground-drag-pin>
        <div
          className={`pgd-sticky-viewport ${isDragging ? 'is-dragging' : ''}`}
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          data-playground-drag
        >
          {/* Animated Stage Container */}
          <div className="pgd-stage" ref={stageRef}>
            <div className="pw-wall">
              {rows.map(({ rowNum, items: rowItems }) => (
                <div key={rowNum} className="pw-row">
                  {rowItems.map((item) => {
                    const globalIdx = items.findIndex((i) => i.id === item.id);
                    return (
                      <article
                        key={item.id}
                        className="pw-card"
                        data-playground-card
                        style={
                          {
                            '--card-bg': item.matColor,
                            '--col': item.col ? String(item.col) : undefined,
                          } as React.CSSProperties
                        }
                        onClick={() => openLightbox(globalIdx)}
                      >
                        <span className="pw-card__tag">{item.category}</span>
                        <div className="pw-card__frame">
                          <img
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <h3 className="pw-card__caption">{item.caption}</h3>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Pill Hint (Douglus .pgd__h) */}
          <div className={`pgd-hint ${hasInteracted ? 'is-hidden' : ''}`} data-playground-drag-hint>
            <div className="pgd-hint__badge">
              <span className="pgd-hint__dot" />
              <span>Scroll or drag to explore</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          2. Mobile & Tablet Responsive Stream (.pw)
          Active on Screens < 1024px or Reduced Motion
          ---------------------------------------------------------------------- */}
      <div className="pw-mobile-stream">
        <div className="pw-wall">
          {rows.map(({ rowNum, items: rowItems }) => (
            <div key={`m-${rowNum}`} className="pw-row">
              {rowItems.map((item) => {
                const globalIdx = items.findIndex((i) => i.id === item.id);
                return (
                  <article
                    key={`m-${item.id}`}
                    className="pw-card"
                    style={
                      {
                        '--card-bg': item.matColor,
                        '--col': item.col ? String(item.col) : undefined,
                      } as React.CSSProperties
                    }
                    onClick={() => openLightbox(globalIdx)}
                  >
                    <span className="pw-card__tag">{item.category}</span>
                    <div className="pw-card__frame">
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className="pw-card__caption">{item.caption}</h3>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          3. Full High-Definition Lightbox Modal
          ---------------------------------------------------------------------- */}
      {activeItemIndex !== null && items[activeItemIndex] && (
        <div
          className="pg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={items[activeItemIndex].caption}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="pg-lightbox__header">
            <span className="pg-lightbox__counter">
              {String(activeItemIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button
              className="pg-lightbox__close"
              type="button"
              onClick={closeLightbox}
              aria-label="Close image viewer"
            >
              &times;
            </button>
          </div>

          <button
            className="pg-lightbox__arrow pg-lightbox__arrow--prev"
            type="button"
            onClick={prevLightbox}
            aria-label="Previous artwork"
          >
            &#8592;
          </button>

          <div className="pg-lightbox__content">
            <img
              className="pg-lightbox__img"
              src={items[activeItemIndex].src}
              alt={items[activeItemIndex].alt}
            />
            <div className="pg-lightbox__footer">
              <span className="pg-lightbox__tag">{items[activeItemIndex].category}</span>
              <h4 className="pg-lightbox__caption">{items[activeItemIndex].caption}</h4>
            </div>
          </div>

          <button
            className="pg-lightbox__arrow pg-lightbox__arrow--next"
            type="button"
            onClick={nextLightbox}
            aria-label="Next artwork"
          >
            &#8594;
          </button>
        </div>
      )}
    </section>
  );
}

