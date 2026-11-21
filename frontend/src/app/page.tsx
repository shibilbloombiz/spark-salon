'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/layout/Preloader';
import { SparkSalonHero } from '@/components/hero';
import BrandStatement from '@/components/sections/BrandStatement';
import { useSiteShell } from '@/components/layout/SiteShell';

const StudioList = dynamic(() => import('@/components/sections/StudioList'), {
  loading: () => <div style={{ minHeight: '600px', backgroundColor: 'var(--paper, #f4f2f1)' }} />,
});
const SpiralGallery = dynamic(() => import('@/components/sections/SpiralGallery'), {
  loading: () => <div style={{ minHeight: '600px', backgroundColor: '#ececec' }} />,
});
const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection'), {
  loading: () => <div style={{ minHeight: '400px', backgroundColor: 'var(--paper)' }} />,
});
const AcademySection = dynamic(() => import('@/components/sections/AcademySection'), {
  loading: () => <div style={{ minHeight: '500px', backgroundColor: '#0c0c0c' }} />,
});
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <div style={{ minHeight: '450px', backgroundColor: '#0c0c0c' }} />,
});
const FinalCta = dynamic(() => import('@/components/sections/FinalCta'), {
  loading: () => <div style={{ minHeight: '300px', backgroundColor: 'var(--paper)' }} />,
});

let hasShownPreloader = false;

export default function HomePage() {
  const { openBooking, setNavbarRevealed } = useSiteShell();
  const [preloaderDone, setPreloaderDone] = useState(() => hasShownPreloader);
  const [isRevealed, setIsRevealed] = useState(() => hasShownPreloader);

  useEffect(() => {
    setNavbarRevealed(hasShownPreloader || isRevealed);
    return () => setNavbarRevealed(true);
  }, [isRevealed, setNavbarRevealed]);

  const handlePreloaderExitStart = () => {
    setIsRevealed(true);
    setNavbarRevealed(true);
  };

  const handlePreloaderComplete = () => {
    hasShownPreloader = true;
    setPreloaderDone(true);
    setIsRevealed(true);
    setNavbarRevealed(true);
  };

  const handleOpenBooking = (studio = 'hair') => {
    openBooking(studio);
  };

  return (
    <main style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#040406' }} data-cursor-theme="dark">
      {/* 01 — 3D CINEMATIC INTRO PRELOADER (matching loading.png) */}
      {!preloaderDone && (
        <Preloader
          onComplete={handlePreloaderComplete}
          onExitStart={handlePreloaderExitStart}
        />
      )}

      {/* 02 — CINEMATIC SCROLL-DRIVEN FRAME-SEQUENCE HERO */}
      <div id="hero">
        <SparkSalonHero
          isRevealed={isRevealed}
          onOpenBooking={() => handleOpenBooking('hair')}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (!el) return;
            if (typeof window !== 'undefined' && (window as any).lenis) {
              (window as any).lenis.scrollTo(el, { duration: 1.2, offset: 0 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>

      {/* 03 — BRAND STATEMENT (matching scroll effect.png) */}
      <BrandStatement />

      {/* 04 — SERVICES LIST */}
      <StudioList />

      {/* 05 — LATEST WORKS SPIRAL HELIX GALLERY */}
      <SpiralGallery />

      {/* LOWER SECTIONS CONTAINER */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 06 — LUXURY APOTHECARY & RETAIL PRODUCTS BANNER */}
        <div id="products">
          <ProductsSection onOpenBooking={() => handleOpenBooking('products')} />
        </div>

        {/* 07 — SPARK INTERNATIONAL ACADEMY */}
        <div id="academy">
          <AcademySection onOpenBooking={() => handleOpenBooking('academy')} />
        </div>

        {/* 08 — TESTIMONIALS */}
        <Testimonials onOpenBooking={() => handleOpenBooking('hair')} />

        {/* 09 — FINAL CTA */}
        <FinalCta onOpenBooking={() => handleOpenBooking('hair')} />
      </div>
    </main>
  );
}
