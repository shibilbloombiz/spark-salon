'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Scissors,
  ShoppingBag,
  GraduationCap,
  Handshake,
  Phone,
  ChevronDown,
  X,
  ArrowRight,
  Menu,
} from 'lucide-react';
import './Navbar.css';
import { markBookingClickHandled } from '@/components/booking/AppointmentRequestDialog';

interface NavbarProps {
  onOpenBooking?: () => void;
  isRevealed?: boolean;
}

type DropdownKey = 'services' | 'store' | 'academy';

/* --------------------------------------------------------------------------
   MEGA MENU CONTENT DEFINITIONS
   -------------------------------------------------------------------------- */
const MENS_SALON = {
  title: "MEN'S SALON",
  subtitle: 'Groom. Style. Repeat.',
  image: '/images/nav/mens_salon.jpg',
  href: '/services',
  items: [
    { label: 'Haircuts & Styling', href: '/services/hair' },
    { label: 'Beard & Grooming', href: '/services/beard-grooming' },
    { label: 'Hair Treatments', href: '/services/hair' },
    { label: "Men's Facial", href: '/services/facial' },
    { label: 'Hair Colouring', href: '/services/hair' },
  ],
};

const WOMENS_SALON = {
  title: "WOMEN'S SALON",
  subtitle: 'Look Beautiful. Feel Amazing.',
  image: '/images/nav/womens_salon.jpg',
  href: '/services',
  items: [
    { label: 'Hair & Styling', href: '/services/hair' },
    { label: 'Skin & Facial', href: '/services/facial' },
    { label: 'Bridal & Makeup', href: '/services/bridal' },
    { label: 'Nail Care', href: '/services/nail' },
    { label: 'Waxing', href: '/services/waxing' },
    { label: 'Spa & Wellness', href: '/services/spa' },
  ],
};

const BEAUTY_STORE = {
  title: 'BEAUTY STORE',
  subtitle: 'Your Beauty, Our Care.',
  image: '/images/nav/beauty_store.jpg',
  href: '/products',
  items: [
    { label: 'Cosmetics & Makeup', href: '/products' },
    { label: 'Skincare Products', href: '/products' },
    { label: 'Haircare Products', href: '/products' },
    { label: 'Beauty & Personal Care', href: '/products' },
    { label: 'Professional Salon Products', href: '/products' },
  ],
};

const BEAUTY_ACADEMY = {
  title: 'BEAUTY ACADEMY',
  subtitle: 'Learn. Practice. Excel.',
  image: '/images/nav/beauty_academy.jpg',
  href: '/academy',
  items: [
    { label: 'Professional Beauty Courses', href: '/academy' },
    { label: 'Hair Styling Training', href: '/academy/hair-couture-balayage' },
    { label: 'Makeup Artist Training', href: '/academy/hd-bridal-makeover' },
    { label: 'Bridal Makeup Training', href: '/academy/hd-bridal-makeover' },
    { label: 'Professional Certification', href: '/academy/russian-manicure' },
  ],
};

