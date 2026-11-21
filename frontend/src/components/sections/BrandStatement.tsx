'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './BrandStatement.css';

export default function BrandStatement() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector<HTMLElement>('[data-ph-stage]');
    const copy = root.querySelector<HTMLElement>('[data-ph-copy]');
    const slot = root.querySelector<HTMLElement>('[data-ph-slot]');
    const blob = root.querySelector<HTMLElement>('[data-ph-blob]');
    const img = root.querySelector<HTMLElement>('[data-ph-img]');
    const photo = root.querySelector<HTMLElement>('[data-ph-photo]');
    const tag = root.querySelector<HTMLElement>('[data-ph-tag]');
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'));
    const nextSection = document.getElementById('services') || document.querySelector<HTMLElement>('.sl');

    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      reduce = false;
    }

    if (reduce) return;

    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let card = { t: 0, l: 0, r: 0, b: 0, w: 0, h: 0 };
    const RADIUS_TL = 8;
    const RADIUS_TR = 40;
    const RADIUS_BR = 8;
    const RADIUS_BL = 40;

    function measure() {
      if (!stage || !slot) return;
      const s = stage.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      card = {
        t: Math.max(0, r.top - s.top),
        l: Math.max(0, r.left - s.left),
        r: Math.max(0, s.right - r.right),
        b: Math.max(0, s.bottom - r.bottom),
        w: r.width,
        h: r.height,
      };
    }

    function getProgress() {
      if (!root) return { rv: 1, p: 0 };
      const rect = root.getBoundingClientRect();
      const H = window.innerHeight;

      // 1. Reveal progress: triggers as the about section scrolls into view
      // Once the section's top reaches 0 (pinned position), rv is strictly 1.
      let rv = 1;
      if (rect.top > 0) {
        const enterSpan = H * 0.85;
        const enterDist = enterSpan - rect.top;
        const rvRatio = clamp(enterDist / (enterSpan * 0.75), 0, 1);
        rv = easeOut(rvRatio);
      } else {
        rv = 1;
      }

      // 2. Pin scroll progress (0.0 to 1.0)
      const span = root.offsetHeight - H;
      if (span <= 0) return { rv, p: 0 };
      const p = clamp(-rect.top / span, 0, 1);

      return { rv, p };
    }

    function draw(rv: number, p: number) {
      if (!stage || !img || !photo) return;

      const ZOOM_START = 0.20;
      const ZOOM_END = 0.60;
      const NEXT_START = 0.70;

      const ze = easeInOut(clamp((p - ZOOM_START) / (ZOOM_END - ZOOM_START), 0, 1));
      const ne = easeInOut(clamp((p - NEXT_START) / (1 - NEXT_START), 0, 1));

      // 1. Text reveals line by line, then fades as the image zooms out
      items.forEach((el, i) => {
        if (rv >= 0.999) {
          el.style.opacity = (1 - ze).toFixed(3);
          el.style.transform = 'none';
          el.style.filter = 'none';
        } else {
          const t = easeOut(clamp((rv - i * 0.12) / 0.6, 0, 1));
          el.style.opacity = (t * (1 - ze)).toFixed(3);
          el.style.transform = `translate3d(0, ${((1 - t) * 32).toFixed(2)}px, 0)`;
          el.style.filter = t > 0.92 ? 'none' : `blur(${((1 - t) * 6).toFixed(2)}px)`;
        }
      });

      if (copy) {
        copy.style.opacity = (rv * (1 - ze)).toFixed(3);
        copy.style.pointerEvents = ze > 0.8 ? 'none' : 'auto';
      }

      // 2. Photo frame: expands using clip-path inset from card rectangle to full screen
      const cardRiseOffset = (1 - rv) * 24; // gentle rise on entrance
      const top = lerp(card.t + cardRiseOffset, 0, ze);
      const left = lerp(card.l, 0, ze);
      const right = lerp(card.r, 0, ze);
      const bottom = lerp(card.b - cardRiseOffset, 0, ze);

      const rTL = lerp(RADIUS_TL, 0, ze);
      const rTR = lerp(RADIUS_TR, 0, ze);
      const rBR = lerp(RADIUS_BR, 0, ze);
      const rBL = lerp(RADIUS_BL, 0, ze);

      img.style.clipPath = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${rTL.toFixed(1)}px ${rTR.toFixed(1)}px ${rBR.toFixed(1)}px ${rBL.toFixed(1)}px)`;

      // Subtle scale settlement from 1.10 to 1.0
      photo.style.transform = `scale(${(1.10 - 0.10 * ze).toFixed(4)})`;

      if (tag) {
        tag.style.opacity = (rv * (1 - ze)).toFixed(3);
        // Tag tracks smoothly from card corner to full-screen corner
        tag.style.left = `${lerp(card.l + 20, 24, ze).toFixed(1)}px`;
        tag.style.bottom = `${lerp(card.b + 20, 24, ze).toFixed(1)}px`;
      }

      if (blob) {
        blob.style.opacity = (rv * (1 - ze) * 0.7).toFixed(3);
      }

      // 3. Next section (Services) rises smoothly from the bottom over the fixed photo
      if (nextSection && root) {
        const H = window.innerHeight;
        const rect = root.getBoundingClientRect();
        if (rect.bottom <= 0 || p >= 0.999) {
          nextSection.style.transform = '';
        } else {
          const naturalTop = rect.bottom - H;
          let translateY = 0;
          if (p >= 1) {
            translateY = 0;
          } else if (p >= NEXT_START) {
            const desiredTop = (1 - ne) * H;
            translateY = Math.max(0, desiredTop - naturalTop);
          } else {
            translateY = Math.max(0, H - naturalTop);
          }
          nextSection.style.transform = translateY > 0.5 ? `translate3d(0, ${translateY.toFixed(1)}px, 0)` : '';
        }
      }
    }

    let targetRv = 1;
    let currentRv = 1;
    let targetP = 0;
    let currentP = 0;
    let running = false;
    const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const SMOOTH = fine ? 0.28 : 0.45;

    function tick() {
      currentRv += (targetRv - currentRv) * SMOOTH;
      if (Math.abs(targetRv - currentRv) < 0.001) currentRv = targetRv;

      currentP += (targetP - currentP) * SMOOTH;
      if (Math.abs(targetP - currentP) < 0.0005) currentP = targetP;

      draw(currentRv, currentP);

      if (currentRv !== targetRv || currentP !== targetP) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    }

    function onScroll() {
      const prog = getProgress();
      targetRv = prog.rv;
      targetP = prog.p;
      if (prog.rv >= 1 && currentRv < 1) {
        currentRv = 1;
      }
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }

    measure();
    const initProg = getProgress();
    targetRv = currentRv = initProg.rv;
    targetP = currentP = initProg.p;
    draw(currentRv, currentP);

    window.addEventListener('scroll', onScroll, { passive: true });
    const win = window as any;
    if (win.lenis && typeof win.lenis.on === 'function') {
      win.lenis.on('scroll', onScroll);
    }

    let resizeTimer: any;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measure();
        const p = getProgress();
        targetRv = currentRv = p.rv;
        targetP = currentP = p.p;
        draw(currentRv, currentP);
      }, 100);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (win.lenis && typeof win.lenis.off === 'function') {
        win.lenis.off('scroll', onScroll);
      }
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      if (nextSection) {
        nextSection.style.transform = '';
      }
    };
  }, []);

  const handleExploreServices = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('services');
    if (!el) return;
    const win = window as any;
    if (win.lenis && typeof win.lenis.scrollTo === 'function') {
      win.lenis.scrollTo(el, { duration: 1.2, offset: 0 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVisitAtelier = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('final-cta');
    if (!el) return;
    const win = window as any;
    if (win.lenis && typeof win.lenis.scrollTo === 'function') {
      win.lenis.scrollTo(el, { duration: 1.2, offset: 0 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="statement"
      className="ph"
      data-cursor-theme="light"
      ref={rootRef}
      aria-label="Spark Atelier Philosophy"
    >
      <div className="ph-stage" data-ph-stage>
        {/* Centered Page Wrapper: Left side Content, Right side Image Card */}
        <div className="ph-wrap wrap">
          <div className="ph-grid">
            {/* Left Column: Eyebrow, Heading, Lead, and Buttons */}
            <div className="ph-copy" data-ph-copy>
              <span className="eyebrow rv" data-rv>
                THE PHILOSOPHY
              </span>
              <h2>
                <span className="rv" data-rv>
                  Beauty is not a<br />look.
                </span>
                <span className="rv l2" data-rv>
                  It&apos;s a signature.
                </span>
              </h2>
              <p className="lead rv" data-rv>
                A sanctuary where cutting-edge dermatological science, bespoke hair artistry,
                and deep tranquil luxury converge to reveal your most radiant self.
              </p>

              <div className="ph-actions rv" data-rv>
                <a href="#services" onClick={handleExploreServices} className="ph-btn">
                  Explore Services
                </a>
                <a href="#final-cta" onClick={handleVisitAtelier} className="ph-btn alt">
                  Visit Atelier
                </a>
              </div>
            </div>

            {/* Right Column: Card Slot Container (Positions the image card in the center grid) */}
            <div className="ph-slot-wrap">
              <div className="ph-slot" data-ph-slot aria-hidden="true">
                <span className="ph-blob" data-ph-blob />
              </div>
            </div>
          </div>
        </div>

        {/* Zooming Image Layer (Pinned to card coordinates, smoothly expands to fullscreen) */}
        <div className="ph-img" data-ph-img>
          <div className="ph-photo" data-ph-photo>
            <img
              src="/philosophy.webp"
              alt="Spark Atelier Creed & Philosophy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('atelier-creed.webp')) {
                  target.src = '/images/sections/atelier-creed.webp';
                }
              }}
            />
          </div>
          <span className="ph-tag" data-ph-tag>
            Spark · Philosophy
          </span>
        </div>
      </div>
    </section>
  );
}
