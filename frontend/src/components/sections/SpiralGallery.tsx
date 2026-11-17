'use client';

import React, { useEffect, useRef } from 'react';
import './SpiralGallery.css';

interface SpiralConfig {
  viewportWidth?: number;
  viewportHeight?: number;
  cardArc: number;
  aspect: number;
  gap: number;
  size: number;
  turnSpacing: number;
  depth: number;
  tilt: number;
  backFade: number;
  wave: number;
  frequency: number;
  smoothing: number;
  sensitivity: number;
  autoplay: number;
  flare: number;
  edgeZone: number;
  smear: number;
  fringe: number;
  wheel: 'off' | 'horizontal' | 'vertical';
  draggable: boolean;
  images: string[];
  background?: string;
  preview?: boolean;
}

const WORKS_IMAGES: string[] = [
  '/works/1.jpg',
  '/works/2.jpg',
  '/works/3.jpg',
  '/works/4.jpg',
  '/works/5.jpg',
  '/works/6.jpg',
  '/works/7.jpg',
  '/works/8.jpg',
  '/works/9.jpg',
  '/works/10.jpg',
];

function createSpiralFlux(root: HTMLElement, initial: SpiralConfig) {
  const canvas = root.querySelector<HTMLCanvasElement>('.sf-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const live = root.querySelector<HTMLElement>('.sf-live');
  const fallback = root.querySelector<HTMLElement>('.sf-fallback');

  let config = initial;
  let width = 1;
  let height = 1;
  let focal = 1;
  let stride = 1;
  let dpr = 1;

  let images: HTMLImageElement[] = [];
  let sources: string[] = [];
  let position = 0;
  let target = 0;
  let last = 0;
  let frame = 0;
  let wave = 0;
  let dragging: { id: number; x: number; y: number; target: number; captured: boolean; both: boolean } | null = null;
  let dragMomentum = 0;
  let dragVelocity = 0;
  let lastMoveTime = 0;
  let lastMoveX = 0;
  let lastMoveY = 0;
  let destroyed = false;
  let visible = true;
  let active = -1;
  let holdUntil = 0;

  const listeners: (() => void)[] = [];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const RAD = Math.PI / 180;
  const mod = (n: number, d: number) => ((n % d) + d) % d;

  const listen = (
    el: EventTarget | null,
    type: string,
    fn: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => {
    if (!el) return;
    el.addEventListener(type, fn, options);
    listeners.push(() => el.removeEventListener(type, fn, options));
  };

  const fallbackImages = (urls: string[]) => {
    if (!fallback) return;
    fallback.replaceChildren(
      ...urls.map((src, i) => {
        const image = document.createElement('img');
        image.src = src;
        image.alt = `Latest work ${i + 1}`;
        image.draggable = false;
        image.setAttribute('role', 'listitem');
        return image;
      })
    );
  };

  if (!canvas || !ctx) {
    const scrollFallback = (direction: number) =>
      fallback?.scrollBy({
        left: direction * root.clientWidth * 0.599999,
        behavior: motion.matches ? 'instant' : 'smooth',
      });
    listen(root, 'keydown', (e: Event) => {
      const event = e as KeyboardEvent;
      if (event.target === root && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        scrollFallback(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    return {
      update(next: SpiralConfig) {
        fallbackImages(next.images);
      },
      nudge() {},
      destroy() {
        listeners.forEach((remove) => remove());
      },
    };
  }

  const geometry = () => {
    const depth = config.depth;
    const horizon = Math.acos(1 / depth);
    const slot = (config.cardArc + config.gap) * RAD;
    const arc = config.cardArc * RAD;
    const cardHeight = arc / config.aspect;
    const turn = cardHeight * config.turnSpacing;
    return { depth, horizon, slot, fill: arc / slot, cardHeight, rise: turn / TAU };
  };

  const textures = new WeakMap<HTMLImageElement, HTMLCanvasElement>();
  const texture = (image: HTMLImageElement, th: number) => {
    const tw = Math.max(1, Math.round(th * config.aspect));
    const cached = textures.get(image);
    if (cached && cached.width === tw && cached.height === th) return cached;
    const copy = document.createElement('canvas');
    const copyCtx = copy.getContext('2d');
    if (!copyCtx) return null;
    copy.width = tw;
    copy.height = th;
    const scale = Math.max(tw / image.naturalWidth, th / image.naturalHeight);
    const sw = tw / scale;
    const sh = th / scale;
    copyCtx.drawImage(
      image,
      (image.naturalWidth - sw) / 2,
      (image.naturalHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      tw,
      th
    );
    textures.set(image, copy);
    return copy;
  };

  const running = () => visible && !document.hidden && !destroyed;

  function wake() {
    if (!frame && running()) {
      last = performance.now();
      frame = requestAnimationFrame(draw);
    }
  }

  function resize() {
    const rect = root.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const g = geometry();
    const oldStride = stride;

    const half = Math.min(width * (width < 600 ? 0.419999 : 0.300001), height * 0.500001) * config.size / 100;
    focal = half * Math.sqrt(g.depth * g.depth - 1);
    stride = focal * g.slot / (g.depth - 1);
    position *= stride / oldStride;
    target *= stride / oldStride;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wake();
  }

  function setImages() {
    if (JSON.stringify(sources) === JSON.stringify(config.images)) return;
    for (const image of images) {
      image.onload = null;
      image.onerror = null;
    }
    sources = [...config.images];
    root.removeAttribute('data-ready');
    fallbackImages(sources);
    images = sources.map((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = image.onerror = () => {
        if (!destroyed) wake();
      };
      image.src = src;
      return image;
    });
    position = mod(position / stride, images.length) * stride;
    target = position;
    active = -1;
  }

  function announce() {
    const next = mod(Math.round(position / stride), images.length);
    if (next !== active) {
      active = next;
      if (!config.preview && live) {
        live.textContent = `Latest work ${next + 1} of ${images.length}`;
      }
    }
  }

  function draw(now: number) {
    frame = 0;
    if (!running()) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Kinetic momentum decay after release from a drag
    if (!dragging && Math.abs(dragMomentum) > 0.005) {
      target -= dragMomentum * dt * 48;
      dragMomentum *= Math.pow(0.91, dt * 60);
      if (Math.abs(dragMomentum) <= 0.005) dragMomentum = 0;
    }

    if (!motion.matches && !dragging && Math.abs(dragMomentum) < 0.01 && now > holdUntil) {
      target += config.autoplay * dt;
    }
    const old = position;
    position += (target - position) * (motion.matches ? 1 : 1 - Math.exp(-config.smoothing * dt));
    const velocity = (position - old) / Math.max(dt, 0.001);
    const amplitude = motion.matches
      ? 0
      : Math.max(-1, Math.min(1, velocity / 1800)) * height * 0.0499999 * config.wave;
    wave += (amplitude - wave) * (1 - Math.exp(-10 * dt));
    if (motion.matches) wave = 0;

    const loop = images.length * stride;
    if (Math.abs(position) > loop * 50) {
      const cycles = Math.trunc(position / loop) * loop;
      position -= cycles;
      target -= cycles;
    }
    ctx.clearRect(0, 0, width, height);

    const { depth, horizon, slot, fill, cardHeight, rise } = geometry();
    const cx = width / 2;
    const cy = height / 2;

    const zone = Math.min(config.edgeZone * RAD, horizon * 0.899999, (Math.PI - horizon) * 0.900001);
    const smear = Math.min(0.899999, config.smear);
    const growth = config.flare * 0.6;

    const part = (t: number) =>
      t <= 0
        ? Math.pow(zone + t, 3) / (3 * zone * zone)
        : 2 * zone / 3 - Math.pow(zone - t, 3) / (3 * zone * zone);

    const family = (A: number, offset: number) => {
      const n = Math.floor((A - offset + zone) / TAU);
      const t = A - offset - n * TAU;
      return n * 2 * zone / 3 + (t >= zone ? 2 * zone / 3 : part(t));
    };

    const warp = (A: number) => A - smear * (family(A, 0) + family(A, 2 * horizon));
    const shift = position / stride + fill / 2 - warp(horizon) / slot;
    const project = (theta: number) => (focal * Math.sin(theta)) / (depth - Math.cos(theta));
    const near = (theta: number) =>
      Math.pow(Math.max(0, (zone - Math.abs(Math.abs(theta) - horizon)) / zone), 2);

    const reach = ((height / 2 + (focal * cardHeight * (1 + growth)) / (depth - 1)) * (depth + 1)) / focal;
    const from = horizon - reach / rise;
    const to = horizon + reach / rise;
    const ready = (image?: HTMLImageElement) => Boolean(image && image.complete && image.naturalWidth > 0);

    const rims: { index: number; right: boolean; front: boolean; points: number[] }[] = [];
    let rim: { index: number; right: boolean; front: boolean; points: number[] } | null = null;
    let painted = false;
    const maxStep = 0.799999 * RAD;
    const edge = project(horizon);
    const cutoff = 0.750001;
    const fadeOut = 6;
    const size = Math.min(2048, Math.ceil(((focal * cardHeight) / (depth - 1)) * (1 + growth) * dpr));

    const pass = (front: boolean) => {
      let A = from;
      while (A < to) {
        const theta = mod(A - horizon + Math.PI, TAU) - Math.PI;
        const side = Math.abs(theta) < horizon;
        const k = near(theta);
        const speed = Math.abs((focal * (depth * Math.cos(theta) - 1)) / Math.pow(depth - Math.cos(theta), 2));
        const step = Math.min(maxStep, (k > 0 ? 2 : 4) / Math.max(speed, 1));
        const B = A + step;
        if (side !== front) {
          rim = null;
          A += (front ? TAU - horizon - mod(theta, TAU) : horizon - theta) + 1e-6;
          continue;
        }
        const u0 = warp(A) / slot + shift;
        const u1 = warp(B) / slot + shift;

        const at = (f: number, index: number) => {
          const angle = A + f * step;
          const t = theta + f * step;
          const d = depth - Math.cos(t);
          const x = cx + project(t);
          const phase = (x / width) * TAU * config.frequency + (position / width) * 1.50001;
          const h = ((focal * cardHeight) / d) * (1 + k * growth) * (1 + (Math.cos(phase) * Math.abs(wave)) / height * 0.150001);
          const centre = (index + fill / 2 - shift) * slot + angle - warp(angle);
          const level = centre + config.tilt * (angle - centre);
          return { x, y: cy - (focal * rise * (horizon - level)) / d + Math.sin(phase) * wave, h };
        };

        for (let index = Math.floor(u0); index <= Math.floor(u1); index++) {
          const ua = Math.max(u0, index);
          const ub = Math.min(u1, index + fill);
          if (ub <= ua) continue;
          const image = images[mod(index, images.length)];
          const source = ready(image) ? texture(image, size) : null;
          if (!source) {
            rim = null;
            continue;
          }
          const fa = (ua - u0) / (u1 - u0);
          const fb = (ub - u0) / (u1 - u0);
          const [p, q] = front ? [at(fa, index), at(fb, index)] : [at(fb, index), at(fa, index)];
          const ta = (ua - index) / fill;
          const tb = (ub - index) / fill;
          const h = (p.h + q.h) / 2;

          if (Math.min(p.y, q.y) - h / 2 > height || Math.max(p.y, q.y) + h / 2 < 0) {
            rim = null;
            continue;
          }
          const dx = q.x - p.x;
          const wide = Math.max(dx, 0) + 1.49999;
          const dy = dx > 0.01 ? ((q.y - p.y) * wide) / dx : q.y - p.y;
          const alpha = Math.min(
            1,
            (edge - Math.max(Math.abs(p.x - cx), Math.abs(p.x + wide - cx)) - cutoff) / fadeOut
          );
          if (alpha <= 0) continue;
          ctx.globalAlpha = alpha;
          ctx.setTransform(dpr * wide, dpr * dy, 0, dpr * h, dpr * p.x, dpr * (p.y - h / 2));
          const sx = (front ? ta : 1 - tb) * source.width;
          const sw = (tb - ta) * source.width * (dx > 0.01 ? wide / dx : 1);
          ctx.drawImage(
            source,
            sx,
            0,
            Math.max(0.0100001, Math.min(sw, source.width - sx)),
            source.height,
            0,
            0,
            1,
            1
          );

          if (config.fringe > 0 && k > 0) {
            const right = theta > 0;
            if (!rim || rim.index !== index || rim.right !== right) {
              rims.push((rim = { index, right, front, points: [] }));
            }
            rim.points.push(p.x, p.y - p.h / 2, p.y + p.h / 2);
          } else {
            rim = null;
          }
          painted = true;
        }
        A = B;
      }
      rim = null;
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    pass(false);

    if (config.backFade > 0) {
      ctx.save();
      ctx.globalAlpha = config.backFade;
      if (config.background === 'transparent') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
      } else {
        ctx.fillStyle = config.background || '#ececec';
      }
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    pass(true);

    if (rims.length) {
      const ramp = (rgb: string, right: boolean, front: boolean) => {
        const inner = project(front ? horizon - zone : horizon + zone);
        const sign = right ? 1 : -1;
        const g2 = ctx.createLinearGradient(cx + sign * inner, 0, cx + sign * edge, 0);
        const span = Math.max(1, Math.abs(edge - inner));
        const peak = Math.max(0.399999, 1 - (cutoff + fadeOut) / span);
        g2.addColorStop(0, `rgba(${rgb},0)`);
        g2.addColorStop(peak * 0.35, `rgba(${rgb},${config.fringe * 0.5})`);
        g2.addColorStop(peak, `rgba(${rgb},${config.fringe})`);
        g2.addColorStop(1, `rgba(${rgb},0)`);
        return g2;
      };
      const line = (points: number[], offset: number, top: boolean) => {
        ctx.beginPath();
        for (let i = 0; i < points.length; i += 3) {
          ctx.lineTo(points[i], points[i + (top ? 1 : 2)] + (top ? -offset : offset));
        }
        ctx.stroke();
      };
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      for (const [rgb, thickness, offset] of [
        ['79,168,255', 3, 1.50001],
        ['255,179,71', 2, -1],
      ] as [string, number, number][]) {
        ctx.lineWidth = thickness;
        for (const { points, right, front } of rims) {
          if (points.length < 6) continue;
          ctx.globalAlpha = front ? 1 : 1 - config.backFade;
          ctx.strokeStyle = ramp(rgb, right, front);
          line(points, offset, true);
          line(points, offset, false);
        }
      }
      ctx.restore();
    }

    root.toggleAttribute('data-ready', painted);
    if (Math.abs(target - position) < 0.499999 && !dragging) announce();
    if (
      dragging ||
      Math.abs(dragMomentum) > 0.005 ||
      Math.abs(target - position) > 0.05 ||
      Math.abs(wave) > 0.0499999 ||
      (!motion.matches && config.autoplay > 0)
    ) {
      wake();
    }
  }

  function step(direction: number) {
    target = (Math.round(target / stride) + direction) * stride;
    wake();
  }

  listen(
    root,
    'wheel',
    (e: Event) => {
      const event = e as WheelEvent;
      if (config.preview || config.wheel === 'off') return;
      const delta =
        config.wheel === 'horizontal'
          ? event.deltaX
          : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
      target += Math.max(-width * 2, Math.min(width * 2, delta * unit * config.sensitivity));
      wake();
    },
    { passive: false }
  );

  listen(root, 'pointerdown', (e: Event) => {
    const event = e as PointerEvent;
    if (
      !config.draggable ||
      config.preview ||
      event.button !== 0 ||
      (event.target as HTMLElement)?.closest('button')
    )
      return;

    dragMomentum = 0;
    dragVelocity = 0;
    lastMoveTime = performance.now();
    lastMoveX = event.clientX;
    lastMoveY = event.clientY;

    dragging = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      target,
      captured: event.pointerType !== 'touch',
      both: event.pointerType !== 'touch',
    };
    if (dragging.captured) {
      root.setPointerCapture(event.pointerId);
      root.toggleAttribute('data-dragging', true);
    }
  });

  listen(root, 'pointermove', (e: Event) => {
    const event = e as PointerEvent;
    if (!dragging || event.pointerId !== dragging.id) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime);

    const dx = event.clientX - dragging.x;
    const dy = event.clientY - dragging.y;
    if (!dragging.captured) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        dragging = null;
        return;
      }
      if (Math.abs(dx) < 8) return;
      dragging.captured = true;
      root.setPointerCapture(event.pointerId);
      root.toggleAttribute('data-dragging', true);
    }

    const stepDx = event.clientX - lastMoveX;
    const stepDy = event.clientY - lastMoveY;
    lastMoveX = event.clientX;
    lastMoveY = event.clientY;
    lastMoveTime = now;

    // Displacement for this move step
    const stepDist = stepDx + (dragging.both ? stepDy : 0);

    // Instantaneous velocity (pixels per ms)
    const instVelocity = stepDist / dt;
    dragVelocity = dragVelocity * 0.45 + instVelocity * 0.55;

    // Dynamic speed scaling:
    // Slower drag -> slower movement (0.35x - 0.7x)
    // Faster drag -> faster movement (up to 3.6x)
    const absV = Math.abs(dragVelocity);
    let speedFactor = 1.0;
    if (absV < 0.35) {
      speedFactor = Math.max(0.35, 0.35 + (absV / 0.35) * 0.45);
    } else if (absV > 0.7) {
      speedFactor = Math.min(3.6, 1.0 + Math.pow((absV - 0.7) / 0.8, 1.3) * 1.5);
    }

    holdUntil = now + 1600;
    target -= stepDist * config.sensitivity * speedFactor;
    wake();
  });

  function release(e: Event) {
    const event = e as PointerEvent;
    if (dragging && event.pointerId === dragging.id) {
      const now = performance.now();
      const timeSinceMove = now - lastMoveTime;

      // Transfer velocity into momentum for kinetic release: faster drag -> longer glide
      if (timeSinceMove < 90 && Math.abs(dragVelocity) > 0.15) {
        const absV = Math.abs(dragVelocity);
        const momentumMultiplier = Math.min(3.2, 0.8 + absV * 0.75);
        dragMomentum = dragVelocity * 38 * config.sensitivity * momentumMultiplier;
      } else {
        dragMomentum = 0;
      }

      dragging = null;
      root.removeAttribute('data-dragging');
      if (root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
      wake();
    }
  }

  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    listen(root, type, release);
  }

  listen(root, 'keydown', (e: Event) => {
    const event = e as KeyboardEvent;
    if (event.target !== root || config.preview) return;
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = (images.length - 1) * stride;
      else step(event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1);
      wake();
    }
  });

  listen(motion, 'change', wake);
  listen(document, 'visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      wake();
    }
  });

  const observer = new ResizeObserver(resize);
  observer.observe(root);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) {
      wake();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(root);

  function update(next: SpiralConfig) {
    config = next;
    root.toggleAttribute('data-draggable', config.draggable && !config.preview);
    root.toggleAttribute('data-preview', config.preview);
    root.tabIndex = config.preview ? -1 : 0;
    if (!config.draggable && dragging) {
      const id = dragging.id;
      dragging = null;
      root.removeAttribute('data-dragging');
      if (root.hasPointerCapture(id)) root.releasePointerCapture(id);
    }
    setImages();
    resize();
    wake();
  }

  update(initial);

  return {
    update,
    nudge(photos: number) {
      holdUntil = performance.now() + 1400;
      target += photos * stride;
      if (dragging) dragging.target += photos * stride;
      wake();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      listeners.forEach((remove) => remove());
      if (dragging && root.hasPointerCapture(dragging.id)) {
        root.releasePointerCapture(dragging.id);
      }
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
      canvas.width = 1;
      canvas.height = 1;
    },
  };
}

export default function SpiralGallery() {
  const trackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const root = rootRef.current;
    const title = titleRef.current;
    if (!track || !stage || !root || !title) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const engine = createSpiralFlux(root, {
      viewportWidth: 1920,
      viewportHeight: 1080,
      cardArc: isMobile ? 40 : 45,
      aspect: 1.05001,
      gap: 0.500001,
      size: isMobile ? 90 : 132,
      turnSpacing: 2,
      depth: 8,
      tilt: 0.200001,
      backFade: 0.149999,
      wave: 0,
      frequency: 0.9,
      smoothing: 6,
      sensitivity: 0.6,
      autoplay: 30,
      flare: 0,
      edgeZone: 12,
      smear: 0.149999,
      fringe: 0,
      wheel: 'off',
      draggable: true,
      images: WORKS_IMAGES,
    });

    const PHOTOS_PER_SCROLL = 6;
    const progress = () => {
      const total = track.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -track.getBoundingClientRect().top / total));
    };

    let lastProgress = progress();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const INTRO_MS = 1400;
    const introStart = performance.now();

    const reveal = () => {
      const intro = reducedMotion.matches ? 1 : Math.min(1, (performance.now() - introStart) / INTRO_MS);
      const scrub = reducedMotion.matches
        ? 1
        : Math.min(1, Math.max(0, 1 - track.getBoundingClientRect().top / window.innerHeight));
      const t = Math.min(intro, scrub);
      const e = t * t * (3 - 2 * t);
      const i = 1 - e;

      stage.style.clipPath = `inset(${(i * 14).toFixed(2)}% ${(i * 5).toFixed(2)}% ${(i * 14).toFixed(2)}% ${(i * 5).toFixed(2)}% round ${(i * 32).toFixed(1)}px)`;
      stage.style.transform = `scale(${(0.9 + 0.1 * e).toFixed(4)})`;
      title.style.opacity = e.toFixed(3);
      title.style.transform = `translate3d(0, ${(i * 30).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      reveal();
      const p = progress();
      if (!reducedMotion.matches && p !== lastProgress) {
        engine.nudge((p - lastProgress) * PHOTOS_PER_SCROLL);
      }
      lastProgress = p;
    };

    const onResize = () => {
      lastProgress = progress();
      reveal();
    };

    let introFrame = 0;
    const introLoop = () => {
      reveal();
      if (performance.now() - introStart < INTRO_MS) {
        introFrame = requestAnimationFrame(introLoop);
      }
    };
    introLoop();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('smooth-scroll', onScroll as EventListener, { passive: true });
    window.addEventListener('resize', onResize);

    const win = window as any;
    let lenisUnsub: (() => void) | null = null;
    if (win.lenis && typeof win.lenis.on === 'function') {
      lenisUnsub = () => win.lenis.off('scroll', onScroll);
      win.lenis.on('scroll', onScroll);
    }

    return () => {
      if (introFrame) cancelAnimationFrame(introFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('smooth-scroll', onScroll as EventListener);
      window.removeEventListener('resize', onResize);
      if (lenisUnsub) lenisUnsub();
      engine.destroy();
    };
  }, []);

  return (
    <section className="sf-track" id="gallery" aria-label="Latest works" ref={trackRef}>
      <div
        className="sf-export"
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Latest works"
      >
        <div
          className="sf-frame"
          style={
            {
              '--sf-w': '1920px',
              '--sf-h': '1080px',
              '--sf-bg': '#ececec',
              '--sf-ink': '#161616',
              '--sf-aspect': '1.05',
            } as React.CSSProperties
          }
        >
          <div
            className="sf-root"
            ref={rootRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Latest works. Drag, scroll or use the arrow keys."
          >
            <canvas className="sf-canvas" aria-hidden="true" />
            <div className="sf-fallback" role="list">
              {WORKS_IMAGES.map((src, i) => (
                <img
                  key={i}
                  role="listitem"
                  src={src}
                  alt={`Latest work ${i + 1}`}
                  draggable={false}
                />
              ))}
            </div>
            <p className="sf-title" ref={titleRef} data-sf-title>
              Latest works
            </p>
            <span className="sf-live" aria-live="polite" aria-atomic="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
