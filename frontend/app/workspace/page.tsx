import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:       'Workspace — API Client Platform',
  description: 'Build, send, and inspect HTTP requests. Manage collections and environments in your workspace.',
};

// ─── Page ─────────────────────────────────────────────────────────────────────
/**
 * WorkspacePage is the main application screen.
 * It renders the full three-panel (sidebar / request builder / response viewer)
 * layout via <AppShell />.
 *
 * No data is fetched at the page level — all state lives in Zustand stores
 * that are initialised client-side.
 */
export default function WorkspacePage() {
  return <AppShell />;
}
