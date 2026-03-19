import { NextResponse } from 'next/server';
import { loadWorkspaceState } from '@/lib/workspace-storage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  try {
    const state = await loadWorkspaceState();

    const results = [
      ...state.tasks.map((item) => ({ type: 'task', id: item.id, title: item.title })),
      ...state.notes.map((item) => ({ type: 'note', id: item.id, title: item.title })),
      ...state.files.map((item) => ({ type: 'file', id: item.id, title: item.name })),
      ...state.tracks.map((item) => ({ type: 'music', id: item.id, title: `${item.title} ${item.artist}` }))
    ].filter((item) => item.title.toLowerCase().includes(q));

    return NextResponse.json({ query: q, count: results.length, results: results.slice(0, 20) });
  } catch (error) {
    console.error('search_load_failed', error);
    return NextResponse.json({ error: 'database_unavailable' }, { status: 503 });
  }
}
