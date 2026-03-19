import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedState } from '@/lib/seed';
import { AUTH_COOKIE } from '@/lib/auth-cookie';
import type { WorkspaceState } from '@/lib/types';

function parseSnapshotPayload(payload: string): WorkspaceState {
  try {
    return JSON.parse(payload) as WorkspaceState;
  } catch {
    return seedState;
  }
}

function getAuthorizedUserId() {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

async function loadWorkspaceState(userId: string) {
  const snapshot = await prisma.workspaceSnapshot.findUnique({ where: { userId } });
  return snapshot ? parseSnapshotPayload(snapshot.payload) : seedState;
}

async function saveWorkspaceState(userId: string, state: WorkspaceState) {
  return prisma.workspaceSnapshot.upsert({
    where: { userId },
    create: {
      userId,
      payload: JSON.stringify(state)
    },
    update: {
      payload: JSON.stringify(state)
    }
  });
}

export async function GET() {
  const userId = getAuthorizedUserId();

  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const state = await loadWorkspaceState(userId);
    return NextResponse.json({ state });
  } catch (error) {
    console.error('workspace_load_failed', error);
    return NextResponse.json({ error: 'workspace_load_failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = getAuthorizedUserId();

  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { state?: WorkspaceState } | null;

  if (!body?.state) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  try {
    const snapshot = await saveWorkspaceState(userId, body.state);
    return NextResponse.json({ ok: true, updatedAt: snapshot.updatedAt });
  } catch (error) {
    console.error('workspace_save_failed', error);
    return NextResponse.json({ error: 'workspace_save_failed' }, { status: 500 });
  }
}
