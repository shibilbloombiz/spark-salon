'use client';

import React from 'react';
import Link from 'next/link';

interface AcademySectionProps {
  onOpenBooking?: () => void;
}

const COURSES = [
  {
    num: '01',
    id: 'hair-diploma',
    title: 'Advanced Hair Couture & Balayage',
    duration: '12 Weeks',
    level: 'Master Diploma',
    desc: 'Master French dimensional balayage, Vidal Sassoon architectural cutting, color chemistry and salon management.',
  },
  {
    num: '02',
    id: 'bridal-artistry',
    title: 'Regal HD Bridal & Makeover Artistry',
    duration: '6 Weeks',
    level: 'Professional Masterclass',
    desc: 'Comprehensive bridal training covering HD airbrush makeup, couture saree draping, jewellery styling and contouring.',
  },
  {
    num: '03',
    id: 'russian-manicure',
    title: 'Russian Apex Dry E-File Manicure',
    duration: '3 Weeks',
    level: 'Specialist Certification',
    desc: 'Learn the elite dry e-file diamond bit cuticle preparation, apex structural builder gel sculpting, and precision nail art.',
  },
  {
    num: '04',
    id: 'skin-aesthetics',
    title: 'Clinical Aesthetic Skin Therapies',
    duration: '4 Weeks',
    level: 'Aesthetician Certification',
    desc: 'In-depth protocols for hydra-infusion facial therapy, peptide chemical peelings, LED phototherapy and skin diagnosis.',
  },
];

export default function AcademySection({ onOpenBooking }: AcademySectionProps = {}) {
  return (
    <section
      id="academy"
      className="dark-band section"
      data-cursor-theme="dark"
      style={{
        position: 'relative',
        backgroundColor: 'var(--black)',
        color: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow" style={{ color: 'var(--red-on-dark)' }}>
              Academy
            </p>
            <h2 className="h-section" style={{ color: 'var(--white)' }}>
              Learn the craft
            </h2>
          </div>
          <Link href="/academy" className="text-link" style={{ color: 'var(--white)' }}>
            View All Programmes
          </Link>
        </div>

        {/* Liquid Academy Cards Grid (2 columns on desktop, 1 on mobile) */}
        <div className="grid-2">
          {COURSES.map((course) => (
            <Link
              key={course.id}
              href={`/academy#${course.id}`}
              className="lq-card a-card"
              data-cursor-theme="light"
            >
              {/* Rising Red Liquid Fill with Wave */}
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="num-blob">{course.num}</span>
                <span
                  style={{
                    font: '500 11px/1 var(--font-sans)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--red-on-dark)',
                    border: '1px solid var(--rule-dark)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {course.duration} • {course.level}
                </span>
              </div>

              <h3>{course.title}</h3>
              <p>{course.desc}</p>

              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  font: '500 11.5px/1 var(--font-sans)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                <span>View Programme Details</span>
                <span style={{ fontSize: '15px' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
