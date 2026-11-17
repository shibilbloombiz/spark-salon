'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSiteShell } from '@/components/layout/SiteShell';
import { markBookingClickHandled } from '@/components/booking/AppointmentRequestDialog';
import UniversalVideo from '@/components/video/UniversalVideo';
import { resolveVideoPosterUrl, parseVideoUrl } from '@/lib/videoUtils';
import type { ServiceDetailData, SiteData } from '@/lib/data/serviceDetailData';
import { STUDIOS_DATA, type StudioData } from '@/lib/data/studios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './service-detail.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StudioPageClientProps {
  service: ServiceDetailData;
  site: SiteData;
}

type StudioSlug = 'hair' | 'beard-grooming' | 'nail' | 'face' | 'waxing' | 'bridal' | 'spa' | 'tattoo';

interface UnifiedStudio extends StudioData {
  bannerImage?: string;
  coverImage?: string;
  servicesImage?: string;
  servicesVideo?: string;
}

interface UnifiedService {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  video: string | null;
  benefits?: string[];
}

interface UnifiedArtist {
  id: string;
  name: string;
  designation: string;
  speciality: string;
  skills: string[];
  experience: string;
  biography: string;
  profileImage: string;
  portfolio: string[];
}

const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function splitIntoLines(name: string): string[] {
  const words = name.split(' ');
  const c = Math.min(3, Math.max(1, Math.ceil(words.length / 2)));
  const per = Math.ceil(words.length / c);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += per) {
    out.push(words.slice(i, i + per).join(' '));
  }
  return out;
}

