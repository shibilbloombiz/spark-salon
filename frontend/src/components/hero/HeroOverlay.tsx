'use client';

import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { BlurText } from '@/components/ui';
import { markBookingClickHandled } from '@/components/booking/AppointmentRequestDialog';
import './HeroOverlay.css';

export interface HeroSlide {
  eyebrow: string;
  headline: string;
  highlightWords: string[];
  subtitle: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: 'SPARK SALON • LUXURY ATELIER',
    headline: 'WHERE BEAUTY\nMEETS EXPERIENCE.',
    highlightWords: ['EXPERIENCE'],
    subtitle:
      'Premium hair sculpture, clinical skin therapies, and bespoke bridal care designed exclusively around your signature aesthetic.',
  },
  {
    eyebrow: 'BESPOKE CRAFT • MASTER ARTISTRY',
    headline: 'SCULPTED TO\nPURE PERFECTION.',
    highlightWords: ['PERFECTION'],
    subtitle:
      'World-class hair architects and colorists crafting radiant silhouettes tailored to your individuality.',
  },
  {
    eyebrow: 'PRIVATE SUITES • SENSORY EQUILIBRIUM',
    headline: 'AN ELEVATED\nSENSORY ESCAPE.',
    highlightWords: ['ESCAPE'],
    subtitle:
      'Acoustically isolated private sanctuaries designed for restorative clinical facials, bridal rituals, and tranquil luxury.',
  },
];

export interface HeroOverlayProps {
  onOpenBooking?: () => void;
  onExploreServices?: () => void;
  isRevealed?: boolean;
}

export interface HeroOverlayHandle {
  updateProgress: (progress: number) => void;
}

const HeroOverlay = forwardRef<HeroOverlayHandle, HeroOverlayProps>(function HeroOverlay(
  { onOpenBooking, onExploreServices, isRevealed = true },
  ref
) {
  const [activeChapter, setActiveChapter] = useState(0);
  const activeChapterRef = useRef(0);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  /**
   * ScrollTrigger scrub synchronization:
   * Smoothly changes text chapters using the signature BlurText effect as the user scrolls
   * Incorporates hysteresis buffers (0.04) to eliminate boundary flicker on slow scrub
   */
  useImperativeHandle(
    ref,
    () => ({
      updateProgress: (progress: number) => {
        let nextChapter = activeChapterRef.current;

        if (activeChapterRef.current === 0) {
          if (progress >= 0.33) nextChapter = 1;
        } else if (activeChapterRef.current === 1) {
          if (progress < 0.29) nextChapter = 0;
          else if (progress >= 0.67) nextChapter = 2;
        } else if (activeChapterRef.current === 2) {
          if (progress < 0.63) nextChapter = 1;
        }

        if (nextChapter !== activeChapterRef.current) {
          activeChapterRef.current = nextChapter;
          setActiveChapter(nextChapter);
        }

        // Scroll indicator fades out as user scrolls (0.00 -> 0.08)
        const scrollIndicatorProgress = Math.min(1, Math.max(0, progress / 0.08));
        const indicatorOpacity = 1 - scrollIndicatorProgress;

        if (scrollIndicatorRef.current) {
          scrollIndicatorRef.current.style.opacity = `${indicatorOpacity.toFixed(3)}`;
          scrollIndicatorRef.current.style.pointerEvents = indicatorOpacity < 0.1 ? 'none' : 'auto';
        }
      },
    }),
    []
  );

  const currentSlide = HERO_SLIDES[activeChapter];

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    markBookingClickHandled(e.nativeEvent);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const win = window as any;
      if (win.openBookingModal) win.openBookingModal('hair');
    }
  };

  const handleExploreServices = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreServices) {
      onExploreServices();
    } else {
      const el = document.getElementById('services') || document.getElementById('statement');
      if (!el) return;
      const win = window as any;
      if (win.lenis && typeof win.lenis.scrollTo === 'function') {
        win.lenis.scrollTo(el, { duration: 1.2, offset: 0 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="hero-overlay-layer">
      {/* Main Content Area aligned with navbar luxury-container */}
      <div className="hero-overlay-container">
        <div className="hero-overlay-content">
          {/* Reserved Height Text Stage to prevent CTA layout shifts */}
          <div className="hero-text-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{ width: '100%' }}
              >
                {/* Top Brand Tag with BlurText */}
                <motion.div
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={
                    isRevealed
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: 16, filter: 'blur(6px)' }
                  }
                  transition={{
                    duration: 0.75,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="hero-eyebrow"
                >
                  <span className="hero-eyebrow-dot" aria-hidden="true" />
                  <BlurText
                    as="span"
                    text={currentSlide.eyebrow}
                    threshold={0.01}
                    delay={25}
                    ready={true}
                  />
                </motion.div>

                {/* Monumental Headline in Cormorant Garamond with signature red italic highlight */}
                <BlurText
                  as="h1"
                  className="hero-headline"
                  text={currentSlide.headline}
                  highlightWords={currentSlide.highlightWords}
                  highlightClassName="hero-headline-highlight"
                  delay={75}
                  direction="top"
                  threshold={0.01}
                  ready={true}
                />

                {/* Body Description in Jost */}
                <BlurText
                  as="p"
                  className="hero-subtitle"
                  threshold={0.01}
                  delay={18}
                  text={currentSlide.subtitle}
                  ready={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action CTAs (Signature Red Pill & Luxury Dark Glass Pill) */}
          <motion.div
            initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="hero-action-ctas"
          >
            <button
              type="button"
              data-open="appt"
              onClick={handleBooking}
              className="hero-btn-primary"
              aria-label="Book appointment at Spark Salon"
            >
              <Calendar size={14} />
              <span>BOOK APPOINTMENT</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={handleExploreServices}
              className="hero-btn-secondary"
              aria-label="Explore Spark Salon services"
            >
              <span>EXPLORE SERVICES</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator (Hidden on mobile screens < 768px) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="hero-scroll-indicator-wrapper"
        >
          <div ref={scrollIndicatorRef} className="hero-scroll-indicator">
            <div className="hero-mouse-pill" aria-hidden="true">
              <div className="hero-mouse-wheel" />
            </div>
            <span>SCROLL TO EXPLORE</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default HeroOverlay;
