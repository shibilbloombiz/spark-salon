'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Phone, User, MessageSquare } from 'lucide-react';
import { StudioData, StudioService, StudioArtist } from '@/lib/data/studios';
import { SITE_CONFIG } from '@/config/site.config';

interface StudioRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio: StudioData;
  preselectedService?: string;
  preselectedArtist?: string;
}

export default function StudioRequestModal({
  isOpen,
  onClose,
  studio,
  preselectedService = '',
  preselectedArtist = '',
}: StudioRequestModalProps) {
  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState(preselectedService);
  const [artist, setArtist] = useState(preselectedArtist);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    } else if (studio.services.length > 0 && !service) {
      setService(studio.services[0].name);
    }
  }, [preselectedService, studio]);

  useEffect(() => {
    if (preselectedArtist) {
      setArtist(preselectedArtist);
    }
  }, [preselectedArtist]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your full name.';
    if (!phone.trim()) {
      errs.phone = 'Please provide your contact number.';
    } else if (phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number (at least 8 digits).';
    }
    if (!service) errs.service = 'Please select a service.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    // 1. Structure the official WhatsApp message according to the prompt instructions
    const artistLine = artist ? `Artist: ${artist}\n` : '';
    const messageLine = message.trim() ? `\nAdditional Message:\n${message.trim()}\n` : '';

    const whatsappMessage = `Hello Byju Spark Saloon International,

I would like to enquire about a service.

Studio: ${studio.name}
Service: ${service}
${artistLine}
Customer Name: ${name.trim()}
Phone: ${phone.trim()}
${messageLine}
Please contact me regarding this enquiry.

Thank you.`;

    // 2. Safely URL-encode the message
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = SITE_CONFIG.contact.whatsapp.replace(/\D/g, '') || '918543097899';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // 3. Optional background booking log to ensure records in salon system
    try {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studio: studio.name,
          service,
          tier: artist || 'Master Stylist',
          date: new Date().toISOString().split('T')[0],
          timeSlot: 'Flexible / WhatsApp Consultation',
          guestName: name.trim(),
          guestPhone: phone.trim(),
          specialRequests: `Studio Page WhatsApp Request: ${message.trim()}`,
        }),
      }).catch((err) => console.warn('Background reservation log error:', err));
    } catch {
      // Non-blocking
    }

    setSubmitted(true);
    setIsSubmitting(false);

    // 4. Open WhatsApp window after a short feedback pulse
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-modal-title"
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(3, 3, 5, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        animation: 'sparkFadeIn 0.25s ease-out forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="squircle-lg"
        data-lenis-prevent
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          backgroundColor: 'rgba(12, 12, 16, 0.96)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15)',
          padding: 'clamp(24px, 5vw, 36px)',
          color: '#ffffff',
        }}
      >
        {/* Top Gold Specular Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '30px',
            right: '30px',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 25%, rgba(255, 248, 220, 0.9) 50%, rgba(212, 175, 55, 0.3) 75%, transparent 100%)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Request Modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <CheckCircle2 size={34} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.6rem',
                color: '#ffffff',
                marginBottom: '10px',
              }}
            >
              Redirecting to WhatsApp
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#b8b8c4',
                marginBottom: '24px',
              }}
            >
              We have generated your formal reservation enquiry with the selected studio and service.
              <strong style={{ color: '#d4af37', display: 'block', marginTop: '6px' }}>
                Please tap "Send" in WhatsApp to submit your message directly to our salon concierge.
              </strong>
            </p>

            <button
              onClick={onClose}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
                color: '#08080c',
                border: 'none',
                fontFamily: 'var(--font-sans-display)',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Done & Return to Studio
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#f3e5ab',
                  fontFamily: 'var(--font-sans-display)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <Sparkles size={12} color="#e5c158" />
                <span>Concierge Service Request</span>
              </div>

              <h2
                id="studio-modal-title"
                style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 1.95rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0 0 6px 0',
                  lineHeight: 1.2,
                }}
              >
                {studio.name}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-sans-display)',
                  fontSize: '0.84rem',
                  color: '#9e9ea8',
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                Request your bespoke appointment. Your enquiry opens directly in WhatsApp with all details pre-filled.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Studio (Preselected Indicator) */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: '#c9a45c',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  Selected Studio
                </label>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  {studio.name}
                </div>
              </div>

              {/* Service Selection */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="service-select"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: '#c9a45c',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  Select Service / Ritual *
                </label>
                <select
                  id="service-select"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    if (errors.service) setErrors((prev) => ({ ...prev, service: '' }));
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#16161d',
                    border: errors.service ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {studio.services.map((srv) => (
                    <option key={srv.id} value={srv.name} style={{ backgroundColor: '#16161d', color: '#fff' }}>
                      {srv.name} — {srv.price} ({srv.duration})
                    </option>
                  ))}
                  <option value="Bespoke Studio Consultation" style={{ backgroundColor: '#16161d', color: '#fff' }}>
                    Bespoke In-Person Studio Consultation
                  </option>
                </select>
                {errors.service && (
                  <p style={{ color: '#ef4444', fontSize: '0.74rem', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.service}
                  </p>
                )}
              </div>

              {/* Artist Selection (Optional) */}
              {studio.artists.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="artist-select"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#c9a45c',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Preferred Artist / Director (Optional)
                  </label>
                  <select
                    id="artist-select"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#16161d',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#16161d', color: '#888' }}>
                      Any Master Stylist Available
                    </option>
                    {studio.artists.map((art) => (
                      <option key={art.id} value={art.name} style={{ backgroundColor: '#16161d', color: '#fff' }}>
                        {art.name} ({art.designation})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Guest Name & Phone Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label
                    htmlFor="guest-name"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#c9a45c',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Your Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="guest-name"
                      type="text"
                      placeholder="e.g. Rohith Menon"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: errors.name ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-sans-display)',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                    <User size={15} color="#888894" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
                  {errors.name && (
                    <p style={{ color: '#ef4444', fontSize: '0.72rem', margin: '4px 0 0 0' }}>{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="guest-phone"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans-display)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#c9a45c',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Phone / WhatsApp *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="guest-phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-sans-display)',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                    <Phone size={15} color="#888894" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
                  {errors.phone && (
                    <p style={{ color: '#ef4444', fontSize: '0.72rem', margin: '4px 0 0 0' }}>{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '22px' }}>
                <label
                  htmlFor="guest-message"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: '#c9a45c',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  Additional Message / Preferred Date
                </label>
                <textarea
                  id="guest-message"
                  rows={2}
                  placeholder="Tell us about preferred dates, occasions, or hair/skin details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans-display)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #aa8210 0%, #d4af37 50%, #f3e5ab 100%)',
                  color: '#08080c',
                  border: 'none',
                  fontFamily: 'var(--font-sans-display)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Preparing WhatsApp...' : 'Continue to WhatsApp Handoff'}</span>
              </button>

              {/* Security & Handoff Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '14px',
                  fontSize: '0.74rem',
                  color: '#9e9ea8',
                }}
              >
                <ShieldCheck size={14} color="#d4af37" />
                <span>Direct WhatsApp concierge with official number ({SITE_CONFIG.contact.phone})</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

