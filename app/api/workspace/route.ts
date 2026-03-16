import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedState } from '@/lib/seed';

const USER_KEY = 'local-single-user';

export async function GET() {
  const snapshot = await prisma.workspaceSnapshot.findUnique({ where: { userKey: USER_KEY } });
  return NextResponse.json({ state: snapshot?.payload ?? seedState });
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
      payload: body.state
    },
    update: {
      payload: body.state
    }
  });

  return NextResponse.json({ ok: true, updatedAt: snapshot.updatedAt });
}
