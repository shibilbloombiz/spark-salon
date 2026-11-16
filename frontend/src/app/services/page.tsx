'use client';

import React from 'react';
import BrandStatement from '@/components/sections/BrandStatement';
import StudioList from '@/components/sections/StudioList';
import FinalCta from '@/components/sections/FinalCta';

export default function ServicesPage() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#040406',
        color: 'var(--ink, #0c0c0c)',
      }}
      data-cursor-theme="dark"
    >
      <main style={{ paddingTop: 'clamp(80px, 8vw, 110px)' }}>
        {/* 01 — Atelier Brand Statement & Philosophy */}
        <BrandStatement />

        {/* 02 — Interactive 8 Specialist Studios List with Photo Reveals */}
        <StudioList />

        {/* 03 — Final Luxury Appointment CTA Band matching landing page */}
        <FinalCta />
      </main>
    </div>
  );
}
