'use client';

import React, { useState } from 'react';
import './FaqSection.css';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  items: FaqItem[];
  defaultOpenIndex?: number | null;
  className?: string;
  showCta?: boolean;
}

export default function FaqSection({
  id = 'faq',
  eyebrow = 'Frequently Asked',
  title = 'Quick answers before you reach out',
  description = 'Everything you need to know about our programmes, admissions, and student experience.',
  ctaText = 'Enquire Now',
  ctaHref,
  onCtaClick,
  items,
  defaultOpenIndex = 0,
  className = '',
  showCta = true,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  if (!items || items.length === 0) return null;

  const headingId = `${id}-heading`;

  return (
    <section className={`section faq-section ${className}`} id={id} aria-labelledby={headingId}>
      <div className="wrap">
        <div className="faq-shell">
          {/* Left Sticky Column */}
          <div className="faq-intro">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="h-section" id={headingId}>
              {title}
            </h2>
            {description && <p className="faq-intro-copy">{description}</p>}

            {showCta && (
              <div className="faq-intro-cta">
                {ctaHref ? (
                  <a
                    href={ctaHref}
                    onClick={onCtaClick}
                    className="btn cta"
                    target={ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {ctaText}
                  </a>
                ) : onCtaClick ? (
                  <button type="button" onClick={onCtaClick} className="btn cta">
                    {ctaText}
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Accordion List */}
          <div className="faq-list">
            {items.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `${id}-panel-${idx}`;
              const triggerId = `${id}-trigger-${idx}`;

              return (
                <div key={item.question} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    id={triggerId}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                  >
                    <span className="faq-question-wrap">
                      <span className="faq-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="faq-question">{item.question}</span>
                    </span>
                    <span className="faq-plus" aria-hidden="true">
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="faq-answer-panel"
                    >
                      <p className="faq-answer">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

