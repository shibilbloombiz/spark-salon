'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UniversalVideo from '@/components/video/UniversalVideo';
import './HairServiceReel.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HairReelService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  mediaType: 'video' | 'image';
  mediaUrl: string;
  posterUrl?: string;
}

export const HAIR_SERVICES: HairReelService[] = [
  {
    id: 'hair-precision-cut',
    title: 'Haute Precision Architectural Haircut',
    description: 'Bespoke consultation, precision scissor detailing, diamond-shine blow-dry and structural finishing.',
    duration: '60 mins',
    price: '₹1,800',
    mediaType: 'video',
    mediaUrl: '/spiral/reels/reel-hair-styling.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'hair-french-balayage',
    title: 'French Balayage & Dimensional Melt',
    description: 'Freehand dimensional contouring with luminous light reflection and custom dual-tone gloss toning.',
    duration: '180 mins',
    price: '₹7,500',
    mediaType: 'video',
    mediaUrl: '/spiral/reels/reel-balayage.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'hair-liquid-silk-keratin',
    title: 'Liquid Silk Keratin Restructuring',
    description: 'Advanced molecular smoothing therapy eliminating up to 95% frizz while sealing mirror-finish cuticle shine.',
    duration: '150 mins',
    price: '₹6,800',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'hair-organic-cysteine',
    title: 'Cysteine Organic Protein Treatment',
    description: 'Formaldehyde-free organic amino acid restructuring for sensitized and heat-compromised hair.',
    duration: '120 mins',
    price: '₹5,500',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'hair-chronologiste-caviar',
    title: 'Chronologiste Caviar Scalp Ritual',
    description: 'Sublime scalp revitalization with biomimetic caviar pearls and therapeutic head massage.',
    duration: '75 mins',
    price: '₹3,200',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=85',
  },
];

function splitIntoLines(title: string): string[] {
  const words = title.split(' ');
  const lineCount = Math.min(3, Math.max(1, Math.ceil(words.length / 2)));
  const perLine = Math.ceil(words.length / lineCount);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += perLine) {
    out.push(words.slice(i, i + perLine).join(' '));
  }
  return out;
}

interface HairServiceReelProps {
  onBookService?: (serviceName: string) => void;
}

