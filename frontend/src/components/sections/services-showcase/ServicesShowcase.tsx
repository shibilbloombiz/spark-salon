'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesShowcase.css';
import './service-stage.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ShowcaseService {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  word: string;
  colors: [string, string, string, string]; // [a, b, c, text]
  heroImage: string;
  tagline: string;
  intro: string[];
  includes: string[];
  duration: string;
  prompt: string;
  gallery: { file: string; caption: string; src?: string }[];
}

export const SHOWCASE_SERVICES: ShowcaseService[] = [
  {
    slug: 'hair',
    name: 'Hair Couture',
    shortName: 'Hair',
    category: 'Hair Studio',
    word: 'HAIR',
    colors: ['#7A4B22', '#C99757', '#140B04', '#f5d79e'],
    heroImage: '/images/services/hair-couture.jpg',
    prompt: 'Sculpt couture silhouettes, dimensional tone and texture suited to your bone structure.',
    tagline: 'Cut, colour and care shaped around your face, your texture and the way you actually live.',
    intro: [
      'Hair work begins with a conversation rather than a chair. Your artist reads your density, your natural movement and the maintenance you can realistically keep up, then designs a cut or colour that works with all three.',
      'From precision cuts and dimensional colour to smoothing and scalp-focused treatments, each appointment is built around hair health as much as the finished look. Nothing is recommended simply because it is fashionable.'
    ],
    includes: [
      'Consultation and hair analysis',
      'Precision cut or restyle',
      'Colour, tone or highlights, where chosen',
      'Blow-dry and finishing styling'
    ],
    duration: 'Typically 60 to 150 minutes, depending on length and colour work. Confirmed at consultation.',
    gallery: [
      { file: 'hair/gallery-1.jpg', caption: 'Layered cut in natural light', src: '/images/services/hair-couture.jpg' },
      { file: 'hair/gallery-2.jpg', caption: 'Colour detail close-up', src: '/images/gallery/signature-brunette.webp' },
      { file: 'hair/gallery-3.jpg', caption: 'Blow-dry and finish', src: '/images/gallery/precision-shears-cutting.webp' },
      { file: 'hair/gallery-4.jpg', caption: 'Consultation at the mirror', src: '/images/experience/exp-hair.jpg' },
      { file: 'hair/gallery-5.jpg', caption: 'Texture and movement', src: '/images/sections/atelier-creed.jpg' }
    ]
  },
  {
    slug: 'beard-grooming',
    name: 'Beard & Grooming',
    shortName: 'Groom',
    category: 'Grooming',
    word: 'GROOM',
    colors: ['#8C532B', '#C99757', '#1A0E06', '#f0d5b5'],
    heroImage: '/images/services/beard-grooming.jpg',
    prompt: 'Precision beard sculpting, hot-towel preparation and classic barbering in a calm chair.',
    tagline: 'Precision beard sculpting and classic grooming, finished with the calm of a proper barber chair.',
    intro: [
      'A beard is a shape, and shape is what this service is about. Your artist studies your jawline, growth pattern and the length you want, then designs a line that frames your face rather than fighting it.',
      'Sessions combine detailed trimming, hot-towel preparation and skin care suited to shaved or bearded skin, so the finish feels as good as it looks.'
    ],
    includes: [
      'Consultation on shape and length',
      'Precision trim and line-up',
      'Hot-towel preparation',
      'Moisturising finish and styling'
    ],
    duration: 'Typically 30 to 60 minutes. Confirmed at consultation.',
    gallery: [
      { file: 'beard-grooming/gallery-1.jpg', caption: 'Sharpened neckline detail', src: '/images/services/beard-grooming.jpg' },
      { file: 'beard-grooming/gallery-2.jpg', caption: 'Hot-towel preparation', src: '/images/about/massage-suite.jpg' },
      { file: 'beard-grooming/gallery-3.jpg', caption: 'Full beard profile', src: '/images/gallery/glamour-makeup-portrait.webp' },
      { file: 'beard-grooming/gallery-4.jpg', caption: 'Trimming with precision tools', src: '/images/sections/bg-1.webp' },
      { file: 'beard-grooming/gallery-5.jpg', caption: 'Finished beard and skin', src: '/images/sections/bg-2.webp' }
    ]
  },
  {
    slug: 'nail',
    name: 'Nail Atelier',
    shortName: 'Nails',
    category: 'Nail Atelier',
    word: 'NAILS',
    colors: ['#A0526B', '#E8B4C8', '#1A0810', '#fce4ec'],
    heroImage: '/images/services/nail-detailing.jpg',
    prompt: 'Good nails are about structure as much as colour. Cuticle care and lasting architectural finish.',
    tagline: 'Considered manicures and pedicures, from clean shaping to lasting colour and fine detail.',
    intro: [
      'Good nails are about structure as much as colour. Shape, cuticle health and the surface beneath the polish decide how long a finish lasts and how it looks in daylight.',
      'Your nail artist assesses your nails first, then recommends a shape and finish that suits your hands and your routine. Gel, polish and nail art are all available, with honest advice on which will hold up best.'
    ],
    includes: [
      'Nail assessment and shaping',
      'Cuticle care and massage',
      'Polish, gel or refined nail art',
      'Hand or foot finishing treatment'
    ],
    duration: 'Typically 45 to 75 minutes, longer for detailed nail art. Confirmed at consultation.',
    gallery: [
      { file: 'nail/gallery-1.jpg', caption: 'Gel manicure close-up', src: '/images/services/nail-detailing.jpg' },
      { file: 'nail/gallery-2.jpg', caption: 'Classic polish detail', src: '/images/gallery/luxury-marble-manicure.webp' },
      { file: 'nail/gallery-3.jpg', caption: 'Fine nail art detail', src: '/images/sections/atelier-creed.jpg' },
      { file: 'nail/gallery-4.jpg', caption: 'Pedicure finish', src: '/images/experience/exp-spa.jpg' },
      { file: 'nail/gallery-5.jpg', caption: 'Hands in natural light', src: '/images/about/spa-lounge.jpg' }
    ]
  },
  {
    slug: 'facial',
    name: 'Skin & Facial',
    shortName: 'Face',
    category: 'Skin & Facials',
    word: 'FACE',
    colors: ['#8C4535', '#D68F7B', '#1B0907', '#fce3dc'],
    heroImage: '/images/gallery/dewy-skin-radiance.webp',
    prompt: 'Facials built on personal skin analysis, cellular hydration, tone and texture renewal.',
    tagline: 'Facials built on a skin analysis, not a generic menu, so each treatment answers what your skin needs today.',
    intro: [
      'Skin changes with season, stress and routine. A facial should respond to that, which is why every session begins with an analysis of tone, texture and hydration rather than a fixed sequence.',
      'Treatments are chosen for the skin in front of us: gentle for sensitive skin, deeper where congestion or dullness calls for it. You leave with a home-care plan that continues the work.'
    ],
    includes: [
      'Skin analysis and consultation',
      'Double cleanse and gentle exfoliation',
      'Targeted mask and serum treatment',
      'Massage and a home-care plan'
    ],
    duration: 'Typically 60 to 90 minutes. Confirmed at consultation.',
    gallery: [
      { file: 'face/gallery-1.jpg', caption: 'Cleansing in progress', src: '/images/gallery/dewy-skin-radiance.webp' },
      { file: 'face/gallery-2.jpg', caption: 'Serum application', src: '/images/gallery/cellular-facial-mask.webp' },
      { file: 'face/gallery-3.jpg', caption: 'Treated skin in soft light', src: '/images/experience/exp-skin.jpg' },
      { file: 'face/gallery-4.jpg', caption: 'Facial massage detail', src: '/images/about/massage-suite.jpg' },
      { file: 'face/gallery-5.jpg', caption: 'Finished look, close up', src: '/images/about/spa-lounge.jpg' }
    ]
  },
  {
    slug: 'waxing',
    name: 'Waxing Studio',
    shortName: 'Wax',
    category: 'Waxing',
    word: 'WAX',
    colors: ['#A45D4B', '#DBA493', '#1F0C06', '#fce3dc'],
    heroImage: '/images/services/skin-waxing.jpg',
    prompt: 'Botanic silk waxing and silky skin refinement with soothing herbal elixirs.',
    tagline: 'Smooth, comfortable hair removal in a calm, private setting, with technique chosen for your skin.',
    intro: [
      'Waxing works best when the technique matches the skin and the hair. We check both before we begin, then explain each step so you know what to expect.',
      'Sessions are private and unhurried. Breaks are offered when you need them, and the aftercare we give is specific to the area treated and how your skin responds.'
    ],
    includes: [
      'Skin check and comfort consultation',
      'Preparation of the area',
      'Wax application for selected areas',
      'Soothing product and aftercare guidance'
    ],
    duration: 'Varies by area. Typically 20 to 60 minutes. Confirmed at consultation.',
    gallery: [
      { file: 'waxing/gallery-1.jpg', caption: 'Prepared skin in a clean setting', src: '/images/services/skin-waxing.jpg' },
      { file: 'waxing/gallery-2.jpg', caption: 'Wax application detail', src: '/images/gallery/cellular-facial-mask.webp' },
      { file: 'waxing/gallery-3.jpg', caption: 'Soothing product application', src: '/images/experience/exp-skin.jpg' },
      { file: 'waxing/gallery-4.jpg', caption: 'Treatment room in calm light', src: '/images/about/massage-suite.jpg' },
      { file: 'waxing/gallery-5.jpg', caption: 'Aftercare essentials', src: '/images/about/spa-lounge.jpg' }
    ]
  },
  {
    slug: 'bridal',
    name: 'Regal Bridal',
    shortName: 'Bridal',
    category: 'Bridal',
    word: 'BRIDAL',
    colors: ['#7A162B', '#C99738', '#1A0409', '#ffebad'],
    heroImage: '/images/services/bridal-masterpiece.jpg',
    prompt: 'Regal haute bridal masterclass: 24k radiance, bridal styling, and heritage elegance.',
    tagline: 'A bridal look planned around your ceremonies, your photographs and the way you want to feel on the day.',
    intro: [
      'A bridal look has to survive long hours, changing light and close-up photographs. We plan for all three, starting well before the wedding.',
      'The process begins with a conversation about your ceremonies, your outfits and your style. A trial session follows so the look can be tested and refined before the day, not discovered on it.'
    ],
    includes: [
      'Discovery consultation',
      'Bridal hair and make-up trial',
      'Coordinated look for the wedding day',
      'Pre-wedding skin and hair preparation advice'
    ],
    duration: 'Trial typically 90 to 120 minutes. Wedding-day timings are agreed at the trial.',
    gallery: [
      { file: 'bridal/gallery-1.jpg', caption: 'Bridal hair detail', src: '/images/services/bridal-masterpiece.jpg' },
      { file: 'bridal/gallery-2.jpg', caption: 'Make-up trial in soft light', src: '/images/gallery/glamour-makeup-portrait.webp' },
      { file: 'bridal/gallery-3.jpg', caption: 'Veil and hairstyle', src: '/images/experience/exp-bridal.jpg' },
      { file: 'bridal/gallery-4.jpg', caption: 'Bridal portrait in natural light', src: '/images/sections/bg-1.webp' },
      { file: 'bridal/gallery-5.jpg', caption: 'Jewellery and finishing detail', src: '/images/sections/atelier-creed.jpg' }
    ]
  },
  {
    slug: 'spa',
    name: 'Spa Sanctuary',
    shortName: 'Spa',
    category: 'Spa & Wellness',
    word: 'SPA',
    colors: ['#285B42', '#86B38E', '#08170F', '#d9efe0'],
    heroImage: '/images/services/spa-wellness.jpg',
    prompt: 'Restorative aromatherapy, deep tissue tension relief, hot stone therapy and botanical scrubs.',
    tagline: 'Slow, restorative rituals that ease tension and leave you genuinely rested, not just relaxed.',
    intro: [
      'Rest is a skill, and most of us have lost the habit. Our spa sessions are designed to slow the pace down deliberately, from the first question about your preferences to the quiet few minutes before you leave.',
      'Massage pressure, oils and the length of each stage are adjusted as you go. Your therapist checks in throughout, so the session stays at a level that feels right for you.'
    ],
    includes: [
      'Wellness consultation',
      'Full-body massage or ritual treatment',
      'Scalp or body exfoliation, where chosen',
      'Quiet time to settle before you leave'
    ],
    duration: 'Typically 60 to 90 minutes. Confirmed at consultation.',
    gallery: [
      { file: 'spa/gallery-1.jpg', caption: 'Treatment room in low light', src: '/images/services/spa-wellness.jpg' },
      { file: 'spa/gallery-2.jpg', caption: 'Warm stones on a towel', src: '/images/about/massage-suite.jpg' },
      { file: 'spa/gallery-3.jpg', caption: 'Massage oil detail', src: '/images/about/spa-lounge.jpg' },
      { file: 'spa/gallery-4.jpg', caption: 'Relaxation corner', src: '/images/experience/exp-spa.jpg' },
      { file: 'spa/gallery-5.jpg', caption: 'Ritual setup', src: '/images/sections/bg-2.webp' }
    ]
  },
  {
    slug: 'tattoo',
    name: 'Tattoo Studio',
    shortName: 'Tattoo',
    category: 'Tattoo Studio',
    word: 'TATTOO',
    colors: ['#38383e', '#737380', '#070709', '#ececf0'],
    heroImage: '/images/services/custom-tattoo.jpg',
    prompt: 'Fine-line illustrative tattoos, sacred geometric mandalas and bespoke custom ink.',
    tagline: 'Considered tattoo work, developed from your design, placed for how it will age, and tattooed to a clean standard.',
    intro: [
      'A tattoo is permanent, so the planning matters more than the session. We work through the design, the size and the placement together, then test the stencil on your skin before any ink is applied.',
      'Every session follows hygiene and safety practice, and you leave with written healing guidance and a follow-up plan. Larger pieces are planned across several sessions, each with its own approval.'
    ],
    includes: [
      'Consultation and design discussion',
      'Stencil placement and approval',
      'Single or multi-session tattooing',
      'Written healing guidance'
    ],
    duration: 'Varies by design. Consultation and stencil approval are usually separate from the tattoo session.',
    gallery: [
      { file: 'tattoo/gallery-1.jpg', caption: 'Stencil placement detail', src: '/images/services/custom-tattoo.jpg' },
      { file: 'tattoo/gallery-2.jpg', caption: 'Linework close-up', src: '/images/gallery/luxury-marble-manicure.webp' },
      { file: 'tattoo/gallery-3.jpg', caption: 'Studio workstation', src: '/images/about/massage-suite.jpg' },
      { file: 'tattoo/gallery-4.jpg', caption: 'Finished piece, healed', src: '/images/sections/atelier-creed.jpg' },
      { file: 'tattoo/gallery-5.jpg', caption: 'Design sketch', src: '/images/experience/exp-hair.jpg' }
    ]
  }
];

