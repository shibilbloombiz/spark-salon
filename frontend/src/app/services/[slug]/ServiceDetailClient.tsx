'use client';

import React, { useEffect, useRef } from 'react';
import type { ServiceDetailData, SiteData } from '@/lib/data/serviceDetailData';
import './service-detail.css';

interface ServiceDetailClientProps {
  service: ServiceDetailData;
  site: SiteData;
}

export default function ServiceDetailClient({ service, site }: ServiceDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set global data contracts
    (window as any).SERVICE = service;
    (window as any).SITE = site;

    const S = service;
    const SITE = site;
    const root = containerRef.current;
    if (!root) return;

    document.body.classList.add('svc-detail-active', 'curtain-on');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (sel: string, r: Element | Document = root) => r.querySelector(sel);
    const $$ = (sel: string, r: Element | Document = root) => [...r.querySelectorAll(sel)];
    const esc = (v: any) =>
      String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
    const pad = (n: number) => String(n).padStart(2, '0');
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    // Media renderer
    function media(m: { file?: string; alt?: string; src?: string | null } | null | undefined) {
      if (m && m.src) {
        return `<img src="${esc(m.src)}" alt="${esc(m.alt || '')}" loading="lazy">`;
      }
      return `<div class="ph"><span>Placeholder · ${esc(m?.file || '')}</span></div>`;
    }

    const splitWords = (text: string) =>
      text
        .split(/\s+/)
        .filter(Boolean)
        .map((w, i) => `<span class="w"><span class="wi" style="--i:${i}">${esc(w)}</span></span>`)
        .join(' ');

    // ---------- Hero ----------
    const heroTitle = $('[data-hero-title]') as HTMLElement | null;
    if (heroTitle) {
      heroTitle.style.fontSize = S.name.length > 8 ? 'clamp(48px, 9.5vw, 150px)' : 'clamp(72px, 16vw, 240px)';
      heroTitle.setAttribute('aria-label', S.name);
      heroTitle.innerHTML = splitWords(S.name);
    }
    const eyebrowEl = $('[data-hero-eyebrow]');
    if (eyebrowEl) eyebrowEl.textContent = S.category;
    const taglineEl = $('[data-hero-tagline]');
    if (taglineEl) taglineEl.textContent = S.tagline;
    const heroMediaEl = $('[data-hero-media]');
    if (heroMediaEl) heroMediaEl.innerHTML = `<div class="media">${media(S.media.hero)}</div>`;

    // ---------- Overview ----------
    const ovTitleEl = $('[data-ov-title]');
    if (ovTitleEl) ovTitleEl.textContent = `What ${S.name} involves`;
    const scrubEl = $('[data-scrub]');
    if (scrubEl) {
      scrubEl.innerHTML = S.intro
        .map((p) => `<p data-sp>${p.split(/\s+/).map((w) => `<span class="sw">${esc(w)}</span>`).join(' ')}</p>`)
        .join('');
    }
    const supportingEl = $('[data-supporting]');
    if (supportingEl) supportingEl.innerHTML = `<div class="media">${media(S.media.supporting)}</div>`;

    // ---------- Details ----------
    const cells = [
      { t: "What's included", list: S.includes },
      { t: 'Benefits', list: S.benefits },
      { t: 'Suitable for', list: S.suitableFor },
      { t: 'Before your visit', list: S.preparation },
      { t: 'After your visit', list: S.aftercare },
      { t: 'Duration', text: S.duration },
    ];
    const detailsEl = $('[data-details]');
    if (detailsEl) {
      detailsEl.innerHTML = cells
        .map(
          (c, i) => `
        <div class="dcell" data-reveal style="--i:${i % 3}">
          <h3>${esc(c.t)}</h3>
          ${
            c.list
              ? `<ul class="ticks">${c.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
              : `<p class="dtext">${esc(c.text)}</p>`
          }
        </div>`
        )
        .join('');
    }

    // ---------- Process ----------
    const stepsEl = $('[data-steps]');
    if (stepsEl) {
      stepsEl.innerHTML = S.process
        .map(
          (s, i) => `
        <article class="step" data-reveal>
          <span class="num">${pad(i + 1)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </article>`
        )
        .join('');
    }
    const prTitleEl = $('[data-pr-title]');
    if (prTitleEl) prTitleEl.textContent = 'How the visit works';

    // ---------- Gallery ----------
    const items = [
      { type: 'video', file: S.media.reel.file, src: S.media.reel.src, alt: `${S.name} reel`, caption: `${S.name} · reel` },
      ...S.media.gallery.map((g) => ({ type: 'image', file: g.file, src: g.src, alt: g.alt, caption: g.caption })),
    ];
    let filter = 'all';
    let viewList: any[] = [];
    let vIdx = 0;
    const visibleItems = () =>
      items.filter((it) => (filter === 'all' ? true : filter === 'video' ? it.type === 'video' : it.type === 'image'));

    const gGrid = $('[data-g-grid]') as HTMLElement;
    function renderGallery() {
      if (!gGrid) return;
      const vis = visibleItems();
      gGrid.innerHTML = items
        .map((it, i) => {
          const v = vis.indexOf(it);
          const off = v < 0;
          const size = off ? '' : v % 6 === 0 ? ' s-big' : ' s-std';
          const badge = it.type === 'video' ? '<span class="g-badge">Video</span>' : '<span class="g-badge">Photo</span>';
          const thumb = it.type === 'video' ? media({ file: it.file }) : media(it);
          return `<button type="button" class="g-item${size}${off ? ' is-off' : ''}" data-g="${i}" style="--i:${
            off ? 0 : v % 3
          }">
            <div class="media">${thumb}</div>${badge}${it.type === 'video' ? '<span class="g-play" aria-hidden="true">&#9654;</span>' : ''}
            <span class="g-cap">${esc(it.caption)}</span></button>`;
        })
        .join('');
      const countEl = $('[data-g-count]');
      if (countEl) countEl.textContent = `${pad(vis.length)} items`;
      observe($$('.g-item', gGrid));
    }

    const filterBtns = $$('[data-filter]', root);
    filterBtns.forEach((b) =>
      b.addEventListener('click', () => {
        filter = (b as HTMLElement).dataset.filter || 'all';
        filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        renderGallery();
      })
    );

    if (gGrid) {
      gGrid.addEventListener('click', (e) => {
        const b = (e.target as HTMLElement).closest('.g-item') as HTMLElement | null;
        if (b && b.dataset.g !== undefined) openViewer(Number(b.dataset.g));
      });
    }

    // ---------- Viewer ----------
    const viewer = $('[data-viewer]') as HTMLDialogElement | null;
    const vStage = $('[data-v-stage]') as HTMLElement | null;
    const vThumbs = $('[data-v-thumbs]') as HTMLElement | null;

    function videoHTML(it: any) {
      if (it.src) {
        return `<div class="univ-video-container" style="position:relative;width:100%;height:100%;background:#0c0c0c;">
          <video src="${esc(it.src)}" autoplay muted loop playsinline class="univ-video-element" style="width:100%;height:100%;object-fit:contain;display:block;"></video>
        </div>`;
      }
      return `<div class="vid" data-vid>
        <div class="media">${media({ file: `Video · ${it.file}` })}</div>
        <button class="vplay" type="button" data-vplay aria-label="Play">&#9654;</button>
        <div class="vbar" aria-hidden="true"><i></i></div></div>`;
    }

    function showViewer(k: number) {
      if (!vStage || !vThumbs) return;
      vIdx = (k + viewList.length) % viewList.length;
      const it = viewList[vIdx];
      vStage.innerHTML = it.type === 'video' ? videoHTML(it) : `<div class="media">${media(it)}</div>`;
      const cap = $('[data-v-caption]');
      if (cap) cap.textContent = it.caption;
      const count = $('[data-v-count]');
      if (count) count.textContent = `${pad(vIdx + 1)} / ${pad(viewList.length)}`;
      $$('.thumb', vThumbs).forEach((t, j) => t.setAttribute('aria-current', String(j === vIdx)));
    }

    function openViewer(globalIdx: number) {
      if (!viewer || !vThumbs) return;
      viewList = visibleItems();
      vThumbs.innerHTML = viewList
        .map(
          (it, k) =>
            `<button class="thumb" type="button" data-thumb="${k}" aria-label="Show ${esc(it.caption)}">${
              it.type === 'video' ? '&#9654;' : pad(k + 1)
            }</button>`
        )
        .join('');
      vIdx = Math.max(0, viewList.indexOf(items[globalIdx]));
      showViewer(vIdx);
      if (typeof viewer.showModal === 'function') {
        viewer.showModal();
      } else {
        viewer.setAttribute('open', '');
      }
    }

    function togglePlay(vid: HTMLElement) {
      const on = vid.classList.toggle('playing');
      const btn = vid.querySelector('[data-vplay]');
      if (btn) btn.innerHTML = on ? '&#10074;&#10074;' : '&#9654;';
    }

    if (viewer) {
      viewer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-v-close]')) {
          viewer.close();
        } else if (target.closest('[data-v-prev]')) {
          showViewer(vIdx - 1);
        } else if (target.closest('[data-v-next]')) {
          showViewer(vIdx + 1);
        } else if (target.closest('[data-thumb]')) {
          const btn = target.closest('[data-thumb]') as HTMLElement;
          showViewer(Number(btn.dataset.thumb));
        } else if (target.closest('[data-vplay]')) {
          const vid = target.closest('[data-vid]') as HTMLElement | null;
          if (vid) togglePlay(vid);
        } else if (target === viewer) {
          viewer.close();
        }
      });

      viewer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') showViewer(vIdx + 1);
        else if (e.key === 'ArrowLeft') showViewer(vIdx - 1);
        else if (e.key === ' ') {
          if (vStage) {
            const v = $('[data-vid]', vStage) as HTMLElement | null;
            if (v) {
              e.preventDefault();
              togglePlay(v);
            }
          }
        }
      });

      viewer.addEventListener('close', () => {
        if (vStage) vStage.innerHTML = '';
      });

      let swipe: { x: number } | null = null;
      if (vStage) {
        vStage.addEventListener('pointerdown', (e: PointerEvent) => {
          swipe = { x: e.clientX };
        });
        vStage.addEventListener('pointerup', (e: PointerEvent) => {
          if (!swipe) return;
          const dx = e.clientX - swipe.x;
          swipe = null;
          if (Math.abs(dx) > 60) showViewer(vIdx + (dx < 0 ? 1 : -1));
        });
      }
    }

    // ---------- Artists ----------
    const artistsEl = $('[data-artists]');
    if (artistsEl) {
      artistsEl.innerHTML = S.artists
        .map(
          (a, i) => `
        <button type="button" class="a-card" data-reveal style="--i:${i % 2}" data-artist="${i}">
          <div class="a-portrait"><div class="media">${media(a.portrait)}</div>${
            a.placeholder ? '<span class="badge">Placeholder profile</span>' : ''
          }</div>
          <div class="a-info">
            <span class="a-idx">${pad(i + 1)}</span>
            <h3>${esc(a.name)}</h3>
            <p class="a-spec">${esc(a.specialisation)}</p>
            <span class="a-more">View profile &rarr;</span>
          </div>
        </button>`
        )
        .join('');
    }

    // ---------- Related ----------
    const relatedEl = $('[data-related]');
    if (relatedEl) {
      relatedEl.innerHTML = S.related
        .map(
          (r, i) => `
        <a class="rel" href="/services/${esc(r.slug)}" data-transition data-reveal style="--i:${i}">
          <div class="rel-media"><div class="media">${media(r.hero)}</div></div>
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.desc)}</p>
          <span class="more">Explore &rarr;</span>
        </a>`
        )
        .join('');
    }

    // ---------- Footer, brand, phone links, sticky bar ----------
    const brandName = $('[data-brand-name]');
    if (brandName) brandName.textContent = SITE.name;
    const footName = $('[data-foot-name]');
    if (footName) footName.textContent = `${SITE.name} · ${S.name}`;
    $$('[data-phone-link]', root).forEach((a) => {
      (a as HTMLAnchorElement).href = SITE.phoneHref;
    });
    const firstPhoneLink = $('[data-phone-link]');
    if (firstPhoneLink) firstPhoneLink.textContent = `Call ${SITE.phoneDisplay}`;
    const stickyName = $('[data-sticky-name]');
    if (stickyName) stickyName.textContent = S.name;
    const stickyPhone = $('.sticky-bar .phone');
    if (stickyPhone) stickyPhone.textContent = SITE.phoneDisplay;

    // ---------- Drawer: artist profile & request form ----------
    const drawer = $('[data-drawer]') as HTMLElement | null;
    const panel = $('[data-drawer-panel]') as HTMLElement | null;
    let lastFocus: HTMLElement | null = null;

    const todayIST = () =>
      new Intl.DateTimeFormat('en-CA', {
        timeZone: SITE.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());

    const normalisePhone = (raw: string) => {
      const d = String(raw || '').replace(/[\s()-]/g, '');
      const m = d.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
      return m ? `+91${m[1]}` : null;
    };

    function artistHTML(a: any) {
      return `
        <div class="d-head"><p class="eyebrow">Artist profile</p>
          <button class="d-close" type="button" data-close aria-label="Close">&times;</button></div>
        <h2 class="d-title" id="drawer-title">${esc(a.name)}</h2>
        <p class="a-spec">${esc(a.specialisation)}</p>
        <div class="d-portrait"><div class="media">${media(a.portrait)}</div>${
        a.placeholder ? '<span class="badge">Placeholder profile</span>' : ''
      }</div>
        ${a.experience ? `<p class="d-meta">${esc(a.experience)}</p>` : ''}
        <p class="d-bio">${esc(a.bio)}</p>
        ${a.skills && a.skills.length ? `<ul class="chips">${a.skills.map((s: string) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
        <div class="form-actions">
          <button class="btn primary" type="button" data-request-artist="${esc(a.id)}">Request with ${esc(a.name)}</button>
          <a class="btn ghost" href="${esc(SITE.phoneHref)}">Call ${esc(SITE.phoneDisplay)}</a>
        </div>`;
    }

    function requestHTML(artistId: string | null) {
      const today = todayIST();
      const slots = SITE.slots.map((t) => `<option value="${t}">${t}</option>`).join('');
      const artists = S.artists
        .map((a) => `<option value="${esc(a.id)}"${a.id === artistId ? ' selected' : ''}>${esc(a.name)}</option>`)
        .join('');
      return `
        <div class="d-head"><p class="eyebrow">Request an appointment</p>
          <button class="d-close" type="button" data-close aria-label="Close">&times;</button></div>
        <h2 class="d-title" id="drawer-title">Request ${esc(S.name)}</h2>
        <p class="d-sub">Tell us what you would like. The salon calls to confirm availability. Your appointment is not confirmed until then.</p>
        <form class="rform" novalidate data-rform>
          <div class="field">
            <label for="rf-name">Full name</label>
            <input id="rf-name" name="name" autocomplete="name" maxlength="80">
            <p class="err" data-err="name"></p>
          </div>
          <div class="field">
            <label for="rf-phone">Mobile number</label>
            <input id="rf-phone" name="phone" inputmode="tel" autocomplete="tel" maxlength="20">
            <p class="hint">10-digit Indian mobile number.</p>
            <p class="err" data-err="phone"></p>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="rf-date">Preferred date</label>
              <input id="rf-date" type="date" min="${today}">
              <p class="err" data-err="date"></p>
            </div>
            <div class="field">
              <label for="rf-time">Preferred time</label>
              <select id="rf-time"><option value="">Choose a time</option>${slots}</select>
              <p class="err" data-err="time"></p>
            </div>
          </div>
          <div class="field">
            <label for="rf-artist">Artist <span class="opt">(optional)</span></label>
            <select id="rf-artist"><option value="">No preference</option>${artists}</select>
          </div>
          <div class="field">
            <label for="rf-msg">Message <span class="opt">(optional)</span></label>
            <textarea id="rf-msg" rows="3" maxlength="500"></textarea>
          </div>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="form-error" role="alert" data-form-error hidden></p>
          <div class="form-actions">
            <button class="btn primary" type="submit" data-submit>Send request</button>
            <a class="btn ghost" href="${esc(SITE.phoneHref)}">Call ${esc(SITE.phoneDisplay)}</a>
          </div>
        </form>`;
    }

    function openDrawer(mode: 'artist' | 'request', arg: any) {
      if (!drawer || !panel) return;
      lastFocus = document.activeElement as HTMLElement | null;
      panel.innerHTML = mode === 'artist' ? artistHTML(arg) : requestHTML(arg || null);
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
      (window as any).lenis?.stop();
      setTimeout(() => {
        const first = panel.querySelector('input, select, textarea, button') as HTMLElement | null;
        (first || (panel.querySelector('.d-close') as HTMLElement | null))?.focus();
      }, 450);
    }

    function closeDrawer() {
      if (!drawer || !drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
      (window as any).lenis?.start();
      lastFocus?.focus?.();
    }

    if (panel) {
      panel.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-close]')) return closeDrawer();
        const ra = target.closest('[data-request-artist]') as HTMLElement | null;
        if (ra) openDrawer('request', ra.dataset.requestArtist);
      });
    }

    const drawerCloseScrim = $('[data-drawer-close]');
    if (drawerCloseScrim) drawerCloseScrim.addEventListener('click', closeDrawer);

    if (drawer) {
      drawer.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeDrawer();
          return;
        }
        if (e.key !== 'Tab' || !panel) return;
        const f = $$('button, a[href], input, select, textarea', panel).filter(
          (el) => !(el as HTMLInputElement).disabled && (el as HTMLElement).offsetParent !== null
        ) as HTMLElement[];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      });
    }

    function setFieldError(name: string, msg: string | undefined) {
      if (!panel) return;
      const el = panel.querySelector(`[data-err="${name}"]`);
      if (el) el.textContent = msg || '';
      const input = panel.querySelector(`#rf-${name}`);
      if (input) input.setAttribute('aria-invalid', String(Boolean(msg)));
    }

    function validateRequest(f: any) {
      const err: Record<string, string> = {};
      const name = f.name?.value?.trim() || '';
      if (!/^[\p{L}][\p{L}\s.'-]{1,79}$/u.test(name)) {
        err.name = 'Please enter your full name.';
      }
      const phone = normalisePhone(f.phone?.value);
      if (!phone) {
        err.phone = 'Enter a 10-digit Indian mobile number.';
      }
      if (!f.date?.value || f.date.value < todayIST()) {
        err.date = 'Choose today or a later date.';
      }
      if (!SITE.slots.includes(f.time?.value)) {
        err.time = 'Choose a time.';
      }
      return { err, name, phone };
    }

    function showSuccess(name: string) {
      if (!panel) return;
      panel.innerHTML = `
        <div class="d-head"><p class="eyebrow">Request received</p>
          <button class="d-close" type="button" data-close aria-label="Close">&times;</button></div>
        <div class="success" role="status">
          <h3 id="drawer-title">Thank you, ${esc(name)}.</h3>
          <p>Your request for ${esc(S.name)} has been received. The salon will call you to confirm availability. Your appointment is not confirmed until that call.</p>
          <button class="btn ghost" type="button" data-close>Close</button>
        </div>`;
    }

    if (panel) {
      panel.addEventListener('submit', async (e) => {
        const target = e.target as HTMLElement;
        const form = target.closest('[data-rform]') as HTMLFormElement | null;
        if (!form) return;
        e.preventDefault();
        const honeypot = form.elements.namedItem('website') as HTMLInputElement | null;
        if (honeypot && honeypot.value) return; // honeypot stopped silently

        const f = {
          name: $('#rf-name', panel) as HTMLInputElement,
          phone: $('#rf-phone', panel) as HTMLInputElement,
          date: $('#rf-date', panel) as HTMLInputElement,
          time: $('#rf-time', panel) as HTMLSelectElement,
          artist: $('#rf-artist', panel) as HTMLSelectElement,
          message: $('#rf-msg', panel) as HTMLTextAreaElement,
        };

        const { err, name, phone } = validateRequest(f);
        ['name', 'phone', 'date', 'time'].forEach((k) => setFieldError(k, err[k]));
        const formError = $('[data-form-error]', panel) as HTMLElement | null;

        if (Object.keys(err).length) {
          if (formError) formError.hidden = true;
          const firstKey = Object.keys(err)[0];
          (panel.querySelector(`#rf-${firstKey}`) as HTMLElement | null)?.focus();
          return;
        }

        const submit = $('[data-submit]', panel) as HTMLButtonElement | null;
        const artist = f.artist?.value ? S.artists.find((a) => a.id === f.artist.value) : null;
        const payload = {
          service: { slug: S.slug, name: S.name },
          customer: { name, phone },
          appointment: { preferredDate: f.date.value, preferredTime: f.time.value },
          artist: artist ? { id: artist.id, name: artist.name } : null,
          message: f.message?.value?.trim() || null,
          source: window.location.pathname,
          submittedAt: new Date().toISOString(),
        };

        // Honest failure when endpoint is empty
        if (!SITE.enquiryEndpoint) {
          if (formError) {
            formError.textContent = `We could not send your request online right now. Please call ${SITE.phoneDisplay}. Your details are still filled in.`;
            formError.hidden = false;
          }
          return;
        }

        if (submit) {
          submit.disabled = true;
          submit.textContent = 'Sending…';
        }

        try {
          const res = await fetch(SITE.enquiryEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(15000) : undefined,
          });
          if (!res.ok) throw new Error(`status ${res.status}`);
          showSuccess(name);
        } catch (_) {
          if (formError) {
            formError.textContent = `We could not send your request. Please try again, or call ${SITE.phoneDisplay}. Your details are still filled in.`;
            formError.hidden = false;
          }
          if (submit) {
            submit.disabled = false;
            submit.textContent = 'Send request';
          }
        }
      });
    }

    // Delegated triggers
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-open-request]')) {
        e.preventDefault();
        openDrawer('request', null);
        return;
      }
      const a = target.closest('[data-artist]') as HTMLElement | null;
      if (a && a.dataset.artist !== undefined) {
        openDrawer('artist', S.artists[Number(a.dataset.artist)]);
        return;
      }
      const relLink = target.closest('a[data-transition]') as HTMLAnchorElement | null;
      if (relLink && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        document.body.classList.add('curtain-on');
        setTimeout(() => {
          window.location.href = relLink.href;
        }, reduce ? 0 : 700);
        return;
      }
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const id = href.slice(1);
        const el = id ? document.getElementById(id) : null;
        if (!el) {
          if (id === 'top' || href === '#') {
            e.preventDefault();
            smoothTo(0);
          }
          return;
        }
        e.preventDefault();
        smoothTo(el.getBoundingClientRect().top + window.scrollY - 24);
      }
    };
    document.addEventListener('click', onDocClick);

    // Eased anchor scrolling
    function smoothTo(y: number, dur = 1100) {
      if (reduce) {
        window.scrollTo(0, y);
        return;
      }
      const start = window.scrollY;
      const d = y - start;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        window.scrollTo(0, start + d * ease);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    // ---------- Reveals ----------
    const revealTargets = () => $$('[data-reveal], .g-item, [data-split]', root);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );
    function observe(nodes: Element[]) {
      nodes.forEach((n) => io.observe(n));
    }

    $$('[data-split]', root).forEach((el) => {
      const text = el.textContent?.trim() || '';
      el.setAttribute('aria-label', text);
      el.innerHTML = splitWords(text);
    });

    // ---------- Scroll engine ----------
    const heroMedia = $('[data-hero-media] .media') as HTMLElement | null;
    const hero = $('#top') as HTMLElement | null;
    const stickyBar = $('[data-sticky]') as HTMLElement | null;
    const steps = $('[data-pr-steps]') as HTMLElement | null;
    const scrubP = $$('[data-sp]', root) as HTMLElement[];
    let ticking = false;

    function frame() {
      ticking = false;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      document.documentElement.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');

      if (!reduce && heroMedia && y < vh * 1.2) {
        heroMedia.style.transform = `translate3d(0, ${(y * 0.25).toFixed(1)}px, 0)`;
      }

      scrubP.forEach((p) => {
        const r = p.getBoundingClientRect();
        const t = clamp((vh * 0.78 - r.top) / (r.height + vh * 0.2), 0, 1);
        const words = (p as any)._words || ((p as any)._words = $$('.sw', p));
        const n = words.length;
        words.forEach((w: Element, j: number) => w.classList.toggle('on', reduce || j / n <= t));
      });

      if (steps) {
        const sr = steps.getBoundingClientRect();
        steps.style.setProperty('--p', clamp((vh * 0.7 - sr.top) / sr.height, 0, 1).toFixed(4));
      }

      if (stickyBar && hero) {
        const past = y > hero.offsetHeight * 0.7 && (!drawer || !drawer.classList.contains('is-open'));
        stickyBar.classList.toggle('show', past);
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Initial render and entrance
    renderGallery();
    if (reduce) {
      revealTargets().forEach((n) => n.classList.add('in'));
    } else {
      observe(revealTargets());
    }

    const enter = () => {
      document.body.classList.add('is-ready');
      setTimeout(() => document.body.classList.remove('curtain-on'), reduce ? 0 : 350);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(enter, 120));
    } else {
      setTimeout(enter, 120);
    }
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('click', onDocClick);
      document.body.classList.remove('curtain-on', 'is-ready', 'drawer-open', 'svc-detail-active');
    };
  }, [service, site]);

  return (
    <div className="svc-page-shell" ref={containerRef}>
      <div className="curtain" aria-hidden="true" />
      <div className="progress" aria-hidden="true">
        <i />
      </div>

      <header className="nav">
        <a className="brand" href="#top" data-brand>
          <b data-brand-name>{site.name}</b>
          <small>International Atelier</small>
        </a>
        <nav className="links" aria-label="On this page">
          <a href="#overview">Details</a>
          <a href="#process">Process</a>
          <a href="#gallery">Gallery</a>
          <a href="#artists">Artists</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="nav-btn" type="button" data-open-request>
          Request appointment &rarr;
        </button>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-media" data-hero-media />
          <div className="hero-shade" />
          <div className="wrap hero-inner">
            <p className="eyebrow" data-hero-eyebrow></p>
            <h1 className="hero-title" id="hero-title" data-hero-title />
            <div className="hero-foot">
              <p className="lede" data-hero-tagline />
              <div className="cta-row">
                <button className="btn primary" type="button" data-open-request>
                  Request this service
                </button>
                <a className="btn ghost" href="#gallery">
                  Explore gallery
                </a>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#overview">
            <i />
            <span>Scroll</span>
          </a>
        </section>

        <section className="overview" id="overview" aria-labelledby="ov-title">
          <div className="wrap">
            <div className="ov-grid">
              <div className="ov-head">
                <p className="eyebrow">About the service</p>
                <h2 className="h2 split" id="ov-title" data-split data-ov-title />
              </div>
              <div className="scrub" data-scrub />
            </div>
            <figure className="supporting" data-reveal="frame" data-supporting />
          </div>
        </section>

        <section className="details" aria-label="Service details">
          <div className="wrap">
            <p className="eyebrow">Everything you need to know</p>
            <div className="dgrid" data-details />
          </div>
        </section>

        <section className="process" id="process" aria-labelledby="pr-title">
          <div className="wrap">
            <div className="pr-grid">
              <div className="pr-head">
                <p className="eyebrow">How it works</p>
                <h2 className="h2 split" id="pr-title" data-split data-pr-title />
              </div>
              <div className="pr-steps" data-pr-steps>
                <div className="pr-line" aria-hidden="true">
                  <i />
                </div>
                <div data-steps />
              </div>
            </div>
          </div>
        </section>

        <section className="gallery" id="gallery" aria-labelledby="g-title">
          <div className="wrap">
            <div className="g-head">
              <div>
                <p className="eyebrow">Gallery</p>
                <h2 className="h2 split" id="g-title" data-split>
                  Recent work
                </h2>
              </div>
              <div className="g-tools" role="group" aria-label="Filter gallery">
                <button className="chip" type="button" data-filter="all" aria-pressed="true">
                  All
                </button>
                <button className="chip" type="button" data-filter="video" aria-pressed="false">
                  Video
                </button>
                <button className="chip" type="button" data-filter="photo" aria-pressed="false">
                  Photos
                </button>
                <span className="g-count" data-g-count />
              </div>
            </div>
            <div className="g-grid" data-g-grid />
          </div>
        </section>

        <section className="artists" id="artists" aria-labelledby="a-title">
          <div className="wrap">
            <div className="a-head">
              <div>
                <p className="eyebrow">The artists</p>
                <h2 className="h2 split" id="a-title" data-split>
                  Meet your artist
                </h2>
              </div>
              <p className="a-hint">Select an artist to read their profile, then request them directly.</p>
            </div>
            <div className="a-list" data-artists />
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="ct-title">
          <div className="wrap ct-grid">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 className="h2 split" id="ct-title" data-split>
                Let&apos;s plan your visit
              </h2>
            </div>
            <div className="ct-card">
              <p>
                Send a request and the salon will call you to confirm availability. Your appointment is not confirmed until
                that call.
              </p>
              <a className="ct-phone" data-phone-link href="#">
                Call the salon
              </a>
              <div className="cta-row">
                <button className="btn primary" type="button" data-open-request>
                  Request an appointment
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="related" aria-labelledby="rel-title">
          <div className="wrap">
            <p className="eyebrow" id="rel-title">
              Other services
            </p>
            <div className="rel-grid" data-related />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-in">
          <span data-foot-name />
          <a data-phone-link href="#">
            Call
          </a>
        </div>
      </footer>

      <div className="sticky-bar" data-sticky>
        <strong data-sticky-name />
        <a className="phone" data-phone-link href="#"></a>
        <button className="btn primary" type="button" data-open-request>
          Request
        </button>
      </div>

      <dialog className="viewer" data-viewer aria-label="Gallery viewer" data-lenis-prevent>
        <div className="v-inner">
          <div className="v-top">
            <span className="v-count" data-v-count />
            <button className="v-close" type="button" data-v-close aria-label="Close gallery">
              &times;
            </button>
          </div>
          <div className="v-main">
            <button className="v-arrow" type="button" data-v-prev aria-label="Previous">
              &larr;
            </button>
            <div className="v-stage" data-v-stage />
            <button className="v-arrow" type="button" data-v-next aria-label="Next">
              &rarr;
            </button>
          </div>
          <div className="v-foot">
            <p className="v-caption" data-v-caption />
            <div className="v-thumbs" data-v-thumbs />
          </div>
        </div>
      </dialog>

      <aside className="drawer" data-drawer aria-hidden="true">
        <div className="drawer-scrim" data-drawer-close />
        <div
          className="drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          data-drawer-panel
          data-lenis-prevent
        />
      </aside>
    </div>
  );
}