export default function HairServiceReel({ onBookService }: HairServiceReelProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const cntRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinEl = pinRef.current;
    const trackEl = trackRef.current;
    const frameEl = frameRef.current;
    const barEl = barRef.current;
    const cntEl = cntRef.current;
    const countEl = countRef.current;
    if (!pinEl || !trackEl || !frameEl || !barEl || !cntEl || !countEl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const slides = Array.from(trackEl.querySelectorAll<HTMLElement>('.hair-reel-slide'));
    const N = slides.length;
    if (N === 0) return;

    const mediaLayers = Array.from(frameEl.querySelectorAll<HTMLElement>('.hair-reel-media-layer'));
    const words = (i: number) => Array.from(slides[i]?.querySelectorAll<HTMLElement>('.hair-reel-in') || []);
    const copy = (i: number) => Array.from(slides[i]?.querySelectorAll<HTMLElement>('.hair-reel-copy, .hair-reel-num') || []);

    // Initial setup matching reference blueprint
    gsap.set(frameEl, { clipPath: 'inset(100% 0% 0% 0% round 20px)' });
    slides.forEach((_, i) => {
      gsap.set(words(i), { yPercent: 118 });
      gsap.set(copy(i), { autoAlpha: 0, y: 26 });
    });
    gsap.set(countEl, { autoAlpha: 0 });
    gsap.set(barEl, { scaleX: 0.02 });
    mediaLayers.forEach((layer, i) => {
      gsap.set(layer, { autoAlpha: i === 0 ? 1 : 0 });
    });

    const HOLD = 0.8;
    const STEP = 1.6;
    const starts: number[] = [0];

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pinEl,
        start: 'top top',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        end: () => `+=${Math.round(window.innerHeight * (0.8 + (N - 1) * 1.1 + 0.4))}`,
        onUpdate: () => {
          const t = tl.time();
          let idx = 0;
          for (let i = 1; i < starts.length; i++) {
            if (t >= starts[i] + STEP * 0.45) {
              idx = i;
            }
          }
          if (cntEl) {
            cntEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
          }
          if (barEl) {
            gsap.set(barEl, { scaleX: Math.max(0.02, tl.progress()) });
          }
        },
      },
    });

    // 01 — Initial appearance upon entering viewport
    tl.to(frameEl, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.0, ease: 'power3.inOut' }, 0.2)
      .to(words(0), { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.6)
      .to(copy(0), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.0)
      .to(countEl, { autoAlpha: 1, duration: 0.5 }, 1.2);

    // 02 — Vertical scroll scrubbed transitions across slides 1..N-1
    for (let i = 1; i < N; i++) {
      tl.to({}, { duration: HOLD });
      const at = tl.duration();
      starts.push(at);

      tl.to(trackEl, { xPercent: (-100 * i) / N, duration: STEP, ease: 'power2.inOut' }, at)
        .to(frameEl, { scale: 0.965, duration: STEP / 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, at);

      if (mediaLayers[i - 1]) {
        tl.to(mediaLayers[i - 1], { autoAlpha: 0, duration: STEP * 0.5, ease: 'power1.inOut' }, at);
      }
      if (mediaLayers[i]) {
        tl.to(mediaLayers[i], { autoAlpha: 1, duration: STEP * 0.5, ease: 'power1.inOut' }, at + STEP * 0.15);
      }

      tl.to(words(i), { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, at + 0.55)
        .to(copy(i), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, at + 0.85);
    }

    // 03 — Final hold before natural release of pin
    tl.to({}, { duration: 0.9 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const N = HAIR_SERVICES.length;

  return (
    <section className="hair-reel-section" id="hair-reel" aria-label="Hair services horizontal reel">
      <div className="hair-reel-pin" ref={pinRef} id="pin">
        {/* Fixed Uppercase Service Category Label */}
        <p className="hair-reel-label">HAIR · SERVICES</p>

        {/* Scrubbed Horizontal Service Track */}
        <div
          className="hair-reel-track"
          ref={trackRef}
          style={{ width: `${N * 100}%` }}
        >
          {HAIR_SERVICES.map((service, index) => {
            const lines = splitIntoLines(service.title);
            const numStr = String(index + 1).padStart(2, '0');

            return (
              <article
                key={service.id}
                className="hair-reel-slide"
                style={{ width: `${100 / N}%` }}
              >
                {/* Stepped Masked Title */}
                <h3 className="hair-reel-h">
                  {lines.map((line, lineIdx) => (
                    <span
                      key={lineIdx}
                      className="hair-reel-line"
                      style={{ paddingLeft: `${lineIdx * 0.7}em` }}
                    >
                      <span className="hair-reel-mask">
                        <span className="hair-reel-in">{line}</span>
                      </span>
                    </span>
                  ))}
                </h3>

                {/* Right Service Details */}
                <div className="hair-reel-copy">
                  <p>{service.description}</p>
                  <dl>
                    <div>
                      <dt>Time</dt>
                      <dd>{service.duration}</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>{service.price}</dd>
                    </div>
                  </dl>
                  {onBookService && (
                    <button
                      type="button"
                      className="hair-reel-book-btn"
                      onClick={() => onBookService(service.title)}
                      aria-label={`Book ${service.title}`}
                    >
                      Reserve Service <span>→</span>
                    </button>
                  )}
                </div>

                {/* Hollow Large Service Number */}
                <span className="hair-reel-num" aria-hidden="true">
                  {numStr}
                </span>
              </article>
            );
          })}
        </div>

        {/* Pinned Central Portrait Media Frame */}
        <figure className="hair-reel-frame" ref={frameRef} aria-hidden="true">
          <div className="hair-reel-media-stack">
            {HAIR_SERVICES.map((service, idx) => (
              <div
                key={service.id}
                className={`hair-reel-media-layer ${idx === 0 ? 'is-active' : ''}`}
              >
                {service.mediaType === 'video' ? (
                  <UniversalVideo
                    videoUrl={service.mediaUrl}
                    poster={service.posterUrl}
                    objectFit="cover"
                    title={service.title}
                  />
                ) : (
                  <img
                    src={service.mediaUrl}
                    alt={service.title}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                )}
              </div>
            ))}
          </div>
        </figure>

        {/* Bottom Progress Counter & Scrub Indicator */}
        <div className="hair-reel-count" ref={countRef} aria-hidden="true">
          <span ref={cntRef}>01 / 0{N}</span>
          <div className="hair-reel-bar">
            <i ref={barRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
