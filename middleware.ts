import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

function normalizePath(pathname: string) {
  return pathname.startsWith('/perSpace') ? pathname.replace('/perSpace', '') || '/' : pathname;
}

export function middleware(request: NextRequest) {
  const normalizedPath = normalizePath(request.nextUrl.pathname);

  const publicPaths = new Set(['/login', '/api/auth/login']);
  const isPublicAsset =
    normalizedPath.startsWith('/_next') ||
    normalizedPath.startsWith('/uploads') ||
    normalizedPath.startsWith('/icons') ||
    normalizedPath === '/manifest.webmanifest' ||
    normalizedPath === '/favicon.ico';

  if (isPublicAsset || publicPaths.has(normalizedPath)) {
    return NextResponse.next();
  }

  const userId = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthorized = Boolean(userId);

  if (isAuthorized && normalizedPath === '/login') {
    return NextResponse.redirect(new URL('/perSpace/', request.url));
  }

  if (!isAuthorized) {
    if (normalizedPath.startsWith('/api/')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const loginUrl = new URL('/perSpace/login', request.url);
    loginUrl.searchParams.set('next', normalizedPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*).*)', '/']
};
