'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './CinematicPageTransition.css';

/* ==========================================================================
   CINEMATIC PAGE TRANSITION SYSTEM
   Inspired by The Sugar Coated Cult & Luxury Awwwards Digital Ateliers
   Tailored for SPARK Salon & Beauty Mall Design Identity
   ========================================================================== */

interface PageTransitionContextValue {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigate: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

type TransitionStage = 'idle' | 'covering' | 'covered' | 'revealing';

interface CinematicPageTransitionProps {
  children: React.ReactNode;
}

export default function CinematicPageTransition({ children }: CinematicPageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [, startReactTransition] = useTransition();

  // Pathname representation for change detection
  const prevPathnameRef = useRef<string>(pathname);

  const [stage, setStage] = useState<TransitionStage>('idle');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Pending destination URL
  const pendingUrlRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPopStateRef = useRef<boolean>(false);
  const isNavigatingRef = useRef<boolean>(false);

  // Content wrapper ref for animating page exit & entrance
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Clean safety timer
  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  /**
   * Reset Lenis & native window scroll to top smoothly
   */
  const resetScrollToTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, []);

  /**
   * Check if client prefers reduced motion
   */
  const prefersReducedMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }, []);

  /**
   * Complete transition and return to idle state
   */
  const finishTransition = useCallback(() => {
    clearSafetyTimer();
    setStage('idle');
    setIsTransitioning(false);
    isNavigatingRef.current = false;
    isPopStateRef.current = false;
    pendingUrlRef.current = null;

    if (contentWrapperRef.current) {
      contentWrapperRef.current.classList.remove('is-exiting');
      contentWrapperRef.current.classList.add('is-entering');
      // Remove entrance animation class after entrance completes
      setTimeout(() => {
        contentWrapperRef.current?.classList.remove('is-entering');
      }, 550);
    }
  }, [clearSafetyTimer]);

  /**
   * Initiate the cinematic page transition to a target URL
   */
  const startTransitionTo = useCallback(
    (targetHref: string) => {
      // Prevent duplicate transitions while already active
      if (isNavigatingRef.current) return;

      // Handle reduced motion: navigate quickly without large transform sweeps
      if (prefersReducedMotion()) {
        resetScrollToTop();
        router.push(targetHref);
        return;
      }

      isNavigatingRef.current = true;
      setIsTransitioning(true);
      pendingUrlRef.current = targetHref;

      // Phase 1 & 2: Current page exit + Curtain Covering
      setStage('covering');

      if (contentWrapperRef.current) {
        contentWrapperRef.current.classList.remove('is-entering');
        contentWrapperRef.current.classList.add('is-exiting');
      }

      // Safety timeout: Never leave user on stuck overlay if route hangs or network drops
      clearSafetyTimer();
      safetyTimerRef.current = setTimeout(() => {
        if (isNavigatingRef.current) {
          console.warn('[CinematicPageTransition] Safety valve triggered - unveiling page.');
          setStage('revealing');
          setTimeout(finishTransition, 480);
        }
      }, 1400);

      // Phase 3: At cover apex (~360ms), update Next.js router
      setTimeout(() => {
        setStage('covered');
        resetScrollToTop();

        // Optional Native View Transitions API support where available
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
          try {
            (document as any).startViewTransition(() => {
              startReactTransition(() => {
                router.push(targetHref);
              });
            });
            return;
          } catch {
            // Fallback to standard router push
          }
        }

        startReactTransition(() => {
          router.push(targetHref);
        });
      }, 360);
    },
    [router, prefersReducedMotion, resetScrollToTop, clearSafetyTimer, finishTransition]
  );

  /**
   * Detect route change completion
   */
  useEffect(() => {
    // If pathname has changed
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;

      // If transition was in covering or covered stage, trigger Phase 4: Destination Reveal
      if (isNavigatingRef.current || stage === 'covering' || stage === 'covered') {
        clearSafetyTimer();
        setStage('revealing');

        // Reveal animation duration: 480ms
        const revealTimer = setTimeout(() => {
          finishTransition();
        }, 480);

        return () => clearTimeout(revealTimer);
      } else if (isPopStateRef.current) {
        // Browser Back / Forward button pressed: execute smooth reveal
        isPopStateRef.current = false;
        if (!prefersReducedMotion()) {
          setStage('revealing');
          const popTimer = setTimeout(() => {
            finishTransition();
          }, 450);
          return () => clearTimeout(popTimer);
        }
      }
    }
  }, [pathname, stage, clearSafetyTimer, finishTransition, prefersReducedMotion]);

  /**
   * Listen for browser Back/Forward (popstate)
   */
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * Global Event Delegation: Capture internal link clicks across the entire site
   */
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore modified clicks (new tab / window) or non-primary clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Check if click originates inside an <a> tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      // Ignore target="_blank"
      if (anchor.target && anchor.target !== '_self') return;

      // Ignore downloads
      if (anchor.hasAttribute('download')) return;

      // Ignore elements marked with data-no-transition
      if (anchor.hasAttribute('data-no-transition') || anchor.closest('[data-no-transition]')) {
        return;
      }

      // Ignore rel="external"
      if (anchor.rel && anchor.rel.includes('external')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Ignore non-navigational protocols
      if (/^(tel:|mailto:|javascript:|sms:|whatsapp:|wa\.me)/i.test(rawHref)) {
        return;
      }

      // Parse URL
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Must be internal (same origin)
      if (url.origin !== window.location.origin) return;

      // Ignore hash links on the same path (e.g. #services, #contact)
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return;
      }

      // If clicking the logo/home link while already on the exact same page without hash,
      // smooth scroll to top instead of triggering a full transition
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        !url.hash
      ) {
        e.preventDefault();
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(0, { duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // Exclude admin panel routes from public transition
      if (url.pathname.startsWith('/admin')) {
        return;
      }

      // Valid internal navigation target: intercept and trigger cinematic transition!
      e.preventDefault();
      e.stopPropagation();

      const targetPath = url.pathname + url.search + url.hash;
      startTransitionTo(targetPath);
    };

    // Use capturing phase so we intercept before Next.js default Link behavior
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [startTransitionTo]);

  // Expose context value
  const contextValue = {
    navigate: startTransitionTo,
    isTransitioning,
  };

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {/* Main Page Content Wrapper (with subtle exit & entrance physics) */}
      <div
        id="spark-page-content"
        ref={contentWrapperRef}
        className="spark-page-content-wrapper"
      >
        {children}
      </div>

      {/* Cinematic Multi-Layered Curtain Overlay */}
      <div
        className={`spark-transition-curtain-root stage-${stage}`}
        aria-hidden={stage === 'idle'}
        data-lenis-prevent
      >
        {/* Layer 1: Leading Velocity Blade (Crimson Accent Wave) */}
        <div className="spark-curtain-blade" aria-hidden="true" />

        {/* Layer 2: Main Velvet Noir Atelier Shield */}
        <div className="spark-curtain-main" aria-hidden="true">
          {/* Subtle Atmospheric Luxury Grain & Radial Illumination */}
          <div className="spark-curtain-glow" />

          {/* Center Brand Atelier Monogram & Typography */}
          <div className="spark-curtain-centerpiece">
            <div className="spark-curtain-logo-wrap">
              <picture>
                <source srcSet="/images/logo-emblem-crop-white.webp" type="image/webp" />
                <img
                  src="/images/logo-emblem-crop-white.png"
                  alt=""
                  className="spark-curtain-logo"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/loading/logo-white.png';
                  }}
                />
              </picture>
            </div>

            <div className="spark-curtain-brand-text">
              <span className="spark-curtain-brand-title">SPARK</span>
              <div className="spark-curtain-divider">
                <span className="spark-curtain-line" />
                <span className="spark-curtain-dot" />
                <span className="spark-curtain-line" />
              </div>
              <span className="spark-curtain-brand-sub">INTERNATIONAL ATELIER</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
