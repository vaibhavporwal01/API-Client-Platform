'use client';

import React from 'react';

interface StatusBarProps {
  status?: number;
  statusText?: string;
  time?: number;
  size?: number;
}

export default function StatusBar({ status, statusText, time, size }: StatusBarProps) {
  const getStatusColor = (code?: number) => {
    if (!code) return 'bg-[var(--pm-text-muted)]';
    if (code >= 200 && code < 300) return 'bg-[#49CC90]';
    if (code >= 300 && code < 400) return 'bg-[#FCA130]';
    if (code >= 400) return 'bg-[#F93E3E]';
    return 'bg-[var(--pm-text-muted)]';
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return (
    <div className="flex items-center gap-4 h-[36px] px-4 border-b border-[var(--pm-border)] text-[12px]">
      {/* Status Badge */}
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-bold text-[#1a1a18] ${getStatusColor(status)}`}>
        <span>{status || '---'}</span>
        <span>{statusText || ''}</span>
      </div>

      {/* Time Pill */}
      <div className="flex items-center gap-1 text-[var(--pm-text-muted)]">
        <span>Time:</span>
        <span className="text-[var(--pm-status-2xx)] font-medium">{time || 0} ms</span>
      </div>

      {/* Size Pill */}
      <div className="flex items-center gap-1 text-[var(--pm-text-muted)]">
        <span>Size:</span>
        <span className="text-[var(--pm-status-2xx)] font-medium">{formatSize(size)}</span>
      </div>
    </div>
  );
}
