'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import './SparkServicesShowcase.css';

export interface SparkServiceItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  image: string;
  tone: string;
}

export const SPARK_SERVICES: SparkServiceItem[] = [
  {
    id: 'hair',
    title: 'HAIR',
    desc: 'Bespoke precision cutting, couture French balayage, and restorative scalp alchemy tailored to your facial architecture.',
    href: '/services/hair',
    image: '/images/services/hair-couture.jpg',
    tone: '#8a7564',
  },
  {
    id: 'beard-grooming',
    title: 'BEARD & GROOMING',
    desc: 'Old-world hot-towel craft, straight-razor detailing, and tailored beard architecture designed for your grooming routine.',
    href: '/services/beard-grooming',
    image: '/images/services/beard-grooming.jpg',
    tone: '#5f5246',
  },
  {
    id: 'nail',
    title: 'NAIL',
    desc: 'Zero-water Russian dry manicures, structured gel architecture, and bespoke chrome fine-line art with lasting precision.',
    href: '/services/nail',
    image: '/images/services/nail-detailing.jpg',
    tone: '#a08c7a',
  },
  {
    id: 'face',
    title: 'FACE',
    desc: 'Transformative medical-grade clinical facials, hydra-oxygen dermabrasion, and cellular radiance therapy for luminous skin.',
    href: '/services/face',
    image: '/images/gallery/dewy-skin-radiance.webp',
    tone: '#6d7566',
  },
  {
    id: 'waxing',
    title: 'WAXING',
    desc: 'Low-temperature Italian hard wax depilation with soothing chamomile restoration in serene private suites.',
    href: '/services/waxing',
    image: '/images/services/skin-waxing.jpg',
    tone: '#9a8677',
  },
  {
    id: 'bridal',
    title: 'BRIDAL',
    desc: 'Haute bridal couture styling, waterproof 24-hour HD airbrush makeup, and regal veil draping for your ceremonial day.',
    href: '/services/bridal',
    image: '/images/services/bridal-masterpiece.jpg',
    tone: '#7a6a5e',
  },
  {
    id: 'spa',
    title: 'SPA',
    desc: 'Authentic Balinese acupressure massage and heated volcanic basalt stone therapies to restore deep sensory equilibrium.',
    href: '/services/spa',
    image: '/images/services/spa-wellness.jpg',
    tone: '#4f5a57',
  },
  {
    id: 'tattoo',
    title: 'TATTOO',
    desc: 'Bespoke single-needle fine-line illustrative tattoos and sacred geometry crafted under medical-grade sterile protocols.',
    href: '/services/tattoo',
    image: '/images/services/custom-tattoo.jpg',
    tone: '#3a3836',
  },
];

const ARROW_SVG = (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      d="M2 8h11M9 4l4 4-4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function smoothstep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function pad2(n: number): string {
  return (n < 10 ? '0' : '') + n;
}

