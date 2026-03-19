'use client';

import { useWorkspace } from '@/components/workspace-provider';

function ToggleCard({
  title,
  description,
  active,
  onClick
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${active ? 'border-accent bg-accent/10 shadow-glow' : 'border-fg/10 bg-muted/40 hover:bg-muted/70'}`}
    >
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-fg/65">{description}</p>
    </button>
  );
}

export default function SettingsPage() {
  const { state, updateSettings } = useWorkspace();

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 max-w-2xl text-fg/70">Единый центр персонализации: тема, язык интерфейса и то, насколько спокойной или динамичной должна быть визуальная среда.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Appearance</p>
          <h2 className="mt-1 text-xl font-semibold">Theme mode</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <ToggleCard
              title="System"
              description="Следовать системной теме устройства."
              active={state.settings.theme === 'system'}
              onClick={() => updateSettings({ theme: 'system' })}
            />
            <ToggleCard
              title="Light"
              description="Светлая calm-сцена для дневной работы."
              active={state.settings.theme === 'light'}
              onClick={() => updateSettings({ theme: 'light' })}
            />
            <ToggleCard
              title="Dark"
              description="Тёмная фокусная сцена для вечера и low-distraction режима."
              active={state.settings.theme === 'dark'}
              onClick={() => updateSettings({ theme: 'dark' })}
            />
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Accessibility</p>
          <h2 className="mt-1 text-xl font-semibold">Motion & comfort</h2>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => updateSettings({ reducedMotion: !state.settings.reducedMotion })}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left ${state.settings.reducedMotion ? 'border-accent bg-accent/10' : 'border-fg/10 bg-muted/40'}`}
            >
              <span>
                <span className="block font-medium">Reduced motion</span>
                <span className="mt-1 block text-sm text-fg/65">Уменьшает анимации и делает интерфейс спокойнее.</span>
              </span>
              <span className="text-sm font-medium">{state.settings.reducedMotion ? 'On' : 'Off'}</span>
            </button>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Language</p>
          <h2 className="mt-1 text-xl font-semibold">Interface language</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ToggleCard
              title="Русский"
              description="Основной язык для calm planning и личных ритуалов."
              active={state.settings.language === 'ru'}
              onClick={() => updateSettings({ language: 'ru' })}
            />
            <ToggleCard
              title="English"
              description="Useful if your tasks, notes, and work context are mostly in English."
              active={state.settings.language === 'en'}
              onClick={() => updateSettings({ language: 'en' })}
            />
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Current state</p>
          <h2 className="mt-1 text-xl font-semibold">Persisted preferences</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
              <span>Theme</span>
              <strong>{state.settings.theme}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
              <span>Language</span>
              <strong>{state.settings.language}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
              <span>Reduced motion</span>
              <strong>{state.settings.reducedMotion ? 'enabled' : 'disabled'}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
