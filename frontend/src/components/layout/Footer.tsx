'use client';

import React from 'react';
import Link from 'next/link';
import './Footer.css';
import { SITE_CONFIG } from '@/config/site.config';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { markBookingClickHandled } from '@/components/booking/AppointmentRequestDialog';

interface FooterProps {
  onOpenBooking?: () => void;
}

const SERVICES_LIST = [
  { slug: 'hair', name: 'Hair' },
  { slug: 'beard-grooming', name: 'Beard & Grooming' },
  { slug: 'nail', name: 'Nail' },
  { slug: 'face', name: 'Face' },
  { slug: 'waxing', name: 'Waxing' },
  { slug: 'bridal', name: 'Bridal' },
  { slug: 'spa', name: 'Spa' },
  { slug: 'tattoo', name: 'Tattoo' },
];

const SHOP_LINKS = [
  { href: '/products', label: 'All products' },
  { href: '/products?category=hair', label: 'Hair' },
  { href: '/products?category=skin', label: 'Skin' },
  { href: '/products?category=nails', label: 'Nails' },
];

const ACADEMY_LINKS = [
  { href: '/academy', label: 'Academy Programmes' },
  { href: '/academy#course-hair-cutting-foundations', label: 'Hair Cutting Foundations' },
  { href: '/academy#course-advanced-bridal-styling', label: 'Advanced Bridal Styling' },
  { href: '/academy#course-nail-technology-essentials', label: 'Nail Technology' },
  { href: '/academy#course-clinical-aesthetics-certification', label: 'Clinical Aesthetics' },
];

export default function Footer({ onOpenBooking }: FooterProps) {
  const settings = useSiteSettings();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    markBookingClickHandled(e.nativeEvent);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.getElementById('book') || document.getElementById('final-cta');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#book';
      }
    }
  };

  return (
    <footer className="site-footer" id="footer" aria-labelledby="footerTitle" data-cursor-theme="dark">
      {/* Dual Animated Flowing Wave Transition at Top Edge */}
      <div className="wave" aria-hidden="true">
        <div className="wave-track wave-back">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 45 C160 10 320 80 480 45 C640 10 800 80 960 45 C1120 10 1280 80 1440 45 L1440 90 L0 90 Z" />
          </svg>
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 45 C160 10 320 80 480 45 C640 10 800 80 960 45 C1120 10 1280 80 1440 45 L1440 90 L0 90 Z" />
          </svg>
        </div>
        <div className="wave-track wave-front">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 60 C200 20 360 85 540 55 C720 25 900 85 1080 55 C1200 35 1320 70 1440 60 L1440 90 L0 90 Z" />
          </svg>
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 60 C200 20 360 85 540 55 C720 25 900 85 1080 55 C1200 35 1320 70 1440 60 L1440 90 L0 90 Z" />
          </svg>
        </div>
      </div>

      <div className="wrap">
        <div className="f-top">
          {/* Column 1 — Brand */}
          <div className="f-brand">
            <Link href="/" className="brand" aria-label="Spark International Salon, home">
              <span className="brand-name">Spark</span>
              <span className="brand-sub">Salon &amp; Beauty Mall</span>
            </Link>
            <p className="f-tag">Hair, skin and ritual for an international clientele.</p>
            <button
              className="cta"
              data-open="appt"
              onClick={handleBooking}
              type="button"
            >
              Book Appointment
            </button>
          </div>

          {/* Column 2 — Services */}
          <nav className="f-col" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {SERVICES_LIST.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — Shop and Academy */}
          <nav className="f-col" aria-label="Shop and academy">
            <h3>Shop</h3>
            <ul>
              {SHOP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: '26px' }}>Academy</h3>
            <ul>
              {ACADEMY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4 — Explore */}
          <nav className="f-col" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <a href="#book" data-open="appt" onClick={handleBooking}>
                  Book Appointment
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 5 — Visit */}
          <div className="f-col" id="footerTitle">
            <h3>Visit</h3>
            <address style={{ whiteSpace: 'pre-line' }}>
              {settings.address || 'Mavoor Rd, Kottooli\nKozhikode, Kerala 673016'}
            </address>
            <p style={{ marginTop: '12px' }}>
              <a href={`tel:${(settings.phone || SITE_CONFIG.contact.phone).replace(/\s+/g, '')}`}>
                {settings.phone || SITE_CONFIG.contact.phone}
              </a>
              <br />
              <a href={`mailto:${settings.email || SITE_CONFIG.contact.email}`}>
                {settings.email || SITE_CONFIG.contact.email}
              </a>
            </p>
            <h3 style={{ marginTop: '26px' }}>Follow</h3>
            <div className="f-social">
              <a
                href={settings.instagram || SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href={settings.facebook || SITE_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href={settings.youtube || SITE_CONFIG.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Oversized SPARK Wordmark with Rising Red Liquid-Fill on Hover */}
        <p className="f-mega" aria-hidden="true">
          Spark
        </p>

        {/* Bottom Information Row */}
        <div className="f-bottom">
          <p style={{ margin: 0 }}>© 2026 Spark International Salon. All rights reserved.</p>
          <nav aria-label="Legal">
            <Link href="/contact">Privacy</Link>
            <Link href="/contact">Terms</Link>
            <Link href="/contact">Cookies</Link>
          </nav>
          <a
            className="to-top"
            href="#top"
            onClick={scrollToTop}
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
