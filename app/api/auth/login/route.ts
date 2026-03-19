import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { login?: string; password?: string } | null;
  const login = body?.login?.trim().toLowerCase();
  const password = body?.password;

  if (!login || !password) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: login } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, userId: user.id });
  response.cookies.set(AUTH_COOKIE, user.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  return response;
}
