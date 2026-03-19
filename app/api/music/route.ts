import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

const MUSIC_DIR = path.join(process.cwd(), 'public', 'uploads', 'music');
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']);
const BASE_PATH = '/perSpace';

function withBasePath(url: string) {
  return `${BASE_PATH}${url}`;
}

function getAuthorizedUserId() {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

function sanitizeBaseName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'track';
}

async function ensureMusicDir() {
  await mkdir(MUSIC_DIR, { recursive: true });
}

export async function GET() {
  const userId = getAuthorizedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const tracks = await prisma.musicTrack.findMany({ where: { userId }, include: { artist: true, album: true }, orderBy: { uploadedAt: 'desc' } });

  return NextResponse.json({
    tracks: tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist?.name ?? 'Вы',
      album: track.album?.title ?? 'Uploaded',
      duration: track.durationSec > 0 ? `${Math.floor(track.durationSec / 60)}:${String(track.durationSec % 60).padStart(2, '0')}` : '—',
      favorite: track.liked,
      fileUrl: withBasePath(`/uploads/music/${encodeURIComponent(track.fileKey)}`),
      uploadedAt: track.uploadedAt.toISOString()
    }))
  });
}

export async function POST(request: Request) {
  const userId = getAuthorizedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  await ensureMusicDir();
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!AUDIO_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: 'unsupported_file_type' }, { status: 400 });
  }

  const baseName = sanitizeBaseName(path.basename(file.name, ext));
  const uniqueName = `${Date.now()}-${baseName}${ext}`;
  const filePath = path.join(MUSIC_DIR, uniqueName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const created = await prisma.musicTrack.create({
    data: {
      userId,
      title: path.basename(file.name, ext),
      durationSec: 0,
      fileKey: uniqueName,
      liked: false
    }
  });

  return NextResponse.json({ ok: true, trackId: created.id, fileUrl: withBasePath(`/uploads/music/${encodeURIComponent(uniqueName)}`) });
}

export async function DELETE(request: Request) {
  const userId = getAuthorizedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('id');
  if (!trackId) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const track = await prisma.musicTrack.findFirst({ where: { userId, id: trackId } });
  if (!track) return NextResponse.json({ error: 'track_not_found' }, { status: 404 });

  try {
    await unlink(path.join(MUSIC_DIR, path.basename(track.fileKey)));
  } catch {
    // ignore missing physical file, still delete metadata
  }

  await prisma.musicTrack.delete({ where: { id: track.id } });
  return NextResponse.json({ ok: true });
}
