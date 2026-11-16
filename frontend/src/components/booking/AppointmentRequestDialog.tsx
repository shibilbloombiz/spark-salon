'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STUDIOS_DATA } from '@/lib/data/studios';
import { SITE_CONFIG } from '@/config/site.config';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import './AppointmentRequestDialog.css';

export interface AppointmentServiceOption {
  name: string;
  price?: string;
}

export interface AppointmentArtistOption {
  name: string;
  designation?: string;
}

export interface AppointmentConfig {
  studioName: string;
  services: AppointmentServiceOption[];
  artists: AppointmentArtistOption[];
}

export interface OpenAppointmentOptions {
  service?: string | number;
  artist?: string | number;
  trigger?: HTMLElement | null;
}

interface AppointmentRequestDialogProps {
  config: AppointmentConfig | null;
  registerOpenFn: (fn: (opts?: OpenAppointmentOptions) => void) => () => void;
}

const TIMES = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

function getDefaultConfig(): AppointmentConfig {
  const services: AppointmentServiceOption[] = [];
  const seenArtists = new Set<string>();
  const artists: AppointmentArtistOption[] = [];

  Object.values(STUDIOS_DATA).forEach((studio) => {
    studio.services.forEach((s) => {
      services.push({
        name: `${s.name} — ${studio.name}`,
        price: s.price,
      });
    });
    studio.artists.forEach((a) => {
      if (!seenArtists.has(a.name)) {
        seenArtists.add(a.name);
        artists.push({
          name: a.name,
          designation: a.designation,
        });
      }
    });
  });

  return {
    studioName: 'Spark International Salon',
    services,
    artists,
  };
}

const handledClickEvents = new WeakSet<Event>();

export function markBookingClickHandled(nativeEvent?: Event | null) {
  if (nativeEvent) {
    handledClickEvents.add(nativeEvent);
  }
}

