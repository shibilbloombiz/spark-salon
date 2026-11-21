'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import './Navbar.css';
import { markBookingClickHandled } from '@/components/booking/AppointmentRequestDialog';

interface NavbarProps {
  onOpenBooking?: () => void;
  isRevealed?: boolean;
}

const SERVICES_LIST = [
  { slug: 'hair', name: 'Hair', num: '01' },
  { slug: 'beard-grooming', name: 'Beard & Grooming', num: '02' },
  { slug: 'nail', name: 'Nail', num: '03' },
  { slug: 'face', name: 'Face', num: '04' },
  { slug: 'waxing', name: 'Waxing', num: '05' },
  { slug: 'bridal', name: 'Bridal', num: '06' },
  { slug: 'spa', name: 'Spa', num: '07' },
  { slug: 'tattoo', name: 'Tattoo', num: '08' },
];

const ACADEMY_COURSES = [
  { slug: 'hair-couture-balayage', name: 'Hair Couture & Balayage' },
  { slug: 'hd-bridal-makeover', name: 'HD Bridal & Makeover' },
  { slug: 'russian-manicure', name: 'Russian E-File Manicure' },
  { slug: 'clinical-aesthetic-skin', name: 'Clinical Aesthetic Skin' },
];

export default function Navbar({ onOpenBooking, isRevealed = true }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubServices, setMobileSubServices] = useState(false);
  const [mobileSubAcademy, setMobileSubAcademy] = useState(false);

  const mainNavRef = useRef<HTMLElement>(null);
  const navBlobRef = useRef<HTMLSpanElement>(null);

  const activeRoute =
    pathname.startsWith('/services') || pathname.startsWith('/studio')
      ? 'services'
      : pathname.startsWith('/products')
        ? 'products'
        : pathname.startsWith('/academy')
          ? 'academy'
          : pathname.startsWith('/contact')
            ? 'contact'
            : 'home';

  const activeRouteRef = useRef<string>(activeRoute);
  activeRouteRef.current = activeRoute;

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll and pause Lenis while mobile menu is open
  useEffect(() => {
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    if (mobileOpen) {
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
  }, [mobileOpen]);

  // Scroll listener for .is-scrolled class
  useEffect(() => {
    const handleScroll = () => {
      const isPast = window.scrollY > 24;
      setScrolled(isPast);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update nav-blob positioning
  const updateBlob = useCallback((targetEl: HTMLElement | null) => {
    const blob = navBlobRef.current;
    const nav = mainNavRef.current;
    if (!blob || !nav) return;

    if (!targetEl || window.innerWidth <= 960) {
      blob.classList.remove('is-visible');
      nav.querySelectorAll('.nav-link').forEach((el) => el.classList.remove('is-covered'));
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = targetEl.getBoundingClientRect();

    blob.style.width = `${linkRect.width}px`;
    blob.style.transform = `translate3d(${linkRect.left - navRect.left}px, 0, 0)`;
    blob.classList.add('is-visible');

    nav.querySelectorAll('.nav-link').forEach((el) => {
      if (el === targetEl) {
        el.classList.add('is-covered');
      } else {
        el.classList.remove('is-covered');
      }
    });
  }, []);

  const resetBlobToActive = useCallback(() => {
    if (!mainNavRef.current) return;
    const activeLink = mainNavRef.current.querySelector<HTMLElement>(`[data-route="${activeRouteRef.current}"]`);
    updateBlob(activeLink);
  }, [updateBlob]);

  useEffect(() => {
    resetBlobToActive();
    const handleResize = () => resetBlobToActive();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeRoute, resetBlobToActive]);

  // Close menus on click outside or ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBooking = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      markBookingClickHandled(e.nativeEvent);
    }
    setMobileOpen(false);
    setOpenDropdown(null);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.getElementById('final-cta') || document.getElementById('book');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}
        id="siteNav"
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'none' : 'translateY(-16px)',
          pointerEvents: isRevealed ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, transform 0.4s var(--ease-liquid)',
        }}
      >
        <div className="bar">
          {/* Left: Spark Logo Image */}
          <Link href="/" prefetch={false} className="brand" aria-label="Spark International Salon, home">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <picture>
                <source srcSet="/images/logo-emblem-crop.webp" type="image/webp" />
                <img
                  src="/images/logo-emblem-crop.png"
                  alt="Spark Logo"
                  width={36}
                  height={36}
                  loading="eager"
                  decoding="async"
                  style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </picture>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span className="brand-name">Spark</span>
                <span className="brand-sub">Salon &amp; Beauty Mall</span>
              </div>
            </div>
          </Link>

          {/* Center: Main Navigation */}
          <nav
            ref={mainNavRef}
            className="main-nav"
            id="mainNav"
            aria-label="Main"
            onPointerLeave={resetBlobToActive}
          >
            <span ref={navBlobRef} className="nav-blob" id="navBlob" aria-hidden="true" />

            {/* Home */}
            <div className="nav-item">
              <Link
                href="/"
                prefetch={false}
                className={`nav-link ${activeRoute === 'home' ? 'is-active' : ''}`}
                data-route="home"
                onPointerEnter={(e) => updateBlob(e.currentTarget)}
                onFocus={(e) => updateBlob(e.currentTarget)}
              >
                Home
              </Link>
            </div>

            {/* Services (Dropdown) */}
            <div
              className={`nav-item has-menu ${openDropdown === 'services' ? 'is-open' : ''}`}
              data-menu
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`nav-link nav-trigger ${activeRoute === 'services' ? 'is-active' : ''}`}
                type="button"
                aria-expanded={openDropdown === 'services'}
                aria-controls="menu-services"
                aria-haspopup="true"
                data-route="services"
                onClick={() => router.push('/services')}
                onPointerEnter={(e) => updateBlob(e.currentTarget)}
                onFocus={(e) => updateBlob(e.currentTarget)}
              >
                Services <span className="caret" aria-hidden="true" />
              </button>

              <div className="dropdown dropdown-services" id="menu-services">
                <p className="dd-label">Services</p>
                <ul className="svc-grid">
                  {SERVICES_LIST.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        prefetch={false}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="svc-no">{s.num}</span>
                        <span className="svc-name">{s.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Products */}
            <div className="nav-item">
              <Link
                href="/products"
                prefetch={false}
                className={`nav-link ${activeRoute === 'products' ? 'is-active' : ''}`}
                data-route="products"
                onPointerEnter={(e) => updateBlob(e.currentTarget)}
                onFocus={(e) => updateBlob(e.currentTarget)}
              >
                Products
              </Link>
            </div>

            {/* Academy (Dropdown) */}
            <div
              className={`nav-item has-menu ${openDropdown === 'academy' ? 'is-open' : ''}`}
              data-menu
              onMouseEnter={() => setOpenDropdown('academy')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`nav-link nav-trigger ${activeRoute === 'academy' ? 'is-active' : ''}`}
                type="button"
                aria-expanded={openDropdown === 'academy'}
                aria-controls="menu-academy"
                aria-haspopup="true"
                data-route="academy"
                onClick={() => router.push('/academy')}
                onPointerEnter={(e) => updateBlob(e.currentTarget)}
                onFocus={(e) => updateBlob(e.currentTarget)}
              >
                Academy <span className="caret" aria-hidden="true" />
              </button>

              <div className="dropdown dropdown-academy" id="menu-academy">
                <ul>
                  <li>
                    <Link href="/academy" prefetch={false} onClick={() => setOpenDropdown(null)}>
                      All Programmes
                    </Link>
                  </li>
                  {ACADEMY_COURSES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/academy#course-${c.slug}`}
                        prefetch={false}
                        onClick={() => {
                          setOpenDropdown(null);
                          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/academy')) {
                            window.location.hash = `course-${c.slug}`;
                          }
                        }}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="nav-item">
              <Link
                href="/contact"
                prefetch={false}
                className={`nav-link ${activeRoute === 'contact' ? 'is-active' : ''}`}
                data-route="contact"
                onPointerEnter={(e) => updateBlob(e.currentTarget)}
                onFocus={(e) => updateBlob(e.currentTarget)}
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Right: Actions (Book Appointment CTA + Mobile Hamburger) */}
          <div className="actions">
            <button
              className="cta"
              data-open="appt"
              onClick={handleBooking}
              type="button"
            >
              <span className="cta-full">Book Appointment</span>
              <span className="cta-short">Book</span>
            </button>

            <button
              className="menu-btn"
              id="menuBtn"
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mPanel"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="menu-lines" aria-hidden="true">
                <i />
                <i />
              </span>
              <span className="menu-label">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop Scrim */}
      <div
        className={`m-scrim ${mobileOpen ? 'is-visible' : ''}`}
        id="mScrim"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        data-lenis-prevent
      />

      {/* Mobile Menu Sheet (< 960px) */}
      <aside
        className={`m-panel ${mobileOpen ? 'is-visible' : ''}`}
        id="mPanel"
        aria-label="Site menu"
        data-lenis-prevent
      >
        <div className="m-head">
          <Link href="/" prefetch={false} className="brand" onClick={() => setMobileOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <picture>
                <source srcSet="/images/logo-emblem-crop-white.webp" type="image/webp" />
                <img
                  src="/images/logo-emblem-crop-white.png"
                  alt="Spark Logo"
                  width={30}
                  height={30}
                  loading="eager"
                  decoding="async"
                  style={{ height: '30px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </picture>
              <span className="brand-name" style={{ color: 'var(--white)' }}>Spark</span>
            </div>
          </Link>
          <button className="m-close" id="mClose" type="button" onClick={() => setMobileOpen(false)}>
            Close
          </button>
        </div>

        <nav className="m-nav" aria-label="Mobile">
          <Link href="/" prefetch={false} onClick={() => setMobileOpen(false)}>
            Home
          </Link>

          <button
            className="m-toggle"
            type="button"
            aria-expanded={mobileSubServices}
            onClick={() => setMobileSubServices(!mobileSubServices)}
          >
            Services <span className="caret" aria-hidden="true" />
          </button>
          <div className={`m-sub ${mobileSubServices ? 'is-open' : ''}`} id="m-services">
            <div>
              <ul>
                <li>
                  <Link href="/services" prefetch={false} onClick={() => setMobileOpen(false)}>
                    All Services
                  </Link>
                </li>
                {SERVICES_LIST.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} prefetch={false} onClick={() => setMobileOpen(false)}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link href="/products" prefetch={false} onClick={() => setMobileOpen(false)}>
            Products
          </Link>

          <button
            className="m-toggle"
            type="button"
            aria-expanded={mobileSubAcademy}
            onClick={() => setMobileSubAcademy(!mobileSubAcademy)}
          >
            Academy <span className="caret" aria-hidden="true" />
          </button>
          <div className={`m-sub ${mobileSubAcademy ? 'is-open' : ''}`} id="m-academy">
            <div>
              <ul>
                <li>
                  <Link href="/academy" prefetch={false} onClick={() => setMobileOpen(false)}>
                    All Programmes
                  </Link>
                </li>
                {ACADEMY_COURSES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/academy#course-${c.slug}`}
                      prefetch={false}
                      onClick={() => {
                        setMobileOpen(false);
                        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/academy')) {
                          window.location.hash = `course-${c.slug}`;
                        }
                      }}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/contact"
            prefetch={false}
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
        </nav>

        <button
          className="btn btn-red m-book"
          data-open="appt"
          onClick={handleBooking}
          type="button"
        >
          Book Appointment
        </button>
      </aside>
    </>
  );
}
