import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedState } from '@/lib/seed';
import { AUTH_COOKIE } from '@/lib/auth-cookie';
import type { WorkspaceState } from '@/lib/types';
import {
  buildWorkspaceState,
  mapFileRecord,
  mapNoteInput,
  mapNoteRecord,
  mapSettingsInput,
  mapSettingsRecord,
  mapTaskInput,
  mapTaskRecord,
  mapTrackRecord
} from '@/lib/workspace-mappers';

function getAuthorizedUserId() {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

async function loadWorkspaceState(userId: string) {
  const [tasks, notes, files, tracks, settings] = await prisma.$transaction([
    prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.note.findMany({ where: { userId, deletedAt: null, archived: false }, orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }] }),
    prisma.fileAsset.findMany({ where: { userId }, orderBy: { uploadedAt: 'desc' } }),
    prisma.musicTrack.findMany({ where: { userId }, include: { artist: true, album: true }, orderBy: { uploadedAt: 'desc' } }),
    prisma.settings.findUnique({ where: { userId } })
  ]);

  const state = buildWorkspaceState({
    tasks: tasks.length ? tasks.map(mapTaskRecord) : seedState.tasks,
    notes: notes.length ? notes.map(mapNoteRecord) : seedState.notes,
    files: files.map(mapFileRecord),
    tracks: tracks.map(mapTrackRecord),
    settings: settings ? mapSettingsRecord(settings) : seedState.settings
  });

  return state;
}

async function saveWorkspaceState(userId: string, state: WorkspaceState) {
  await prisma.$transaction([
    prisma.task.deleteMany({ where: { userId } }),
    prisma.note.deleteMany({ where: { userId } }),
    prisma.task.createMany({ data: state.tasks.map((task) => mapTaskInput(userId, task)) }),
    prisma.note.createMany({ data: state.notes.map((note) => mapNoteInput(userId, note)) }),
    prisma.settings.upsert({
      where: { userId },
      create: mapSettingsInput(userId, state.settings),
      update: mapSettingsInput(userId, state.settings)
    })
  ]);
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
    await saveWorkspaceState(userId, body.state);
    return NextResponse.json({ ok: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error('workspace_save_failed', error);
    return NextResponse.json({ error: 'workspace_save_failed' }, { status: 500 });
  }
}
