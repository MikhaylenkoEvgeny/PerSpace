import { NextResponse } from 'next/server';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MUSIC_DIR = path.join(process.cwd(), 'public', 'uploads', 'music');
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']);

interface UploadedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  favorite: boolean;
  fileUrl: string;
  uploadedAt: string;
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
  await ensureMusicDir();
  const entries = await readdir(MUSIC_DIR, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile())
    .filter((entry) => AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase()));

  const tracks = await Promise.all(
    files.map(async (entry) => {
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);
      const fileStat = await stat(path.join(MUSIC_DIR, entry.name));

      const track: UploadedTrack = {
        id: entry.name,
        title: baseName,
        artist: 'Вы',
        album: 'Uploaded',
        duration: '—',
        favorite: false,
        fileUrl: `/uploads/music/${encodeURIComponent(entry.name)}`,
        uploadedAt: fileStat.birthtime.toISOString()
      };

      return track;
    })
  );

  tracks.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

  return NextResponse.json({ tracks });
}

export async function POST(request: Request) {
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

  return NextResponse.json({ ok: true, fileName: uniqueName, fileUrl: `/uploads/music/${encodeURIComponent(uniqueName)}` });
}
