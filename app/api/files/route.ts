import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { AUTH_COOKIE } from '@/lib/auth-cookie';

const FILES_DIR = path.join(process.cwd(), 'public', 'uploads', 'files');
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
    .slice(0, 100) || 'file';
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

async function ensureFilesDir() {
  await mkdir(FILES_DIR, { recursive: true });
}

export async function GET() {
  const userId = getAuthorizedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const files = await prisma.fileAsset.findMany({ where: { userId }, orderBy: { uploadedAt: 'desc' } });

  return NextResponse.json({
    files: files.map((file) => ({
      id: file.id,
      name: file.name,
      folder: 'Uploads',
      size: formatSize(Number(file.sizeBytes)),
      type: file.mimeType,
      updatedAt: new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(file.uploadedAt),
      fileUrl: withBasePath(`/uploads/files/${encodeURIComponent(file.key)}`),
      uploadedAt: file.uploadedAt.toISOString()
    }))
  });
}

export async function POST(request: Request) {
  const userId = getAuthorizedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  await ensureFilesDir();
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 });
  }

  const ext = path.extname(file.name);
  const baseName = sanitizeBaseName(path.basename(file.name, ext));
  const uniqueName = `${Date.now()}-${baseName}${ext}`;
  const filePath = path.join(FILES_DIR, uniqueName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  const fileStat = await stat(filePath);

  const created = await prisma.fileAsset.create({
    data: {
      userId,
      name: file.name,
      key: uniqueName,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: BigInt(fileStat.size),
      status: 'ready'
    }
  });

  return NextResponse.json({ ok: true, fileName: created.name, fileUrl: withBasePath(`/uploads/files/${encodeURIComponent(uniqueName)}`) });
}

export async function DELETE(request: Request) {
  const userId = getAuthorizedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');
  if (!fileId) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const file = await prisma.fileAsset.findFirst({ where: { userId, id: fileId } });
  if (!file) return NextResponse.json({ error: 'file_not_found' }, { status: 404 });

  try {
    await unlink(path.join(FILES_DIR, path.basename(file.key)));
  } catch {
    // ignore missing physical file, still delete metadata
  }

  await prisma.fileAsset.delete({ where: { id: file.id } });
  return NextResponse.json({ ok: true });
}