export default function StudioPageClient({ service, site }: StudioPageClientProps) {
  // Normalize slug to match STUDIOS_DATA
  const normalizedSlug = (
    service.slug === 'facial' ? 'face' : service.slug === 'grooming' ? 'beard-grooming' : service.slug
  );
  const slugKey: StudioSlug = (normalizedSlug in STUDIOS_DATA ? normalizedSlug : 'hair') as StudioSlug;
  const staticStudio = STUDIOS_DATA[slugKey] || STUDIOS_DATA.hair;

  // Live database data fetched from MongoDB via Express backend
  const [dbData, setDbData] = useState<{
    studio?: any;
    services?: any[];
    artists?: any[];
    media?: any[];
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/studios/${slugKey}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.studio && isMounted) {
          setDbData(data);
        }
      })
      .catch((e) => console.warn('Could not load live studio data:', e));
    return () => {
      isMounted = false;
    };
  }, [slugKey]);

  // Derived studio data (merging live DB with visual defaults)
  const studio: UnifiedStudio = useMemo(() => {
    if (!dbData?.studio) {
      return {
        ...staticStudio,
        bannerImage: staticStudio.heroMedia?.url,
        coverImage: staticStudio.heroMedia?.url,
        servicesImage: '',
        servicesVideo: '',
      };
    }
    return {
      ...staticStudio,
      name: dbData.studio.name || staticStudio.name,
      eyebrow: staticStudio.eyebrow,
      description: dbData.studio.description || dbData.studio.shortDescription || staticStudio.description,
      bannerImage: dbData.studio.bannerImage || staticStudio.heroMedia?.url,
      coverImage: dbData.studio.coverImage || staticStudio.heroMedia?.url,
      servicesImage: dbData.studio.servicesImage || '',
      servicesVideo: dbData.studio.servicesVideo || '',
    };
  }, [dbData, staticStudio]);

  // Derived services (live DB services replace static array when available)
  const isVideoAsset = useCallback((u?: string | null): boolean => {
    const val = (u || '').trim();
    if (!val) return false;
    if (/\.(mp4|webm|mov|m4v|ogv|ogg)(?:[?#].*)?$/i.test(val)) return true;
    const p = parseVideoUrl(val);
    return p.platform === 'youtube' || p.platform === 'vimeo' || p.platform === 'instagram';
  }, []);

  const services: UnifiedService[] = useMemo(() => {
    if (dbData?.services && dbData.services.length > 0) {
      return dbData.services.map((s, idx) => {
        const imgs: string[] = Array.isArray(s.images) ? s.images.filter(Boolean) : [];
        const firstVideoInImages = imgs.find((u) => isVideoAsset(u)) || null;
        const firstImageOnly = imgs.find((u) => !isVideoAsset(u)) || '';
        const resolvedVideo = (s.videoUrl && s.videoUrl.trim()) || firstVideoInImages || (studio.servicesVideo || null);
        const resolvedImage = firstImageOnly || (studio.servicesImage || '') || staticStudio.services[idx % staticStudio.services.length]?.image || '/images/gallery/signature-brunette.webp';
        return {
          id: s._id || s.slug || `db-svc-${idx}`,
          index: String(idx + 1).padStart(2, '0'),
          name: s.name,
          tagline: s.description ? s.description.slice(0, 90) : '',
          description: s.description || '',
          duration: s.duration || '60 mins',
          price: typeof s.price === 'number' ? `₹${s.price.toLocaleString('en-IN')}` : (s.price || 'By Consultation'),
          image: resolvedImage,
          video: resolvedVideo,
        };
      });
    }
    return (staticStudio.services || []).map((s, idx) => ({
      id: s.id || `svc-${idx}`,
      index: String(idx + 1).padStart(2, '0'),
      name: s.name,
      tagline: s.description ? s.description.slice(0, 90) : '',
      description: s.description || '',
      duration: s.duration || '60 mins',
      price: s.price || 'By Consultation',
      image: (studio.servicesImage || '') || s.image || '/images/gallery/signature-brunette.webp',
      video: (studio.servicesVideo || null),
      benefits: s.benefits,
    }));
  }, [dbData, staticStudio, studio.servicesImage, studio.servicesVideo, isVideoAsset]);

  const renderServiceVisual = (s: UnifiedService, idx: number, eager: boolean) => {
    if (s.video) {
      return (
        <UniversalVideo
          videoUrl={s.video}
          poster={s.image || undefined}
          objectFit="cover"
          title={s.name}
          autoplay={true}
          loop={true}
          muted={true}
        />
      );
    }
    if (s.image) {
      return <img src={s.image} alt={s.name} loading={eager ? 'eager' : 'lazy'} />;
    }
    return (
      <div
        className="marble-slot"
        style={{
          opacity: 1,
          background: `radial-gradient(circle at 35% 30%, #c8102e 0%, #3a040b 50%, #0c0c0c 100%)`,
          borderRadius: '8px 40px 8px 40px',
        }}
      />
    );
  };

  // Derived artists (live DB artists replace static array when available)
  const artists: UnifiedArtist[] = useMemo(() => {
    if (dbData?.artists && dbData.artists.length > 0) {
      return dbData.artists.map((a, idx) => ({
        id: a._id || a.slug || `db-artist-${idx}`,
        name: a.name,
        designation: a.designation || 'Master Artist',
        speciality: Array.isArray(a.specialities) ? a.specialities.join(' · ') : (a.speciality || 'Couture Craft'),
        skills: Array.isArray(a.specialities) ? a.specialities : [],
        experience: a.experience || 'Master Artisan',
        biography: a.bio || '',
        profileImage: a.profileImage || staticStudio.artists[idx % staticStudio.artists.length]?.profileImage || '/images/artists/byju-portrait.jpg',
        portfolio: Array.isArray(a.portfolio) ? a.portfolio : [],
      }));
    }
    return (staticStudio.artists || []).map((a, idx) => ({
      id: a.id || `artist-${idx}`,
      name: a.name,
      designation: a.designation || 'Master Artist',
      speciality: a.speciality || 'Couture Craft',
      skills: a.skills || [],
      experience: a.experience || 'Master Artisan',
      biography: a.biography || '',
      profileImage: a.profileImage || '/images/artists/byju-portrait.jpg',
      portfolio: a.portfolio || [],
    }));
  }, [dbData, staticStudio]);

  // Studio Hero Image computed from live DB or fallback
  const studioHeroImage = useMemo(() => {
    if (studio.bannerImage) return studio.bannerImage;
    if (studio.coverImage) return studio.coverImage;
    if (studio.heroMedia?.url) return studio.heroMedia.url;
    const defaults: Record<StudioSlug, string> = {
      'beard-grooming': '/images/services/beard-grooming.jpg',
      hair: '/images/services/hair-couture.jpg',
      nail: '/images/services/nail-detailing.jpg',
      face: '/images/services/skin-waxing.jpg',
      waxing: '/images/services/skin-waxing.jpg',
      bridal: '/images/services/bridal-masterpiece.jpg',
      spa: '/images/services/spa-wellness.jpg',
      tattoo: '/images/services/custom-tattoo.jpg',
    };
    return defaults[slugKey] || '/images/services/hair-couture.jpg';
  }, [studio, slugKey]);

  // Dialog State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeArtistIndex, setActiveArtistIndex] = useState<number | null>(null);

  // Reel Refs
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLElement>(null);

  // Appointment Dialog integration with SiteShell (#apptDlg)
  const { openAppointment, registerBookingHandler, setAppointmentConfig } = useSiteShell();

  useEffect(() => {
    setAppointmentConfig({
      studioName: studio.name,
      services: services.map((s) => ({ name: s.name, price: s.price })),
      artists: artists.map((a) => ({ name: a.name, designation: a.designation })),
    });
    return () => setAppointmentConfig(null);
  }, [studio.name, services, artists, setAppointmentConfig]);

  const openAppt = useCallback(
    (opts?: { service?: number; artist?: number; trigger?: HTMLElement | null; event?: Event }) => {
      markBookingClickHandled(opts?.event);
      openAppointment({
        service: opts?.service,
        artist: opts?.artist,
        trigger: opts?.trigger,
      });
    },
    [openAppointment]
  );

  useEffect(() => registerBookingHandler(() => openAppt()), [registerBookingHandler, openAppt]);

  // Keyboard navigation for studio dialogs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeArtistIndex !== null) setActiveArtistIndex(null);
        else if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArtistIndex, mobileMenuOpen]);

  // Lock body scroll & pause Lenis when artist or mobile menu is open
  useEffect(() => {
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    if (activeArtistIndex !== null || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop?.();
    } else {
      document.body.style.overflow = '';
      lenis?.start?.();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start?.();
    };
  }, [activeArtistIndex, mobileMenuOpen]);

  // GSAP Pinned Horizontal Reel Setup (runs on all screen sizes, matching windows animated scrolling model)
  useEffect(() => {
    const pinEl = pinRef.current;
    const trackEl = trackRef.current;
    const frameEl = frameRef.current;
    if (!pinEl || !trackEl || !frameEl) return;

    const N = services.length;
    if (N === 0) return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const slides = Array.from(trackEl.querySelectorAll<HTMLElement>('.slide'));
    const words = (i: number) => Array.from(slides[i]?.querySelectorAll<HTMLElement>('.in') || []);
    const copy = (i: number) => Array.from(slides[i]?.querySelectorAll<HTMLElement>('.copy') || []);
    const mediaLayers = Array.from(frameEl.querySelectorAll<HTMLElement>('.art'));

    // Ensure frame is fully visible with rounded corners
    gsap.set(frameEl, { clipPath: 'inset(0% 0% 0% 0% round 8px 40px 8px 40px)' });

    // Initial state: Slide 0 is immediately active and visible upon arriving
    slides.forEach((_, i) => {
      if (i === 0) {
        gsap.set(words(i), { yPercent: 0 });
        gsap.set(copy(i), { autoAlpha: 1, y: 0, filter: 'none' });
      } else {
        gsap.set(words(i), { yPercent: 118 });
        gsap.set(copy(i), { autoAlpha: 0, y: 26, filter: 'blur(6px)' });
      }
    });
    mediaLayers.forEach((layer, i) => {
      gsap.set(layer, { autoAlpha: i === 0 ? 1 : 0 });
    });

    const HOLD = 0.6;
    const STEP = 1.4;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const pinPerSlide = isMobile ? 0.55 : 1.05;
    const scrubVal = isMobile ? 0.2 : 0.8;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pinEl,
        start: 'top top',
        pin: true,
        scrub: scrubVal,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        end: () => `+=${Math.round(window.innerHeight * (isMobile ? (0.4 + (N - 1) * pinPerSlide) : (0.8 + (N - 1) * pinPerSlide)))}`,
      },
    });

    // Hold slide 0 initially
    tl.to({}, { duration: HOLD });

    // Transitions across slides
    for (let i = 1; i < N; i++) {
      const at = tl.duration();

      tl.to(trackEl, { xPercent: (-100 * i) / N, duration: STEP, ease: 'power2.inOut' }, at)
        .to(frameEl, { scale: 0.965, duration: STEP / 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, at);

      if (mediaLayers[i - 1]) {
        tl.to(mediaLayers[i - 1], { autoAlpha: 0, duration: STEP * 0.45, ease: 'power2.out' }, at + STEP * 0.08);
      }
      if (mediaLayers[i]) {
        tl.to(mediaLayers[i], { autoAlpha: 1, scale: 1, duration: STEP * 0.45, ease: 'power2.out' }, at + STEP * 0.15);
      }

      // Hide previous slide's typography & copy
      tl.to(words(i - 1), { yPercent: -118, duration: STEP * 0.4, ease: 'power2.in' }, at);
      tl.to(copy(i - 1), { autoAlpha: 0, duration: STEP * 0.4, ease: 'power2.in' }, at);

      // Reveal incoming slide's typography & copy
      tl.to(words(i), { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, at + 0.4)
        .to(copy(i), { autoAlpha: 1, y: 0, filter: 'none', duration: 0.85, ease: 'power2.out' }, at + 0.6);

      tl.to({}, { duration: HOLD });
    }

    // Toggle body class 'reel-on' to hide floating button when reel is pinned
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        document.body.classList.toggle('reel-on', en.isIntersecting);
      });
    }, { threshold: 0.2 });
    io.observe(pinEl);

    // Mobile touch horizontal swipe support
    let startX = 0;
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        const stepDist = window.innerHeight * pinPerSlide;
        if (dx < 0) {
          window.scrollBy({ top: stepDist, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: -stepDist, behavior: 'smooth' });
        }
      }
    };

    pinEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    pinEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      io.disconnect();
      pinEl.removeEventListener('touchstart', handleTouchStart);
      pinEl.removeEventListener('touchend', handleTouchEnd);
      document.body.classList.remove('reel-on');
    };
  }, [services]);

  return (
    <>

      <main id="top">
        {/* SECTION 01 — Cinematic Studio Hero with Full-Screen Photographic Background */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <img
              src={studioHeroImage}
              alt=""
              loading="eager"
              fetchPriority="high"
            />
          </div>

          <div className="wrap hero-wrap">
            <div className="hero-content">
              <p className="eyebrow">{studio.eyebrow || 'Studio'}</p>
              <h1>{studio.name}</h1>
              <p className="hero-lead">
                {studio.description ||
                  'Cuts, colour and treatments for hair, led by our studio artists. Choose a service below, meet the team, or request an appointment.'}
              </p>
              <div className="hero-actions">
                <button
                  className="btn"
                  type="button"
                  data-open="appt"
                  onClick={(e) => openAppt({ trigger: e.currentTarget, event: e.nativeEvent })}
                >
                  Request an appointment
                </button>
                <a className="btn ghost" href="#services">
                  View services
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02 & 03 — Studio Introduction & Facts */}
        <section className="section" id="about">
          <div className="wrap about">
            <div>
              <p className="eyebrow">About the studio</p>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                {studio.introduction?.title || 'A studio built around the chair'}
              </h2>
              <p>
                {studio.introduction?.philosophy ||
                  'Every service in this Studio is performed by a named artist, with a consultation before any treatment. Our artists also share their portfolio work, so you can see the results before you book.'}
              </p>
            </div>
            <dl className="facts">
              <div>
                <dt>Services</dt>
                <dd id="factServices">{services.length}</dd>
              </div>
              <div>
                <dt>Artists</dt>
                <dd id="factArtists">{artists.length}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* SECTION 04 & 05 — Services: Pinned Horizontal Reel (Desktop) / Swipe Rail (Mobile) */}
        <section className="reel" id="services" aria-label={`${studio.name} services`}>
          {/* Desktop Pinned Horizontal Reel */}
          <div className="pin" id="pin" ref={pinRef}>
            <p className="reel-label">{studio.slug.toUpperCase()} · SERVICES</p>

            <div
              className="reel-track"
              id="reelTrack"
              ref={trackRef}
              style={{ width: `${services.length * 100}%` }}
            >
              {services.map((s, i) => {
                const lines = splitIntoLines(s.name);
                return (
                  <article
                    key={s.id || i}
                    className="slide"
                    style={{ width: `${100 / services.length}%` }}
                  >
                    <h3 className="slide-h">
                      {lines.map((l, k) => (
                        <span key={k} className="line" style={{ paddingLeft: `${k * 0.7}em` }}>
                          <span className="mask">
                            <span className="in">{l}</span>
                          </span>
                        </span>
                      ))}
                    </h3>

                    <div className="copy">
                      <p>{s.description}</p>
                      <dl>
                        <div>
                          <dt>Time</dt>
                          <dd>{s.duration}</dd>
                        </div>
                        <div>
                          <dt>Price</dt>
                          <dd>{s.price}</dd>
                        </div>
                      </dl>
                      <button
                        className="btn book"
                        type="button"
                        data-open="appt"
                        data-service={String(i)}
                        onClick={(e) => openAppt({ service: i, trigger: e.currentTarget, event: e.nativeEvent })}
                      >
                        Book this service
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pinned Central Portrait Frame */}
            <figure className="frame" id="frame" ref={frameRef} aria-hidden="true">
              {services.map((s, idx) => (
                <div key={idx} className="art" style={{ opacity: idx === 0 ? 1 : 0 }}>
                  {renderServiceVisual(s, idx, idx === 0)}
                </div>
              ))}
              <span className="frame-tag">{studio.name}</span>
            </figure>
          </div>
        </section>

        {/* SECTION 07 — Artists / Stylists (Liquid Rising Wave Hover Cards) */}
        <section className="section" id="artists">
          <div className="wrap">
            <div className="artists-head">
              <div>
                <p className="eyebrow">Artists</p>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Meet the artists
                </h2>
              </div>
            </div>

            <div className="artist-grid" id="artistGrid">
              {artists.map((a, i) => {
                const tone = i % 2 === 1 ? 'red' : 'black';
                return (
                  <button
                    key={a.id || i}
                    className="card"
                    type="button"
                    data-tone={tone}
                    aria-label={`${a.name}, view profile`}
                    onClick={() => setActiveArtistIndex(i)}
                  >
                    {/* Double SVG Rising Liquid Wave */}
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

                    <div className="card-art">
                      {a.profileImage ? (
                        <img src={a.profileImage} alt={a.name} loading="lazy" />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: tone === 'red'
                              ? 'radial-gradient(circle at 35% 30%, #c8102e 0%, #3a040b 55%, #0c0c0c 100%)'
                              : 'radial-gradient(circle at 35% 30%, #2a2a2e 0%, #161618 55%, #0c0c0c 100%)',
                          }}
                        />
                      )}
                    </div>

                    <div className="card-body">
                      <span className="card-role">{a.designation}</span>
                      <h3>{a.name}</h3>
                      <p className="card-meta">
                        {Array.isArray(a.skills) && a.skills.length > 0
                          ? a.skills.slice(0, 3).join(' · ')
                          : a.speciality}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 08 — Ready When You Are CTA Band */}
        <div className="cta-band section">
          <span className="liquid-cap" aria-hidden="true" />
          <div className="wrap">
            <div className="cta-copy">
              <p className="eyebrow">Ready when you are</p>
              <h2 className="h-section">Book your next visit.</h2>
            </div>
          </div>
          <div className="cta-actions">
            <button
              className="btn cta-band-btn"
              type="button"
              data-open="appt"
              onClick={(e) => openAppt({ trigger: e.currentTarget, event: e.nativeEvent })}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </main>

      {/* DIALOG 1 — Artist Profile Dialog (#artistDlg) */}
      {activeArtistIndex !== null && artists[activeArtistIndex] && (
        <>
          <div className="dlg-backdrop-fixed" data-lenis-prevent onClick={() => setActiveArtistIndex(null)} />
          <dialog
            open
            id="artistDlg"
            aria-labelledby="artistName"
            data-lenis-prevent
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveArtistIndex(null);
            }}
          >
          <div className="dlg-head">
            <div>
              <p className="eyebrow" id="artistRole">{artists[activeArtistIndex].designation}</p>
              <h2 id="artistName">{artists[activeArtistIndex].name}</h2>
            </div>
            <button className="close" type="button" onClick={() => setActiveArtistIndex(null)}>
              Close
            </button>
          </div>

          <div className="dlg-body" id="artistBody" data-lenis-prevent>
            <div className="dlg-cols">
              <div className="dlg-art">
                {artists[activeArtistIndex].profileImage ? (
                  <img
                    src={artists[activeArtistIndex].profileImage}
                    alt={artists[activeArtistIndex].name}
                  />
                ) : (
                  <div
                    className="marble-slot"
                    style={{
                      opacity: 1,
                      background: 'radial-gradient(circle at 35% 30%, #c8102e 0%, #3a040b 55%, #0c0c0c 100%)',
                      borderRadius: '8px 40px 8px 40px',
                    }}
                  />
                )}
                <span className="frame-tag">{artists[activeArtistIndex].name}</span>
              </div>

              <div>
                <div className="block">
                  <h4>Studios</h4>
                  <div className="tags">
                    <span>{studio.name}</span>
                  </div>
                </div>

                <div className="block">
                  <h4>Specialities</h4>
                  <div className="tags">
                    {Array.isArray(artists[activeArtistIndex].skills) && artists[activeArtistIndex].skills.length > 0
                      ? artists[activeArtistIndex].skills.map((s, idx) => <span key={idx}>{s}</span>)
                      : <span>{artists[activeArtistIndex].speciality}</span>}
                  </div>
                </div>

                <div className="block">
                  <h4>Biography</h4>
                  <p>{artists[activeArtistIndex].biography || 'Master artist specializing in couture salon craft.'}</p>
                </div>

                <dl className="dlg-meta">
                  <div>
                    <dt>Experience</dt>
                    <dd>{artists[activeArtistIndex].experience || '10+ Years Experience'}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{artists[activeArtistIndex].designation}</dd>
                  </div>
                </dl>

                <div className="block">
                  <button
                    className="btn"
                    type="button"
                    data-open="appt"
                    data-artist={String(activeArtistIndex)}
                    onClick={(e) => {
                      const curIdx = activeArtistIndex;
                      const nativeEvent = e.nativeEvent;
                      setActiveArtistIndex(null);
                      openAppt({ artist: curIdx, event: nativeEvent });
                    }}
                  >
                    Request with {artists[activeArtistIndex].name}
                  </button>
                </div>
              </div>
            </div>

            {/* Portfolio Grid */}
            {Array.isArray(artists[activeArtistIndex].portfolio) && artists[activeArtistIndex].portfolio.length > 0 && (
              <div className="block">
                <h4>Portfolio Works</h4>
                <div className="works">
                  {artists[activeArtistIndex].portfolio.slice(0, 3).map((imgUrl, k) => (
                    <div key={k}>
                      <img src={imgUrl} alt={`Portfolio work ${k + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </dialog>
        </>
      )}
    </>
  );
}
