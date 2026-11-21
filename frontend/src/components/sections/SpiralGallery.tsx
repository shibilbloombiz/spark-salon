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
  '/works/1.webp',
  '/works/2.webp',
  '/works/3.webp',
  '/works/4.webp',
  '/works/5.webp',
  '/works/6.webp',
  '/works/7.webp',
  '/works/8.webp',
  '/works/9.webp',
  '/works/10.webp',
];

interface CachedGeometry {
  depth: number;
  horizon: number;
  slot: number;
  fill: number;
  cardHeight: number;
  rise: number;
  zone: number;
  smear: number;
  growth: number;
  reach: number;
  from: number;
  to: number;
  edge: number;
  size: number;
}

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
  let isReady = false;

  let dragging: { id: number; x: number; y: number; target: number; captured: boolean; both: boolean } | null = null;
  let dragMomentum = 0;
  let dragVelocity = 0;
  let lastMoveTime = 0;
  let lastMoveX = 0;
  let lastMoveY = 0;
  let holdUntil = 0;

  let destroyed = false;
  let visible = true;
  let active = -1;

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
      onScrollDelta() {},
      nudge() {},
      destroy() {
        listeners.forEach((remove) => remove());
      },
    };
  }

  // Precomputed geometry cached to eliminate layout/trig recalculations on every frame
  let geom: CachedGeometry = {
    depth: 8,
    horizon: 1.445,
    slot: 0.794,
    fill: 0.989,
    cardHeight: 0.748,
    rise: 0.238,
    zone: 0.209,
    smear: 0.15,
    growth: 0,
    reach: 1.82,
    from: -6.2,
    to: 9.09,
    edge: 300,
    size: 512,
  };

  const part = (t: number) =>
    t <= 0
      ? Math.pow(geom.zone + t, 3) / (3 * geom.zone * geom.zone)
      : (2 * geom.zone) / 3 - Math.pow(geom.zone - t, 3) / (3 * geom.zone * geom.zone);

  const family = (A: number, offset: number) => {
    const n = Math.floor((A - offset + geom.zone) / TAU);
    const t = A - offset - n * TAU;
    return n * ((2 * geom.zone) / 3) + (t >= geom.zone ? (2 * geom.zone) / 3 : part(t));
  };

  const warp = (A: number) => A - geom.smear * (family(A, 0) + family(A, 2 * geom.horizon));

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

    const depth = config.depth;
    const horizon = Math.acos(1 / depth);
    const slot = (config.cardArc + config.gap) * RAD;
    const arc = config.cardArc * RAD;
    const cardHeight = arc / config.aspect;
    const turn = cardHeight * config.turnSpacing;
    const rise = turn / TAU;
    const fill = arc / slot;

    const oldStride = stride;
    const isMobileWidth = width < 768;
    const half = isMobileWidth
      ? Math.min(width * 0.74, height * 0.44) * (config.size / 100)
      : Math.min(width * 0.300001, height * 0.500001) * (config.size / 100);
    focal = half * Math.sqrt(depth * depth - 1);
    stride = (focal * slot) / (depth - 1);

    const growth = config.flare * 0.6;
    const reach = ((height / 2 + (focal * cardHeight * (1 + growth)) / (depth - 1)) * (depth + 1)) / focal;
    const from = horizon - reach / rise;
    const to = horizon + reach / rise;

    const zone = Math.min(config.edgeZone * RAD, horizon * 0.899999, (Math.PI - horizon) * 0.900001);
    const smear = Math.min(0.899999, config.smear);
    const edge = (focal * Math.sin(horizon)) / (depth - Math.cos(horizon));

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = Math.min(2048, Math.ceil(((focal * cardHeight) / (depth - 1)) * (1 + growth) * dpr));

    geom = {
      depth,
      horizon,
      slot,
      fill,
      cardHeight,
      rise,
      zone,
      smear,
      growth,
      reach,
      from,
      to,
      edge,
      size,
    };

    if (oldStride > 0 && Math.abs(oldStride - stride) > 0.001) {
      const ratio = stride / oldStride;
      position *= ratio;
      target *= ratio;
    }

    wake();
  }

  function setImages() {
    if (JSON.stringify(sources) === JSON.stringify(config.images)) return;
    for (const image of images) {
      image.onload = null;
      image.onerror = null;
    }
    sources = [...config.images];
    isReady = false;
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

    // 1. Kinetic drag momentum decay
    if (!dragging && Math.abs(dragMomentum) > 0.002) {
      target -= dragMomentum * dt * 50;
      dragMomentum *= Math.pow(0.92, dt * 60);
      if (Math.abs(dragMomentum) <= 0.002) dragMomentum = 0;
    }

    // 2. Idle auto-rotation: smooth constant rotation when idle and in viewport
    const isInteracting = dragging || Math.abs(dragMomentum) > 0.002 || now < holdUntil;
    if (!motion.matches && !isInteracting && config.autoplay > 0) {
      target += config.autoplay * dt;
    }

    // 3. Smooth exponential interpolation to target
    const old = position;
    const lerpFactor = motion.matches ? 1 : 1 - Math.exp(-config.smoothing * dt);
    position += (target - position) * lerpFactor;

    // 4. Wave amplitude (only calculated if config.wave is active)
    if (config.wave > 0 && !motion.matches) {
      const velocity = (position - old) / Math.max(dt, 0.001);
      const amplitude = Math.max(-1, Math.min(1, velocity / 1800)) * height * 0.0499999 * config.wave;
      wave += (amplitude - wave) * (1 - Math.exp(-10 * dt));
    } else {
      wave = 0;
    }

    // 5. Seamless loop wrap: when position travels far, subtract whole cycles without any visual jump
    const loop = images.length * stride;
    if (loop > 0 && Math.abs(position) > loop * 20) {
      const cycles = Math.trunc(position / loop) * loop;
      position -= cycles;
      target -= cycles;
    }

    // 6. Canvas 2D render pass
    ctx.clearRect(0, 0, width, height);

    const { depth, horizon, slot, fill, cardHeight, rise, zone, growth, from, to, edge, size } = geom;
    const cx = width / 2;
    const cy = height / 2;

    const shift = position / stride + fill / 2 - warp(horizon) / slot;
    const project = (theta: number) => (focal * Math.sin(theta)) / (depth - Math.cos(theta));
    const near = (theta: number) =>
      Math.pow(Math.max(0, (zone - Math.abs(Math.abs(theta) - horizon)) / zone), 2);

    const ready = (image?: HTMLImageElement) => Boolean(image && image.complete && image.naturalWidth > 0);

    const rims: { index: number; right: boolean; front: boolean; points: number[] }[] = [];
    let rim: { index: number; right: boolean; front: boolean; points: number[] } | null = null;
    let painted = false;
    const maxStep = 0.799999 * RAD;
    const cutoff = 0.750001;
    const fadeOut = 6;

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
          const centre = (index + fill / 2 - shift) * slot + angle - warp(angle);
          const level = centre + config.tilt * (angle - centre);
          let h = ((focal * cardHeight) / d) * (1 + k * growth);
          let y = cy - (focal * rise * (horizon - level)) / d;
          if (wave !== 0) {
            const phase = (x / width) * TAU * config.frequency + (position / width) * 1.50001;
            h *= 1 + (Math.cos(phase) * Math.abs(wave)) / height * 0.150001;
            y += Math.sin(phase) * wave;
          }
          return { x, y, h };
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

    if (!isReady && painted) {
      isReady = true;
      root.setAttribute('data-ready', '');
    }

    if (Math.abs(target - position) < 0.499999 && !dragging) announce();

    if (
      dragging ||
      Math.abs(dragMomentum) > 0.002 ||
      Math.abs(target - position) > 0.05 ||
      Math.abs(wave) > 0.0499999 ||
      (!motion.matches && config.autoplay > 0)
    ) {
      wake();
    }
  }

  function step(direction: number) {
    target = (Math.round(target / stride) + direction) * stride;
    holdUntil = performance.now() + 1500;
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
      holdUntil = performance.now() + 1500;
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
    lastMoveX = event.clientX;
    lastMoveY = event.clientY;
    lastMoveTime = now;

    const instVelocity = stepDx / dt;
    dragVelocity = dragVelocity * 0.4 + instVelocity * 0.6;

    holdUntil = now + 1500;
    // Responsive, linear 1:1 drag
    target -= stepDx * config.sensitivity;
    wake();
  });

  function release(e: Event) {
    const event = e as PointerEvent;
    if (dragging && event.pointerId === dragging.id) {
      const now = performance.now();
      const timeSinceMove = now - lastMoveTime;

      // Transfer velocity into silky momentum
      if (timeSinceMove < 120 && Math.abs(dragVelocity) > 0.08) {
        const v = Math.max(-3.5, Math.min(3.5, dragVelocity));
        dragMomentum = v * 24 * config.sensitivity;
      } else {
        dragMomentum = 0;
      }

      holdUntil = now + 1500;
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
      if (event.key === 'Home') {
        target = 0;
        holdUntil = performance.now() + 1500;
        wake();
      } else if (event.key === 'End') {
        target = (images.length - 1) * stride;
        holdUntil = performance.now() + 1500;
        wake();
      } else {
        step(event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1);
      }
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
    onScrollDelta(deltaPhotos: number) {
      if (dragging) return;
      target += deltaPhotos * stride;
      holdUntil = performance.now() + 1000;
      wake();
    },
    nudge(photos: number) {
      target += photos * stride;
      holdUntil = performance.now() + 1500;
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

    const getGalleryConfig = (mobile: boolean): SpiralConfig => ({
      viewportWidth: 1920,
      viewportHeight: 1080,
      cardArc: mobile ? 44 : 45,
      aspect: 1.05001,
      gap: 0.500001,
      size: mobile ? 122 : 132,
      // Desktop uses 2. On mobile, keep turnSpacing compact (1.25) so the spiral does
      // NOT climb vertically into a tall "long spiral model", but stays centered like on Windows screen!
      turnSpacing: mobile ? 1.25 : 2,
      depth: 8,
      tilt: mobile ? 0.16 : 0.200001,
      backFade: 0.149999,
      wave: 0,
      frequency: 0.9,
      smoothing: 6,
      sensitivity: mobile ? 0.75 : 0.6,
      autoplay: mobile ? 24 : 32,
      flare: 0,
      edgeZone: 12,
      smear: 0.149999,
      fringe: 0,
      wheel: 'off',
      draggable: true,
      images: WORKS_IMAGES,
    });

    const engine = createSpiralFlux(root, getGalleryConfig(isMobile));

    const SCROLL_PHOTOS = 8;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let trackHeight = track.offsetHeight;
    let windowH = window.innerHeight;

    const updateMeasurements = () => {
      trackHeight = track.offsetHeight;
      windowH = window.innerHeight;
    };

    let lastP: number | null = null;
    let scrollScheduled = false;

    const updateScrollAndReveal = () => {
      scrollScheduled = false;
      const rect = track.getBoundingClientRect();
      const H = windowH || window.innerHeight;
      const total = (trackHeight || track.offsetHeight) - H;

      // Reveal / hero-entry scale & clip animation
      const scrub = reducedMotion.matches
        ? 1
        : Math.min(1, Math.max(0, 1 - rect.top / H));

      if (scrub >= 0.999) {
        if (stage.style.clipPath !== 'none') stage.style.clipPath = 'none';
        if (stage.style.transform !== 'none') stage.style.transform = 'none';
        if (title.style.opacity !== '1') title.style.opacity = '1';
        if (title.style.transform !== 'none') title.style.transform = 'none';
      } else {
        const e = scrub * scrub * (3 - 2 * scrub);
        const i = 1 - e;
        stage.style.clipPath = `inset(${(i * 14).toFixed(2)}% ${(i * 5).toFixed(2)}% ${(i * 14).toFixed(2)}% ${(i * 5).toFixed(2)}% round ${(i * 32).toFixed(1)}px)`;
        stage.style.transform = `scale(${(0.9 + 0.1 * e).toFixed(4)})`;
        title.style.opacity = e.toFixed(3);
        title.style.transform = `translate3d(0, ${(i * 30).toFixed(2)}px, 0)`;
      }

      // Scroll progress through pinned track: 0 to 1
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      if (lastP === null) {
        lastP = p;
        return;
      }

      const dp = p - lastP;
      lastP = p;

      if (Math.abs(dp) > 0.0001 && !reducedMotion.matches) {
        const mob = window.innerWidth < 768;
        const photos = mob ? 4 : SCROLL_PHOTOS;
        engine.onScrollDelta(dp * photos);
      }
    };

    const onScroll = () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(updateScrollAndReveal);
      }
    };

    const onResize = () => {
      updateMeasurements();
      const mob = window.innerWidth < 768;
      engine.update(getGalleryConfig(mob));
      updateScrollAndReveal();
    };

    updateScrollAndReveal();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const win = window as any;
    let lenisUnsub: (() => void) | null = null;
    if (win.lenis && typeof win.lenis.on === 'function') {
      lenisUnsub = () => win.lenis.off('scroll', onScroll);
      win.lenis.on('scroll', onScroll);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (lenisUnsub) lenisUnsub();
      engine.destroy();
    };
  }, []);

  return (
    <section className="sf-track" id="gallery" aria-label="Latest works" ref={trackRef}>
      <div
        className="sf-export"
        role="region"
        aria-roledescription="carousel"
        aria-label="Latest works"
      >
        <div
          className="sf-frame"
          ref={stageRef}
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
