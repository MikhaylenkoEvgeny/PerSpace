import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedState } from '@/lib/seed';

const USER_KEY = 'local-single-user';

function parseSnapshotPayload(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {
    return seedState;
  }
}

export async function GET() {
  const snapshot = await prisma.workspaceSnapshot.findUnique({ where: { userKey: USER_KEY } });
  const state = snapshot ? parseSnapshotPayload(snapshot.payload) : seedState;

  return NextResponse.json({ state });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body || typeof body !== 'object' || !('state' in body)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const snapshot = await prisma.workspaceSnapshot.upsert({
    where: { userKey: USER_KEY },
    create: {
      userKey: USER_KEY,
      payload: JSON.stringify(body.state)
    },
    update: {
      payload: JSON.stringify(body.state)
    }
  });

  return NextResponse.json({ ok: true, updatedAt: snapshot.updatedAt });
}
