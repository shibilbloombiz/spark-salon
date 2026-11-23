import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site.config';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:5000';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. If backend server is running, attempt to fetch live settings with a short timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch(`${BACKEND_URL}/api/settings`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend offline / ECONNREFUSED — gracefully fall back to default site configuration
  }

  // 2. Fallback response matching ISettings format without throwing proxy errors
  return NextResponse.json({
    success: true,
    data: {
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
    },
  });
}
