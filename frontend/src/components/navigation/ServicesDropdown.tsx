'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export interface ServiceMenuItem {
  id: string;
  name: string;
  href: string;
  index: number;
}

export const SERVICES_MENU: ServiceMenuItem[] = [
  { id: 'hair', name: 'Hair', href: '/services/hair', index: 0 },
  { id: 'beard-grooming', name: 'Beard & Grooming', href: '/services/beard-grooming', index: 1 },
  { id: 'nail', name: 'Nail', href: '/services/nail', index: 2 },
  { id: 'face', name: 'Face', href: '/services/face', index: 3 },
  { id: 'waxing', name: 'Waxing', href: '/services/waxing', index: 4 },
  { id: 'bridal', name: 'Bridal', href: '/services/bridal', index: 5 },
  { id: 'spa', name: 'Spa', href: '/services/spa', index: 6 },
  { id: 'tattoo', name: 'Tattoo', href: '/services/tattoo', index: 7 },
];

interface ServicesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (index: number) => void;
  onOpenBooking?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ServicesDropdown({
  isOpen,
  onClose,
  onSelectService,
  onMouseEnter,
  onMouseLeave,
}: ServicesDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute position directly beneath the Services navbar item
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const trigger = document.querySelector('.spark-services-trigger');
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const isMobile = window.innerWidth < 640;
        const panelWidth = isMobile ? Math.min(320, window.innerWidth - 32) : 420;
        const top = rect.bottom + 8;

        // Center horizontally beneath the Services item, clamped within viewport bounds
        const desiredLeft = rect.left + rect.width / 2 - panelWidth / 2;
        const clampedLeft = Math.max(16, Math.min(window.innerWidth - panelWidth - 16, desiredLeft));
        setCoords({ top, left: clampedLeft });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  // ESC key listener to close dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        const trigger = (e.target as HTMLElement).closest('.spark-services-trigger');
        if (!trigger) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const col1 = SERVICES_MENU.slice(0, 4);
  const col2 = SERVICES_MENU.slice(4, 8);

  const renderServiceLink = (service: ServiceMenuItem) => (
    <Link
      key={service.id}
      href={service.href}
      onClick={() => {
        onClose();
        if (onSelectService) onSelectService(service.index);
      }}
      className="spark-service-link"
    >
      <span className="spark-service-name">
        {service.name}
        <span className="spark-service-underline" />
      </span>
      <span className="spark-service-indicator" aria-hidden="true">
        ✦
      </span>
    </Link>
  );

  return createPortal(
    <>
      <style>{`
        .spark-services-dropdown-wrap {
          position: fixed;
          z-index: 999995;
          padding-top: 8px;
          animation: sparkDropdownSlideIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes sparkDropdownSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spark-services-panel {
          background-color: #0B0A0B;
          border: 1px solid #A98935;
          border-radius: 12px;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.9), 0 0 20px rgba(169, 137, 53, 0.12);
          padding: 14px 16px;
          width: 420px;
          max-width: calc(100vw - 32px);
          box-sizing: border-box;
        }

        .spark-services-grid {
          display: flex;
          align-items: stretch;
          gap: 16px;
        }

        .spark-services-col {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }

        .spark-services-divider {
          width: 1px;
          background: rgba(169, 137, 53, 0.22);
          align-self: stretch;
          margin: 4px 0;
        }

        .spark-service-link {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          height: 38px;
          padding: 0 12px;
          border-radius: 6px;
          color: #f4f1ea;
          text-decoration: none;
          font-family: var(--font-space-grotesk, 'Space Grotesk', sans-serif);
          font-size: 0.90rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.22s ease, background-color 0.22s ease;
          position: relative;
          cursor: pointer;
          box-sizing: border-box;
        }

        .spark-service-link:hover,
        .spark-service-link:focus-visible {
          color: #A98935;
          background-color: rgba(169, 137, 53, 0.08);
        }

        .spark-service-name {
          position: relative;
          display: inline-block;
          white-space: nowrap;
          line-height: 1.3;
        }

        .spark-service-underline {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #A98935;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spark-service-link:hover .spark-service-underline,
        .spark-service-link:focus-visible .spark-service-underline {
          transform: scaleX(1);
        }

        .spark-service-indicator {
          opacity: 0;
          transform: translateX(-4px);
          color: #A98935;
          font-size: 9px;
          transition: opacity 0.22s ease, transform 0.22s ease;
          line-height: 1;
          margin-left: 8px;
        }

        .spark-service-link:hover .spark-service-indicator,
        .spark-service-link:focus-visible .spark-service-indicator {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 639px) {
          .spark-services-panel {
            width: min(320px, calc(100vw - 32px));
            padding: 10px 12px;
          }
          .spark-services-grid {
            flex-direction: column;
            gap: 2px;
          }
          .spark-services-divider {
            display: none;
          }
          .spark-service-link {
            padding: 11px 12px;
            font-size: 0.96rem;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        role="dialog"
        aria-label="Services Menu"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-lenis-prevent
        className="spark-services-dropdown-wrap"
        style={{
          top: coords ? `${coords.top - 8}px` : '66px',
          left: coords ? `${coords.left}px` : '50%',
          transform: coords ? 'none' : 'translateX(-50%)',
        }}
      >
        <div className="spark-services-panel">
          <div className="spark-services-grid">
            <div className="spark-services-col">
              {col1.map(renderServiceLink)}
            </div>

            <div className="spark-services-divider" aria-hidden="true" />

            <div className="spark-services-col">
              {col2.map(renderServiceLink)}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
