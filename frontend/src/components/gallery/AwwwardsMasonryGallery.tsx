'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MASONRY_GALLERY_ITEMS,
  CATEGORY_TABS,
  slugToCategory,
  type MasonryGalleryItem,
  type GalleryCategory,
} from '@/lib/data/masonryGalleryData';
import './AwwwardsMasonryGallery.css';

interface AwwwardsMasonryGalleryProps {
  initialCategory?: string;
  studioName?: string;
}

const ITEMS_PER_PAGE = 12;

export default function AwwwardsMasonryGallery({
  initialCategory,
  studioName,
}: AwwwardsMasonryGalleryProps) {
  // Category state
  const defaultCat: GalleryCategory = useMemo(() => {
    const mapped = slugToCategory(initialCategory);
    return mapped !== 'all' ? mapped : 'all';
  }, [initialCategory]);

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(defaultCat);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Responsive column count
  const [columnCount, setColumnCount] = useState<number>(4);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter tab scroll container ref for mobile
  const tabsNavRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLElement>(null);

  // Parallax offsets for columns
  const [scrollY, setScrollY] = useState(0);

  // Update responsive column count based on window width
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1200) {
        setColumnCount(4);
      } else if (w >= 1024) {
        setColumnCount(3);
      } else {
        setColumnCount(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop subtle parallax scroll listener
  useEffect(() => {
    if (columnCount < 3) return; // Disable parallax on tablet & mobile
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (gallerySectionRef.current) {
            const rect = gallerySectionRef.current.getBoundingClientRect();
            // Relative scroll within section
            const offset = -rect.top;
            setScrollY(offset);
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [columnCount]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return MASONRY_GALLERY_ITEMS;
    }
    return MASONRY_GALLERY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Sliced items up to visibleCount
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Distribute displayed items into independent masonry columns
  const columns = useMemo(() => {
    const cols: MasonryGalleryItem[][] = Array.from({ length: columnCount }, () => []);
    displayedItems.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });
    return cols;
  }, [displayedItems, columnCount]);

  // Reset pagination when category changes
  const handleCategoryChange = (cat: GalleryCategory) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);

    // Scroll active category tab into view on mobile
    if (tabsNavRef.current) {
      const activeBtn = tabsNavRef.current.querySelector<HTMLButtonElement>(`[data-cat="${cat}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Load More handler
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
  };

  // Lightbox handlers
  const openLightbox = (item: MasonryGalleryItem) => {
    const idx = displayedItems.findIndex((it) => it.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % displayedItems.length);
  }, [lightboxIndex, displayedItems.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + displayedItems.length) % displayedItems.length);
  }, [lightboxIndex, displayedItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent background scrolling
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const win = window as any;
    if (win.lenis && typeof win.lenis.stop === 'function') {
      win.lenis.stop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
      if (win.lenis && typeof win.lenis.start === 'function') {
        win.lenis.start();
      }
    };
  }, [lightboxIndex, closeLightbox, nextLightbox, prevLightbox]);

  // Mobile Touch Swipe for Lightbox
  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(dx) > 45) {
      if (dx < 0) nextLightbox();
      else prevLightbox();
    }
    touchStartXRef.current = null;
  };

  const currentLightboxItem = lightboxIndex !== null ? displayedItems[lightboxIndex] : null;

  return (
    <section
      className="aww-masonry-section"
      id="gallery"
      ref={gallerySectionRef}
      aria-label="Salon Artistry Gallery"
    >
      <div className="aww-gallery-container">
        {/* 1. Gallery Header */}
        <header className="aww-gallery-header">
          <div className="aww-gallery-header-text">
            <span className="aww-gallery-eyebrow">
              {studioName ? `${studioName.toUpperCase()} · ` : ''}PORTFOLIO ATELIER
            </span>
            <h2 className="aww-gallery-title">Beauty in Every Moment</h2>
            <p className="aww-gallery-subtitle">
              A glimpse into our world of style, care and transformation.
            </p>
          </div>

          {/* 2. Category Filter Navigation */}
          <nav
            className="aww-gallery-nav"
            ref={tabsNavRef}
            aria-label="Gallery category filters"
          >
            <div className="aww-gallery-tabs">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-cat={tab.id}
                    type="button"
                    className={`aww-tab-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleCategoryChange(tab.id)}
                    aria-pressed={isActive}
                  >
                    <span>{tab.label}</span>
                    {isActive && <span className="aww-tab-active-indicator" />}
                  </button>
                );
              })}
            </div>
          </nav>
        </header>

        {/* 3. Asymmetric Masonry Grid Columns */}
        <div
          className="aww-masonry-grid"
          style={
            {
              '--col-count': columnCount,
            } as React.CSSProperties
          }
        >
          {columns.map((columnItems, colIndex) => {
            // Subtle parallax translateY offset for desktop (columns 1, 2, 3, 4 move slightly differently)
            let parallaxY = 0;
            if (columnCount === 4) {
              if (colIndex === 1) parallaxY = Math.max(-50, Math.min(50, scrollY * -0.04));
              else if (colIndex === 2) parallaxY = Math.max(-40, Math.min(40, scrollY * 0.035));
              else if (colIndex === 3) parallaxY = Math.max(-60, Math.min(60, scrollY * -0.03));
            } else if (columnCount === 3) {
              if (colIndex === 1) parallaxY = Math.max(-40, Math.min(40, scrollY * -0.03));
            }

            return (
              <div
                key={colIndex}
                className="aww-masonry-col"
                style={{
                  transform: columnCount >= 3 ? `translate3d(0, ${parallaxY.toFixed(1)}px, 0)` : 'none',
                }}
              >
                {columnItems.map((item, itemIdx) => {
                  return (
                    <article
                      key={item.id}
                      className={`aww-gallery-card aww-aspect-${item.aspect}`}
                      onClick={() => openLightbox(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightbox(item);
                        }
                      }}
                      aria-label={`${item.title} — click to expand`}
                      style={
                        {
                          '--item-index': itemIdx,
                        } as React.CSSProperties
                      }
                    >
                      <div className="aww-card-media-wrap">
                        <img
                          src={item.src}
                          alt={item.alt}
                          loading={itemIdx < 4 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="aww-card-img"
                        />
                        <div className="aww-card-overlay" aria-hidden="true">
                          <div className="aww-card-expand-icon">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="15 3 21 3 21 9" />
                              <polyline points="9 21 3 21 3 15" />
                              <line x1="21" y1="3" x2="14" y2="10" />
                              <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                          </div>
                          <div className="aww-card-meta">
                            <span className="aww-card-cat-badge">{item.categoryLabel}</span>
                            <h3 className="aww-card-title">{item.title}</h3>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 4. Load More Button */}
        {visibleCount < filteredItems.length && (
          <div className="aww-gallery-footer">
            <button
              type="button"
              className="aww-load-more-btn"
              onClick={handleLoadMore}
            >
              <span className="aww-btn-label">Load More Works</span>
              <span className="aww-btn-count">
                ({displayedItems.length} of {filteredItems.length})
              </span>
              <svg
                className="aww-btn-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 5. Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && currentLightboxItem && (
        <div
          className="aww-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label={currentLightboxItem.title}
          data-lenis-prevent
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop */}
          <div
            className="aww-lightbox-backdrop"
            onClick={closeLightbox}
            aria-hidden="true"
          />

          {/* Header Controls */}
          <div className="aww-lightbox-top-bar">
            <div className="aww-lightbox-tag">
              <span className="aww-lightbox-cat">{currentLightboxItem.categoryLabel}</span>
              <span className="aww-lightbox-counter">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(displayedItems.length).padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              className="aww-lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close image viewer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Previous Arrow */}
          <button
            type="button"
            className="aww-lightbox-nav-btn aww-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            aria-label="Previous artwork"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            className="aww-lightbox-nav-btn aww-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            aria-label="Next artwork"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Centered Image Container */}
          <div className="aww-lightbox-stage" onClick={closeLightbox}>
            <div
              className="aww-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentLightboxItem.src}
                alt={currentLightboxItem.alt}
                className="aww-lightbox-img"
              />
              <div className="aww-lightbox-caption">
                <h3>{currentLightboxItem.title}</h3>
                <p>{currentLightboxItem.alt}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
