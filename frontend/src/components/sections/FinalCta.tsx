'use client';

import React from 'react';
import { useSiteShell } from '@/components/layout/SiteShell';
import { markBookingClickHandled } from '@/components/booking/AppointmentRequestDialog';

interface FinalCtaProps {
  onOpenBooking?: () => void;
}

export default function FinalCta({ onOpenBooking }: FinalCtaProps = {}) {
  const { openBooking } = useSiteShell();

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    markBookingClickHandled(e.nativeEvent);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      openBooking('hair');
    }
  };

  return (
    <section id="final-cta" className="cta-band section" data-cursor-theme="dark">
      {/* Morphing Black Liquid Cap on the right */}
      <span className="liquid-cap" aria-hidden="true" />
      <div id="contact" style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, pointerEvents: 'none' }} />

      <div className="wrap">
        <div className="cta-copy">
          <p className="eyebrow" style={{ color: 'var(--white)', opacity: 0.82 }}>
            Ready when you are
          </p>
          <h2 className="h-section" style={{ color: 'var(--white)' }}>
            Book your next visit.
          </h2>
          <p
            style={{
              font: '400 17px/1.6 var(--font-sans)',
              color: 'rgba(255, 255, 255, 0.88)',
              marginTop: '16px',
              maxWidth: '46ch',
            }}
          >
            Experience bespoke hair transformations, clinical dermatology, and soothing luxury rituals at Kerala&apos;s premier salon.
          </p>
        </div>
      </div>

      <div className="cta-actions">
        <button
          className="btn cta-band-btn"
          data-open="appt"
          onClick={handleBooking}
          type="button"
        >
          Book Appointment
        </button>
      </div>
    </section>
  );
}
