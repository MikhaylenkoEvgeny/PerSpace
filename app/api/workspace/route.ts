import { NextResponse } from 'next/server';
import { loadWorkspaceState, saveWorkspaceState } from '@/lib/workspace-storage';

export async function GET() {
  try {
    const state = await loadWorkspaceState();
    return NextResponse.json({ state });
  } catch (error) {
    console.error('workspace_load_failed', error);
    return NextResponse.json({ state: null, error: 'database_unavailable' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object' || !('state' in body)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  try {
    const snapshot = await saveWorkspaceState(body.state);
    return NextResponse.json({ ok: true, updatedAt: snapshot.updatedAt });
  } catch (error) {
    console.error('workspace_save_failed', error);
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 });
  }
}
