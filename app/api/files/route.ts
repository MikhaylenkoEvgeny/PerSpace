import { NextResponse } from 'next/server';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FILES_DIR = path.join(process.cwd(), 'public', 'uploads', 'files');

interface UploadedFile {
  id: string;
  name: string;
  folder: string;
  size: string;
  type: string;
  updatedAt: string;
  fileUrl: string;
  uploadedAt: string;
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
  await ensureFilesDir();
  const entries = await readdir(FILES_DIR, { withFileTypes: true });

  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const ext = path.extname(entry.name);
        const fileStat = await stat(path.join(FILES_DIR, entry.name));

        const uploadedFile: UploadedFile = {
          id: entry.name,
          name: entry.name,
          folder: 'Uploads',
          size: formatSize(fileStat.size),
          type: ext ? ext.slice(1).toLowerCase() : 'file',
          updatedAt: new Intl.DateTimeFormat('ru-RU', {
            dateStyle: 'short',
            timeStyle: 'short'
          }).format(fileStat.mtime),
          fileUrl: `/uploads/files/${encodeURIComponent(entry.name)}`,
          uploadedAt: fileStat.birthtime.toISOString()
        };

        return uploadedFile;
      })
  );

  files.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

  return NextResponse.json({ files });
}

export async function POST(request: Request) {
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

  return NextResponse.json({ ok: true, fileName: uniqueName, fileUrl: `/uploads/files/${encodeURIComponent(uniqueName)}` });
}
