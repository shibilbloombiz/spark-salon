'use client';

import React, { useEffect, useRef } from 'react';
import './Testimonials.css';

interface TestimonialItem {
  title: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    title: 'A salon experience built to the highest standard',
    quote:
      'From the first consultation to the final finish, every detail felt considered. The stylists listened closely and delivered exactly what I hoped for.',
    name: 'Anjali Menon',
    role: 'Hair Client',
    avatar: '/images/testimonials/client-anjali.jpg',
  },
  {
    title: 'Bridal beauty that felt effortless',
    quote:
      'The bridal team handled trials, timing and touch-ups with real calm. On the day, I felt like the best version of myself.',
    name: 'Aiswarya Varma',
    role: 'Bridal Client',
    avatar: '/images/testimonials/client-aiswarya.jpg',
  },
  {
    title: 'Precision and comfort in one place',
    quote:
      'The barber studio is sharp, the atmosphere is relaxed, and the results speak for themselves every time I return.',
    name: 'Zameel Hameed',
    role: 'Barber Studio Client',
    avatar: '/images/testimonials/client-zameel.jpg',
  },
  {
    title: 'Skin care that actually changes things',
    quote:
      'My treatments were tailored from the start, and the room was a genuine place to slow down. My skin has never looked better.',
    name: 'Dr. Rehana Cheriyan',
    role: 'Skin & Spa Client',
    avatar: '/images/testimonials/client-rehana.jpg',
  },
  {
    title: 'Every detail, handled with care',
    quote:
      'From the welcome to the final styling, the team made every visit feel personal and unhurried. I always leave feeling my best.',
    name: 'Sunaina Kapoor',
    role: 'VIP Member',
    avatar: '/images/testimonials/client-anjali.jpg',
  },
];

interface TestimonialsProps {
  onOpenBooking?: () => void;
}