export default function Navbar({ onOpenBooking, isRevealed = true }: NavbarProps) {
  const pathname = usePathname() || '/';

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<DropdownKey | null>('services');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine active route for styling
  const isHome = pathname === '/';
  const isServices = pathname.startsWith('/services') || pathname.startsWith('/studio');
  const isStore = pathname.startsWith('/products');
  const isAcademy = pathname.startsWith('/academy');
  const isPartner = pathname.startsWith('/partner');
  const isContact = pathname.startsWith('/contact');

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // Scroll listener for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and pause Lenis during mobile menu
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hover intent buffer handlers
  const handleTriggerEnter = (key: DropdownKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleTriggerLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMenuLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const handleBooking = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      markBookingClickHandled(e.nativeEvent);
    }
    setMobileOpen(false);
    setActiveDropdown(null);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.getElementById('final-cta') || document.getElementById('book');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------------
          DESKTOP FLOATING PILL NAVBAR
          ------------------------------------------------------------------ */}
      <div
        ref={wrapperRef}
        className="spark-nav-wrapper"
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateX(-50%)' : 'translateX(-50%) translateY(-14px)',
          pointerEvents: isRevealed ? 'auto' : 'none',
        }}
      >
        <header className={`spark-nav-bar ${scrolled ? 'is-scrolled' : ''}`}>
          {/* 1. Logo & Brand (Far Left) */}
          <Link
            href="/"
            className="spark-nav-brand"
            aria-label="Spark Salon & Beauty Mall Home"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="spark-brand-logo-wrap">
              <picture>
                <source srcSet="/images/logo-emblem-crop-white.webp" type="image/webp" />
                <img
                  src="/images/logo-emblem-crop-white.png"
                  alt="Spark Logo"
                  className="spark-brand-logo"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/loading/logo-white.png';
                  }}
                />
              </picture>
            </div>
            <div className="spark-brand-text">
              <span className="spark-brand-name">Spark</span>
              <span className="spark-brand-sub">SALON &amp; BEAUTY MALL</span>
            </div>
          </Link>

          {/* Thin Vertical Separator */}
          <div className="spark-brand-divider" aria-hidden="true" />

          {/* 2. Horizontal Navigation Items (Center) */}
          <nav className="spark-nav-center" aria-label="Main Navigation">
            {/* ITEM 1: HOME */}
            <div className="spark-nav-item">
              <Link
                href="/"
                className={`spark-nav-link ${isHome ? 'is-home-active' : ''}`}
                onClick={() => setActiveDropdown(null)}
              >
                HOME
              </Link>
            </div>

            {/* ITEM 2: SALON SERVICES (Mega Menu Trigger) */}
            <div
              className="spark-nav-item"
              onMouseEnter={() => handleTriggerEnter('services')}
              onMouseLeave={handleTriggerLeave}
            >
              <button
                type="button"
                className={`spark-nav-link ${
                  isServices ? 'is-active' : ''
                } ${activeDropdown === 'services' ? 'is-dropdown-open' : ''}`}
                aria-expanded={activeDropdown === 'services'}
                aria-haspopup="true"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'services' ? null : 'services')
                }
              >
                <span>SALON SERVICES</span>
                <ChevronDown size={14} className="spark-nav-chevron" />
              </button>
            </div>

            {/* ITEM 3: BEAUTY STORE (Mega Menu Trigger) */}
            <div
              className="spark-nav-item"
              onMouseEnter={() => handleTriggerEnter('store')}
              onMouseLeave={handleTriggerLeave}
            >
              <button
                type="button"
                className={`spark-nav-link ${
                  isStore ? 'is-active' : ''
                } ${activeDropdown === 'store' ? 'is-dropdown-open' : ''}`}
                aria-expanded={activeDropdown === 'store'}
                aria-haspopup="true"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'store' ? null : 'store')
                }
              >
                <span>BEAUTY STORE</span>
                <ChevronDown size={14} className="spark-nav-chevron" />
              </button>
            </div>

            {/* ITEM 4: BEAUTY ACADEMY (Mega Menu Trigger) */}
            <div
              className="spark-nav-item"
              onMouseEnter={() => handleTriggerEnter('academy')}
              onMouseLeave={handleTriggerLeave}
            >
              <button
                type="button"
                className={`spark-nav-link ${
                  isAcademy ? 'is-active' : ''
                } ${activeDropdown === 'academy' ? 'is-dropdown-open' : ''}`}
                aria-expanded={activeDropdown === 'academy'}
                aria-haspopup="true"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'academy' ? null : 'academy')
                }
              >
                <span>BEAUTY ACADEMY</span>
                <ChevronDown size={14} className="spark-nav-chevron" />
              </button>
            </div>

            {/* ITEM 5: PARTNER WITH US */}
            <div className="spark-nav-item">
              <Link
                href="/partner"
                className={`spark-nav-link ${isPartner ? 'is-active' : ''}`}
                onClick={() => setActiveDropdown(null)}
              >
                PARTNER WITH US
              </Link>
            </div>

            {/* ITEM 6: CONTACT */}
            <div className="spark-nav-item">
              <Link
                href="/contact"
                className={`spark-nav-link ${isContact ? 'is-active' : ''}`}
                onClick={() => setActiveDropdown(null)}
              >
                CONTACT
              </Link>
            </div>
          </nav>

          {/* 3. Action Buttons (Right) */}
          <div className="spark-nav-right">
            <button
              type="button"
              className="spark-book-btn"
              onClick={handleBooking}
            >
              BOOK APPOINTMENT
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="spark-mobile-toggle"
              aria-label="Open mobile menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* ------------------------------------------------------------------
            MEGA MENU 1: SALON SERVICES (Desktop 3-Column Layout)
            ------------------------------------------------------------------ */}
        {activeDropdown === 'services' && (
          <div
            className="spark-mega-menu spark-mega-services"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            {/* AREA 1 — MEN'S SALON */}
            <div className="spark-mega-col">
              <div className="spark-mega-img-wrap">
                <img
                  src={MENS_SALON.image}
                  alt="Men's Salon"
                  className="spark-mega-img"
                  loading="lazy"
                />
              </div>
              <div className="spark-mega-content">
                <Link
                  href={MENS_SALON.href}
                  className="spark-mega-title"
                  onClick={() => setActiveDropdown(null)}
                >
                  {MENS_SALON.title}
                </Link>
                <p className="spark-mega-sub">{MENS_SALON.subtitle}</p>
                <div className="spark-mega-divider" />
                <ul className="spark-mega-list">
                  {MENS_SALON.items.map((item) => (
                    <li key={item.label} className="spark-mega-item">
                      <Link
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="spark-mega-bullet">&rsaquo;</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AREA 2 — WOMEN'S SALON */}
            <div className="spark-mega-col">
              <div className="spark-mega-img-wrap">
                <img
                  src={WOMENS_SALON.image}
                  alt="Women's Salon"
                  className="spark-mega-img"
                  loading="lazy"
                />
              </div>
              <div className="spark-mega-content">
                <Link
                  href={WOMENS_SALON.href}
                  className="spark-mega-title"
                  onClick={() => setActiveDropdown(null)}
                >
                  {WOMENS_SALON.title}
                </Link>
                <p className="spark-mega-sub">{WOMENS_SALON.subtitle}</p>
                <div className="spark-mega-divider" />
                <ul className="spark-mega-list">
                  {WOMENS_SALON.items.map((item) => (
                    <li key={item.label} className="spark-mega-item">
                      <Link
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="spark-mega-bullet">&rsaquo;</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AREA 3 — PROMOTIONAL BANNER */}
            <div className="spark-mega-promo">
              <img
                src="/images/nav/promo_scissors.jpg"
                alt="Salon Aesthetics"
                className="spark-mega-promo-bg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <h3 className="spark-mega-promo-title">
                Premium Salon
                <br />
                Experience
              </h3>
              <p className="spark-mega-promo-sub">Beauty Beyond Limits</p>
              <Link
                href="/services"
                className="spark-mega-promo-btn"
                onClick={() => setActiveDropdown(null)}
              >
                <span>Explore Services</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            MEGA MENU 2: BEAUTY STORE
            ------------------------------------------------------------------ */}
        {activeDropdown === 'store' && (
          <div
            className="spark-mega-menu spark-mega-standard align-store"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="spark-mega-col">
              <div className="spark-mega-img-wrap">
                <img
                  src={BEAUTY_STORE.image}
                  alt="Beauty Store"
                  className="spark-mega-img"
                  loading="lazy"
                />
              </div>
              <div className="spark-mega-content">
                <Link
                  href={BEAUTY_STORE.href}
                  className="spark-mega-title"
                  onClick={() => setActiveDropdown(null)}
                >
                  {BEAUTY_STORE.title}
                </Link>
                <p className="spark-mega-sub">{BEAUTY_STORE.subtitle}</p>
                <div className="spark-mega-divider" />
                <ul className="spark-mega-list">
                  {BEAUTY_STORE.items.map((item) => (
                    <li key={item.label} className="spark-mega-item">
                      <Link
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="spark-mega-bullet">&rsaquo;</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="spark-mega-col-action">
                  <Link
                    href="/products"
                    className="spark-mega-action-btn"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <span>View All Products</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            MEGA MENU 3: BEAUTY ACADEMY
            ------------------------------------------------------------------ */}
        {activeDropdown === 'academy' && (
          <div
            className="spark-mega-menu spark-mega-standard align-academy"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="spark-mega-col">
              <div className="spark-mega-img-wrap">
                <img
                  src={BEAUTY_ACADEMY.image}
                  alt="Beauty Academy"
                  className="spark-mega-img"
                  loading="lazy"
                />
              </div>
              <div className="spark-mega-content">
                <Link
                  href={BEAUTY_ACADEMY.href}
                  className="spark-mega-title"
                  onClick={() => setActiveDropdown(null)}
                >
                  {BEAUTY_ACADEMY.title}
                </Link>
                <p className="spark-mega-sub">{BEAUTY_ACADEMY.subtitle}</p>
                <div className="spark-mega-divider" />
                <ul className="spark-mega-list">
                  {BEAUTY_ACADEMY.items.map((item) => (
                    <li key={item.label} className="spark-mega-item">
                      <Link
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="spark-mega-bullet">&rsaquo;</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="spark-mega-col-action">
                  <Link
                    href="/academy"
                    className="spark-mega-action-btn"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <span>Explore Academy</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          MOBILE & TABLET NAVIGATION DRAWER (BOTTOM-RIGHT CARD IN REFERENCE)
          ------------------------------------------------------------------ */}
      {mobileOpen && (
        <>
          <div
            className="spark-mobile-scrim"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <aside
            className="spark-mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Header: Logo + Close Icon */}
            <div className="spark-mobile-head">
              <Link
                href="/"
                className="spark-nav-brand"
                onClick={() => setMobileOpen(false)}
              >
                <picture>
                  <source srcSet="/images/logo-emblem-crop-white.webp" type="image/webp" />
                  <img
                    src="/images/logo-emblem-crop-white.png"
                    alt="Spark Logo"
                    style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/loading/logo-white.png';
                    }}
                  />
                </picture>
                <div className="spark-brand-text">
                  <span className="spark-brand-name" style={{ fontSize: '20px' }}>
                    Spark
                  </span>
                  <span className="spark-brand-sub" style={{ fontSize: '7.5px' }}>
                    SALON &amp; BEAUTY MALL
                  </span>
                </div>
              </Link>

              <button
                type="button"
                className="spark-mobile-close"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Accordion Navigation Items */}
            <nav className="spark-mobile-nav">
              {/* 1. Home */}
              <div>
                <Link
                  href="/"
                  className={`spark-mobile-link-row ${isHome ? 'is-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="spark-mobile-link-left">
                    <span className="spark-mobile-link-icon">
                      <Home size={18} />
                    </span>
                    <span>Home</span>
                  </span>
                </Link>
              </div>

              {/* 2. Salon Services */}
              <div>
                <button
                  type="button"
                  className={`spark-mobile-link-row ${
                    mobileExpandedCat === 'services' ? 'is-expanded' : ''
                  }`}
                  onClick={() =>
                    setMobileExpandedCat(mobileExpandedCat === 'services' ? null : 'services')
                  }
                >
                  <span className="spark-mobile-link-left">
                    <span className="spark-mobile-link-icon">
                      <Scissors size={18} />
                    </span>
                    <span>Salon Services</span>
                  </span>
                  <ChevronDown size={16} className="spark-mobile-chevron" />
                </button>

                {mobileExpandedCat === 'services' && (
                  <div className="spark-mobile-sub">
                    <Link
                      href="/services"
                      className="spark-mobile-sub-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="spark-mobile-sub-bullet">&rsaquo;</span>
                      <span>Men&apos;s Salon</span>
                    </Link>
                    <Link
                      href="/services"
                      className="spark-mobile-sub-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="spark-mobile-sub-bullet">&rsaquo;</span>
                      <span>Women&apos;s Salon</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. Beauty Store */}
              <div>
                <button
                  type="button"
                  className={`spark-mobile-link-row ${
                    mobileExpandedCat === 'store' ? 'is-expanded' : ''
                  }`}
                  onClick={() =>
                    setMobileExpandedCat(mobileExpandedCat === 'store' ? null : 'store')
                  }
                >
                  <span className="spark-mobile-link-left">
                    <span className="spark-mobile-link-icon">
                      <ShoppingBag size={18} />
                    </span>
                    <span>Beauty Store</span>
                  </span>
                  <ChevronDown size={16} className="spark-mobile-chevron" />
                </button>

                {mobileExpandedCat === 'store' && (
                  <div className="spark-mobile-sub">
                    {BEAUTY_STORE.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="spark-mobile-sub-link"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="spark-mobile-sub-bullet">&rsaquo;</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Beauty Academy */}
              <div>
                <button
                  type="button"
                  className={`spark-mobile-link-row ${
                    mobileExpandedCat === 'academy' ? 'is-expanded' : ''
                  }`}
                  onClick={() =>
                    setMobileExpandedCat(mobileExpandedCat === 'academy' ? null : 'academy')
                  }
                >
                  <span className="spark-mobile-link-left">
                    <span className="spark-mobile-link-icon">
                      <GraduationCap size={18} />
                    </span>
                    <span>Beauty Academy</span>
                  </span>
                  <ChevronDown size={16} className="spark-mobile-chevron" />
                </button>

                {mobileExpandedCat === 'academy' && (
                  <div className="spark-mobile-sub">
                    {BEAUTY_ACADEMY.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="spark-mobile-sub-link"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="spark-mobile-sub-bullet">&rsaquo;</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Partner With Us */}
              <div>
                <Link
                  href="/partner"
                  className={`spark-mobile-link-row ${isPartner ? 'is-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="spark-mobile-link-left">
                    <span className="spark-mobile-link-icon">
                      <Handshake size={18} />
                    </span>
                    <span>Partner With Us</span>
                  </span>
                </Link>
              </div>

              {/* 6. Contact */}
              <div>
                <Link
                  href="/contact"
                  className={`spark-mobile-link-row ${isContact ? 'is-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="spark-mobile-link-left">
                    <span className="spark-mobile-link-icon">
                      <Phone size={18} />
                    </span>
                    <span>Contact</span>
                  </span>
                </Link>
              </div>
            </nav>

            {/* Bottom: Book Appointment CTA Button */}
            <div className="spark-mobile-foot">
              <button
                type="button"
                className="spark-mobile-book-btn"
                onClick={handleBooking}
              >
                BOOK APPOINTMENT
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
