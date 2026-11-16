'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site.config';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import './contact.css';

type FormMode = 'contact' | 'partner';

interface FaqItem {
  question: string;
  answer: string;
}

const CONTACT_FAQS: FaqItem[] = [
  {
    question: 'How do I book an appointment at Spark Salon?',
    answer:
      'You can request a booking directly from any Studio page on our website, message our front desk through the Contact Us form above, or call/WhatsApp our reception desk during salon hours.',
  },
  {
    question: 'What are your salon hours and holiday availability?',
    answer:
      'Our flagship salon at Mavoor Road, Kottooli is open Monday to Sunday from 09:00 AM to 09:00 PM. We also remain open on most public holidays — please call ahead to confirm your preferred slot.',
  },
  {
    question: 'How do I apply to become a Spark Salon partner or franchise?',
    answer:
      'Switch the form above to "Become a Partner", enter your name, phone number, email, and proposal message, and submit. Your details are formatted into a dedicated Partnership Enquiry and sent straight to our partnership desk on WhatsApp.',
  },
  {
    question: 'How can I enquire about Spark Academy courses, dates, and fees?',
    answer:
      'Select "Academy" under the Contact Us form or call our admissions desk directly. Our counsellors share upcoming batch schedules, curriculum outlines, and fee structures by phone or email within one working day.',
  },
  {
    question: 'Are Beauty Mall products available for consultation before purchase?',
    answer:
      'Yes. Walk in to experience professional hair, skin, and grooming formulations with guidance from our stylists, or choose "Products" in the Contact Us form to check stock availability before visiting.',
  },
  {
    question: 'Is parking available when visiting the Kozhikode salon?',
    answer:
      'Yes, dedicated parking with valet assistance is available for salon and beauty mall guests at our Mavoor Rd, Kottooli location.',
  },
];

function extractHandle(url: string | undefined, fallbackHandle: string): string {
  if (!url) return fallbackHandle;
  const cleaned = url.replace(/\/+$/, '').split('/').pop();
  if (!cleaned) return fallbackHandle;
  return cleaned.startsWith('@') ? cleaned : `@${cleaned}`;
}

function normalizeWhatsAppDigits(raw: string | undefined, fallback: string): string {
  const digits = (raw || fallback).replace(/\D/g, '');
  return digits || fallback.replace(/\D/g, '');
}

function buildPartnerWhatsAppUrl(
  whatsappDigits: string,
  payload: { name: string; phone: string; email: string; message: string }
): string {
  const text = encodeURIComponent(
    `*SPARK INTERNATIONAL — PARTNERSHIP ENQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello Spark Partnership Team,\n` +
      `I would like to explore partnering with Spark International.\n\n` +
      `• *Partner Name:* ${payload.name.trim()}\n` +
      `• *Phone Number:* ${payload.phone.trim()}\n` +
      `• *Email Address:* ${payload.email.trim()}\n` +
      `• *Proposal / Message:*\n${payload.message.trim()}\n\n` +
      `_Sent via Spark Salon Contact Page (Become a Partner)_`
  );
  return `https://wa.me/${whatsappDigits}?text=${text}`;
}

