import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import './globals.css';

// ─── Fonts ────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
});

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:       'API Client Platform',
  description: 'A powerful open-source API client. Send HTTP requests, manage collections, set environments, and collaborate — all in one place.',
  keywords:    ['API client', 'REST client', 'HTTP testing', 'Postman alternative'],
  authors:     [{ name: 'API Client Platform' }],
  robots:      'noindex',   // internal tool; keep off search engines
};

export const viewport: Viewport = {
  themeColor: '#1A1A18',
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
      style={{ colorScheme: 'dark' }}
    >
      <body
        className={`${inter.variable} ${jetbrainsMono.variable}`}
        /**
         * Background and foreground come from globals.css:
         *   body { background: var(--pm-bg-primary); color: var(--pm-text-primary); }
         */
      >
        {/* React Query + global state providers */}
        <Providers>
          {children}
        </Providers>

        {/* Toast notifications — styled to match --pm-* tokens */}
        <Toaster
          position="bottom-right"
          gutter={8}
          containerStyle={{ zIndex: 9999 }}
          toastOptions={{
            duration: 3500,
            className: 'pm-toast',
            style: {
              background:   'var(--pm-bg-surface)',
              color:        'var(--pm-text-primary)',
              border:       '1px solid var(--pm-border-strong)',
              borderRadius: 'var(--radius-md)',
              fontSize:     '13px',
              fontFamily:   'var(--font-inter), Inter, system-ui, sans-serif',
              padding:      '10px 14px',
              boxShadow:    '0 8px 32px rgba(0,0,0,0.45)',
            },
            success: {
              iconTheme: { primary: 'var(--pm-status-2xx)', secondary: 'var(--pm-bg-surface)' },
            },
            error: {
              iconTheme: { primary: 'var(--pm-status-4xx)', secondary: 'var(--pm-bg-surface)' },
            },
          }}
        />
      </body>
    </html>
  );
}
