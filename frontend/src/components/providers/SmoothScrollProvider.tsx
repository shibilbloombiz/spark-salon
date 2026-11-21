'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Inner component to synchronize Lenis with GSAP ScrollTrigger
 * and drive animation frames exclusively via gsap.ticker
 */
function LenisGsapSync() {
  const lenis = useLenis();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Synchronize ScrollTrigger on every Lenis scroll step and drive via GSAP ticker
  useEffect(() => {
    if (!lenis) return;

    // Expose instance globally for convenience (e.g. lenis.scrollTo)
    (window as any).lenis = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
    };
    const unbind = lenis.on('scroll', onScroll);

    // Feed Lenis's RAF directly into GSAP's ticker to avoid two competing RAF loops
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    // Disable lag smoothing in GSAP to prevent any jumps or jitter during smooth scrolling
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      if (typeof unbind === 'function') {
        unbind();
      } else if (typeof (lenis as any).off === 'function') {
        (lenis as any).off('scroll', onScroll);
      }
      if ((window as any).lenis === lenis) {
        delete (window as any).lenis;
      }
    };
  }, [lenis]);

  // Synchronize ScrollTrigger and Lenis across route transitions
  useEffect(() => {
    if (!lenis) return;

    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;

      // 1. Release any residual body scroll locks, drawer classes, or stuck cursor states
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove(
        'reel-on',
        'svc-detail-active',
        'curtain-on',
        'drawer-open',
        'nav-open',
        'is-press'
      );
      if (document.body.dataset.cursor) {
        delete document.body.dataset.cursor;
      }

      // 2. Ensure Lenis is resumed in case a modal or menu paused it
      lenis.start?.();

      // 3. Reset scroll position immediately or handle anchor target
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          setTimeout(() => {
            lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.0 });
          }, 80);
        }
      } else {
        lenis.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }

      // 4. Reset ScrollTrigger scroll memory and recalculate all triggers
      if (typeof ScrollTrigger.clearScrollMemory === 'function') {
        ScrollTrigger.clearScrollMemory('manual');
      }

      // Two-phase refresh: immediate frame + post-hydration/layout settle
      const rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      const timerId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 180);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
      };
    }
  }, [lenis, pathname]);

  return null;
}

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    setMounted(true);
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Weighted, silky Lenis configuration matching https://lenis.dev feel
  const options: LenisOptions = useMemo(
    () => ({
      duration: 1.15,
      // Curated exponential ease-out curve for a weighted, responsive feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
      // Exclude internally-scrollable elements (modals, dialogs, dropdowns, panels)
      prevent: (node: Node) => {
        if (!node || !(node instanceof HTMLElement)) return false;
        return Boolean(
          node.hasAttribute('data-lenis-prevent') ||
          node.closest('[data-lenis-prevent], [role="dialog"], dialog[open], [aria-modal="true"], .course-dialog-backdrop, .dlg-backdrop-fixed')
        );
      },
    }),
    []
  );

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Always render ReactLenis so children tree is never unmounted/remounted during hydration
  return (
    <ReactLenis root options={options} autoRaf={false}>
      {children}
      {mounted && !reducedMotion ? <LenisGsapSync /> : null}
    </ReactLenis>
  );
}
