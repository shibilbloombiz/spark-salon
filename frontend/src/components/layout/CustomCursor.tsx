'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type CursorMode = 'default' | 'link' | 'view' | 'explore' | 'text' | 'arrow-up' | 'arrow-down';
type CursorTheme = 'dark' | 'light' | 'red';

interface CursorState {
  mode: CursorMode;
  label: string;
  theme: CursorTheme;
}

/**
 * Luxury Spark Cursor System
 * - Desktop fine pointer only ((hover: hover) and (pointer: fine))
 * - Small gold four-point spark (26px, #d4af37) follows pointer directly with gold glow drop-shadow
 * - 9s linear self-rotation loop
 * - Comet stretch: stretch = 1 + min(speed / 38, 1.1) along movement angle, cross-axis 1 / sqrt(stretch)
 * - Trailing soft gold radial glow (44px) with lerp 0.14
 * - States:
 *   1. Link (a[href], button): spark shrinks to 55%, 46px gold outlined diamond trails pointer
 *   2. Services section (data-cursor="view"): 88px morphing pill labelled "View"
 *   3. Cards (data-cursor="explore"): 112px morphing pill labelled "Explore"
 *   4. Text field (input, textarea, select, [contenteditable]): 2px by 26px gold caret, spark/glow hidden
 *   5. Press (is-press): spark scales to 0.6 and turns 45deg, pill scales to 0.9
 * - Adaptive pill colors via nearest data-cursor-theme:
 *   - dark -> gold pill (#d4af37), dark text (#0b0b0d)
 *   - light -> black pill (#0b0b0d), light text (#f4f1ea)
 *   - red -> red pill (#c8102e), white text (#ffffff)
 * - Full prefers-reduced-motion support (no rotation, no stretch, no morph, instant follow)
 * - Strict TypeScript with no `any`
 */
