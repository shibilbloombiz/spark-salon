'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import ServicesDropdown from './ServicesDropdown';

export interface NavLinkItem {
  id: string;
  label: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavLinkItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'services', label: 'Services', hasDropdown: true },
  { id: 'products', label: 'Products' },
  { id: 'academy', label: 'Academy' },
  { id: 'contact', label: 'Contact' },
];

interface NavLinksProps {
  scrolled?: boolean;
  onNavigate?: (id: string) => void;
  onOpenBooking?: () => void;
}

export default function NavLinks({ scrolled = false, onNavigate, onOpenBooking }: NavLinksProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>('hero');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const activeIdRef = useRef<string>('hero');
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set active link according to current URL pathname
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.startsWith('/services') || p.startsWith('/studio')) {
        setActiveId('services');
        activeIdRef.current = 'services';
      } else if (p.startsWith('/products')) {
        setActiveId('products');
        activeIdRef.current = 'products';
      } else if (p.startsWith('/academy')) {
        setActiveId('academy');
        activeIdRef.current = 'academy';
      } else if (p === '/') {
        setActiveId('hero');
        activeIdRef.current = 'hero';
      }
    }
  }, []);

  useEffect(() => {
    // Only scroll spy on home page
    if (typeof window !== 'undefined' && window.location.pathname !== '/') return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollPos = window.scrollY + 260;
        const sections = [
          { id: 'hero', name: 'hero' },
          { id: 'services', name: 'services' },
          { id: 'products', name: 'products' },
          { id: 'academy', name: 'academy' },
          { id: 'final-cta', name: 'contact' },
          { id: 'contact', name: 'contact' },
        ];

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el && el.offsetTop <= scrollPos) {
            if (activeIdRef.current !== sections[i].name) {
              activeIdRef.current = sections[i].name;
              setActiveId(sections[i].name);
            }
            break;
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Initialize hardware acceleration (force3D) on mount
  useEffect(() => {
    const allFront = document.querySelectorAll<HTMLElement>('.mdx-char-front');
    const allBack = document.querySelectorAll<HTMLElement>('.mdx-char-back');
    if (allFront.length > 0 && allBack.length > 0) {
      gsap.set([...Array.from(allFront), ...Array.from(allBack)], { yPercent: 0, force3D: true });
    }
  }, []);

  /**
   * HorizonX Signature Character Rolling Flip on Mouse Enter
   */
  const handleMouseEnter = useCallback((id: string) => {
    const btn = buttonRefs.current[id];
    if (!btn) return;

    const frontChars = btn.querySelectorAll<HTMLElement>('.mdx-char-front');
    const backChars = btn.querySelectorAll<HTMLElement>('.mdx-char-back');
    const all = [...Array.from(frontChars), ...Array.from(backChars)];

    gsap.set(all, { willChange: 'transform' });
    const enterAnim = {
      yPercent: -100,
      duration: 0.6,
      stagger: 0.025,
      ease: 'expo.out',
      overwrite: 'auto' as const,
    };
    gsap.to(Array.from(frontChars), enterAnim);
    gsap.to(Array.from(backChars), enterAnim);
  }, []);

  /**
   * HorizonX Signature Character Rolling Flip on Mouse Leave
   */
  const handleMouseLeave = useCallback((id: string) => {
    const btn = buttonRefs.current[id];
    if (!btn) return;

    const frontChars = btn.querySelectorAll<HTMLElement>('.mdx-char-front');
    const backChars = btn.querySelectorAll<HTMLElement>('.mdx-char-back');
    const all = [...Array.from(frontChars), ...Array.from(backChars)];

    const leaveAnim = {
      yPercent: 0,
      duration: 0.45,
      stagger: 0.018,
      ease: 'power3.in',
      overwrite: 'auto' as const,
      onComplete: () => {
        gsap.set(all, { clearProps: 'willChange' });
      },
    };
    gsap.to(Array.from(frontChars), leaveAnim);
    gsap.to(Array.from(backChars), leaveAnim);
  }, []);

  // Hover management for Services dropdown
  const handleItemMouseEnter = (id: string) => {
    handleMouseEnter(id);
    if (id === 'services') {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setDropdownOpen(true);
    }
  };

  const handleItemMouseLeave = (id: string) => {
    handleMouseLeave(id);
    if (id === 'services') {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 240);
    }
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const handleDropdownMouseLeave = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleLinkClick = (id: string) => {
    setActiveId(id);

    if (id === 'hero') {
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          router.push('/');
        }
      }
      return;
    }

    if (id === 'services') {
      setDropdownOpen(false);
      router.push('/services');
      return;
    }

    if (id === 'products') {
      router.push('/products');
      return;
    }

    if (id === 'academy') {
      router.push('/academy');
      return;
    }

    if (id === 'contact') {
      const el =
        document.getElementById('final-cta') ||
        document.getElementById('contact');
      if (el) {
        if (typeof window !== 'undefined' && (window as any).lenis) {
          (window as any).lenis.scrollTo(el, { duration: 1.2, offset: 0 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push('/#final-cta');
      }
      return;
    }

    if (onNavigate) {
      onNavigate(id);
    }
  };

  const handleSelectDropdownService = (serviceIndex: number) => {
    setDropdownOpen(false);
    setActiveId('services');

    if (onNavigate) {
      onNavigate('services');
    } else {
      const el = document.getElementById('services');
      if (el) {
        if (typeof window !== 'undefined' && (window as any).lenis) {
          (window as any).lenis.scrollTo(el, { duration: 1.0, offset: 0 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/#services';
      }
    }

    // After scrolling, activate the exact service card in ServicesShowcase
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('spark:gotoService', { detail: { index: serviceIndex } })
      );
    }, 320);
  };

  return (
    <>
      <ul
        role="menubar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: scrolled ? '22px' : '30px',
          listStyle: 'none',
          margin: 0,
          padding: '0 8px',
          transition: 'gap 0.3s ease',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const isServicesItem = item.id === 'services';

          return (
            <li
              key={item.id}
              role="none"
              style={{ position: 'relative' }}
              onMouseEnter={() => handleItemMouseEnter(item.id)}
              onMouseLeave={() => handleItemMouseLeave(item.id)}
            >
              <button
                ref={(el) => {
                  buttonRefs.current[item.id] = el;
                }}
                role="menuitem"
                aria-haspopup={isServicesItem ? 'true' : undefined}
                aria-expanded={isServicesItem ? dropdownOpen : undefined}
                onClick={() => handleLinkClick(item.id)}
                aria-label={`Navigate to ${item.label}`}
                className={`spark-nav-link ${isActive ? 'is-active' : ''} ${
                  isServicesItem ? 'spark-services-trigger' : ''
                }`}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 4px',
                  fontFamily: 'var(--font-sans-display), "Inter", -apple-system, sans-serif',
                  fontSize: scrolled ? '0.85rem' : '0.92rem',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.08em',
                  color: isActive ? '#c9a45c' : '#f4f1ea',
                  textShadow: isActive
                    ? '0 0 12px rgba(201, 164, 92, 0.45), 0 0 24px rgba(201, 164, 92, 0.25)'
                    : 'none',
                  transition: 'color 0.3s cubic-bezier(0.16, 1, 0.3, 1), font-size 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                {/* HorizonX Character Rolling Mask Container */}
                <span className="mdx-link-content">
                  {item.label.split('').map((char, i) => (
                    <span key={i} className="mdx-link-char-mask">
                      <span
                        className="mdx-char-front"
                        style={{
                          color: isActive ? '#c9a45c' : '#f4f1ea',
                          transition: 'color 0.25s ease',
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                      <span
                        className="mdx-char-back"
                        aria-hidden="true"
                        style={{
                          color: '#e5c158',
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    </span>
                  ))}
                </span>

                {/* Subtle Luxury Chevron for Services Dropdown */}
                {item.hasDropdown && (
                  <ChevronDown
                    size={13}
                    style={{
                      color: isActive || dropdownOpen ? '#c9a45c' : 'rgba(244, 241, 234, 0.7)',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease',
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Floating Services Mega-Dropdown Modal */}
      <ServicesDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onSelectService={handleSelectDropdownService}
        onOpenBooking={onOpenBooking}
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleDropdownMouseLeave}
      />
    </>
  );
}
