'use client';

import { useWorkspace } from '@/components/workspace-provider';

function OptionRow({ title, description, active, onClick }: { title: string; description: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`w-full rounded-xl border px-4 py-4 text-left ${active ? 'border-fg bg-fg text-white' : 'border-fg/10 bg-transparent text-fg'}`}>
      <p className="font-medium">{title}</p>
      <p className={`mt-1 text-sm ${active ? 'text-white/72' : 'text-fg/58'}`}>{description}</p>
    </button>
  );
}

export default function SettingsPage() {
  const { state, updateSettings } = useWorkspace();

  return (
    <div className="page-shell max-w-3xl">
      <header className="page-header">
        <p className="text-sm font-medium text-fg/50">Settings</p>
        <h1 className="page-title">Минимальные настройки. Без лишней драматизации.</h1>
        <p className="page-subtitle">Только appearance, language и motion — ровно то, что влияет на ощущение продукта.</p>
      </header>

      <section className="surface p-5 md:p-6">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <OptionRow title="System" description="Следовать устройству" active={state.settings.theme === 'system'} onClick={() => updateSettings({ theme: 'system' })} />
          <OptionRow title="Light" description="Светлый интерфейс" active={state.settings.theme === 'light'} onClick={() => updateSettings({ theme: 'light' })} />
          <OptionRow title="Dark" description="Тёмный интерфейс" active={state.settings.theme === 'dark'} onClick={() => updateSettings({ theme: 'dark' })} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <h2 className="text-lg font-semibold">Language</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <OptionRow title="Русский" description="Основной язык интерфейса" active={state.settings.language === 'ru'} onClick={() => updateSettings({ language: 'ru' })} />
          <OptionRow title="English" description="English interface" active={state.settings.language === 'en'} onClick={() => updateSettings({ language: 'en' })} />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <h2 className="text-lg font-semibold">Motion</h2>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-fg/10 px-4 py-4">
          <div>
            <p className="font-medium">Reduced motion</p>
            <p className="mt-1 text-sm text-fg/58">Меньше анимаций, меньше отвлечения.</p>
          </div>
          <button type="button" onClick={() => updateSettings({ reducedMotion: !state.settings.reducedMotion })} className={`h-10 rounded-xl px-4 text-sm font-medium ${state.settings.reducedMotion ? 'bg-fg text-white' : 'bg-muted text-fg/75'}`}>
            {state.settings.reducedMotion ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </section>
    </div>
  );
}