export default function ContactPage() {
  const settings = useSiteSettings();

  const [formMode, setFormMode] = useState<FormMode>('contact');

  // Contact Us state
  const [selectedTopic, setSelectedTopic] = useState<'Services' | 'Products' | 'Academy' | 'Something else'>('Services');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [when, setWhen] = useState('Email');
  const [message, setMessage] = useState('');

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [msgError, setMsgError] = useState(false);
  const [contactStatus, setContactStatus] = useState<{ isOk: boolean; text: string } | null>(null);

  // Become a Partner state
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerMessage, setPartnerMessage] = useState('');

  const [partnerNameError, setPartnerNameError] = useState(false);
  const [partnerPhoneError, setPartnerPhoneError] = useState(false);
  const [partnerEmailError, setPartnerEmailError] = useState(false);
  const [partnerMsgError, setPartnerMsgError] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<{
    isOk: boolean;
    text: string;
    whatsappUrl?: string;
  } | null>(null);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const phoneOk = (v: string) => v.replace(/\D/g, '').length >= 7;

  const displayPhone = settings.phone || SITE_CONFIG.contact.phone;
  const displayEmail = settings.email || SITE_CONFIG.contact.email;
  const displayAddress = settings.address || SITE_CONFIG.contact.address.full;
  const whatsappDigits = normalizeWhatsAppDigits(settings.whatsappNumber, SITE_CONFIG.contact.whatsapp);

  const instagramUrl = settings.instagram || SITE_CONFIG.socials.instagram;
  const facebookUrl = settings.facebook || SITE_CONFIG.socials.facebook;
  const youtubeUrl = settings.youtube || SITE_CONFIG.socials.youtube;
  const whatsappUrl = `https://wa.me/${whatsappDigits}`;

  const switchMode = (nextMode: FormMode) => {
    setFormMode(nextMode);
    setContactStatus(null);
    setPartnerStatus(null);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameBad = !name.trim();
    const isEmailBad = !emailOk(email);
    const isMsgBad = !message.trim();

    setNameError(isNameBad);
    setEmailError(isEmailBad);
    setMsgError(isMsgBad);

    if (isNameBad || isEmailBad || isMsgBad) {
      setContactStatus({
        isOk: false,
        text: 'Please complete the highlighted fields.',
      });
      return;
    }

    setContactStatus({
      isOk: true,
      text: `Thank you, ${name.trim()}. Your ${selectedTopic.toLowerCase()} message is noted. We reply by ${when.toLowerCase()} within one working day.`,
    });

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameBad = !partnerName.trim();
    const isPhoneBad = !phoneOk(partnerPhone);
    const isEmailBad = !emailOk(partnerEmail);
    const isMsgBad = !partnerMessage.trim();

    setPartnerNameError(isNameBad);
    setPartnerPhoneError(isPhoneBad);
    setPartnerEmailError(isEmailBad);
    setPartnerMsgError(isMsgBad);

    if (isNameBad || isPhoneBad || isEmailBad || isMsgBad) {
      setPartnerStatus({
        isOk: false,
        text: 'Please enter your name, valid phone number, email, and partnership message.',
      });
      return;
    }

    const formattedUrl = buildPartnerWhatsAppUrl(whatsappDigits, {
      name: partnerName,
      phone: partnerPhone,
      email: partnerEmail,
      message: partnerMessage,
    });

    window.open(formattedUrl, '_blank', 'noopener,noreferrer');

    setPartnerStatus({
      isOk: true,
      text: `Thank you, ${partnerName.trim()}. Your Partner Enquiry template is ready in WhatsApp.`,
      whatsappUrl: formattedUrl,
    });

    setPartnerName('');
    setPartnerPhone('');
    setPartnerEmail('');
    setPartnerMessage('');
  };

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', color: 'var(--ink)' }} data-cursor-theme="light">
      <main>
        {/* Header with Marble Slot */}
        <section className="page-head">
          <div className="marble-slot" aria-hidden="true">
            <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
              <g filter="url(#marble)">
                <rect width="1000" height="800" fill="#ffffff" />
                <ellipse cx="300" cy="250" rx="300" ry="220" fill="#c8102e" />
                <ellipse cx="700" cy="530" rx="260" ry="230" fill="#0c0c0c" />
                <ellipse cx="840" cy="170" rx="170" ry="140" fill="#c8102e" />
                <ellipse cx="520" cy="430" rx="110" ry="100" fill="#ffffff" />
              </g>
            </svg>
          </div>
          <div className="wrap">
            <p className="eyebrow reveal">Contact</p>
            <h1 className="h-display reveal">Say hello</h1>
            <p className="lead reveal">
              Questions about a treatment, a product, the academy, or partnering with Spark? Choose an enquiry form below, call the salon, or visit us in person.
            </p>
          </div>
        </section>

        {/* 3 Liquid Contact Cards */}
        <section className="section" style={{ paddingBottom: '40px' }}>
          <div className="wrap contact-cards">
            {/* 01 Visit */}
            <a className="lq-card" href="#visit" data-cursor-theme="light">
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
              <span className="num-blob">01</span>
              <h3>Visit</h3>
              <p>Walk in or book ahead. We are at the address below.</p>
              <span className="detail">{displayAddress}</span>
            </a>

            {/* 02 Call */}
            <a
              className="lq-card"
              href={`tel:${displayPhone.replace(/\s+/g, '')}`}
              data-cursor-theme="light"
            >
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
              <span className="num-blob">02</span>
              <h3>Call</h3>
              <p>Speak to the front desk about a treatment or an appointment.</p>
              <span className="detail">
                {displayPhone} / {SITE_CONFIG.contact.phoneSecondary}
              </span>
            </a>

            {/* 03 Write */}
            <a className="lq-card" href={`mailto:${displayEmail}`} data-cursor-theme="light">
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
              <span className="num-blob">03</span>
              <h3>Write</h3>
              <p>Send a message for product, academy or partnership enquiries.</p>
              <span className="detail">{displayEmail}</span>
            </a>
          </div>
        </section>

        {/* Form & Side Panel */}
        <section className="section" id="message">
          <div className="wrap contact-grid">
            {/* Left Column: Strictly Two Form Types (Contact Us / Become a Partner) */}
            <div className="contact-form-panel">
              <div className="form-mode-bar">
                <span className="form-mode-label" id="formTypeLabel">
                  Select enquiry form
                </span>
                <div className="form-mode-tabs" role="tablist" aria-labelledby="formTypeLabel">
                  <button
                    type="button"
                    role="tab"
                    id="tab-contact"
                    aria-selected={formMode === 'contact'}
                    aria-controls="contactForm"
                    className="choice form-mode-tab"
                    onClick={() => switchMode('contact')}
                  >
                    Contact Us
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-partner"
                    aria-selected={formMode === 'partner'}
                    aria-controls="partnerForm"
                    className="choice form-mode-tab form-mode-tab--partner"
                    onClick={() => switchMode('partner')}
                  >
                    Become a Partner
                  </button>
                </div>
              </div>

              {formMode === 'contact' ? (
                <form className="form" id="contactForm" aria-labelledby="tab-contact" onSubmit={handleContactSubmit} noValidate>
                  <div>
                    <p className="eyebrow">Contact Us</p>
                    <h2 className="h-section">What can we help with?</h2>
                  </div>

                  {/* Topic Choice Group */}
                  <div className="field">
                    <label id="topicLabel">Topic</label>
                    <div className="choice-group" role="radiogroup" aria-labelledby="topicLabel" id="topics">
                      {(['Services', 'Products', 'Academy', 'Something else'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className="choice"
                          role="radio"
                          aria-checked={selectedTopic === t ? 'true' : 'false'}
                          data-value={t}
                          onClick={() => setSelectedTopic(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="form-row">
                    <div className={`field ${nameError ? 'error' : ''}`}>
                      <label htmlFor="cName">Name</label>
                      <input
                        id="cName"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameError(false);
                        }}
                      />
                      <p className="err">Please enter your name.</p>
                    </div>

                    <div className={`field ${emailError ? 'error' : ''}`}>
                      <label htmlFor="cEmail">Email</label>
                      <input
                        id="cEmail"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(false);
                        }}
                      />
                      <p className="err">Please enter a valid email address.</p>
                    </div>
                  </div>

                  {/* Phone & Contact Preference Row */}
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="cPhone">Phone (optional)</label>
                      <input
                        id="cPhone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="cWhen">Preferred contact</label>
                      <select
                        id="cWhen"
                        name="when"
                        value={when}
                        onChange={(e) => setWhen(e.target.value)}
                      >
                        <option>Email</option>
                        <option>Phone</option>
                        <option>Either</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`field ${msgError ? 'error' : ''}`}>
                    <label htmlFor="cMsg">Message</label>
                    <textarea
                      id="cMsg"
                      name="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setMsgError(false);
                      }}
                    />
                    <p className="err">Please write a short message.</p>
                  </div>

                  <div className="form-foot">
                    <button className="btn btn-red" type="submit">
                      Send message
                    </button>
                    <p className="fine">We reply within one working day.</p>
                  </div>

                  {contactStatus && (
                    <p
                      className={`form-msg ${contactStatus.isOk ? 'is-ok' : ''}`}
                      id="formMsg"
                      role="status"
                      aria-live="polite"
                    >
                      {contactStatus.text}
                    </p>
                  )}
                </form>
              ) : (
                <form className="form" id="partnerForm" aria-labelledby="tab-partner" onSubmit={handlePartnerSubmit} noValidate>
                  <div>
                    <p className="eyebrow">Partnership Desk</p>
                    <h2 className="h-section">Become a partner</h2>
                  </div>

                  <div className="partner-intro-banner">
                    <span>
                      <strong>Direct Partner WhatsApp Dispatch:</strong> Interested in salon franchising, brand collaborations, or distribution with Spark International? Submit your details below to send a formatted Partner Proposal straight to our WhatsApp desk.
                    </span>
                  </div>

                  {/* Partner Name & Phone Number Row */}
                  <div className="form-row">
                    <div className={`field ${partnerNameError ? 'error' : ''}`}>
                      <label htmlFor="pName">Name</label>
                      <input
                        id="pName"
                        name="partnerName"
                        autoComplete="name"
                        placeholder="Your full name"
                        value={partnerName}
                        onChange={(e) => {
                          setPartnerName(e.target.value);
                          setPartnerNameError(false);
                        }}
                      />
                      <p className="err">Please enter your name.</p>
                    </div>

                    <div className={`field ${partnerPhoneError ? 'error' : ''}`}>
                      <label htmlFor="pPhone">Phone Number</label>
                      <input
                        id="pPhone"
                        name="partnerPhone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={partnerPhone}
                        onChange={(e) => {
                          setPartnerPhone(e.target.value);
                          setPartnerPhoneError(false);
                        }}
                      />
                      <p className="err">Please enter a valid phone number.</p>
                    </div>
                  </div>

                  {/* Partner Email */}
                  <div className={`field ${partnerEmailError ? 'error' : ''}`}>
                    <label htmlFor="pEmail">Email</label>
                    <input
                      id="pEmail"
                      name="partnerEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={partnerEmail}
                      onChange={(e) => {
                        setPartnerEmail(e.target.value);
                        setPartnerEmailError(false);
                      }}
                    />
                    <p className="err">Please enter a valid email address.</p>
                  </div>

                  {/* Partner Message */}
                  <div className={`field ${partnerMsgError ? 'error' : ''}`}>
                    <label htmlFor="pMsg">Message</label>
                    <textarea
                      id="pMsg"
                      name="partnerMessage"
                      placeholder="Tell us about your city, investment background, or partnership vision..."
                      value={partnerMessage}
                      onChange={(e) => {
                        setPartnerMessage(e.target.value);
                        setPartnerMsgError(false);
                      }}
                    />
                    <p className="err">Please include a brief partnership message.</p>
                  </div>

                  <div className="form-foot">
                    <button className="btn btn-red btn-wa-inline" type="submit">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.07c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.96-4.39-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.58.83 2.02.9 2.17.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.31.38-.44.51-.14.14-.29.29-.12.58.17.29.75 1.24 1.62 2.01 1.12.99 2.06 1.3 2.35 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.7-.17 1.38z" />
                      </svg>
                      <span>Send Partner Enquiry via WhatsApp</span>
                    </button>
                    <p className="fine">Uses a dedicated partner WhatsApp template.</p>
                  </div>

                  {partnerStatus && (
                    <div
                      className={`form-msg ${partnerStatus.isOk ? 'is-ok' : ''}`}
                      id="partnerFormMsg"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="form-msg-inner">
                        <span>{partnerStatus.text}</span>
                        {partnerStatus.whatsappUrl && (
                          <a
                            href={partnerStatus.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="form-msg-wa-link"
                          >
                            Open WhatsApp ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Right Column: Dark Hours Card + Designed Social Channels Card (eliminates blank space) */}
            <div className="contact-right-stack">
              <aside className="side">
                <div className="marble-slot" aria-hidden="true">
                  <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
                    <g filter="url(#marble)">
                      <rect width="1000" height="800" fill="#0c0c0c" />
                      <ellipse cx="260" cy="260" rx="260" ry="200" fill="#c8102e" />
                      <ellipse cx="720" cy="560" rx="200" ry="180" fill="#c8102e" opacity="0.7" />
                    </g>
                  </svg>
                </div>
                <div className="side-inner">
                  <h3>Hours</h3>
                  <ul>
                    <li>
                      <span>Monday to Sunday</span>
                      <span>{settings.openingHours || '09:00 AM – 09:00 PM'}</span>
                    </li>
                    <li>
                      <span>Public Holidays</span>
                      <span>Open (Call to confirm)</span>
                    </li>
                  </ul>
                  <p className="label">Academy enquiries</p>
                  <p>Course dates and fees are shared by phone or email. Get in touch with our admissions desk.</p>
                  <p className="label">Visit the salon</p>
                  <p>{displayAddress}</p>
                </div>
              </aside>

              {/* Connect & Follow Panel */}
              <aside className="social-panel" aria-label="Official social channels">
                <div className="social-panel-head">
                  <div>
                    <p className="eyebrow">Connect &amp; Follow</p>
                    <h3 className="social-panel-title">Find us online</h3>
                  </div>
                  <p className="social-panel-note">Daily transformations &amp; concierge chat</p>
                </div>

                <div className="social-links-grid">
                  {/* Instagram */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-tile"
                    aria-label="Follow Spark Salon on Instagram"
                  >
                    <span className="social-tile-icon" aria-hidden="true">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </span>
                    <span className="social-tile-meta">
                      <span className="social-tile-name">Instagram</span>
                      <span className="social-tile-sub">{extractHandle(instagramUrl, '@byjuspark')}</span>
                    </span>
                    <span className="social-tile-arrow" aria-hidden="true">↗</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-tile"
                    aria-label="Follow Spark Salon on Facebook"
                  >
                    <span className="social-tile-icon" aria-hidden="true">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </span>
                    <span className="social-tile-meta">
                      <span className="social-tile-name">Facebook</span>
                      <span className="social-tile-sub">{extractHandle(facebookUrl, '@byjuspark')}</span>
                    </span>
                    <span className="social-tile-arrow" aria-hidden="true">↗</span>
                  </a>

                  {/* YouTube */}
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-tile"
                    aria-label="Watch Spark Salon on YouTube"
                  >
                    <span className="social-tile-icon" aria-hidden="true">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span className="social-tile-meta">
                      <span className="social-tile-name">YouTube</span>
                      <span className="social-tile-sub">{extractHandle(youtubeUrl, '@byjuspark')}</span>
                    </span>
                    <span className="social-tile-arrow" aria-hidden="true">↗</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-tile"
                    aria-label="Chat with Spark Salon on WhatsApp"
                  >
                    <span className="social-tile-icon" aria-hidden="true">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.07c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.96-4.39-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.58.83 2.02.9 2.17.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.31.38-.44.51-.14.14-.29.29-.12.58.17.29.75 1.24 1.62 2.01 1.12.99 2.06 1.3 2.35 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.7-.17 1.38z" />
                      </svg>
                    </span>
                    <span className="social-tile-meta">
                      <span className="social-tile-name">WhatsApp</span>
                      <span className="social-tile-sub">{displayPhone}</span>
                    </span>
                    <span className="social-tile-arrow" aria-hidden="true">↗</span>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Location Block */}
        <section className="section" id="visit" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <div className="wrap">
            <div className="map-frame">
              <div className="marble-slot" aria-hidden="true">
                <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
                  <g filter="url(#marble)">
                    <rect width="1000" height="800" fill="#0c0c0c" />
                    <ellipse cx="200" cy="200" rx="240" ry="200" fill="#c8102e" />
                    <ellipse cx="800" cy="600" rx="260" ry="200" fill="#ffffff" opacity="0.14" />
                  </g>
                </svg>
              </div>
              <span className="pin" aria-hidden="true" />
              <div className="caption">
                <h3>Find the salon</h3>
                <p>
                  {displayAddress}. Located conveniently in the heart of Calicut with valet parking available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="section faq-section" id="faq" aria-labelledby="faqHeading">
          <div className="wrap">
            <div className="faq-shell">
              <div className="faq-intro">
                <p className="eyebrow">Frequently Asked</p>
                <h2 className="h-section" id="faqHeading">
                  Quick answers before you reach out
                </h2>
                <p className="faq-intro-copy">
                  Everything guests, students, and prospective partners usually ask our front desk and partnership team.
                </p>
                <a
                  href="#message"
                  className="btn"
                  onClick={() => switchMode('partner')}
                >
                  Partner With Spark
                </a>
              </div>

              <div className="faq-list">
                {CONTACT_FAQS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const panelId = `faq-panel-${idx}`;
                  const buttonId = `faq-trigger-${idx}`;
                  return (
                    <div key={item.question} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        id={buttonId}
                        className="faq-trigger"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
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
                          aria-labelledby={buttonId}
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
      </main>
    </div>
  );
}
