import { NextResponse } from 'next/server';
import { INITIAL_COURSES } from '@/lib/data/academyCourses';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:5000';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. If backend server is running, attempt to fetch live courses with short timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch(`${BACKEND_URL}/api/academy`, {
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
    // Backend offline / ECONNREFUSED — gracefully fall back to local seed courses
  }

  // 2. Fallback response matching Academy schema
  return NextResponse.json({
    success: true,
    count: INITIAL_COURSES.length,
    data: INITIAL_COURSES,
    courses: INITIAL_COURSES,
  });
}