export default function CustomCursor(): React.JSX.Element | null {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      document.documentElement.classList.remove('has-cursor');
      return;
    }
    if (typeof window === 'undefined') return;

    // Enable only when (hover: hover) and (pointer: fine).
    // On touch devices remove element and keep system cursor untouched.
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFine) {
      if (rootRef.current) {
        rootRef.current.remove();
      }
      return;
    }

    const rootEl = rootRef.current;
    const trailEl = trailRef.current;
    const leadEl = leadRef.current;
    const cometEl = cometRef.current;
    const labelEl = labelRef.current;

    if (!rootEl || !trailEl || !leadEl || !cometEl || !labelEl) return;

    document.documentElement.classList.add('has-cursor');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let animId = 0;
    let mx = -100;
    let my = -100;
    let prevMx = -100;
    let prevMy = -100;
    let tx = -100;
    let ty = -100;
    let isShown = false;

    // Comet stretch smoothing state
    let curAngle = 0;
    let targetAngle = 0;
    let curStretch = 1;
    let targetStretch = 1;

    // State resolution from element under pointer
    function resolveCursorState(target: HTMLElement | null): CursorState {
      if (!target) {
        return { mode: 'default', label: '', theme: 'dark' };
      }

      // 1. Text field check (hide spark and glow, show caret)
      const textField = target.closest<HTMLElement>(
        'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, select, [contenteditable="true"], [contenteditable=""]'
      );
      if (textField) {
        const themeEl = target.closest<HTMLElement>('[data-cursor-theme]');
        const rawTheme = themeEl?.getAttribute('data-cursor-theme');
        const theme: CursorTheme = rawTheme === 'light' || rawTheme === 'red' ? rawTheme : 'dark';
        return { mode: 'text', label: '', theme };
      }

      // Nearest ancestor data-cursor-theme (for pill background & text contrast)
      const themeEl = target.closest<HTMLElement>('[data-cursor-theme]');
      const rawTheme = themeEl?.getAttribute('data-cursor-theme');
      const theme: CursorTheme = rawTheme === 'light' || rawTheme === 'red' ? rawTheme : 'dark';

      // 2. Testimonials section: enforce up/down arrow button cursor model
      const testimonialsEl = target.closest<HTMLElement>('#testimonials, .testimonials-section');
      if (testimonialsEl) {
        const arrowEl = target.closest<HTMLElement>('[data-cursor="arrow-up"], [data-cursor="arrow-down"]');
        if (arrowEl) {
          const mode = arrowEl.getAttribute('data-cursor') as CursorMode;
          return { mode, label: '', theme: 'red' };
        }
        const stageEl = testimonialsEl.querySelector<HTMLElement>('.testimonials-stage');
        if (stageEl) {
          const rect = stageEl.getBoundingClientRect();
          const isTop = my < rect.top + rect.height / 2;
          return { mode: isTop ? 'arrow-up' : 'arrow-down', label: '', theme: 'red' };
        }
        return { mode: 'arrow-up', label: '', theme: 'red' };
      }

      // 3. Landing page services section: seamlessly transform current cursor into the "View" button model
      const servicesRow = target.closest<HTMLElement>('.sl-item, .sl-link, .sl-list, [data-cursor="view"]');
      if (servicesRow) {
        return { mode: 'view', label: 'View', theme: 'red' };
      }

      // 4. In all other sections and cards across the website:
      // Remove cursor button models on cards. Links/buttons show standard link diamond.
      const linkOrBtn = target.closest<HTMLElement>('a[href], button, [role="button"]');
      if (linkOrBtn) {
        return { mode: 'link', label: '', theme };
      }

      return { mode: 'default', label: '', theme };
    }

    let activeKey = '';

    const updateState = (target: HTMLElement | null): void => {
      const state = resolveCursorState(target);
      const key = `${state.mode}|${state.label}|${state.theme}`;
      if (key === activeKey) return;
      activeKey = key;

      document.body.dataset.cursor = state.mode;
      document.body.dataset.cursorTheme = state.theme;
      labelEl.textContent = state.label;
    };

    const handlePointerOver = (e: PointerEvent): void => {
      updateState(e.target as HTMLElement | null);
    };

    const handlePointerMove = (e: PointerEvent): void => {
      mx = e.clientX;
      my = e.clientY;

      if (!isShown) {
        isShown = true;
        tx = mx;
        ty = my;
        prevMx = mx;
        prevMy = my;
        document.body.classList.add('cur-on');
      }

      updateState(e.target as HTMLElement | null);
    };

    const handlePointerDown = (): void => {
      document.body.classList.add('is-press');
    };

    const handlePointerUp = (): void => {
      document.body.classList.remove('is-press');
    };

    const handleMouseLeave = (e: MouseEvent): void => {
      if (!e.relatedTarget) {
        document.body.classList.remove('cur-on');
        isShown = false;
      }
    };

    // Single delegated listeners on document / window
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });

    // Single requestAnimationFrame loop: never read layout in the loop
    const tick = (): void => {
      const isReduced = reduceMotion.matches;
      const ease = isReduced ? 1 : 0.14;

      // Trailing position interpolation (glow, diamond, pill)
      tx += (mx - tx) * ease;
      ty += (my - ty) * ease;

      trailEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      leadEl.style.transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0)`;

      // Comet stretch computation (speed and smoothed angle/stretch)
      if (!isReduced) {
        const dx = mx - prevMx;
        const dy = my - prevMy;
        const speed = Math.hypot(dx, dy);
        prevMx = mx;
        prevMy = my;

        if (speed > 0.6) {
          targetAngle = Math.atan2(dy, dx);
          targetStretch = 1 + Math.min(speed / 38, 1.1);
        } else {
          targetStretch = 1;
        }

        // Angular interpolation through shortest arc
        let diff = targetAngle - curAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        curAngle += diff * 0.22;

        curStretch += (targetStretch - curStretch) * 0.18;
        const crossScale = 1 / Math.sqrt(curStretch);

        cometEl.style.transform = `rotate(${curAngle.toFixed(4)}rad) scale(${curStretch.toFixed(3)}, ${crossScale.toFixed(3)}) rotate(${-curAngle.toFixed(4)}rad)`;
      } else {
        cometEl.style.transform = 'none';
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      document.body.classList.remove('cur-on', 'is-press');
      delete document.body.dataset.cursor;
      delete document.body.dataset.cursorTheme;

      document.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="spark-cursor-root" ref={rootRef} aria-hidden="true">
      {/* Trailing layer: soft gold glow, diamond, adaptive morphing pill, arrow button */}
      <div className="spark-cur-trail" ref={trailRef}>
        <div className="spark-cur-glow" />
        <div className="spark-cur-diamond" />
        <div className="spark-cur-pill">
          <span className="spark-cur-label" ref={labelRef} />
        </div>
        <div className="spark-cur-arrow-btn" aria-hidden="true">
          <svg
            className="spark-cur-arrow-svg spark-cur-arrow-up"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <svg
            className="spark-cur-arrow-svg spark-cur-arrow-down"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>

      {/* Pointer lead layer: gold spark and caret */}
      <div className="spark-cur-lead" ref={leadRef}>
        <div className="spark-cur-comet" ref={cometRef}>
          <div className="spark-cur-spark">
            <svg
              viewBox="0 0 26 26"
              width="26"
              height="26"
              className="spark-cur-svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M 13 1 C 13 7.6 18.4 13 25 13 C 18.4 13 13 18.4 13 25 C 13 18.4 7.6 13 1 13 C7.6 13 13 7.6 13 1 Z"
                fill="#d4af37"
                stroke="#0b0b0d"
                strokeWidth="0.75"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="spark-cur-caret" />
      </div>
    </div>
  );
}