function esc(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TextBlock {
  tag: string;
  cls?: string;
  text: string;
  group?: undefined;
  items?: undefined;
}

interface GroupBlock {
  group: true;
  items: { text: string; file: string; src?: string }[];
  tag?: undefined;
  cls?: undefined;
  text?: undefined;
}

type StageBlock = TextBlock | GroupBlock;

interface ReelItem {
  video?: boolean;
  file: string;
  caption: string;
  src?: string;
}

export default function ServicesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const bgsRef = useRef<(HTMLDivElement | null)[]>([]);
  const railDotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const cvRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const activeIdxRef = useRef(0);
  activeIdxRef.current = activeIdx;
  const zIndexRef = useRef(1);
  const promptIntervalRef = useRef<any>(null);

  const stageInstanceRef = useRef<{
    show: (idx: number) => void;
    replay: () => void;
    destroy: () => void;
  } | null>(null);

  const typePrompt = useCallback((text: string) => {
    if (promptIntervalRef.current) {
      clearInterval(promptIntervalRef.current);
    }
    if (!typedRef.current) return;
    typedRef.current.textContent = '';
    let p = 0;
    promptIntervalRef.current = setInterval(() => {
      p++;
      if (typedRef.current) {
        typedRef.current.textContent = text.slice(0, p);
      }
      if (p >= text.length) {
        clearInterval(promptIntervalRef.current);
      }
    }, 18);
  }, []);

  const selectService = useCallback(
    (nextIdx: number, userInitiated = true) => {
      const idx = clamp(nextIdx, 0, SHOWCASE_SERVICES.length - 1);
      const prevIdx = activeIdxRef.current;
      setActiveIdx(idx);

      // Animate background layers
      const nextBg = bgsRef.current[idx];
      if (nextBg && idx !== prevIdx) {
        zIndexRef.current += 1;
        gsap.fromTo(
          nextBg,
          {
            clipPath: idx > prevIdx ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
            zIndex: zIndexRef.current,
          },
          {
            clipPath: 'inset(0 0 0 0%)',
            duration: 0.85,
            ease: 'power3.inOut',
            overwrite: true,
          }
        );
      }

      // Update prompt typewriter
      typePrompt(SHOWCASE_SERVICES[idx].prompt);

      // Tell right-side stage to switch
      if (stageInstanceRef.current) {
        stageInstanceRef.current.show(idx);
      }
    },
    [typePrompt]
  );

  // Mount the right stage inside cv
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const stage: HTMLElement = stageEl;

    stageEl.innerHTML = `
      <div class="svc-stage__inner">
        <div class="svc-stage__top">
          <span class="svc-stage__kicker"></span>
          <div class="svc-stage__tools">
            <span class="svc-stage__hint">Auto-streaming</span>
            <button class="svc-stage__replay" type="button" aria-label="Replay current studio details">&#8635; Replay</button>
          </div>
        </div>
        <div class="svc-stage__stream" aria-live="polite"></div>
        <div class="svc-stage__reel" aria-label="Media preview"></div>
        <div class="svc-stage__cta">
          <div class="svc-stage__cta-row">
            <a href="/studio/hair" class="svc-stage__btn svc-stage__btn--pri" data-pri-cta>Explore Hair Studio &rarr;</a>
            <a href="#contact" class="svc-stage__btn svc-stage__btn--ghost" data-open="appt">Book Appointment</a>
          </div>
        </div>
      </div>
    `;

    const kicker = stageEl.querySelector<HTMLElement>('.svc-stage__kicker')!;
    const stream = stageEl.querySelector<HTMLElement>('.svc-stage__stream')!;
    const reel = stageEl.querySelector<HTMLElement>('.svc-stage__reel')!;
    const cta = stageEl.querySelector<HTMLElement>('.svc-stage__cta')!;
    const priCta = stageEl.querySelector<HTMLAnchorElement>('[data-pri-cta]')!;
    const replayBtn = stageEl.querySelector<HTMLButtonElement>('.svc-stage__replay')!;

    let runId = 0;
    let current = 0;
    let userControl = false;
    let goal = 0;
    let raf = 0;
    let started = false;

    function alive(id: number) {
      return id === runId;
    }

    function setGoal(v: number) {
      if (userControl) return;
      goal = Math.max(0, v);
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function panTo(top: number) {
      const maxTop = stage.scrollHeight - stage.clientHeight;
      const t = clamp(top, 0, Math.max(0, maxTop));
      stage.scrollTop = t;
    }

    function tick() {
      if (userControl) {
        raf = 0;
        return;
      }
      const max = stage.scrollHeight - stage.clientHeight;
      const target = clamp(goal, 0, Math.max(0, max));
      const d = target - stage.scrollTop;
      if (Math.abs(d) < 0.5) {
        panTo(target);
        raf = 0;
        return;
      }
      panTo(stage.scrollTop + d * 0.14);
      raf = requestAnimationFrame(tick);
    }

    function followEl(el: HTMLElement) {
      if (userControl) return;
      const c = el.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const want = stage.scrollTop + (c.bottom - st.top) - stage.clientHeight * 0.65;
      if (want > goal) {
        setGoal(want);
      }
    }

    function buildBlocks(s: ShowcaseService): StageBlock[] {
      return [
        { tag: 'h3', cls: 'svc-stage__title', text: s.name },
        { tag: 'p', cls: 'svc-stage__lead', text: s.tagline },
        ...s.intro.map((text): TextBlock => ({ tag: 'p', cls: 'svc-stage__p', text })),
        { tag: 'h4', cls: 'svc-stage__h4', text: 'WHAT IS INCLUDED' },
        {
          group: true,
          items: s.includes.map((text, k) => ({
            text,
            file: `${s.slug}/include-${k + 1}.jpg`,
            src: s.gallery[k]?.src || s.heroImage,
          })),
        },
        { tag: 'h4', cls: 'svc-stage__h4', text: 'DURATION & APPOINTMENT' },
        { tag: 'p', cls: 'svc-stage__note', text: s.duration },
      ];
    }

    let incVisuals: HTMLElement[] = [];
    let incItems: HTMLElement[] = [];
    let autoIdx: number | null = null;
    let hoverIdx: number | null = null;
    let doneIdx = -1;

    function renderInc() {
      const idx = hoverIdx !== null ? hoverIdx : autoIdx;
      incVisuals.forEach((v, k) => v.classList.toggle('on', k === idx));
      incItems.forEach((li, k) => li.classList.toggle('is-hot', k === idx));
    }

    function buildGroup(items: { text: string; file: string; src?: string }[]) {
      const wrap = document.createElement('div');
      wrap.className = 'svc-stage__inc svc-stage__reveal-block';

      const ul = document.createElement('ul');
      ul.className = 'svc-stage__inc-list';

      const vis = document.createElement('div');
      vis.className = 'svc-stage__inc-visual';
      vis.innerHTML = items
        .map(
          (it) => `
        <figure class="svc-stage__inc-img">
          <div class="svc-stage__media">
            ${
              it.src
                ? `<img src="${esc(it.src)}" alt="${esc(it.text)}" style="width:100%;height:100%;object-fit:cover;" />`
                : `<span class="svc-stage__ph-file">Placeholder · ${esc(it.file)}</span>`
            }
          </div>
          <figcaption class="svc-stage__caption">${esc(it.text)}</figcaption>
        </figure>
      `
        )
        .join('');

      const lis = items.map((it, k) => {
        const li = document.createElement('li');
        li.className = 'svc-stage__inc-item svc-stage__reveal-block';
        li.textContent = it.text;
        li.addEventListener('pointerenter', (e) => {
          if (e.pointerType === 'mouse' && k <= doneIdx) {
            hoverIdx = k;
            renderInc();
          }
        });
        li.addEventListener('pointerleave', () => {
          hoverIdx = null;
          renderInc();
        });
        ul.append(li);
        return li;
      });

      wrap.append(ul, vis);
      stream.append(wrap);
      incVisuals = [...vis.children] as HTMLElement[];
      incItems = lis;
      return lis;
    }

    function makeNode(b: TextBlock) {
      const node = document.createElement(b.tag);
      node.className = (b.cls ? b.cls + ' ' : '') + 'svc-stage__reveal-block';
      node.textContent = b.text;
      stream.append(node);
      return node;
    }

    function buildReel(s: ShowcaseService) {
      const items: ReelItem[] = [
        { video: true, file: `${s.slug}/reel.mp4`, caption: `${s.name} · video reel`, src: s.heroImage },
        ...s.gallery.map((g): ReelItem => ({ file: g.file, caption: g.caption, src: g.src })),
      ];

      reel.innerHTML = items
        .map((it) =>
          it.video
            ? `
          <figure class="svc-stage__tile svc-stage__tile--video">
            <div class="svc-stage__media">
              ${
                it.src
                  ? `<img src="${esc(it.src)}" alt="${esc(it.caption)}" style="width:100%;height:100%;object-fit:cover;" />`
                  : `<span class="svc-stage__ph-file">Video · ${esc(it.file)}</span>`
              }
            </div>
            <div class="svc-stage__play" aria-hidden="true">&#9654;</div>
            <div class="svc-stage__bar" aria-hidden="true"><i></i></div>
            <figcaption class="svc-stage__caption">${esc(it.caption)}</figcaption>
          </figure>
        `
            : `
          <figure class="svc-stage__tile">
            <div class="svc-stage__media">
              ${
                it.src
                  ? `<img src="${esc(it.src)}" alt="${esc(it.caption)}" style="width:100%;height:100%;object-fit:cover;" />`
                  : `<span class="svc-stage__ph-file">Placeholder · ${esc(it.file)}</span>`
              }
            </div>
            <figcaption class="svc-stage__caption">${esc(it.caption)}</figcaption>
          </figure>
        `
        )
        .join('');
    }

    function getOffsetInStage(el: HTMLElement) {
      return el.getBoundingClientRect().top - stage.getBoundingClientRect().top + stage.scrollTop;
    }

    async function reveal(id: number) {
      const tiles = [...reel.children] as HTMLElement[];
      const reelTop = getOffsetInStage(reel);
      setGoal(Math.max(0, reelTop - 24));
      await wait(240);
      if (!alive(id)) return;

      for (const t of tiles) {
        t.classList.add('on');
        await wait(160);
        if (!alive(id)) return;
      }

      await wait(200);
      if (!alive(id)) return;

      cta.classList.add('on');
      const ctaTop = getOffsetInStage(cta);
      setGoal(Math.max(0, ctaTop + cta.offsetHeight - stage.clientHeight + 48));
    }

    async function run(i: number) {
      const id = ++runId;
      current = i;
      userControl = false;
      const s = SHOWCASE_SERVICES[i];
      if (!s) return;

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      stream.innerHTML = '';
      reel.innerHTML = '';
      cta.classList.remove('on');
      panTo(0);
      goal = 0;
      incVisuals = [];
      incItems = [];
      autoIdx = null;
      hoverIdx = null;
      doneIdx = -1;

      kicker.textContent = `${pad(i + 1)} / ${pad(SHOWCASE_SERVICES.length)} · ${s.category.toUpperCase()}`;
      priCta.textContent = `Explore ${s.name} Studio \u2192`;
      priCta.href = `/studio/${s.slug}`;

      buildReel(s);

      const blocks = buildBlocks(s);

      if (reduce) {
        for (const b of blocks) {
          if (b.group) {
            const lis = buildGroup(b.items);
            lis.forEach((li, k) => {
              li.textContent = b.items[k].text;
              li.classList.add('is-revealed');
            });
            stream.querySelector('.svc-stage__inc')?.classList.add('is-revealed');
            doneIdx = b.items.length - 1;
            autoIdx = doneIdx;
            renderInc();
          } else {
            const node = makeNode(b);
            node.classList.add('is-revealed');
          }
        }
        reel.querySelectorAll<HTMLElement>('.svc-stage__tile').forEach((t) => t.classList.add('on'));
        cta.classList.add('on');
        return;
      }

      // Perfect staggered text & content reveal animation (no typewriter typing)
      for (const b of blocks) {
        if (b.group) {
          const lis = buildGroup(b.items);
          const wrap = stream.querySelector('.svc-stage__inc') as HTMLElement;
          if (wrap) {
            wrap.classList.add('is-revealed');
            followEl(wrap);
            await wait(180);
            if (!alive(id)) return;
          }

          for (let k = 0; k < b.items.length; k++) {
            autoIdx = k;
            doneIdx = k;
            renderInc();
            lis[k]?.classList.add('is-revealed');
            followEl(lis[k]);
            await wait(360);
            if (!alive(id)) return;
          }
          continue;
        }

        const node = makeNode(b);
        await wait(60);
        if (!alive(id)) return;
        node.classList.add('is-revealed');
        followEl(node);
        await wait(160);
        if (!alive(id)) return;
      }

      // Hold so the user can hover and explore the included features
      await wait(1800);
      if (!alive(id)) return;

      await reveal(id);
    }

    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userControl = false;
      run(current);
    });

    const onWheel = () => {
      userControl = true;
    };
    stageEl.addEventListener('wheel', onWheel, { passive: true });
    stageEl.addEventListener('touchstart', onWheel, { passive: true });

    // Drag inside stage to scroll vertically
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.target && (e.target as HTMLElement).closest('button, a')) return;
      isDragging = true;
      startY = e.clientY;
      startScrollTop = stageEl.scrollTop;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 4) {
        userControl = true;
        panTo(startScrollTop - dy);
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    stageEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Tile hover 3D tilt
    const onTileTilt = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('.svc-stage__tile');
      if (!t) return;
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      t.style.setProperty('--svc-stage-rx', `${-py * 12}deg`);
      t.style.setProperty('--svc-stage-ry', `${px * 12}deg`);
    };

    const onTileLeave = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('.svc-stage__tile');
      if (t) {
        t.style.setProperty('--svc-stage-rx', '0deg');
        t.style.setProperty('--svc-stage-ry', '0deg');
      }
    };

    reel.addEventListener('pointermove', onTileTilt);
    reel.addEventListener('pointerout', onTileLeave);

    // Trigger start on intersection
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          io.disconnect();
          run(activeIdxRef.current);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(stageEl);

    kicker.textContent = `01 / ${pad(SHOWCASE_SERVICES.length)} · ${SHOWCASE_SERVICES[0].category.toUpperCase()}`;

    stageInstanceRef.current = {
      show(idx: number) {
        started = true;
        userControl = false;
        current = clamp(idx, 0, SHOWCASE_SERVICES.length - 1);
        run(current);
      },
      replay() {
        userControl = false;
        run(current);
      },
      destroy() {
        io.disconnect();
        stageEl.removeEventListener('wheel', onWheel);
        stageEl.removeEventListener('touchstart', onWheel);
        stageEl.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        reel.removeEventListener('pointermove', onTileTilt);
        reel.removeEventListener('pointerout', onTileLeave);
      },
    };

    return () => {
      stageInstanceRef.current?.destroy();
    };
  }, []);

  // GSAP ScrollTrigger setup for smooth desktop pinning
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const pinEl = pinRef.current;
    if (!sectionEl || !pinEl) return;

    const N = SHOWCASE_SERVICES.length;
    const isReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const existingSt = ScrollTrigger.getById('services-showcase');
    if (existingSt) {
      existingSt.kill(true);
    }

    const st = ScrollTrigger.create({
      id: 'services-showcase',
      trigger: sectionEl,
      pin: pinEl,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * N * 0.75)}`,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIdx = clamp(Math.floor(self.progress * N), 0, N - 1);
        if (nextIdx !== activeIdxRef.current) {
          selectService(nextIdx, false);
        }
      },
    });

    return () => {
      st.kill(true);
    };
  }, [selectService]);

  const activeService = SHOWCASE_SERVICES[activeIdx];

  return (
    <section id="services" ref={sectionRef} className="services-showcase-section" aria-label="Our Studios">
      <div ref={pinRef} className="services-showcase-root">
        {/* Top Section Brand Heading */}
        <div className="services-section-heading">
          <div className="services-eyebrow">
            <span className="gold-dash" />
            <span className="eyebrow-text">LUXURY ATELIER</span>
          </div>
          <h2 className="services-main-title">
            EXPERIENCE <span className="gold-highlight">SPARK</span>
          </h2>
        </div>

        {/* 8 Stacked Campaign Background Layers with Studio Imagery */}
        <div id="bgs">
          {SHOWCASE_SERVICES.map((s, i) => (
            <div
              key={s.slug}
              ref={(el) => {
                bgsRef.current[i] = el;
              }}
              className={`bg-layer ${i === activeIdx ? 'is-active' : ''}`}
              style={
                {
                  '--a': s.colors[0],
                  '--b': s.colors[1],
                  '--c': s.colors[2],
                  '--w': s.colors[3],
                  backgroundImage: `url(${s.heroImage})`,
                  clipPath: i === activeIdx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)',
                  zIndex: i === activeIdx ? 1 : 0,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Left Navigation Dot Rail */}
        <div className="rail" id="rail" aria-label="Studio navigation">
          {SHOWCASE_SERVICES.map((s, i) => (
            <button
              key={s.slug}
              ref={(el) => {
                railDotsRef.current[i] = el;
              }}
              type="button"
              className={i === activeIdx ? 'on' : ''}
              aria-label={`Studio ${i + 1}: ${s.name}`}
              onClick={() => selectService(i)}
            />
          ))}
        </div>

        {/* Floating Dark Prompt Panel */}
        <div className="pp">
          <div className="tabs" role="tablist" id="tabs" aria-label="Choose a studio">
            {SHOWCASE_SERVICES.map((s, j) => (
              <button
                key={s.slug}
                ref={(el) => {
                  tabsRef.current[j] = el;
                }}
                className={j === activeIdx ? 'tab on' : 'tab'}
                role="tab"
                type="button"
                aria-selected={j === activeIdx}
                onClick={() => selectService(j)}
              >
                {s.shortName}
              </button>
            ))}
            <span className="status-dot" aria-hidden="true" />
          </div>
          <div className="row">
            <span className="ico" />
            <div className="txt" aria-live="polite">
              <span ref={typedRef} id="typed">
                {activeService.prompt}
              </span>
              <span className="caret" />
            </div>
            <button
              className="send"
              id="send"
              type="button"
              aria-label="Next studio"
              onClick={() => selectService((activeIdx + 1) % SHOWCASE_SERVICES.length)}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right-Side Container (.cv) Housing the New Model */}
        <div className="cv" id="cv" ref={cvRef} data-lenis-prevent>
          <div ref={stageRef} className="svc-stage" data-svc-stage data-lenis-prevent />
        </div>
      </div>
    </section>
  );
}