export default function AppointmentRequestDialog({
  config,
  registerOpenFn,
}: AppointmentRequestDialogProps) {
  const settings = useSiteSettings();
  const dlgRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const readyLinkRef = useRef<HTMLAnchorElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const lastClickedTriggerRef = useRef<HTMLElement | null>(null);

  const defaultConfig = useMemo(() => getDefaultConfig(), []);
  const activeConfig = config || defaultConfig;

  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceIdx, setSelectedServiceIdx] = useState('');
  const [selectedArtistIdx, setSelectedArtistIdx] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSummaryError, setShowSummaryError] = useState(false);
  const [requestReady, setRequestReady] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }, []);

  const restoreScrollAndFocus = useCallback(() => {
    setIsOpen(false);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    lenis?.start?.();

    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && opener.isConnected && typeof opener.focus === 'function') {
      requestAnimationFrame(() => opener.focus());
    }
  }, []);

  const closeDialog = useCallback(() => {
    const dlg = dlgRef.current;
    if (dlg && dlg.open) {
      dlg.close();
    } else {
      restoreScrollAndFocus();
    }
  }, [restoreScrollAndFocus]);

  const openDialog = useCallback(
    (opts?: OpenAppointmentOptions) => {
      const dlg = dlgRef.current;
      if (!dlg) return;

      const trigger =
        opts?.trigger ||
        lastClickedTriggerRef.current ||
        (typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null);
      if (trigger && trigger !== document.body && !dlg.contains(trigger)) {
        openerRef.current = trigger;
      }

      // Reset form, hide all errors, clear aria-invalid, and hide success card on every open
      setFullName('');
      setPhone('');
      setSelectedServiceIdx(
        opts?.service !== undefined && opts.service !== '' ? String(opts.service) : ''
      );
      setSelectedArtistIdx(
        opts?.artist !== undefined && opts.artist !== '' ? String(opts.artist) : ''
      );
      setPreferredDate('');
      setPreferredTime('');
      setNotes('');
      setErrors({});
      setShowSummaryError(false);
      setRequestReady(false);
      setWhatsAppUrl('');

      const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
      lenis?.stop?.();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      if (!dlg.open) {
        dlg.showModal();
      }
      setIsOpen(true);

      requestAnimationFrame(() => {
        nameRef.current?.focus();
      });
    },
    []
  );

  // Register open function with SiteShell
  useEffect(() => registerOpenFn(openDialog), [registerOpenFn, openDialog]);

  // Listen for native <dialog> close event (Esc or dlg.close())
  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;

    const handleClose = () => {
      restoreScrollAndFocus();
    };

    dlg.addEventListener('close', handleClose);
    return () => {
      dlg.removeEventListener('close', handleClose);
    };
  }, [restoreScrollAndFocus]);

  // Safety cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;
      lenis?.start?.();
    };
  }, []);

  // Capture exact clicked trigger + delegated click listener for [data-open="appt"]
  useEffect(() => {
    const onCaptureClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest('[data-open="appt"], button, a') as HTMLElement | null;
      if (el && !dlgRef.current?.contains(el)) {
        lastClickedTriggerRef.current = el;
      }
    };

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest('[data-open="appt"]') as HTMLElement | null;
      if (!trigger) return;

      e.preventDefault();
      if (handledClickEvents.has(e)) return;
      handledClickEvents.add(e);

      const serviceAttr = trigger.getAttribute('data-service');
      const artistAttr = trigger.getAttribute('data-artist');
      openDialog({
        service: serviceAttr !== null ? serviceAttr : undefined,
        artist: artistAttr !== null ? artistAttr : undefined,
        trigger,
      });
    };

    document.addEventListener('click', onCaptureClick, true);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('click', onCaptureClick, true);
      document.removeEventListener('click', onDocClick);
    };
  }, [openDialog]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const digits = cleanPhone.replace(/\D/g, '');
    const phoneCharsOk = /^[+\d\s()-]+$/.test(cleanPhone);
    const cleanNotes = notes.trim();

    const nextErrors: Record<string, string> = {};
    if (!cleanName) {
      nextErrors.name = 'Enter your name.';
    }
    if (!cleanPhone || digits.length < 8 || !phoneCharsOk) {
      nextErrors.phone = 'Enter a phone number with at least 8 digits.';
    }
    if (!selectedServiceIdx) {
      nextErrors.service = 'Choose a service.';
    }
    if (!preferredDate || preferredDate < todayStr) {
      nextErrors.date = 'Choose today or a later date.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setShowSummaryError(true);
      setRequestReady(false);
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector(
          '[aria-invalid="true"]'
        ) as HTMLElement | null;
        firstInvalid?.focus();
      });
      return;
    }

    setErrors({});
    setShowSummaryError(false);

    const chosenService =
      selectedServiceIdx === 'unsure'
        ? 'Not sure yet'
        : activeConfig.services[Number(selectedServiceIdx)]?.name || 'Not sure yet';
    const chosenArtist =
      selectedArtistIdx !== ''
        ? activeConfig.artists[Number(selectedArtistIdx)]?.name || 'No preference'
        : 'No preference';
    const chosenTime = preferredTime || 'Any time';

    const lines = [
      `Appointment request, ${activeConfig.studioName}`,
      `Name: ${cleanName}`,
      `Phone: ${cleanPhone}`,
      `Service: ${chosenService}`,
      `Artist: ${chosenArtist}`,
      `Date: ${preferredDate}`,
      `Time: ${chosenTime}`,
    ];
    if (cleanNotes) {
      lines.push(`Notes: ${cleanNotes}`);
    }

    const rawWa = String(settings?.whatsappNumber || SITE_CONFIG.contact.whatsapp || '918543097899');
    const waDigits = rawWa.replace(/\D/g, '');
    const url = `https://wa.me/${waDigits}?text=${encodeURIComponent(lines.join('\n'))}`;

    setWhatsAppUrl(url);
    setRequestReady(true);

    requestAnimationFrame(() => {
      readyLinkRef.current?.focus();
    });
  };

  return (
    <dialog
      ref={dlgRef}
      id="apptDlg"
      aria-labelledby="apptTitle"
      data-lenis-prevent
      data-open-state={isOpen ? 'open' : 'closed'}
      onClick={(e) => {
        if (e.target === dlgRef.current) {
          closeDialog();
        }
      }}
    >
      <div className="dlg-head">
        <div>
          <p className="dlg-eyebrow">Appointment request</p>
          <h2 id="apptTitle">Request an appointment</h2>
        </div>
        <button className="close" type="button" onClick={closeDialog}>
          Close
        </button>
      </div>

      <div className="dlg-body" data-lenis-prevent>
        <form ref={formRef} id="apptForm" className="appt-form" noValidate onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="aName">Full name *</label>
            <input
              ref={nameRef}
              id="aName"
              name="name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={errors.name ? 'true' : undefined}
            />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="aPhone">Phone or WhatsApp *</label>
            <input
              id="aPhone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errors.phone ? 'true' : undefined}
            />
            {errors.phone && <p className="err">{errors.phone}</p>}
          </div>

          <div className="field">
            <label htmlFor="aService">Service *</label>
            <select
              id="aService"
              name="service"
              value={selectedServiceIdx}
              onChange={(e) => setSelectedServiceIdx(e.target.value)}
              aria-invalid={errors.service ? 'true' : undefined}
            >
              <option value="">Select a service</option>
              {activeConfig.services.map((s, i) => (
                <option key={`${s.name}-${i}`} value={String(i)}>
                  {s.price ? `${s.name} (${s.price})` : s.name}
                </option>
              ))}
              <option value="unsure">Not sure yet</option>
            </select>
            {errors.service && <p className="err">{errors.service}</p>}
          </div>

          <div className="field">
            <label htmlFor="aArtist">Artist</label>
            <select
              id="aArtist"
              name="artist"
              value={selectedArtistIdx}
              onChange={(e) => setSelectedArtistIdx(e.target.value)}
            >
              <option value="">No preference</option>
              {activeConfig.artists.map((a, i) => (
                <option key={`${a.name}-${i}`} value={String(i)}>
                  {a.designation ? `${a.name} — ${a.designation}` : a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="aDate">Preferred date *</label>
            <input
              id="aDate"
              name="date"
              type="date"
              min={todayStr}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              aria-invalid={errors.date ? 'true' : undefined}
            />
            {errors.date && <p className="err">{errors.date}</p>}
          </div>

          <div className="field">
            <label htmlFor="aTime">Preferred time</label>
            <select
              id="aTime"
              name="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            >
              <option value="">Any time</option>
              {TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="field wide">
            <label htmlFor="aNote">Notes</label>
            <textarea
              id="aNote"
              name="note"
              maxLength={400}
              placeholder="Hair length, colour history, anything the artist should know"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="field wide">
            <p className="hint">
              Requests are sent through WhatsApp. The studio confirms each appointment by message. There is no online payment.
            </p>
          </div>

          <div className="field wide appt-foot">
            <p className="err" id="apptErr" hidden={!showSummaryError}>
              Fix the highlighted fields to continue.
            </p>
            <button className="appt-pill-btn" type="submit">
              <span>Prepare request</span>
            </button>
          </div>
        </form>

        <div className="ready" id="ready" hidden={!requestReady}>
          <strong>Your request is ready</strong>
          <p>
            WhatsApp opens with the details filled in. Press Send there to deliver the request to the studio.
          </p>
          <a
            ref={readyLinkRef}
            className="appt-pill-btn"
            id="readyLink"
            href={whatsAppUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Open WhatsApp</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
