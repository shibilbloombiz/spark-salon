'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StudioData } from '@/lib/data/studios';
import { SectionCornerAccent } from '@/components/ui';
import './StudioServices.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type BorderVariant = 'A' | 'B' | 'C';

export interface AtelierServiceItem {
  id: string;
  number: string;
  name: string;
  title: string;
  slug: string;
  shortDesc: string;
  image: string;
  variant: BorderVariant;
}

export const ATELIER_SERVICES_DATA: AtelierServiceItem[] = [
  {
    id: 'hair',
    number: '01 / 08',
    name: 'Hair',
    title: 'Hair Couture & Balayage Atelier',
    slug: 'hair',
    shortDesc: 'Sculptural precision cutting, bespoke balayage alchemy, and molecular hair revitalization.',
    image: '/images/services/hair-couture.jpg',
    variant: 'A',
  },
  {
    id: 'beard-grooming',
    number: '02 / 08',
    name: 'Beard & Grooming',
    title: 'Bespoke Beard & Grooming Atelier',
    slug: 'beard-grooming',
    shortDesc: 'Old-world hot-towel rituals, precision razor geometry, and luxury facial contouring.',
    image: '/images/services/beard-grooming.jpg',
    variant: 'B',
  },
  {
    id: 'nail',
    number: '03 / 08',
    name: 'Nail',
    title: 'Nail Architecture & Detailing Lounge',
    slug: 'nail',
    shortDesc: 'Russian dry apex detailing, sculpted gel extensions, and liquid chrome fine-line art.',
    image: '/images/services/nail-detailing.jpg',
    variant: 'C',
  },
  {
    id: 'face',
    number: '04 / 08',
    name: 'Face',
    title: 'Face & Clinical Derma Studio',
    slug: 'face',
    shortDesc: '24K liquid gold cellular facials, hydra-dermabrasion, and advanced peptide infusions.',
    image: '/images/gallery/dewy-skin-radiance.webp',
    variant: 'A',
  },
  {
    id: 'waxing',
    number: '05 / 08',
    name: 'Waxing',
    title: 'Waxing & Silkening Suite',
    slug: 'waxing',
    shortDesc: 'Low-temperature Italian hard wax rituals and botanical calming restorative treatments.',
    image: '/images/services/skin-waxing.jpg',
    variant: 'B',
  },
  {
    id: 'bridal',
    number: '06 / 08',
    name: 'Bridal',
    title: 'Regal Haute Bridal Atelier',
    slug: 'bridal',
    shortDesc: 'HD airbrush radiance, bespoke royal draping, and couture bridal hair architecture.',
    image: '/images/services/bridal-masterpiece.jpg',
    variant: 'C',
  },
  {
    id: 'spa',
    number: '07 / 08',
    name: 'Spa',
    title: 'Holistic Spa & Sanctuary',
    slug: 'spa',
    shortDesc: 'Balinese acupressure, heated volcanic basalt therapy, and botanical body polishes.',
    image: '/images/services/spa-wellness.jpg',
    variant: 'A',
  },
  {
    id: 'tattoo',
    number: '08 / 08',
    name: 'Tattoo',
    title: 'Custom Tattoo & Fine Art Ink Atelier',
    slug: 'tattoo',
    shortDesc: 'Single-needle fine-line artistry, sacred geometry, and bespoke talisman ink craft.',
    image: '/images/services/custom-tattoo.jpg',
    variant: 'B',
  },
];

