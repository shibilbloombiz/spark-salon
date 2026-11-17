'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './StudioList.css';

interface ServiceRow {
  no: string;
  slug: string;
  name: string;
  img: string;
  desc: string;
  chips: string[];
}

const SERVICE_ROWS: ServiceRow[] = [
  {
    no: '01',
    slug: 'hair',
    name: 'Hair',
    img: '/img/hair/hero.jpg',
    desc: 'Hair services planned around your face, texture and the way you wear your hair day to day. Your artist talks through the options before any work begins.',
    chips: ['Cut and styling', 'Colour', 'Treatments', 'Blow-dry and finish'],
  },
  {
    no: '02',
    slug: 'beard-grooming',
    name: 'Beard & Grooming',
    img: '/img/beard-grooming/hero.jpg',
    desc: 'Beard shaping and classic grooming, with the shape chosen for your features and your routine.',
    chips: ['Beard shaping', 'Classic grooming', 'Hot-towel preparation', 'Skin care'],
  },
  {
    no: '03',
    slug: 'nail',
    name: 'Nail',
    img: '/img/nail/hero.jpg',
    desc: 'Manicures, pedicures and nail art, with careful preparation and cuticle care.',
    chips: ['Manicure', 'Pedicure', 'Gel and polish', 'Nail art'],
  },
  {
    no: '04',
    slug: 'face',
    name: 'Face',
    img: '/img/face/hero.jpg',
    desc: 'Facial treatments chosen after a skin consultation, with advice for care at home.',
    chips: ['Skin consultation', 'Facial treatments', 'Cleansing and exfoliation', 'Home-care advice'],
  },
  {
    no: '05',
    slug: 'waxing',
    name: 'Waxing',
    img: '/img/waxing/hero.jpg',
    desc: 'Private, unhurried waxing with a skin check before each treatment.',
    chips: ['Facial waxing', 'Body waxing', 'Soothing aftercare'],
  },
  {
    no: '06',
    slug: 'bridal',
    name: 'Bridal',
    img: '/img/bridal/hero.jpg',
    desc: 'Bridal hair and make-up planned around your ceremonies, with a trial session before the wedding.',
    chips: ['Bridal consultation', 'Bridal hair', 'Bridal make-up', 'Trial session'],
  },
  {
    no: '07',
    slug: 'spa',
    name: 'Spa',
    img: '/img/spa/hero.jpg',
    desc: 'Massage and restorative rituals, adjusted to your comfort as the session goes on.',
    chips: ['Massage', 'Body rituals', 'Scalp treatments'],
  },
  {
    no: '08',
    slug: 'tattoo',
    name: 'Tattoo',
    img: '/img/tattoo/hero.jpg',
    desc: 'Tattoo design, stencil approval and sessions planned around placement.',
    chips: ['Consultation and design', 'Stencil approval', 'Tattoo sessions', 'Healing guidance'],
  },
];

