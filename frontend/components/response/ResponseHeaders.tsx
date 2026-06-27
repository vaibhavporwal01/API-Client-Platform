'use client';

import React from 'react';

interface ResponseHeadersProps {
  headers: Record<string, string>;
}

export default function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const headerKeys = Object.keys(headers);

  if (headerKeys.length === 0) {
    return <div className="p-4 text-[var(--pm-text-muted)] italic">No response headers</div>;
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--pm-bg-sidebar)] text-[var(--pm-text-muted)] text-[11px] font-semibold uppercase tracking-wider h-[32px]">
            <th className="px-4 text-left border-b border-[var(--pm-border)]">Key</th>
            <th className="px-4 text-left border-b border-[var(--pm-border)]">Value</th>
          </tr>
        </thead>
        <tbody>
          {headerKeys.map((key, idx) => (
            <tr 
              key={key} 
              className={`h-[32px] border-b border-[var(--pm-border)] hover:bg-[var(--pm-bg-hover)] transition-colors ${idx % 2 === 0 ? 'bg-[var(--pm-bg-primary)]' : 'bg-[var(--pm-bg-sidebar)]'}`}
            >
              <td className="px-4 text-[12px] text-[var(--pm-text-muted)] font-medium border-r border-[var(--pm-border)]">
                {key}
              </td>
              <td className="px-4 text-[12px] text-[var(--pm-text-primary)] font-mono break-all">
                {headers[key]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
