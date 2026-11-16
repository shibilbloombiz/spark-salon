'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PRODUCT_BANNERS = [
  {
    id: 'hair-couture-banner',
    image: '/images/products/products banner.png',
    eyebrow: 'OFFICIAL KÉRASTASE & OLAPLEX ATELIER',
    title: 'Haute Salon Formulations & Bond Architecture',
    subtitle: 'Prescribed salon-exclusive hair elixirs, molecular bond repair therapies, and rejuvenating caviar scalp rituals used by master stylists.',
    tag: 'Couture Haircare',
    btnText: 'Explore Products Catalog',
  },
  {
    id: 'clinical-derma-banner',
    image: '/images/products/product banner 2.png',
    eyebrow: 'CLINICAL DERMA & PRECISION STYLING',
    title: 'Dermatological Science & Intelligent Heat Control',
    subtitle: 'Medical-grade vitamin C complexes, hydra-infusion resurfacing serums, and Dyson Supersonic professional atelier styling technology.',
    tag: 'Skin Therapeutics & Tools',
    btnText: 'Explore Products Catalog',
  },
];

interface ProductsSectionProps {
  onOpenBooking?: () => void;
}

export default function ProductsSection({ onOpenBooking }: ProductsSectionProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel continuously every 4.5s (never pauses on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PRODUCT_BANNERS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="products"
      className="section"
      data-cursor-theme="light"
      style={{
        position: 'relative',
        backgroundColor: 'var(--paper)',
        overflow: 'hidden',
        padding: '72px 0',
      }}
    >
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">The Mall</p>
            <h2 className="h-section">From our shelves</h2>
          </div>
          <Link href="/products" className="text-link">
            Shop All Products
          </Link>
        </div>

        {/* Carousel Container */}
        <div
          data-cursor-theme="dark"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(300px, 32vw, 420px)',
            borderRadius: '8px 40px 8px 40px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(12, 12, 12, 0.06), 0 20px 45px -20px rgba(12, 12, 12, 0.35)',
            border: '1px solid var(--rule)',
            backgroundColor: 'var(--black)',
          }}
        >
          {PRODUCT_BANNERS.map((banner, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={banner.id}
                aria-hidden={!isActive}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(1.03)',
                  transition: 'opacity 0.75s var(--ease-liquid), transform 0.85s var(--ease-liquid)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 2 : 1,
                }}
              >
                {/* Full-Bleed Banner Image */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Editorial Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(12, 12, 12, 0.94) 0%, rgba(12, 12, 12, 0.75) 45%, rgba(12, 12, 12, 0.2) 80%, transparent 100%)',
                    zIndex: 2,
                  }}
                />

                {/* Text Content */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'clamp(28px, 4vw, 56px)',
                    maxWidth: '620px',
                  }}
                >
                  <span
                    style={{
                      font: '500 11px/1 var(--font-sans)',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: 'var(--red-on-dark)',
                      marginBottom: '14px',
                    }}
                  >
                    {banner.eyebrow}
                  </span>

                  <h3
                    style={{
                      font: '600 clamp(28px, 3.2vw, 42px)/1.08 var(--font-serif)',
                      color: 'var(--white)',
                      margin: '0 0 16px 0',
                    }}
                  >
                    {banner.title}
                  </h3>

                  <p
                    style={{
                      font: '400 clamp(14px, 1.1vw, 16px)/1.55 var(--font-sans)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 28px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {banner.subtitle}
                  </p>

                  <div>
                    <Link href="/products" className="cta">
                      {banner.btnText}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slide Indicators */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '28px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {PRODUCT_BANNERS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === currentSlide ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: i === currentSlide ? 'var(--red)' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 300ms var(--ease-liquid)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
