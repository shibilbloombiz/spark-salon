'use client';

import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site.config';

export interface SiteSettingsData {
  siteName: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHours?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

let cachedSettings: SiteSettingsData | null = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsData>(() => cachedSettings || {
    siteName: SITE_CONFIG.name,
    logoUrl: '',
    phone: SITE_CONFIG.contact.phone,
    whatsappNumber: SITE_CONFIG.contact.whatsapp,
    email: SITE_CONFIG.contact.email,
    address: SITE_CONFIG.contact.address.full,
    openingHours: SITE_CONFIG.contact.hours,
    instagram: SITE_CONFIG.socials.instagram,
    facebook: SITE_CONFIG.socials.facebook,
    youtube: SITE_CONFIG.socials.youtube,
  });

  useEffect(() => {
    let isMounted = true;
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.data && isMounted) {
          cachedSettings = data.data;
          setSettings(data.data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
}