export default function StudioList() {
  const rootRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const list = root.querySelector<HTMLElement>('.sl-list');
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-sl-item]'));
    const cursor = root.querySelector<HTMLElement>('[data-sl-cursor]');
    if (!list || !cursor || items.length === 0) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let current: HTMLElement | null = null;
    let inside = false;
    let lastY = 0;
    let ticking = false;
    let pinned = false;
    let focusScrollIgnoreUntil = 0;
    let settleEnd = 0;
    let settling = false;
    let settleRaf = 0;
    let queueRaf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    function show(item: HTMLElement | null) {
      if (current === item) return;
      if (current) current.classList.remove('is-open');
      current = item;
      if (item) item.classList.add('is-open');
    }

    function rowAt(y: number): HTMLElement | null {
      return (
        items.find((it) => {
          const r = it.getBoundingClientRect();
          return y >= r.top && y < r.bottom;
        }) || null
      );
    }

    // Opening or closing a row moves the rows below it for about a second, so re-check each frame while it settles
    function settle() {
      if (!fine) return;
      settleEnd = Math.max(settleEnd, performance.now() + 1300);
      if (settling) return;
      settling = true;
      const f = () => {
        refresh();
        if (performance.now() < settleEnd) {
          settleRaf = requestAnimationFrame(f);
        } else {
          settling = false;
        }
      };
      settleRaf = requestAnimationFrame(f);
    }

    function refresh() {
      ticking = false;
      if (performance.now() < focusScrollIgnoreUntil) return;
      if (pinned && !fine) return;
      // Mouse: the row under the pointer. Otherwise: the row crossing the middle of the screen
      const y = inside ? lastY : window.innerHeight * 0.5;
      if (current) {
        const r = current.getBoundingClientRect();
        if (y >= r.top && y < r.bottom) return;
      }
      const next = rowAt(y);
      if (next !== current) {
        show(next);
        settle();
      }
    }

    function queue() {
      if (!ticking) {
        ticking = true;
        queueRaf = requestAnimationFrame(refresh);
      }
    }

    const onScroll = () => {
      if (performance.now() < focusScrollIgnoreUntil) return;
      pinned = false;
      queue();
    };
    const onResize = () => queue();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const step = () => {
      cx += (tx - cx) * 0.34;
      cy += (ty - cy) * 0.34;
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cx = tx = e.clientX;
      cy = ty = e.clientY;
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      root.classList.add('cursor-on');
      inside = true;
      lastY = e.clientY;
      refresh();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      if (!root.classList.contains('cursor-on')) {
        cx = tx;
        cy = ty;
        root.classList.add('cursor-on');
      }
      if (!raf) raf = requestAnimationFrame(step);
      inside = true;
      lastY = e.clientY;
      refresh();
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      root.classList.remove('cursor-on');
      inside = false;
      refresh();
    };

    if (fine) {
      list.addEventListener('pointerenter', onPointerEnter);
      list.addEventListener('pointermove', onPointerMove);
      list.addEventListener('pointerleave', onPointerLeave);
    }

    // Mouse click opens the service page. Touch: first tap reveals row, second tap or CTA opens page.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const row = target.closest<HTMLElement>('.sl-link');
      if (!row) return;
      const href = row.dataset.href;
      if (fine || target.closest('.sl-cta')) {
        if (href) router.push(href);
        return;
      }
      const parent = row.parentElement;
      if (current === parent) {
        if (href) router.push(href);
      } else {
        pinned = true;
        show(parent);
      }
    };

    // Keyboard: Enter opens the focused service
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.key === 'Enter' && target && target.classList.contains('sl-link')) {
        const href = target.dataset.href;
        if (href) router.push(href);
      }
    };

    // Keyboard focus reveals the row
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      const item = target?.closest<HTMLElement>('[data-sl-item]') || null;
      if (item) {
        focusScrollIgnoreUntil = performance.now() + 250;
        if (!fine) pinned = true;
        show(item);
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (!related || !list.contains(related)) queue();
    };

    list.addEventListener('click', onClick);
    list.addEventListener('keydown', onKeyDown);
    list.addEventListener('focusin', onFocusIn);
    list.addEventListener('focusout', onFocusOut);

    // Default to the first studio revealed on mount
    if (items[0]) {
      show(items[0]);
    }
    queue();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (fine) {
        list.removeEventListener('pointerenter', onPointerEnter);
        list.removeEventListener('pointermove', onPointerMove);
        list.removeEventListener('pointerleave', onPointerLeave);
      }
      list.removeEventListener('click', onClick);
      list.removeEventListener('keydown', onKeyDown);
      list.removeEventListener('focusin', onFocusIn);
      list.removeEventListener('focusout', onFocusOut);
      if (raf) cancelAnimationFrame(raf);
      if (settleRaf) cancelAnimationFrame(settleRaf);
      if (queueRaf) cancelAnimationFrame(queueRaf);
      root.classList.remove('cursor-on');
    };
  }, [router]);

  return (
    <section
      className="sl"
      ref={rootRef}
      data-sl
      aria-labelledby="sl-title"
      id="services"
      data-cursor-theme="dark"
    >
      <header className="sl-head">
        <p className="sl-label">Spark International</p>
        <h2 className="sl-h2" id="sl-title">
          Our services
        </h2>
      </header>

      <ul className="sl-list">
        {SERVICE_ROWS.map((srv) => {
          const href = `/services/${srv.slug}`;
          return (
            <li key={srv.slug} className="sl-item" data-sl-item>
              <div className="sl-link" data-href={href} tabIndex={0} role="link" aria-label={srv.name}>
                <span className="sl-bg" aria-hidden="true">
                  <img
                    src={srv.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="sl-ph">Photo to be supplied</span>
                </span>
                <span className="sl-top">
                  <span className="sl-no">{srv.no}</span>
                  <span className="sl-name">{srv.name}</span>
                </span>
                <div className="sl-panel">
                  <div>
                    <div className="sl-details">
                      <p>{srv.desc}</p>
                      <ul className="sl-chips">
                        {srv.chips.map((chip) => (
                          <li key={chip}>{chip}</li>
                        ))}
                      </ul>
                      <a className="sl-cta" href={href}>
                        Explore more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sl-cursor" data-sl-cursor aria-hidden="true">
        View
      </div>
    </section>
  );
}