export default function Testimonials({ onOpenBooking }: TestimonialsProps): React.JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const dotsWrapRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const zoneTopRef = useRef<HTMLButtonElement>(null);
  const zoneBottomRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const deck = deckRef.current;
    const dotsWrap = dotsWrapRef.current;
    const counter = counterRef.current;
    const zoneTop = zoneTopRef.current;
    const zoneBottom = zoneBottomRef.current;

    if (!stage || !deck || !dotsWrap || !counter || !zoneTop || !zoneBottom) {
      return;
    }

    // Clean previous DOM if re-mounting
    deck.innerHTML = '';
    dotsWrap.innerHTML = '';

    const total = TESTIMONIALS.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Visible stack positions: 0 = front, 3 = back
    const SLOTS = [
      { t: 'translate(0,0) rotate(0deg)', o: 1, z: 5 },
      { t: 'translate(-3%,-4%) rotate(-5deg)', o: 0.95, z: 4 },
      { t: 'translate(3%,4%) rotate(4deg)', o: 0.9, z: 3 },
      { t: 'translate(-1%,6%) rotate(-2deg)', o: 0.85, z: 2 },
    ];
    // Any position beyond the visible four waits off-stack
    const HIDDEN = { t: 'translate(0,40%) rotate(0deg)', o: 0, z: 1 };
    const slotPose = (pos: number) => (pos < SLOTS.length ? SLOTS[pos] : HIDDEN);

    const BELOW = { t: 'translate(0,120vh) rotate(0deg)', o: 1, z: 10 };
    const POP = { t: 'translate(0,-10%) rotate(-2deg)', o: 1, z: 10 };
    const POP_EASE = 'cubic-bezier(.2,.7,.3,1)';
    const SMOOTH = 'cubic-bezier(.33,0,.2,1)';

    let order = TESTIMONIALS.map((_, i) => i);
    let busy = false;
    const cards: HTMLElement[] = [];
    const dots: HTMLButtonElement[] = [];

    const esc = (s: string) =>
      s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));

    function setPose(card: HTMLElement & { _pose?: any }, pose: { t: string; o: number; z: number }) {
      card.style.transform = pose.t;
      card.style.opacity = String(pose.o);
      card.style.zIndex = String(pose.z);
      card._pose = pose;
    }

    function tweenPath(
      card: HTMLElement & { _pose?: any },
      waypoints: { t: string; o: number; z?: number }[],
      ms: number,
      delay = 0,
      easing = SMOOTH,
      holdZ: number | null = null
    ): Promise<void> {
      const from = card._pose || { t: 'translate(0,0) rotate(0deg)', o: 1, z: 5 };
      if (holdZ !== null) {
        card.style.zIndex = String(holdZ);
      } else if (waypoints[0].z !== undefined) {
        card.style.zIndex = String(waypoints[0].z);
      }
      const frames = [{ transform: from.t, opacity: from.o }].concat(
        waypoints.map((p) => ({ transform: p.t, opacity: p.o }))
      );
      const anim = card.animate(frames, {
        duration: reduce ? 1 : ms,
        delay: reduce ? 0 : delay,
        easing,
        fill: 'both',
      });
      const last = waypoints[waypoints.length - 1];
      return anim.finished.then(() => {
        setPose(card, { t: last.t, o: last.o, z: holdZ ?? last.z ?? from.z });
        anim.cancel();
      });
    }

    function syncUI() {
      const front = order[0];
      dots.forEach((d, i) => d.classList.toggle('is-on', i === front));
      if (counter) {
        counter.textContent = `${String(front + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      }
    }

    // UP: the front card pops up, the others move forward, the popped card drops to the back.
    async function moveUp() {
      if (busy) return;
      busy = true;
      const front = cards[order[0]];
      const next = [...order.slice(1), order[0]];
      order = next;
      syncUI();

      await tweenPath(front, [POP], 220, 0, POP_EASE, 10);

      next.slice(0, total - 1).forEach((ci, pos) => {
        tweenPath(cards[ci], [slotPose(pos)], 800, 0, SMOOTH);
      });
      // Pop goes up through the top of the screen...
      await tweenPath(
        front,
        [{ t: 'translate(-4%,-120vh) rotate(-6deg)', o: 1, z: 10 }],
        520,
        0,
        'cubic-bezier(.5,0,.75,0)',
        10
      );
      // ...then re-enters from above and settles into the last position
      setPose(front, { t: 'translate(-4%,-120vh) rotate(-6deg)', o: 1, z: 10 });
      await tweenPath(front, [slotPose(total - 1)], 700, 0, SMOOTH);

      busy = false;
    }

    // DOWN: the last card comes in from the bottom to the front, the others step back.
    async function moveDown() {
      if (busy) return;
      busy = true;
      const back = cards[order[total - 1]];
      const next = [order[total - 1], ...order.slice(0, total - 1)];
      order = next;
      syncUI();

      next.slice(1).forEach((ci, i) => {
        tweenPath(cards[ci], [slotPose(i + 1)], 900, 0, SMOOTH);
      });

      await tweenPath(back, [{ ...slotPose(total - 1), o: 0, z: 1 }], 160, 0, 'ease-in');
      setPose(back, BELOW);
      await tweenPath(back, [slotPose(0)], 900, 0, SMOOTH, 10);

      busy = false;
    }

    async function goTo(target: number) {
      while (order[0] !== target) {
        if (busy) {
          await new Promise((r) => setTimeout(r, 60));
          continue;
        }
        const pos = order.indexOf(target);
        if (pos <= total / 2) await moveUp();
        else await moveDown();
      }
    }

    // Build Cards & Dots
    TESTIMONIALS.forEach((t, i) => {
      const card = document.createElement('article');
      card.className = 't-card';
      const avatarStyle = t.avatar
        ? `background-image: url('${esc(t.avatar)}'); background-size: cover; background-position: center;`
        : '';
      card.innerHTML = `
        <div class="t-card-inner">
          <h2>${esc(t.title)}</h2>
          <div class="body">
            <div class="t-person">
              <div class="t-avatar" style="${avatarStyle}" aria-hidden="true"></div>
              <div class="name">${esc(t.name)}</div>
              <div class="role">${esc(t.role)}</div>
            </div>
            <p class="t-quote">${esc(t.quote)}</p>
          </div>
        </div>`;
      deck.appendChild(card);
      cards.push(card);
      setPose(card, slotPose(i));

      const dot = document.createElement('button');
      dot.className = 't-dot';
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    const handleUpClick = (e: MouseEvent) => {
      e.stopPropagation();
      moveUp();
    };
    const handleDownClick = (e: MouseEvent) => {
      e.stopPropagation();
      moveDown();
    };

    zoneTop.addEventListener('click', handleUpClick);
    zoneBottom.addEventListener('click', handleDownClick);

    // Global stage pointer move to ensure cursor reflects top/bottom arrow model
    const handleStagePointerMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const isTop = e.clientY < rect.top + rect.height / 2;
      document.body.dataset.cursor = isTop ? 'arrow-up' : 'arrow-down';
    };

    // Stage click: clicking anywhere in top half moves up, bottom half moves down
    const handleStageClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.t-dot')) return;
      const rect = stage.getBoundingClientRect();
      const isTop = e.clientY < rect.top + rect.height / 2;
      if (isTop) moveUp();
      else moveDown();
    };

    stage.addEventListener('mousemove', handleStagePointerMove);
    stage.addEventListener('click', handleStageClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveUp();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    let startY: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (startY === null) return;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dy) > 40) {
        if (dy < 0) moveUp();
        else moveDown();
      }
      startY = null;
    };
    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });

    let wheelLock = false;
    const handleWheel = (e: WheelEvent) => {
      if (wheelLock || Math.abs(e.deltaY) < 20) return;
      wheelLock = true;
      if (e.deltaY > 0) moveDown();
      else moveUp();
      setTimeout(() => {
        wheelLock = false;
      }, 900);
    };
    stage.addEventListener('wheel', handleWheel, { passive: true });

    let hovered = false;
    const handleMouseEnter = () => {
      hovered = true;
    };
    const handleMouseLeave = () => {
      hovered = false;
      if (document.body.dataset.cursor === 'arrow-up' || document.body.dataset.cursor === 'arrow-down') {
        delete document.body.dataset.cursor;
      }
    };
    stage.addEventListener('mouseenter', handleMouseEnter);
    stage.addEventListener('mouseleave', handleMouseLeave);

    let autoTimer: NodeJS.Timeout | null = null;
    if (!reduce) {
      autoTimer = setInterval(() => {
        if (!hovered) moveUp();
      }, 6000);
    }

    syncUI();

    return () => {
      if (autoTimer) clearInterval(autoTimer);
      zoneTop.removeEventListener('click', handleUpClick);
      zoneBottom.removeEventListener('click', handleDownClick);
      stage.removeEventListener('mousemove', handleStagePointerMove);
      stage.removeEventListener('click', handleStageClick);
      window.removeEventListener('keydown', handleKeyDown);
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchend', handleTouchEnd);
      stage.removeEventListener('wheel', handleWheel);
      stage.removeEventListener('mouseenter', handleMouseEnter);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      deck.innerHTML = '';
      dotsWrap.innerHTML = '';
    };
  }, []);

  return (
    <section id="testimonials" className="testimonials-section" data-cursor-theme="red">
      <div
        className="testimonials-stage"
        ref={stageRef}
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        <div className="t-deck" ref={deckRef} />

        {/* Top half zone: Up Arrow Button Model cursor */}
        <button
          className="t-zone t-zone-top"
          ref={zoneTopRef}
          type="button"
          aria-label="Pop front card to the back"
          data-cursor="arrow-up"
        />

        {/* Bottom half zone: Down Arrow Button Model cursor */}
        <button
          className="t-zone t-zone-bottom"
          ref={zoneBottomRef}
          type="button"
          aria-label="Bring last card to the front"
          data-cursor="arrow-down"
        />

        <div className="t-dots" ref={dotsWrapRef} aria-label="Choose testimonial" />
        <div className="t-counter" ref={counterRef}>
          01 / 05
        </div>
      </div>
    </section>
  );
}
