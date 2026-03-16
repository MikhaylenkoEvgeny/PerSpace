'use client';

import { useWorkspace } from '@/components/workspace-provider';

export default function SettingsPage() {
  const { state } = useWorkspace();

  return (
    <div className="glass rounded-2xl p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-fg/70">Единый центр аккаунта, темы, языка, PWA и media preferences.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-fg/60">Theme</p>
          <p className="font-medium">{state.settings.theme}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-fg/60">Language</p>
          <p className="font-medium">{state.settings.language}</p>
        </div>
      </div>
    </div>
  );
}
