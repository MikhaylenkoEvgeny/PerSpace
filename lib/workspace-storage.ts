import { prisma } from '@/lib/prisma';
import { seedState } from '@/lib/seed';
import type { WorkspaceState } from '@/lib/types';

const USER_KEY = 'local-single-user';

function parseSnapshotPayload(payload: string): WorkspaceState {
  try {
    return JSON.parse(payload) as WorkspaceState;
  } catch {
    return seedState;
  }
}

export async function loadWorkspaceState() {
  const snapshot = await prisma.workspaceSnapshot.findUnique({ where: { userKey: USER_KEY } });
  return snapshot ? parseSnapshotPayload(snapshot.payload) : seedState;
}

export async function saveWorkspaceState(state: WorkspaceState) {
  return prisma.workspaceSnapshot.upsert({
    where: { userKey: USER_KEY },
    create: {
      userKey: USER_KEY,
      payload: JSON.stringify(state)
    },
    update: {
      payload: JSON.stringify(state)
    }
  });
}
