import { NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:5000';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // 1. If backend server is running, attempt to fetch live products with short timeout
  try {
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const dest = queryString
      ? `${BACKEND_URL}/api/products?${queryString}`
      : `${BACKEND_URL}/api/products`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch(dest, {
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
    // Backend offline / ECONNREFUSED — gracefully fall back
  }

  // 2. Fallback response so frontend uses its internal catalogue without throwing proxy errors
  return NextResponse.json({
    success: true,
    count: 0,
    data: [],
  });
}
