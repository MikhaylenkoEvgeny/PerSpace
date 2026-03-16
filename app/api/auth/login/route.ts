import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'perspace-auth';
const AUTH_VALUE = 'authorized';
const LOGIN = 'mikhaylenko.evg@gmail.com';
const PASSWORD = 'secret2026';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { login?: string; password?: string } | null;

  if (!body || body.login !== LOGIN || body.password !== PASSWORD) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, AUTH_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  return response;
}
