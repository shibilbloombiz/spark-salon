'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import './RealevateServicesSection.css';

export interface RealevateServiceItem {
  id: string;
  no: string;
  slug: string;
  marqueeWord: string;
  title: string;
  description: string;
  image: string;
  chips: string[];
}

export const REALEVATE_SERVICES: RealevateServiceItem[] = [
  {
    id: 'hair',
    no: '01',
    slug: 'hair',
    marqueeWord: 'HAIR',
    title: 'Hair Couture & Balayage Atelier',
    description: 'Bespoke precision cutting, couture balayage, and restorative scalp alchemy tailored to your facial architecture and natural hair movement.',
    image: '/images/services/hair-couture.jpg',
    chips: ['Bespoke Cut', 'Couture Balayage', 'Scalp Alchemy', 'Blow-dry Finish'],
  },
  {
    id: 'beard-grooming',
    no: '02',
    slug: 'beard-grooming',
    marqueeWord: 'BEARD & GROOMING',
    title: 'Beard Architecture & Precision Grooming',
    description: 'Sculpted beard tapering, hot-towel straight-razor detailing, and tailored facial hair artistry designed for your routine.',
    image: '/images/services/beard-grooming.jpg',
    chips: ['Beard Tapering', 'Hot-Towel Shave', 'Facial Detailing', 'Skin Nourish'],
  },
  {
    id: 'nail',
    no: '03',
    slug: 'nail',
    marqueeWord: 'NAIL',
    title: 'Haute Manicure & Nail Detailing',
    description: 'Architectural nail shaping, Russian cuticle detailing, and avant-garde editorial gel artistry with lasting precision.',
    image: '/images/services/nail-detailing.jpg',
    chips: ['Haute Manicure', 'Russian Cuticle Care', 'Editorial Gel Art', 'Pedicure Spa'],
  },
  {
    id: 'face',
    no: '04',
    slug: 'face',
    marqueeWord: 'FACE',
    title: 'Facial Sculpting & Dermal Rituals',
    description: 'Targeted skin consultations, micro-current lifting, and cellular radiance therapy formulated for your unique complexion.',
    image: '/images/gallery/dewy-skin-radiance.webp',
    chips: ['Dermal Consultation', 'Micro-Current Lift', 'Cellular Radiance', 'Hydration Infusion'],
  },
  {
    id: 'waxing',
    no: '05',
    slug: 'waxing',
    marqueeWord: 'WAXING',
    title: 'Botanical Waxing & Silk Skin Rituals',
    description: 'Hypoallergenic botanical wax formulas, precision depilation, and soothing chamomile aftercare in private, serene suites.',
    image: '/images/services/skin-waxing.jpg',
    chips: ['Silk Depilation', 'Botanical Wax', 'Chamomile Soothe', 'Private Suite'],
  },
  {
    id: 'bridal',
    no: '06',
    slug: 'bridal',
    marqueeWord: 'BRIDAL',
    title: 'Haute Bridal Couture & Artistry',
    description: 'Complete ceremonial hair architecture, luminous bridal make-up harmony, veil styling, and bespoke trial consultations.',
    image: '/images/services/bridal-masterpiece.jpg',
    chips: ['Bridal Trial Session', 'Ceremonial Hair', 'Luminous Make-Up', 'Veil Drapery'],
  },
  {
    id: 'spa',
    no: '07',
    slug: 'spa',
    marqueeWord: 'SPA',
    title: 'Restorative Body Alchemy & Thermal Spa',
    description: 'Full-body aromatherapy massage, Ayurvedic warm herbal poultice rituals, and deep restorative tranquility.',
    image: '/images/services/spa-wellness.jpg',
    chips: ['Aromatherapy Body', 'Warm Herbal Poultice', 'Thermal Steam', 'Restorative Scalp'],
  },
  {
    id: 'tattoo',
    no: '08',
    slug: 'tattoo',
    marqueeWord: 'TATTOO',
    title: 'Bespoke Fine-Line Tattoo Atelier',
    description: 'Single-needle illustrative designs, anatomical placement consulting, and hospital-grade sterile private sessions.',
    image: '/images/services/custom-tattoo.jpg',
    chips: ['Single-Needle Fine', 'Custom Stencil', 'Placement Consult', 'Sterile Suite'],
  },
  {
    id: 'facial',
    no: '09',
    slug: 'facial',
    marqueeWord: 'FACIAL',
    title: 'Cellular Hydro-Oxygen Facial Alchemy',
    description: 'Deep dermal oxygen infusions, hyaluronic hydration baths, and rejuvenating lymphatic drainage rituals for glowing glass skin.',
    image: '/images/gallery/cellular-facial-mask.webp',
    chips: ['Hydro-Oxygen Bath', 'Hyaluronic Infusion', 'Lymphatic Drainage', 'Glass-Skin Finish'],
  },
];