interface Radii {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

function getCardRadii(variant: BorderVariant, width: number): Radii {
  const scale = width > 0 && width < 360 ? Math.max(0.75, width / 360) : 1;
  switch (variant) {
    case 'A':
      return {
        tl: Math.round(52 * scale),
        tr: Math.round(14 * scale),
        br: Math.round(52 * scale),
        bl: Math.round(14 * scale),
      };
    case 'B':
      return {
        tl: Math.round(14 * scale),
        tr: Math.round(52 * scale),
        br: Math.round(14 * scale),
        bl: Math.round(52 * scale),
      };
    case 'C':
      return {
        tl: Math.round(14 * scale),
        tr: Math.round(64 * scale),
        br: Math.round(18 * scale),
        bl: Math.round(44 * scale),
      };
  }
}

function buildCardSvgPath(w: number, h: number, radii: Radii, inset = 1.2): string {
  const { tl, tr, br, bl } = radii;
  const left = inset;
  const top = inset;
  const right = Math.max(left + 10, w - inset);
  const bottom = Math.max(top + 10, h - inset);

  return `M ${left + tl} ${top} L ${right - tr} ${top} A ${tr} ${tr} 0 0 1 ${right} ${top + tr} L ${right} ${bottom - br} A ${br} ${br} 0 0 1 ${right - br} ${bottom} L ${left + bl} ${bottom} A ${bl} ${bl} 0 0 1 ${left} ${bottom - bl} L ${left} ${top + tl} A ${tl} ${tl} 0 0 1 ${left + tl} ${top} Z`.replace(/\s+/g, ' ').trim();
}

interface AsymCardProps {
  item: AtelierServiceItem;
  isCurrent: boolean;
}

function AsymServiceCard({ item, isCurrent }: AsymCardProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 380, h: 510 });
  const uniqueId = useId().replace(/:/g, '_');

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDims({
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        });
      }
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const radii = getCardRadii(item.variant, dims.w);
  const pathD = buildCardSvgPath(dims.w, dims.h, radii, 1.2);
  const borderRadiusStyle = `${radii.tl}px ${radii.tr}px ${radii.br}px ${radii.bl}px`;

  return (
    <Link
      ref={cardRef}
      href={`/studio/${item.slug}`}
      className={`asym-service-card ${isCurrent ? 'is-current' : ''}`}
      style={{
        borderRadius: borderRadiusStyle,
      }}
      aria-label={`Explore ${item.title}`}
    >
      {/* Background Photographic Image */}
      <div className="asym-card-image-wrap" style={{ borderRadius: borderRadiusStyle }}>
        <img
          src={item.image}
          alt={item.title}
          className="asym-card-image"
          loading="lazy"
        />
        {/* Dark Editorial Gradient Overlay */}
        <div className="asym-card-gradient" />
      </div>

      {/* SVG Asymmetrical Sculpted Frame */}
      <svg
        className="asym-card-svg-frame"
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Metallic Champagne Gradient */}
          <linearGradient
            id={`grad_${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F2D6A0" />
            <stop offset="35%" stopColor="#D6B16C" />
            <stop offset="65%" stopColor="#AA8210" />
            <stop offset="100%" stopColor="#F2D6A0" />
          </linearGradient>

          {/* Traveling Specular Highlight Gradient */}
          <linearGradient
            id={`beam_${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#F2D6A0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D6B16C" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. Base Subtle Outline */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(214, 177, 108, 0.28)"
          strokeWidth="1.2"
        />

        {/* 2. GSAP ScrollTrigger Drawn Metallic Stroke */}
        <path
          className="card-svg-stroke-animated"
          d={pathD}
          fill="none"
          stroke={`url(#grad_${uniqueId})`}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* 3. Desktop Hover Traveling Highlight Beam */}
        <path
          className="card-svg-stroke-highlight"
          d={pathD}
          fill="none"
          stroke={`url(#beam_${uniqueId})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Card Content Structure */}
      <div className="asym-card-content">
        {/* Top: Service Number + Decorative Line */}
        <div className="asym-card-top">
          <span className="asym-card-number">{item.number}</span>
          <span className="asym-card-gold-line" />
        </div>

        {/* Lower: Title + Short Description + Explore Service */}
        <div className="asym-card-bottom">
          <h3 className="asym-card-title">{item.title}</h3>
          <p className="asym-card-desc">{item.shortDesc}</p>

          <div className="asym-card-action">
            <span className="asym-card-explore">Explore Service</span>
            <div className="asym-card-arrow-circle">
              <ArrowRight size={13} color="#F2D6A0" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface StudioServicesProps {
  studio: StudioData;
  onRequestService?: (serviceName: string) => void;
}

export default function StudioServices({ studio }: StudioServicesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Section Header Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Sequential Cards Stagger Reveal (opacity: 0, y: 70px, scale: 0.96)
      const cards = gridRef.current?.querySelectorAll<HTMLElement>('.asym-service-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 70,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            stagger: 0.14,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );

        // 3. Progressive SVG Border Stroke Drawing
        const strokes = gridRef.current?.querySelectorAll<SVGPathElement>('.card-svg-stroke-animated');
        strokes?.forEach((stroke, idx) => {
          const length = stroke.getTotalLength?.() || 1800;
          gsap.set(stroke, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(stroke, {
            strokeDashoffset: 0,
            duration: 1.35,
            delay: idx * 0.14,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        });

        // 4. Subtle Photographic Entrance Zoom
        const images = gridRef.current?.querySelectorAll<HTMLElement>('.asym-card-image');
        images?.forEach((img, idx) => {
          gsap.fromTo(
            img,
            { scale: 1.12, filter: 'brightness(0.7)' },
            {
              scale: 1,
              filter: 'brightness(1)',
              duration: 1.3,
              delay: idx * 0.14,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="studio-services" ref={sectionRef} className="asym-services-section">
      <SectionCornerAccent corner="both" />

      <div className="asym-services-container">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="asym-section-header">
          <div className="asym-section-label">
            <span className="asym-section-label-dash" />
            <span>02 — BESPOKE SERVICE ATELIERS</span>
          </div>

          <h2 className="asym-section-title">
            Eight Distinctive Worlds of Artistry
          </h2>

          <p className="asym-section-desc">
            Explore our specialized craft houses—from haute bridal architecture and precision color chemistry to clinical dermal therapies and fine-line talisman ink.
          </p>
        </div>

        {/* Asymmetrical 3-Column Luxury Cards Grid */}
        <div ref={gridRef} className="asym-cards-grid">
          {ATELIER_SERVICES_DATA.map((item) => (
            <AsymServiceCard
              key={item.id}
              item={item}
              isCurrent={studio?.id === item.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
