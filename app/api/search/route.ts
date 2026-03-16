import { NextResponse } from 'next/server';
import { seedState } from '@/lib/seed';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  const results = [
    ...seedState.tasks.map((item) => ({ type: 'task', id: item.id, title: item.title })),
    ...seedState.notes.map((item) => ({ type: 'note', id: item.id, title: item.title })),
    ...seedState.files.map((item) => ({ type: 'file', id: item.id, title: item.name })),
    ...seedState.tracks.map((item) => ({ type: 'music', id: item.id, title: `${item.title} ${item.artist}` }))
  ].filter((item) => item.title.toLowerCase().includes(q));

  return NextResponse.json({ query: q, count: results.length, results: results.slice(0, 20) });
}
