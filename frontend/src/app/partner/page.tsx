'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site.config';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import FinalCta from '@/components/sections/FinalCta';
import '../contact/contact.css';

export default function PartnerPage() {
  const settings = useSiteSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [proposal, setProposal] = useState('');

  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const displayPhone = settings?.phone || SITE_CONFIG.contact.phone;
  const displayEmail = settings?.email || SITE_CONFIG.contact.email;
  const displayAddress = SITE_CONFIG.contact.address.full;
  const rawWhatsApp = (settings?.whatsappNumber || SITE_CONFIG.contact.whatsapp).replace(/\D/g, '') || '918543097899';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameBad = !name.trim();
    const isPhoneBad = phone.replace(/\D/g, '').length < 8;
    const isCityBad = !city.trim();

    setNameError(isNameBad);
    setPhoneError(isPhoneBad);
    setCityError(isCityBad);

    if (isNameBad || isPhoneBad || isCityBad) {
      return;
    }

    const message = `*SPARK SALON & BEAUTY MALL — PARTNERSHIP ENQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━
*Name:* ${name.trim()}
*Phone / WhatsApp:* ${phone.trim()}
*Email:* ${email.trim() || 'N/A'}
*City / Target Location:* ${city.trim()}
*Proposal Details:*
${proposal.trim() || 'Interested in exploring salon partnership, expansion, and business collaboration.'}
━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via Spark Salon Official Website (Partner With Us)_`;

    const url = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', color: 'var(--ink)' }} data-cursor-theme="light">
      <main>
        {/* ==================================================================
            1. SIGNATURE PAGE HEAD
            ================================================================== */}
        <section className="page-head">
          <div className="wrap">
            <p className="eyebrow">Partnership</p>
            <h1 className="h-display">Grow with Spark</h1>
            <p className="lead">
              Join hands with South India’s premier luxury salon and beauty mall ecosystem. Discover our heritage, multi-studio architecture, and collaborative expansion avenues.
            </p>
          </div>
        </section>

        {/* ==================================================================
            2. HERITAGE & ATELIER STORY SECTION
            ================================================================== */}
        <section className="section" style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--rule)' }}>
          <div className="wrap">
            <div className="contact-grid" style={{ alignItems: 'center' }}>
              {/* Left Column: Brand Story & Metrics */}
              <div>
                <p className="eyebrow">Heritage &amp; Story</p>
                <h2 className="h-section">Crafted by Byju Spark. Built for distinction.</h2>
                <p className="lead" style={{ marginTop: '20px', maxWidth: '54ch' }}>
                  Byju Spark International Salon &amp; Beauty Mall represents a premier lifestyle institution dedicated to precision aesthetics and restorative wellness. Rooted in haute French sectioning geometries, European balayage painting, and clinical derma-science, we curate bespoke rituals tailored to individual personality and hair architecture.
                </p>
                <p style={{ marginTop: '16px', color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '54ch' }}>
                  Our flagship spans specialized studios—including executive men&apos;s styling, haute couture women&apos;s ateliers, private VIP bridal suites, clinical skin treatment rooms, and Russian nail architecture. Adjacent to our service floors sits the <strong>Spark Beauty Mall</strong>, providing clients with 100% genuine international cosmetic, skincare, and bond-repair formulations with verified batch authenticity.
                </p>

                {/* 4 Authentic Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '24px 32px',
                    marginTop: '36px',
                    paddingTop: '28px',
                    borderTop: '1px solid var(--rule)',
                  }}
                >
                  <div>
                    <span style={{ font: '600 36px/1 var(--font-serif)', color: 'var(--red)' }}>15+</span>
                    <p style={{ font: '600 11px/1.3 var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: '6px' }}>
                      Years Craft &amp; Excellence
                    </p>
                    <p style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--muted)', marginTop: '2px' }}>
                      Atelier mastery in South India
                    </p>
                  </div>
                  <div>
                    <span style={{ font: '600 36px/1 var(--font-serif)', color: 'var(--red)' }}>10,000+</span>
                    <p style={{ font: '600 11px/1.3 var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: '6px' }}>
                      Clients Styled
                    </p>
                    <p style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--muted)', marginTop: '2px' }}>
                      Discerning bespoke clientele
                    </p>
                  </div>
                  <div>
                    <span style={{ font: '600 36px/1 var(--font-serif)', color: 'var(--red)' }}>8</span>
                    <p style={{ font: '600 11px/1.3 var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: '6px' }}>
                      Specialized Studios
                    </p>
                    <p style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--muted)', marginTop: '2px' }}>
                      Comprehensive luxury destination
                    </p>
                  </div>
                  <div>
                    <span style={{ font: '600 36px/1 var(--font-serif)', color: 'var(--red)' }}>50+</span>
                    <p style={{ font: '600 11px/1.3 var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: '6px' }}>
                      Certified Artists
                    </p>
                    <p style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--muted)', marginTop: '2px' }}>
                      Internationally trained team
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Feature Showcase */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '8px 44px 8px 44px',
                  overflow: 'hidden',
                  border: '1px solid var(--rule)',
                  boxShadow: '0 1px 2px rgba(12, 12, 12, 0.05), 0 24px 48px -20px rgba(12, 12, 12, 0.25)',
                  backgroundColor: 'var(--white)',
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img
                    src="/images/nav/partner_with_us.jpg"
                    alt="Spark Salon Partnership"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(12, 12, 12, 0.85) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '24px',
                      color: 'var(--white)',
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--red)',
                        color: 'var(--white)',
                        font: '600 10px/1 var(--font-sans)',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        marginBottom: '10px',
                      }}
                    >
                      Flagship Standards
                    </span>
                    <h3 style={{ font: '600 22px/1.15 var(--font-serif)', color: 'var(--white)', margin: 0 }}>
                      An Ecosystem Built for Scale &amp; Distinction
                    </h3>
                  </div>
                </div>

                <div style={{ padding: '20px 24px', backgroundColor: 'var(--white)' }}>
                  <p style={{ margin: 0, font: '500 12px/1.4 var(--font-sans)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Flagship Atelier Location:
                  </p>
                  <p style={{ margin: '6px 0 0', font: '500 14px/1.4 var(--font-sans)', color: 'var(--ink)' }}>
                    {displayAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. PROPOSAL FORM & EXECUTIVE DESK
            ================================================================== */}
        <section className="section" id="proposal">
          <div className="wrap contact-grid">
            {/* Left Column: Interactive Proposal Form */}
            <div className="contact-form-panel">
              <form className="form" onSubmit={handleSubmit} noValidate>
                <div>
                  <p className="eyebrow">Executive Desk</p>
                  <h2 className="h-section">Submit your proposal</h2>
                </div>

                <div className="partner-intro-banner">
                  <span>
                    Submit your details below to share your proposal directly with our executive management desk.
                  </span>
                </div>

                {/* Name & Phone */}
                <div className="form-row">
                  <div className={`field ${nameError ? 'error' : ''}`}>
                    <label htmlFor="pName">Full Name *</label>
                    <input
                      id="pName"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError(false);
                      }}
                    />
                    <p className="err">Please enter your name.</p>
                  </div>

                  <div className={`field ${phoneError ? 'error' : ''}`}>
                    <label htmlFor="pPhone">Phone / WhatsApp *</label>
                    <input
                      id="pPhone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError(false);
                      }}
                    />
                    <p className="err">Please enter a valid phone number.</p>
                  </div>
                </div>

                {/* Email & Target City */}
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="pEmail">Email Address</label>
                    <input
                      id="pEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className={`field ${cityError ? 'error' : ''}`}>
                    <label htmlFor="pCity">Target City / Location *</label>
                    <input
                      id="pCity"
                      type="text"
                      required
                      placeholder="e.g. Kozhikode, Kochi, Bangalore"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setCityError(false);
                      }}
                    />
                    <p className="err">Please enter your target location.</p>
                  </div>
                </div>

                {/* Proposal Notes */}
                <div className="field">
                  <label htmlFor="pNotes">Proposal Notes</label>
                  <textarea
                    id="pNotes"
                    placeholder="Share brief notes on your background, property, or discussion proposal..."
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                  />
                </div>

                <div className="form-foot">
                  <button className="btn btn-red" type="submit">
                    Send
                  </button>
                  <p className="fine">Direct dispatch to Spark executive desk.</p>
                </div>

                {submitted && (
                  <div
                    style={{
                      padding: '18px 22px',
                      borderRadius: '8px 24px 8px 24px',
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--rule)',
                      borderLeft: '4px solid var(--red)',
                      marginTop: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={20} color="var(--red)" />
                      <strong style={{ font: '600 14px var(--font-sans)', color: 'var(--ink)' }}>
                        Proposal Submitted!
                      </strong>
                    </div>
                    <p style={{ margin: '8px 0 12px', fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                      Thank you for contacting us. Your proposal details have been forwarded to our director. If your message did not open automatically, click below:
                    </p>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-black"
                        style={{ height: '36px', fontSize: '10.5px' }}
                      >
                        Open Message Again →
                      </a>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Direct Desk & Quick Connect */}
            <div className="contact-right-stack">
              {/* Coordinates Card */}
              <div className="social-panel">
                <div className="social-panel-head">
                  <div>
                    <p className="eyebrow">Direct Desk</p>
                    <h3 className="social-panel-title">Spark Coordinates</h3>
                  </div>
                  <p className="social-panel-note">Headquarters &amp; Flagship</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={18} color="var(--red)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)' }}>
                        Flagship Address
                      </p>
                      <p style={{ margin: '4px 0 0', font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--muted)' }}>
                        {displayAddress}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Phone size={18} color="var(--red)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)' }}>
                        Direct Telephone
                      </p>
                      <p style={{ margin: '4px 0 0', font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--muted)' }}>
                        <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {displayPhone}
                        </a>
                        {' / '}
                        <a href={`tel:${SITE_CONFIG.contact.phoneSecondary.replace(/\s+/g, '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {SITE_CONFIG.contact.phoneSecondary}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Mail size={18} color="var(--red)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)' }}>
                        Executive Email
                      </p>
                      <p style={{ margin: '4px 0 0', font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--muted)' }}>
                        <a href={`mailto:${displayEmail}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {displayEmail}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Instant Connect Tile */}
                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--rule)' }}>
                  <p style={{ font: '600 11px/1.2 var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '12px' }}>
                    Direct Consultation
                  </p>
                  <a
                    href={`https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(
                      'Hello Spark Salon Executive Desk, I would like to enquire about partnership opportunities.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-black"
                    style={{ width: '100%' }}
                  >
                    Direct Consultation →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. SIGNATURE FINAL CTA BAND
            ================================================================== */}
        <FinalCta />
      </main>
    </div>
  );
}
