import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AppShell } from '@/components/app-shell';
import { WorkspaceProvider } from '@/components/workspace-provider';

export const metadata: Metadata = {
  title: 'PerSpace',
  description: 'Digital sanctuary for tasks, notes, files and music',
  manifest: '/manifest.webmanifest',
  icons: [{ rel: 'apple-touch-icon', url: '/icons/icon.svg' }]
};

export const viewport: Viewport = {
  themeColor: '#171A25',
  viewportFit: 'cover'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <WorkspaceProvider>
          <AppShell>{children}</AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
