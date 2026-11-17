'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import FaqSection from '@/components/faq/FaqSection';
import { ACADEMY_GENERAL_FAQS, getCourseFaqs } from '@/lib/data/academyFaqs';

interface Course {
  _id: string;
  name: string;
  slug: string;
  studio: string;
  description?: string;
  duration?: string;
  level?: string;
  schedule?: string;
  fee?: string;
  learn: string[];
  includes: string[];
  bannerImage?: string;
  tone?: 'black' | 'red';
  displayOrder?: number;
  isPublished: boolean;
}

interface SiteSettings {
  siteName: string;
  whatsappNumber: string;
  phone: string;
  email: string;
}

/* Marble graphic generator matching luxury atelier liquid aesthetic */
function renderMarbleSvg(index: number) {
  const flip = index % 2 === 1;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: flip
          ? 'radial-gradient(circle at 70% 30%, #c8102e 0%, #300408 55%, #0c0c0c 100%)'
          : 'radial-gradient(circle at 30% 70%, #c8102e 0%, #161616 55%, #0c0c0c 100%)',
        borderRadius: 'inherit',
      }}
    />
  );
}

const INITIAL_COURSES: Course[] = [
  {
    _id: 'seed-1',
    name: 'Hair Couture & Balayage',
    slug: 'hair-couture-balayage',
    studio: 'Hair',
    tone: 'black',
    duration: '6 months',
    level: 'Advanced Diploma',
    schedule: 'Quarterly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/hair-couture.jpg',
    description:
      'Master haute precision cutting geometry, bespoke French balayage painting, and dimensional colour formulation under Spark master stylists.',
    learn: [
      'Anatomical sectioning & French balayage feathering',
      'Precision architectural graduation & texturising',
      'Complex colour correction & tone chemistry',
      'Luxury client consultation & salon floor leadership',
    ],
    includes: [
      'Professional shears & Japanese carbon comb kit',
      'Mannequin heads & Kérastase backbar product suite',
      'Certified Haute Hair Director Diploma',
    ],
    displayOrder: 1,
    isPublished: true,
  },
  {
    _id: 'seed-2',
    name: 'HD Bridal & Makeover',
    slug: 'hd-bridal-makeover',
    studio: 'Bridal',
    tone: 'red',
    duration: '3 months',
    level: 'Professional Masterclass',
    schedule: 'Monthly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/bridal-masterpiece.jpg',
    description:
      'Complete bridal artistry covering high-definition silicon airbrush makeup, couture hair sculpting, dupatta draping, and luxury wedding backstage management.',
    learn: [
      'High-definition silicone airbrush & micro-pigment blending',
      'Royal architectural updos, French braids & floral weaving',
      'Traditional & contemporary saree/lehenga draping architecture',
      'Jewellery setting, client lighting prep & camera-ready longevity',
    ],
    includes: [
      'HD professional makeup kit & airbrush compressor',
      'Bridal portfolio photoshoots with professional models',
      'Master Bridal Artisan Certification',
    ],
    displayOrder: 2,
    isPublished: true,
  },
  {
    _id: 'seed-3',
    name: 'Russian E-File Manicure',
    slug: 'russian-manicure',
    studio: 'Nail',
    tone: 'black',
    duration: '6 weeks',
    level: 'Specialist Certification',
    schedule: 'Bi-weekly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/nail-detailing.jpg',
    description:
      'Elite dry electric file cuticle work, flawless apex architecture, combined manicure protocols, and long-lasting gel extensions.',
    learn: [
      'Diamond bit selection & safe mechanical e-file cuticle detailing',
      'Flawless rubber base apex alignment & self-levelling balance',
      'Under-cuticle deep gel pigment coating technique',
      'Polygel extension sculpting & architectural pinch shaping',
    ],
    includes: [
      'Professional 35,000 RPM e-file unit & diamond bit suite',
      'Russian technique certification of mastery',
    ],
    displayOrder: 3,
    isPublished: true,
  },
  {
    _id: 'seed-4',
    name: 'Clinical Aesthetic Skin',
    slug: 'clinical-aesthetic-skin',
    studio: 'Face',
    tone: 'red',
    duration: '8 weeks',
    level: 'Clinical Certification',
    schedule: 'Monthly intake',
    fee: 'On enquiry',
    bannerImage: '/images/services/skin-waxing.jpg',
    description:
      'Clinical dermal science, ultrasonic hydra-dermabrasion, superficial medical peels, LED phototherapy, and bespoke barrier restoration protocols.',
    learn: [
      'Dermal anatomy & Fitzpatrick skin typing diagnostic analysis',
      'Hydra-dermabrasion infusion & ultrasonic deep extraction',
      'AHA/BHA chemical resurfacing & post-peel neutralizing',
      'LED phototherapy wavelengths & active serum electro-mesotherapy',
    ],
    includes: [
      'Clinical dermal diagnostic kit & aesthetic manual',
      'Certified Clinical Aesthetic Practitioner credential',
    ],
    displayOrder: 4,
    isPublished: true,
  },
];

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Byju Spark Saloon International',
    whatsappNumber: '918543097899',
    phone: '+91 8543097899',
    email: 'byjuspark@gmail.com',
  });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [modalFaqIndex, setModalFaqIndex] = useState<number | null>(0);

  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Fetch published Academy courses and Site Settings from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [academyRes, settingsRes] = await Promise.all([
          fetch('/api/academy'),
          fetch('/api/settings'),
        ]);

        if (academyRes.ok) {
          const academyData = await academyRes.json();
          if (isMounted && academyData.success && Array.isArray(academyData.data)) {
            setCourses(academyData.data);
          }
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (isMounted && settingsData.success && settingsData.data) {
            setSettings({
              siteName: settingsData.data.siteName || 'Byju Spark Saloon International',
              whatsappNumber: settingsData.data.whatsappNumber || '918543097899',
              phone: settingsData.data.phone || '+91 8543097899',
              email: settingsData.data.email || 'byjuspark@gmail.com',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load academy courses or settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute studio category filters dynamically from published courses
  const studioFilters = useMemo(() => {
    const list = Array.from(new Set(courses.map((c) => c.studio || 'Hair').filter(Boolean)));
    return ['All', ...list];
  }, [courses]);

  // Filtered course list
  const filteredCourses = useMemo(() => {
    if (activeFilter === 'All') return courses;
    return courses.filter((c) => (c.studio || 'Hair') === activeFilter);
  }, [courses, activeFilter]);

  // Hash Routing (#course-<slug>)
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('course-')) {
        const slug = hash.replace('course-', '');
        const found = courses.find((c) => c.slug === slug);
        if (found) {
          setActiveCourse(found);
          return;
        }
      }
      if (hash === '' || hash === 'academy') {
        setActiveCourse(null);
      }
    }

    if (courses.length > 0) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [courses]);

  // Lock body scroll & pause Lenis when course dialog is open
  useEffect(() => {
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    if (activeCourse) {
      document.body.style.overflow = 'hidden';
      lenis?.stop?.();
    } else {
      document.body.style.overflow = '';
      lenis?.start?.();
      if (lastFocusRef.current) {
        lastFocusRef.current.focus();
        lastFocusRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start?.();
    };
  }, [activeCourse]);

  // Handle Dialog Closing
  const closeDialog = useCallback(() => {
    setActiveCourse(null);
    if (window.location.hash.startsWith('#course-')) {
      window.history.replaceState(null, '', '#academy');
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (activeCourse) {
          closeDialog();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCourse, closeDialog]);

  // Generate WhatsApp enquiry link
  const getWhatsAppEnquiryUrl = (course: Course) => {
    const rawPhone = settings.whatsappNumber.replace(/[^0-9]/g, '') || '918543097899';
    const message = `Hello, I would like to enquire about the ${course.name} course at Spark International Salon.`;
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="spark-academy-root">
      {/* 3. Main Hero Header with Abstract Marble Slot */}
      <main id="academy">
        <section className="head">
          <div
            className="marble-slot"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(circle at 75% 35%, rgba(200, 16, 46, 0.22) 0%, rgba(12, 12, 12, 0.08) 50%, transparent 80%)',
            }}
          />

          <div className="wrap">
            <p className="eyebrow">Academy</p>
            <h1 className="h-display">All courses</h1>
            <p className="lead">
              Choose a course to see its full details, then send an enquiry.
            </p>
          </div>
        </section>

        {/* 4. Toolbar & Filters */}
        <div className="wrap">
          <div className="toolbar">
            <div className="filters" role="group" aria-label="Filter courses by studio" id="filters">
              {studioFilters.map((s) => (
                <button
                  key={s}
                  className="filter"
                  type="button"
                  data-studio={s}
                  aria-pressed={activeFilter === s}
                  onClick={() => setActiveFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="count" id="count" aria-live="polite">
              {loading
                ? 'Loading courses...'
                : `${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'}`}
            </p>
          </div>

          {/* 5. Course Cards Grid (Liquid Fill Wave) */}
          <div className="grid" id="grid">
            {filteredCourses.map((c, i) => {
              const tone = c.tone || (i % 2 === 1 ? 'red' : 'black');
              return (
                <button
                  key={c._id}
                  className="card"
                  type="button"
                  data-tone={tone}
                  data-slug={c.slug}
                  aria-label={`${c.name}, view details`}
                  onClick={(e) => {
                    lastFocusRef.current = e.currentTarget;
                    window.location.hash = `course-${c.slug}`;
                    setActiveCourse(c);
                    setModalFaqIndex(0);
                  }}
                >
                  {/* Rising liquid fill with animated continuous wave */}
                  <span className="lq-fill" aria-hidden="true">
                    <span className="lq-wave">
                      <svg viewBox="0 0 1440 28" preserveAspectRatio="none">
                        <path d="M0 14 C180 0 360 28 540 14 S900 0 1080 14 S1350 28 1440 14 V28 H0Z" />
                      </svg>
                      <svg viewBox="0 0 1440 28" preserveAspectRatio="none">
                        <path d="M0 14 C180 0 360 28 540 14 S900 0 1080 14 S1350 28 1440 14 V28 H0Z" />
                      </svg>
                    </span>
                  </span>

                  {/* Top card artwork */}
                  <div className="card-art">
                    {c.bannerImage ? (
                      <img
                        src={c.bannerImage}
                        alt={c.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ) : (
                      renderMarbleSvg(i)
                    )}
                  </div>

                  {/* Card body */}
                  <div className="card-body">
                    <span className="card-studio">{c.studio || 'Hair'}</span>
                    <h3>{c.name}</h3>
                    <p className="card-meta">
                      {c.duration || 'Flexible'} · {c.level || 'Professional'}
                    </p>
                    <span className="card-cta">View course</span>
                  </div>
                </button>
              );
            })}
          </div>

          {!loading && filteredCourses.length === 0 && (
            <p className="empty" id="empty">
              No courses in this studio yet.
            </p>
          )}
        </div>

        {/* 6. Academy FAQs Section (Exact Contact Page FAQ Model) */}
        <FaqSection
          id="academy-faq"
          eyebrow="Academy FAQs"
          title="Everything you need to know before enrolling"
          description="Explore key insights into our admissions process, credentials, student kits, and career placements across luxury salons."
          ctaText="Enquire Now"
          ctaHref={
            settings?.whatsappNumber
              ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Hello, I would like to enquire about Spark Academy courses.'
                )}`
              : 'https://wa.me/919946899990'
          }
          items={ACADEMY_GENERAL_FAQS}
        />
      </main>

      {/* 6. Course Detail Modal Dialog */}
      {activeCourse && (
        <div
          className="course-dialog-backdrop"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div
            className="course-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="courseName"
            data-lenis-prevent
          >
            <div className="dlg">
              {/* Left Side Artwork */}
              <div className="dlg-art">
                <div className="marble-slot" aria-hidden="true">
                  {activeCourse.bannerImage ? (
                    <img
                      src={activeCourse.bannerImage}
                      alt={activeCourse.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    renderMarbleSvg(courses.indexOf(activeCourse))
                  )}
                </div>
                <span className="studio-tag">{activeCourse.studio || 'Hair'}</span>
              </div>

              {/* Right Side Course Content */}
              <div className="dlg-main" data-lenis-prevent>
                <div className="dlg-top">
                  <div>
                    <p className="eyebrow" id="dlgStudio">
                      {activeCourse.studio || 'Hair'} studio
                    </p>
                    <h2 id="courseName">{activeCourse.name}</h2>
                  </div>
                  <button
                    className="close"
                    type="button"
                    id="dlgClose"
                    aria-label="Close dialog"
                    onClick={closeDialog}
                  >
                    Close
                  </button>
                </div>

                {/* Facts Grid */}
                <dl className="facts" id="dlgFacts">
                  <div>
                    <dt>Duration</dt>
                    <dd>{activeCourse.duration || 'Flexible'}</dd>
                  </div>
                  <div>
                    <dt>Level</dt>
                    <dd>{activeCourse.level || 'All Levels'}</dd>
                  </div>
                  <div>
                    <dt>Schedule</dt>
                    <dd>{activeCourse.schedule || 'Monthly intake'}</dd>
                  </div>
                </dl>

                {/* About This Course */}
                {activeCourse.description && (
                  <div>
                    <h4>About this course</h4>
                    <p id="dlgSummary">{activeCourse.description}</p>
                  </div>
                )}

                {/* What You Will Learn */}
                {activeCourse.learn && activeCourse.learn.length > 0 && (
                  <div>
                    <h4>What you will learn</h4>
                    <ul id="dlgLearn">
                      {activeCourse.learn.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Included Benefits */}
                {activeCourse.includes && activeCourse.includes.length > 0 && (
                  <div>
                    <h4>Included</h4>
                    <ul id="dlgIncludes">
                      {activeCourse.includes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Course-Specific FAQ Section (Exact Contact Page FAQ Model) */}
                <div className="dlg-faqs">
                  <h4>Course Questions & Answers</h4>
                  <div className="faq-list">
                    {getCourseFaqs(activeCourse).map((item, idx) => {
                      const isOpen = modalFaqIndex === idx;
                      const panelId = `dlg-faq-panel-${idx}`;
                      const triggerId = `dlg-faq-trigger-${idx}`;
                      return (
                        <div key={item.question} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                          <button
                            type="button"
                            id={triggerId}
                            className="faq-trigger"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setModalFaqIndex(isOpen ? null : idx)}
                          >
                            <span className="faq-question-wrap">
                              <span className="faq-num">{String(idx + 1).padStart(2, '0')}</span>
                              <span className="faq-question">{item.question}</span>
                            </span>
                            <span className="faq-plus" aria-hidden="true">
                              +
                            </span>
                          </button>
                          {isOpen && (
                            <div
                              id={panelId}
                              role="region"
                              aria-labelledby={triggerId}
                              className="faq-answer-panel"
                            >
                              <p className="faq-answer">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Course Action Buttons */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '12px' }}>
                  <a
                    className="enquire"
                    id="dlgEnquire"
                    href={getWhatsAppEnquiryUrl(activeCourse)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enquire Now
                  </a>
                  <Link
                    href={`/academy/${activeCourse.slug}`}
                    className="dlg-full-page-btn"
                  >
                    View Full Course Page &rarr;
                  </Link>
                </div>

                <p className="note">
                  The enquiry opens WhatsApp with a message ready. Press Send in WhatsApp to contact us.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Scoped Styles Replicating Spark Academy.html Exactly */}
      <style jsx global>{`
        :root {
          --red: #c8102e;
          --black: #0c0c0c;
          --white: #ffffff;
          --paper: #f4f2f1;
          --ink: #0c0c0c;
          --muted: rgba(12, 12, 12, 0.62);
          --rule: rgba(12, 12, 12, 0.14);
          --ease: cubic-bezier(0.5, 0.1, 0.2, 1);
          --font-serif: "Cormorant Garamond", Georgia, serif;
          --font-sans: "Jost", system-ui, -apple-system, sans-serif;
        }

        .spark-academy-root {
          margin: 0;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          min-height: 100vh;
        }

        @keyframes morph {
          0%, 100% { border-radius: 58% 42% 52% 48% / 46% 56% 44% 54%; }
          50% { border-radius: 44% 56% 40% 60% / 60% 42% 58% 40%; }
        }

        @keyframes wave-x {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        /* Page & Hero */
        #academy .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: max(28px, env(safe-area-inset-left, 0px));
          padding-right: max(28px, env(safe-area-inset-right, 0px));
          padding-bottom: 96px;
        }
        .head {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          margin-top: 0;
          padding: 170px 0 70px;
          background: var(--white);
          border-bottom: 1px solid var(--rule);
        }
        #academy .head .wrap {
          position: relative;
          padding-bottom: 0;
        }
        .marble-slot {
          position: absolute;
          top: 0;
          right: 0;
          width: 64%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 44%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 44%);
        }
        .marble-slot svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .eyebrow {
          font: 500 11px/1 var(--font-sans);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
          margin: 0;
        }
        .h-display {
          margin-top: 20px;
          margin-bottom: 0;
          font: 600 clamp(52px, 8vw, 116px)/0.92 var(--font-serif);
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .lead {
          max-width: 50ch;
          margin-top: 24px;
          margin-bottom: 0;
          font-size: 17px;
          line-height: 1.6;
          color: var(--muted);
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 48px;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .filter {
          height: 40px;
          padding: 0 18px;
          background: var(--white);
          border: 1px solid var(--black);
          border-radius: 999px;
          cursor: pointer;
          font: 500 11px/1 var(--font-sans);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          transition: background-color 280ms ease, color 280ms ease;
        }
        .filter:hover,
        .filter[aria-pressed="true"] {
          background: var(--black);
          color: var(--white);
        }
        .count {
          font-size: 13px;
          color: var(--muted);
          font-variant-numeric: tabular-nums;
          margin: 0;
        }

        /* Course cards (Liquid Wave Fill) */
        .grid {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        .card {
          --fill: var(--black);
          position: relative;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          padding: 0;
          background: var(--white);
          color: var(--ink);
          border: 1px solid var(--rule);
          border-radius: 8px 40px 8px 40px;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(12, 12, 12, 0.05), 0 18px 40px -26px rgba(12, 12, 12, 0.35);
          transition: color 520ms ease, transform 520ms var(--ease), box-shadow 520ms ease;
          font-family: inherit;
        }
        .card[data-tone="red"] {
          --fill: var(--red);
        }
        .card:hover,
        .card:focus-visible {
          color: var(--white);
          transform: translate3d(0, -4px, 0);
          box-shadow: 0 1px 2px rgba(12, 12, 12, 0.05), 0 30px 50px -28px rgba(12, 12, 12, 0.5);
          outline: none;
        }
        .card .lq-fill {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: calc(100% - 190px);
          z-index: 1;
          background: var(--fill);
          transform: translate3d(0, 130%, 0);
          transition: transform 780ms var(--ease);
          pointer-events: none;
        }
        .card:hover .lq-fill,
        .card:focus-visible .lq-fill {
          transform: translate3d(0, 0, 0);
        }
        .lq-wave {
          position: absolute;
          left: 0;
          top: -26px;
          width: 200%;
          height: 28px;
          display: flex;
          animation: wave-x 5s linear infinite;
        }
        .lq-wave svg {
          display: block;
          width: 50%;
          height: 100%;
        }
        .lq-wave path {
          fill: var(--fill);
        }
        .card-art {
          position: relative;
          height: 210px;
          overflow: hidden;
          z-index: 2;
          background: var(--white);
          border-radius: 8px 40px 0 0;
        }
        .card-art svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .card-body {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 10px;
          padding: 22px 26px 26px;
        }
        .card-studio {
          font: 500 10.5px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--red);
          transition: color 420ms ease;
        }
        .card:hover .card-studio,
        .card:focus-visible .card-studio {
          color: var(--white);
        }
        .card h3 {
          font: 600 30px/1.02 var(--font-serif);
          margin: 0;
        }
        .card-meta {
          font-size: 13px;
          color: var(--muted);
          transition: color 420ms ease;
          margin: 0;
        }
        .card:hover .card-meta,
        .card:focus-visible .card-meta {
          color: rgba(255, 255, 255, 0.86);
        }
        .card-cta {
          margin-top: 8px;
          font: 500 11px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .empty {
          padding: 48px 0;
          color: var(--muted);
        }

        /* Course Detail Dialog Backdrop & Window */
        .course-dialog-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: rgba(12, 12, 12, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .course-dialog {
          width: min(960px, calc(100vw - 32px));
          height: min(86vh, 820px);
          max-height: min(90vh, 860px);
          padding: 0;
          border: 0;
          border-radius: 8px 40px 8px 40px;
          background: var(--white);
          color: var(--ink);
          box-shadow: 0 50px 90px -40px rgba(12, 12, 12, 0.7);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .dlg {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          grid-template-rows: minmax(0, 1fr);
          height: 100%;
          max-height: 100%;
          width: 100%;
          min-height: 0;
          overflow: hidden;
        }
        .dlg-art {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          height: 100%;
          min-height: 100%;
          background: var(--paper);
        }
        .dlg-art .marble-slot {
          width: 100%;
          height: 100%;
          opacity: 0.9;
        }
        .dlg-art .studio-tag {
          position: absolute;
          left: 26px;
          bottom: 24px;
          z-index: 2;
          padding: 8px 14px;
          background: var(--white);
          border-radius: 999px;
          font: 500 10.5px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink);
          box-shadow: 0 4px 12px rgba(12, 12, 12, 0.08);
        }
        .dlg-main {
          overflow-y: auto !important;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          height: 100%;
          max-height: 100%;
          min-height: 0;
          padding: 40px 40px 36px;
          display: grid;
          align-content: start;
          gap: 22px;
        }
        .dlg-main::-webkit-scrollbar {
          width: 6px;
        }
        .dlg-main::-webkit-scrollbar-track {
          background: transparent;
        }
        .dlg-main::-webkit-scrollbar-thumb {
          background: rgba(12, 12, 12, 0.25);
          border-radius: 4px;
        }
        .dlg-main::-webkit-scrollbar-thumb:hover {
          background: var(--red);
        }
        .dlg-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }
        .dlg-main h2 {
          font: 600 44px/1 var(--font-serif);
          margin: 6px 0 0;
          color: var(--ink);
        }
        .close {
          flex: 0 0 auto;
          height: 38px;
          padding: 0 16px;
          background: none;
          border: 1px solid var(--black);
          border-radius: 999px;
          cursor: pointer;
          font: 500 10.5px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink);
          transition: background-color 240ms ease, color 240ms ease;
        }
        .close:hover {
          background: var(--black);
          color: var(--white);
        }
        .facts {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          margin: 0;
          padding: 0;
        }
        .facts div {
          padding: 14px 0;
        }
        .facts div + div {
          padding-left: 16px;
          border-left: 1px solid var(--rule);
        }
        .facts dt {
          font: 500 10px/1 var(--font-sans);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .facts dd {
          margin: 8px 0 0;
          font-size: 15px;
          color: var(--ink);
          font-weight: 500;
        }
        .dlg-main p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--muted);
          margin: 0;
        }
        .dlg-main h4 {
          font: 500 10.5px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin: 0 0 10px;
          color: var(--ink);
        }
        .dlg-main ul {
          display: grid;
          gap: 8px;
          font-size: 15px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .dlg-main li {
          padding-left: 18px;
          position: relative;
          color: var(--ink);
          line-height: 1.5;
        }
        .dlg-main li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.62em;
          width: 6px;
          height: 6px;
          background: var(--red);
          border-radius: 58% 42% 52% 48% / 46% 56% 44% 54%;
        }
        .enquire {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          align-self: start;
          height: 52px;
          padding: 0 32px;
          overflow: hidden;
          isolation: isolate;
          border-radius: 999px;
          background: var(--red);
          color: var(--white);
          font: 500 12px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          border: 0;
          cursor: pointer;
        }
        .enquire::before {
          content: "";
          position: absolute;
          z-index: -1;
          left: -15%;
          right: -15%;
          top: 100%;
          height: 160%;
          background: var(--black);
          border-radius: 45% 55% 40% 60% / 50% 40% 60% 50%;
          transition: top 620ms var(--ease);
        }
        .enquire:hover::before,
        .enquire:focus-visible::before {
          top: -35%;
          animation: morph 4s ease-in-out infinite;
        }
        .note {
          font-size: 12px;
          line-height: 1.5;
          color: var(--muted);
          margin: 0;
        }

        .dlg-faqs {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--rule);
        }
        .dlg-faqs h4 {
          font: 500 11px/1 var(--font-sans);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 12px;
        }
        .dlg-faqs .faq-question {
          font-size: 19px;
        }
        .dlg-faqs .faq-trigger {
          padding: 16px 0;
        }
        .dlg-faqs .faq-plus {
          width: 30px;
          height: 30px;
          font-size: 18px;
        }
        .dlg-faqs .faq-answer-panel {
          padding: 0 16px 18px 28px;
        }
        .dlg-full-page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          padding: 0 28px;
          border-radius: 999px;
          border: 1px solid var(--rule);
          background: transparent;
          color: var(--ink);
          font: 500 11.5px/1 var(--font-sans);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 220ms ease;
        }
        .dlg-full-page-btn:hover {
          background: var(--ink);
          color: var(--white);
          border-color: var(--ink);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 960px) {
          .marble-slot {
            width: 100%;
            opacity: 0.7;
          }
          .dlg {
            display: flex;
            flex-direction: column;
            max-height: min(92vh, 880px);
            height: 100%;
            overflow: hidden;
          }
          .dlg-art {
            flex: 0 0 200px;
            min-height: 200px;
            max-height: 200px;
          }
          .dlg-art .marble-slot {
            position: absolute;
            inset: 0;
          }
          .dlg-main {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            max-height: calc(min(92vh, 880px) - 200px);
            padding: 30px 24px 28px;
          }
        }

        @media (max-width: 640px) {
          .head {
            padding: 130px 0 56px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .facts {
            grid-template-columns: 1fr;
          }
          .facts div + div {
            padding-left: 0;
            border-left: 0;
            border-top: 1px solid var(--rule);
          }
          .course-dialog-backdrop {
            padding: 0;
            z-index: 99999;
          }
          .course-dialog {
            width: 100vw;
            max-width: 100vw;
            height: 100%;
            height: 100dvh;
            max-height: 100dvh;
            border-radius: 0;
          }
          .dlg {
            max-height: 100dvh;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .dlg-art {
            flex: 0 0 170px;
            min-height: 170px;
            max-height: 170px;
          }
          .dlg-main {
            flex: 1 1 auto;
            min-height: 0;
            height: calc(100dvh - 170px);
            max-height: calc(100dvh - 170px);
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            padding: 24px 20px 32px;
          }
          .dlg-main h2 {
            font-size: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition-duration: 1ms !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
