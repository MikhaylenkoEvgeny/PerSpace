import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedState } from '@/lib/seed';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

function parseSnapshotPayload(payload: string) {
  try {
    const state = await loadWorkspaceState();
    return NextResponse.json({ state });
  } catch (error) {
    console.error('workspace_load_failed', error);
    return NextResponse.json({ state: null, error: 'database_unavailable' }, { status: 503 });
  }
}

function getAuthorizedUserId() {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

export async function GET() {
  const userId = getAuthorizedUserId();

  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const snapshot = await prisma.workspaceSnapshot.findUnique({ where: { userId } });
  const state = snapshot ? parseSnapshotPayload(snapshot.payload) : seedState;

  return NextResponse.json({ state });
}

export async function POST(request: Request) {
  const userId = getAuthorizedUserId();

  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object' || !('state' in body)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const snapshot = await prisma.workspaceSnapshot.upsert({
    where: { userId },
    create: {
      userId,
      payload: JSON.stringify(body.state)
    },
    update: {
      payload: JSON.stringify(body.state)
    }
  });

  return NextResponse.json({ ok: true, updatedAt: snapshot.updatedAt });
}