export default function RealevateServicesSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [easedIndex, setEasedIndex] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update scroll physics with smooth plateau easing
  const updateScrollProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) return;

    // Calculate raw progress [0, 1]
    const rawProgress = Math.min(1, Math.max(0, -rect.top / trackHeight));

    // Map 0..1 to float index 0..8 (8 transitions across 9 items)
    const totalTransitions = REALEVATE_SERVICES.length - 1; // 8
    const rawFloat = rawProgress * totalTransitions;

    // Apply editorial pause (plateau) for the first ~45% of each segment,
    // then smooth cubic transition over the remaining ~55%.
    const currentBase = Math.floor(rawFloat);
    const fraction = rawFloat - currentBase;

    let easedFloat = rawFloat;
    if (currentBase < totalTransitions) {
      if (fraction < 0.45) {
        easedFloat = currentBase;
      } else {
        const t = (fraction - 0.45) / 0.55;
        // Smoothstep easing: 3t^2 - 2t^3
        const smoothT = t * t * (3 - 2 * t);
        easedFloat = currentBase + smoothT;
      }
    } else {
      easedFloat = totalTransitions;
    }

    setEasedIndex(easedFloat);

    const calculatedActive = Math.min(
      totalTransitions,
      Math.max(0, Math.round(easedFloat))
    );
    setActiveIndex(calculatedActive);
  }, []);

  useEffect(() => {
    updateScrollProgress();

    const handleScroll = () => {
      requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Sync with Lenis if active
    let lenisUnsubscribe: (() => void) | null = null;
    if (typeof window !== 'undefined' && (window as any).lenis) {
      const lenis = (window as any).lenis;
      if (typeof lenis.on === 'function') {
        const onLenisScroll = () => requestAnimationFrame(updateScrollProgress);
        lenis.on('scroll', onLenisScroll);
        lenisUnsubscribe = () => lenis.off('scroll', onLenisScroll);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (lenisUnsubscribe) lenisUnsubscribe();
    };
  }, [updateScrollProgress]);

  // Jump to specific service on indicator click
  const scrollToService = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const trackTop = track.offsetTop;
    const trackHeight = track.offsetHeight - window.innerHeight;
    const targetProgress = index / (REALEVATE_SERVICES.length - 1);
    const targetScrollY = trackTop + targetProgress * trackHeight;

    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  const activeService = useMemo(() => {
    return REALEVATE_SERVICES[activeIndex] || REALEVATE_SERVICES[0];
  }, [activeIndex]);

  // Build marquee tracks: 2 identical sets of repeated words for seamless infinite -50% CSS translation
  const marqueeItems = useMemo(() => {
    // 8 repetitions per track to span any ultrawide screen
    return Array.from({ length: 8 }, (_, i) => ({
      key: `mq-${i}`,
      word: activeService.marqueeWord,
    }));
  }, [activeService.marqueeWord]);

  return (
    <section
      id="services"
      ref={trackRef}
      className="realevate-services-track"
      aria-label="Atelier Services and Rituals"
    >
      {/* Pinned Showcase Stage */}
      <div className="realevate-sticky-stage">
        {/* Stage Top Meta / Tag */}
        <header className="realevate-stage-header">
          <div className="realevate-header-pill">
            <span className="realevate-dot" aria-hidden="true" />
            <span className="realevate-tagline">ATELIER RITUALS &amp; SERVICES</span>
          </div>
          <div className="realevate-index-badge">
            <span className="realevate-num-current">{activeService.no}</span>
            <span className="realevate-num-divider">/</span>
            <span className="realevate-num-total">09</span>
          </div>
        </header>

        {/* 1. CENTERED LARGE SERVICE IMAGE AT THE TOP */}
        <div className="realevate-image-stage" aria-hidden="true">
          <div className="realevate-image-viewport">
            {REALEVATE_SERVICES.map((service, idx) => {
              // Offset relative to current continuous scroll position
              const offset = idx - easedIndex;
              // Only render / compute transform for cards within visible distance
              const isNear = Math.abs(offset) <= 1.2;
              if (!isNear && isMounted) return null;

              // Vertical translation slit-scan:
              // offset < 0: moving UP out through the top (translateY(-100%))
              // offset > 0: entering from the BOTTOM (translateY(100%))
              const translateYPercent = offset * 100;
              const opacity = Math.max(0, 1 - Math.abs(offset) * 0.4);

              return (
                <div
                  key={service.id}
                  className="realevate-image-card"
                  style={{
                    transform: `translate3d(0, ${translateYPercent}%, 0)`,
                    opacity,
                    visibility: Math.abs(offset) > 1.05 ? 'hidden' : 'visible',
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="realevate-service-img"
                    loading={idx <= 1 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <div className="realevate-image-overlay" />
                  <div className="realevate-image-caption">
                    <span className="realevate-caption-title">{service.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. OVERSIZED ANIMATED SERVICE HEADING DIRECTLY UNDER THE IMAGE */}
        {/* Strictly BELOW the image: never behind, never overlapping */}
        <div className="realevate-marquee-container" aria-label={activeService.marqueeWord}>
          <div className="realevate-marquee-track" aria-hidden="true">
            {/* Set 1 */}
            <div className="realevate-marquee-group">
              {marqueeItems.map((item, i) => (
                <span key={`a-${i}`} className="realevate-marquee-item">
                  <span className="realevate-marquee-text">{item.word}</span>
                  <span className="realevate-marquee-bullet" aria-hidden="true">•</span>
                </span>
              ))}
            </div>
            {/* Set 2 (for seamless infinite loop) */}
            <div className="realevate-marquee-group">
              {marqueeItems.map((item, i) => (
                <span key={`b-${i}`} className="realevate-marquee-item">
                  <span className="realevate-marquee-text">{item.word}</span>
                  <span className="realevate-marquee-bullet" aria-hidden="true">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. SHORT SERVICE DESCRIPTION UNDERNEATH THE HEADING */}
        <div className="realevate-desc-container">
          <p key={activeService.id} className="realevate-description">
            {activeService.description}
          </p>

          {/* Luxury Service Highlights */}
          <div className="realevate-chips-row">
            {activeService.chips.map((chip, ci) => (
              <span key={ci} className="realevate-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* 4. EXPLORE SERVICE BUTTON UNDERNEATH THE DESCRIPTION */}
        <div className="realevate-actions-container">
          <Link
            href={`/services/${activeService.slug}`}
            className="realevate-explore-btn"
            aria-label={`Explore ${activeService.title} rituals`}
          >
            <span className="realevate-btn-text">EXPLORE SERVICE</span>
            <span className="realevate-btn-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </Link>
        </div>

        {/* Bottom Interactive Navigation Dots / Progress Track */}
        <nav className="realevate-progress-nav" aria-label="Services selector">
          {REALEVATE_SERVICES.map((s, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                className={`realevate-dot-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => scrollToService(idx)}
                aria-label={`Jump to service ${idx + 1}: ${s.marqueeWord}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="realevate-dot-inner" />
                <span className="realevate-dot-tooltip">{s.marqueeWord}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
