import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/'
  });

  return response;
}
