/**
 * ============================================================================
 * SERVICE STAGE — Right-Side Cinematic Content Stage
 * ============================================================================
 * TUNABLES:
 * - Inner Pan Padding (--svc-stage-pan):
 *     Desktop: 64px
 *     Mobile (<900px): 28px
 * - Typing Speed Bounds:
 *     Base delay per char: clamp(6000 / totalChars, 5, 14) ms
 *     Punctuation extra delays:
 *       Sentence ends [.!?]: +180ms
 *       Mid-sentence pauses [,;:]: +70ms
 * - Hold Duration:
 *     5000ms pause after text finishes before the gallery reel reveals
 * - Drag Thresholds:
 *     Deadzone: 8px minimum movement before recognizing drag mode
 *     Horizontal navigation threshold: |dx| > 120px
 *     Flick navigation threshold: |vx| > 0.5 px/ms with |dx| > 30px
 *     Direction: dx < 0 is +1 (next), dx > 0 is -1 (previous)
 *     Snapback animation duration: 500ms (cubic-bezier(0.16, 1, 0.3, 1))
 * ============================================================================
 */

(function () {
  'use strict';

  let activeInstance = null;

  function createServiceStage(element, services, options) {
    options = options || {};

    const esc = (v) =>
      String(v).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c]));
    const pad = (n) => String(n).padStart(2, '0');
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    // Fall back to min(88vh, 840px) if container has no height
    if (!element.clientHeight) {
      element.style.minHeight = 'min(88vh, 840px)';
    }

    // Inherit host font families or fall back to Unbounded and Space Grotesk
    const cs = window.getComputedStyle(element);
    const stageDisplay = cs.getPropertyValue('--svc-stage-display').trim();
    const stageText = cs.getPropertyValue('--svc-stage-text').trim();
    if (!stageDisplay) {
      const hostDisplay =
        cs.getPropertyValue('--display').trim() ||
        cs.fontFamily ||
        "'Unbounded', system-ui, sans-serif";
      element.style.setProperty('--svc-stage-display', hostDisplay);
    }
    if (!stageText) {
      const hostText =
        cs.getPropertyValue('--text').trim() ||
        cs.fontFamily ||
        "'Space Grotesk', system-ui, -apple-system, sans-serif";
      element.style.setProperty('--svc-stage-text', hostText);
    }

    // Construct DOM inside .svc-stage host element
    element.innerHTML = `
      <div class="svc-stage__inner">
        <div class="svc-stage__top">
          <span class="svc-stage__kicker" data-svc-kicker></span>
          <div class="svc-stage__tools">
            <span class="svc-stage__hint" aria-hidden="true">&larr; Drag &rarr;</span>
            <button class="svc-stage__replay" type="button" data-svc-replay>Replay</button>
          </div>
        </div>
        <div class="svc-stage__stream" data-svc-stream></div>
        <div class="svc-stage__reel" data-svc-reel></div>
        <div class="svc-stage__cta" data-svc-cta>
          <a class="svc-stage__btn svc-stage__btn--primary" data-svc-explore href="#">Explore</a>
          <a class="svc-stage__btn svc-stage__btn--ghost" href="#book">Book appointment</a>
        </div>
      </div>
    `;

    const inner = element.querySelector('.svc-stage__inner');
    const kicker = element.querySelector('[data-svc-kicker]');
    const replayBtn = element.querySelector('[data-svc-replay]');
    const stream = element.querySelector('[data-svc-stream]');
    const reel = element.querySelector('[data-svc-reel]');
    const cta = element.querySelector('[data-svc-cta]');
    const explore = element.querySelector('[data-svc-explore]');

    // Orange blinking caret
    const caret = document.createElement('span');
    caret.className = 'svc-stage__caret';
    caret.setAttribute('aria-hidden', 'true');

    let current = 0;
    let runId = 0;
    let started = false;
    let goal = 0;
    let raf = 0;
    let userControl = false; // true once visitor scrubs stage by hand
    let movedSinceDown = false; // suppresses click following a drag
    let drag = null;

    const alive = (id) => id === runId;

    // ----- Diagonal Auto-Scroll Pan -----
    function setGoal(v) {
      if (userControl) return;
      goal = Math.max(0, v);
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function panTo(top) {
      const maxTop = element.scrollHeight - element.clientHeight;
      const maxLeft = element.scrollWidth - element.clientWidth;
      const t = clamp(top, 0, maxTop);
      element.scrollTop = t;
      element.scrollLeft = maxTop > 0 && maxLeft > 0 ? maxLeft * (t / maxTop) : 0;
    }

    function tick() {
      if (userControl) {
        raf = 0;
        return;
      }
      const max = element.scrollHeight - element.clientHeight;
      const target = clamp(goal, 0, max);
      const d = target - element.scrollTop;
      if (Math.abs(d) < 0.5) {
        panTo(target);
        raf = 0;
        return;
      }
      panTo(element.scrollTop + d * 0.12);
      raf = requestAnimationFrame(tick);
    }

    function follow() {
      if (userControl) return;
      const c = caret.getBoundingClientRect();
      const st = element.getBoundingClientRect();
      const want = element.scrollTop + (c.top - st.top) - element.clientHeight * 0.5;
      if (want > goal) {
        setGoal(want);
      }
    }

    // ----- Content Structuring -----
    function buildBlocks(s) {
      return [
        { tag: 'p', cls: 'svc-stage__lead', text: s.tagline },
        ...s.intro.map((text) => ({ tag: 'p', cls: 'svc-stage__p', text })),
        { tag: 'h4', cls: 'svc-stage__h4', text: 'What is included' },
        {
          group: true,
          items: s.includes.map((text, k) => ({
            text,
            file: `${s.slug}/includes-${k + 1}.jpg`,
          })),
        },
        { tag: 'p', cls: 'svc-stage__note', text: s.duration },
      ];
    }

    // Included-list state
    let incVisuals = [];
    let incItems = [];
    let autoIdx = null; // line currently finished typing (null while typing)
    let hoverIdx = null; // line under mouse pointer
    let doneIdx = -1;

    function renderInc() {
      const idx = hoverIdx !== null ? hoverIdx : autoIdx;
      incVisuals.forEach((v, k) => v.classList.toggle('on', k === idx));
      incItems.forEach((li, k) => li.classList.toggle('is-hot', k === idx));
    }

    function buildGroup(items) {
      const wrap = document.createElement('div');
      wrap.className = 'svc-stage__inc';

      const ul = document.createElement('ul');
      ul.className = 'svc-stage__inc-list';

      const vis = document.createElement('div');
      vis.className = 'svc-stage__inc-visual';
      vis.innerHTML = items
        .map(
          (it) => `
        <figure class="svc-stage__inc-img">
          <div class="svc-stage__media">
            <span class="svc-stage__ph-file">Placeholder · ${esc(it.file)}</span>
          </div>
          <figcaption class="svc-stage__caption">${esc(it.text)}</figcaption>
        </figure>
      `
        )
        .join('');

      const lis = items.map((it, k) => {
        const li = document.createElement('li');
        li.className = 'svc-stage__inc-item';
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
      incVisuals = [...vis.children];
      incItems = lis;
      return lis;
    }

    function makeNode(b) {
      const node = document.createElement(b.tag);
      if (b.cls) node.className = b.cls;
      stream.append(node);
      return node;
    }

    async function typeInto(node, text, id, per) {
      const txt = document.createElement('span');
      node.append(txt, caret);
      for (let i = 1; i <= text.length; i++) {
        if (!alive(id)) return false;
        txt.textContent = text.slice(0, i);
        follow();
        const ch = text[i - 1];
        await wait(per + (/[.!?]/.test(ch) ? 180 : /[,;:]/.test(ch) ? 70 : 0));
      }
      return alive(id);
    }

    function buildReel(s) {
      const items = [
        { video: true, file: `${s.slug}/reel.mp4`, caption: `${s.name} · reel` },
        ...s.gallery.map((g) => ({ file: g.file, caption: g.caption })),
      ];

      reel.innerHTML = items
        .map((it) =>
          it.video
            ? `
          <figure class="svc-stage__tile svc-stage__tile--video">
            <div class="svc-stage__media">
              <span class="svc-stage__ph-file">Video · ${esc(it.file)}</span>
            </div>
            <div class="svc-stage__play" aria-hidden="true">&#9654;</div>
            <div class="svc-stage__bar" aria-hidden="true"><i></i></div>
            <figcaption class="svc-stage__caption">${esc(it.caption)}</figcaption>
          </figure>
        `
            : `
          <figure class="svc-stage__tile">
            <div class="svc-stage__media">
              <span class="svc-stage__ph-file">Placeholder · ${esc(it.file)}</span>
            </div>
            <figcaption class="svc-stage__caption">${esc(it.caption)}</figcaption>
          </figure>
        `
        )
        .join('');
    }

    async function reveal(id) {
      const tiles = [...reel.children];
      setGoal(reel.offsetTop - 30);
      await wait(250);
      if (!alive(id)) return;

      for (const t of tiles) {
        t.classList.add('on');
        await wait(200);
        if (!alive(id)) return;
      }

      await wait(250);
      if (!alive(id)) return;

      cta.classList.add('on');
      setGoal(cta.offsetTop + cta.offsetHeight - element.clientHeight + 48);
    }

    async function run(i) {
      const id = ++runId;
      current = i;
      userControl = false;
      const s = services[i];
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

      kicker.textContent = `${pad(i + 1)} / ${pad(services.length)} · ${s.category.toUpperCase()}`;
      explore.href = `/services/${s.slug}`;
      explore.textContent = `Explore ${s.name}`;
      buildReel(s);

      const blocks = buildBlocks(s);

      // Reduced motion: immediate render without typing or animations
      if (reduce) {
        for (const b of blocks) {
          if (b.group) {
            const lis = buildGroup(b.items);
            lis.forEach((li, k) => {
              li.textContent = b.items[k].text;
            });
            doneIdx = b.items.length - 1;
            autoIdx = doneIdx;
            renderInc();
          } else {
            makeNode(b).textContent = b.text;
          }
        }
        reel.querySelectorAll('.svc-stage__tile').forEach((t) => t.classList.add('on'));
        cta.classList.add('on');
        return;
      }

      // Typing sequence: roughly 6 seconds total
      const totalChars = blocks.reduce(
        (n, b) =>
          n +
          (b.group
            ? b.items.reduce((m, it) => m + it.text.length, 0)
            : b.text.length),
        0
      );
      const per = clamp(6000 / totalChars, 5, 14);

      for (const b of blocks) {
        if (b.group) {
          const lis = buildGroup(b.items);
          for (let k = 0; k < b.items.length; k++) {
            autoIdx = null;
            renderInc();
            if (!(await typeInto(lis[k], b.items[k].text, id, per))) return;
            doneIdx = k;
            autoIdx = k;
            renderInc();
            await wait(320);
            if (!alive(id)) return;
          }
          continue;
        }
        const node = makeNode(b);
        if (!(await typeInto(node, b.text, id, per))) return;
        await wait(220);
        if (!alive(id)) return;
      }

      caret.remove();

      // Hold on screen for 5000ms so visitor can hover finished included lines
      await wait(5000);
      if (!alive(id)) return;

      await reveal(id);
    }

    replayBtn.addEventListener('click', () => run(current));

    // ----- Pointer Interactions (Drag & Scrub) -----
    element.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      movedSinceDown = false;
      drag = {
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        lastX: e.clientX,
        lastT: performance.now(),
        vx: 0,
        dx: 0,
        mode: null,
        mouse: e.pointerType === 'mouse',
        st0: element.scrollTop,
      };
    });

    window.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;

      if (!drag.mode) {
        if (Math.hypot(dx, dy) < 8) return;
        drag.mode = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        movedSinceDown = true;
        if (drag.mode === 'h') {
          element.classList.add('svc-stage--dragging');
        }
      }

      if (drag.mode === 'h') {
        const now = performance.now();
        const dt = Math.max(1, now - drag.lastT);
        drag.vx = (e.clientX - drag.lastX) / dt;
        drag.lastX = e.clientX;
        drag.lastT = now;
        drag.dx = dx;
        inner.style.transform = `translate3d(${dx * 0.35}px, 0, 0)`;
        inner.style.opacity = String(1 - Math.min(0.5, Math.abs(dx) / 800));
      } else if (drag.mode === 'v' && drag.mouse) {
        userControl = true;
        panTo(drag.st0 - dy);
      }
    });

    async function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      element.classList.remove('svc-stage--dragging');

      if (d.mode !== 'h') return;
      const dx = d.dx;
      const flick = Math.abs(d.vx) > 0.5 && Math.abs(dx) > 30;

      if (Math.abs(dx) > 120 || flick) {
        const dir = dx < 0 ? 1 : -1; // dragging left means next service (+1)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
          inner.style.transform = '';
          inner.style.opacity = '';
          if (typeof options.onNavigate === 'function') {
            options.onNavigate(dir);
          }
          return;
        }

        const out = inner.animate(
          [
            {
              transform: inner.style.transform || 'translate3d(0,0,0)',
              opacity: inner.style.opacity || '1',
            },
            { transform: `translate3d(${-dir * 140}px, 0, 0)`, opacity: 0 },
          ],
          { duration: 240, easing: 'ease-in', fill: 'forwards' }
        );
        await out.finished;
        inner.style.transform = '';
        inner.style.opacity = '';
        out.cancel();

        if (typeof options.onNavigate === 'function') {
          options.onNavigate(dir);
        }
      } else {
        const snap = inner.animate(
          [
            {
              transform: inner.style.transform || 'translate3d(0,0,0)',
              opacity: inner.style.opacity || '1',
            },
            { transform: 'translate3d(0,0,0)', opacity: 1 },
          ],
          { duration: 500, easing: 'cubic-bezier(.16, 1, .3, 1)' }
        );
        await snap.finished;
        inner.style.transform = '';
        inner.style.opacity = '';
      }
    }

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Suppress click that follows a drag using capture phase listener
    element.addEventListener(
      'click',
      (e) => {
        if (movedSinceDown) {
          e.preventDefault();
          e.stopPropagation();
          movedSinceDown = false;
        }
      },
      true
    );

    // 3D Tilt on Hover for Gallery Tiles
    reel.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const t = e.target.closest('.svc-stage__tile.on');
      if (!t) return;
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      t.style.setProperty('--svc-stage-ry', `${(px * 10).toFixed(2)}deg`);
      t.style.setProperty('--svc-stage-rx', `${(-py * 10).toFixed(2)}deg`);
    });

    reel.addEventListener('pointerout', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('.svc-stage__tile') : null;
      if (t && !t.contains(e.relatedTarget)) {
        t.style.setProperty('--svc-stage-rx', '0deg');
        t.style.setProperty('--svc-stage-ry', '0deg');
      }
    });

    // IntersectionObserver: start sequence when at least 30% visible
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          io.disconnect();
          run(current);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(element);

    // Initial label
    if (services[0]) {
      kicker.textContent = `01 / ${pad(services.length)} · ${services[0].category.toUpperCase()}`;
    }

    const instance = {
      show(index) {
        started = true;
        current = clamp(index, 0, services.length - 1);
        run(current);
      },
      replay() {
        run(current);
      },
      destroy() {
        io.disconnect();
      },
    };

    return instance;
  }

  // Public API
  window.ServiceStage = {
    mount(element, services, options) {
      if (!element) {
        throw new Error('ServiceStage.mount requires a valid DOM element.');
      }
      activeInstance = createServiceStage(element, services, options);
      return activeInstance;
    },
    show(index) {
      if (activeInstance) {
        activeInstance.show(index);
      }
    },
    replay() {
      if (activeInstance) {
        activeInstance.replay();
      }
    },
  };
})();