export default function SparkServicesShowcase() {
  const N = SPARK_SERVICES.length;

  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  // Reactive state for React rendering
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isStatic, setIsStatic] = useState<boolean>(false);

  // Imperative animation state for 60/120fps hardware-accelerated motion without React re-render lag
  const animStateRef = useRef({
    active: 0,
    pos: 0,
    target: 0,
    gw: 1,
    x: 0,
    speed: 80,
    last: 0,
    inView: true,
    isStatic: false,
    rafScroll: 0,
    rafMarquee: 0,
    leaveTimer: 0 as any,
    resizeTimer: 0 as any,
  });

  // Marquee Group DOM Construction matching reference HTML
  const buildTitle = useCallback((text: string) => {
    const track = trackRef.current;
    if (!track || typeof window === 'undefined') return;

    function makeGroup(txt: string, reps: number) {
      const g = document.createElement('div');
      g.className = 'svc-group';
      for (let r = 0; r < reps; r++) {
        const w = document.createElement('span');
        w.className = 'svc-word';
        w.textContent = txt;
        const s = document.createElement('span');
        s.className = 'svc-sep';
        s.textContent = '•';
        g.appendChild(w);
        g.appendChild(s);
      }
      return g;
    }

    const vw = window.innerWidth;
    const probe = makeGroup(text, 1);
    track.replaceChildren(probe);
    const unit = probe.getBoundingClientRect().width || 1;
    const reps = Math.max(1, Math.ceil((vw * 0.6) / unit));
    const group = makeGroup(text, reps);
    track.replaceChildren(group);
    const gw = group.getBoundingClientRect().width || 1;
    const count = Math.ceil((vw + gw) / gw) + 1;
    const frag = document.createDocumentFragment();
    frag.appendChild(group);
    for (let k = 1; k < count; k++) {
      frag.appendChild(group.cloneNode(true));
    }
    track.replaceChildren(frag);

    const s = animStateRef.current;
    s.gw = gw;
    s.x = s.x % gw;
  }, []);

  // Continuous Marquee Animation Frame Loop
  const startMarquee = useCallback(() => {
    const s = animStateRef.current;
    if (s.rafMarquee || s.isStatic || !s.inView || (typeof document !== 'undefined' && document.hidden)) {
      return;
    }
    s.last = 0;

    const marqueeTick = (t: number) => {
      if (!s.last) s.last = t;
      const dt = Math.min(0.064, (t - s.last) / 1000);
      s.last = t;
      s.x = (s.x + s.speed * dt) % s.gw;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${(-s.x).toFixed(2)}px,0,0)`;
      }
      s.rafMarquee = requestAnimationFrame(marqueeTick);
    };

    s.rafMarquee = requestAnimationFrame(marqueeTick);
  }, []);

  const stopMarquee = useCallback(() => {
    const s = animStateRef.current;
    if (s.rafMarquee) {
      cancelAnimationFrame(s.rafMarquee);
      s.rafMarquee = 0;
    }
  }, []);

  // Vertical Slide Reveal Transformations
  const renderSlides = useCallback(
    (p: number) => {
      for (let i = 0; i < N; i++) {
        const slide = slidesRef.current[i];
        if (slide) {
          slide.style.transform = `translate3d(0,${((i - p) * 100).toFixed(3)}%,0)`;
        }
      }
    },
    [N]
  );

  // Preload Active and Adjacent Images to prevent any pop-in during scrub
  const preload = useCallback(
    (i: number) => {
      for (let j = i - 1; j <= i + 1; j++) {
        if (j < 0 || j >= N) continue;
        const img = imgRefs.current[j];
        if (img && !img.src) {
          const ds = img.dataset.src;
          if (ds) img.src = ds;
        }
      }
    },
    [N]
  );

  // Text Animation for Description changes
  const applyDesc = useCallback((idx: number) => {
    const desc = descRef.current;
    if (!desc) return;
    desc.textContent = SPARK_SERVICES[idx].desc;
    desc.classList.remove('is-leaving');
    desc.classList.add('is-entering');
    void desc.offsetWidth; // commit the start position before easing in
    desc.classList.remove('is-entering');
  }, []);

  const scheduleDesc = useCallback(
    (idx: number) => {
      const s = animStateRef.current;
      const desc = descRef.current;
      if (!desc) return;

      if (s.isStatic) {
        applyDesc(idx);
        return;
      }

      if (s.leaveTimer) return; // already leaving; the timer applies the latest index

      desc.classList.remove('is-entering');
      desc.classList.add('is-leaving');

      s.leaveTimer = setTimeout(() => {
        s.leaveTimer = 0;
        applyDesc(s.active);
      }, 320);
    },
    [applyDesc]
  );

  // Synchronize Active Metadata & Typography
  const syncMeta = useCallback(
    (i: number) => {
      const s = animStateRef.current;
      const svc = SPARK_SERVICES[i];

      if (stageRef.current) {
        stageRef.current.style.setProperty('--scale', svc.title.length > 12 ? '0.8' : '1');
      }

      if (ctaRef.current) {
        ctaRef.current.href = svc.href;
        ctaRef.current.setAttribute('aria-label', `Explore ${svc.title} service`);
      }

      buildTitle(svc.title);
      preload(i);
      setActiveIdx(i);
      scheduleDesc(i);
    },
    [buildTitle, preload, scheduleDesc]
  );

  const setActive = useCallback(
    (i: number) => {
      const s = animStateRef.current;
      if (i === s.active) return;
      s.active = i;
      syncMeta(i);
    },
    [syncMeta]
  );

  // Scroll Progress Calculations
  const rawFromScroll = useCallback(() => {
    const sec = sectionRef.current;
    const st = stickyRef.current;
    if (!sec || !st) return 0;
    const range = sec.offsetHeight - st.offsetHeight;
    if (range <= 0) return 0;
    const p = clamp(-sec.getBoundingClientRect().top / range, 0, 1);
    return p * (N - 1);
  }, [N]);

  // Interval-dwell easing: dwells firmly at each service and transitions smoothly across the middle
  const easeIndex = useCallback(
    (raw: number) => {
      if (raw >= N - 1) return N - 1;
      const i = Math.floor(raw);
      return i + smoothstep(0.22, 0.78, raw - i);
    },
    [N]
  );

  // Lerp follow loop
  const follow = useCallback(() => {
    const s = animStateRef.current;
    const d = s.target - s.pos;
    if (Math.abs(d) < 0.0008) {
      s.pos = s.target;
      s.rafScroll = 0;
    } else {
      s.pos += d * 0.16;
      s.rafScroll = requestAnimationFrame(follow);
    }
    renderSlides(s.pos);
    setActive(clamp(Math.round(s.pos), 0, N - 1));
  }, [N, renderSlides, setActive]);

  const onScroll = useCallback(() => {
    const s = animStateRef.current;
    if (s.isStatic) return;
    s.target = easeIndex(rawFromScroll());
    if (!s.rafScroll) {
      s.rafScroll = requestAnimationFrame(follow);
    }
  }, [easeIndex, follow, rawFromScroll]);

  // Manual Prev / Next navigation for reduced-motion mode
  const go = useCallback(
    (i: number) => {
      const s = animStateRef.current;
      const target = clamp(i, 0, N - 1);
      s.pos = s.target = target;
      renderSlides(target);
      setActive(target);
    },
    [N, renderSlides, setActive]
  );

  // Main lifecycle setup
  useEffect(() => {
    const s = animStateRef.current;
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    s.speed = Math.max(64, window.innerWidth * 0.08);
    s.isStatic = reduceMq.matches;
    setIsStatic(s.isStatic);

    const startIdx = s.isStatic ? 0 : Math.round(easeIndex(rawFromScroll()));
    s.pos = s.target = s.isStatic ? startIdx : easeIndex(rawFromScroll());
    renderSlides(s.pos);
    s.active = clamp(startIdx, 0, N - 1);

    // Initial preloads for slides 0 & 1
    preload(s.active);
    syncMeta(s.active);
    applyDesc(s.active);

    if (!s.isStatic) {
      startMarquee();
    }

    // Measure typography accurately once fonts load
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        buildTitle(SPARK_SERVICES[s.active].title);
      });
    }

    // Scroll listeners: native window and Lenis smooth scroll
    window.addEventListener('scroll', onScroll, { passive: true });
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', onScroll);
    }

    // Resize handler (debounced)
    const handleResize = () => {
      clearTimeout(s.resizeTimer);
      s.resizeTimer = setTimeout(() => {
        s.speed = Math.max(64, window.innerWidth * 0.08);
        buildTitle(SPARK_SERVICES[s.active].title);
        onScroll();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    // Visibility change handler (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopMarquee();
      } else if (!s.isStatic && s.inView) {
        startMarquee();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Reduced motion media query listener
    const handleReduceMotion = () => {
      s.isStatic = reduceMq.matches;
      setIsStatic(s.isStatic);
      if (s.isStatic) {
        if (s.rafScroll) {
          cancelAnimationFrame(s.rafScroll);
          s.rafScroll = 0;
        }
        stopMarquee();
        go(s.active < 0 ? 0 : s.active);
      } else {
        startMarquee();
        onScroll();
      }
    };
    reduceMq.addEventListener('change', handleReduceMotion);

    // IntersectionObserver: pause marquee when scrolled away to save CPU / battery
    let io: IntersectionObserver | null = null;
    if (sectionRef.current) {
      io = new IntersectionObserver((entries) => {
        s.inView = entries[0].isIntersecting;
        if (s.inView && !s.isStatic && !document.hidden) {
          startMarquee();
        } else {
          stopMarquee();
        }
      });
      io.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', onScroll);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reduceMq.removeEventListener('change', handleReduceMotion);
      if (io) io.disconnect();
      if (s.rafScroll) cancelAnimationFrame(s.rafScroll);
      if (s.rafMarquee) cancelAnimationFrame(s.rafMarquee);
      clearTimeout(s.leaveTimer);
      clearTimeout(s.resizeTimer);
    };
  }, [
    N,
    applyDesc,
    buildTitle,
    easeIndex,
    go,
    onScroll,
    preload,
    rawFromScroll,
    renderSlides,
    startMarquee,
    stopMarquee,
    syncMeta,
  ]);

  const activeService = SPARK_SERVICES[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`svc ${isStatic ? 'is-static' : ''}`}
      aria-label="Services"
      style={{ '--n': N } as React.CSSProperties}
    >
      <div ref={stickyRef} className="svc-sticky">
        {/* Central Visual Stage */}
        <div ref={stageRef} className="svc-stage">
          {/* Moving Typography Layer (positioned behind central image frame) */}
          <div className="svc-marquee" aria-hidden="true">
            <div ref={trackRef} className="svc-track">
              {/* Initial SSR probe group to eliminate layout shift */}
              <div className="svc-group">
                <span className="svc-word">{SPARK_SERVICES[0].title}</span>
                <span className="svc-sep">•</span>
                <span className="svc-word">{SPARK_SERVICES[0].title}</span>
                <span className="svc-sep">•</span>
              </div>
            </div>
          </div>

          {/* Portrait Frame: clipping window for the vertical reveal */}
          <div
            ref={frameRef}
            className="svc-frame"
            aria-label={`${activeService.title} service image`}
          >
            <div className="svc-slides">
              {SPARK_SERVICES.map((service, i) => (
                <div
                  key={service.id}
                  ref={(el) => {
                    slidesRef.current[i] = el;
                  }}
                  className="svc-slide"
                  style={
                    {
                      '--tone': service.tone,
                      transform: `translate3d(0, ${i * 100}%, 0)`,
                    } as React.CSSProperties
                  }
                >
                  <img
                    ref={(el) => {
                      imgRefs.current[i] = el;
                    }}
                    alt=""
                    decoding="async"
                    draggable={false}
                    src={i <= 1 ? service.image : undefined}
                    data-src={service.image}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Service Description & Explore CTA Button */}
        <div className="svc-copy">
          <p ref={descRef} className="svc-desc">
            {activeService.desc}
          </p>

          <Link
            ref={ctaRef}
            className="svc-cta"
            href={activeService.href}
            aria-label={`Explore ${activeService.title} service`}
          >
            <span>Explore service</span>
            {ARROW_SVG}
          </Link>
        </div>

        {/* Accessible Navigation Controls (active in reduced-motion mode) */}
        <div className="svc-nav">
          <button
            type="button"
            disabled={activeIdx === 0}
            onClick={() => go(activeIdx - 1)}
          >
            Previous
          </button>
          <span>
            {pad2(activeIdx + 1)} / {pad2(N)}
          </span>
          <button
            type="button"
            disabled={activeIdx === N - 1}
            onClick={() => go(activeIdx + 1)}
          >
            Next
          </button>
        </div>

        {/* Accessible screen-reader announcement */}
        <h2 className="svc-sr-only" aria-live="polite">
          {activeService.title}
        </h2>
      </div>
    </section>
  );
}
