'use client';

import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

dayjs.extend(relativeTime);

export default function HistoryList() {
  const { history, fetchHistory, clearHistory, loadFromHistory } = useWorkspaceStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClear = async () => {
    if (confirm("Are you sure you want to clear your entire request history?")) {
      await clearHistory();
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'var(--pm-method-get)',
      POST: 'var(--pm-method-post)',
      PUT: 'var(--pm-method-put)',
      PATCH: 'var(--pm-method-patch)',
      DELETE: 'var(--pm-method-delete)',
    };
    return colors[method] || 'var(--pm-text-muted)';
  };

  const getStatusColor = (code?: number) => {
    if (!code) return 'text-[var(--pm-text-muted)]';
    if (code >= 200 && code < 300) return 'text-[var(--pm-status-2xx)]';
    if (code >= 400) return 'text-[var(--pm-status-4xx)]';
    return 'text-[var(--pm-status-3xx)]';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--pm-border)]">
        <span className="text-[11px] text-[var(--pm-text-muted)] uppercase font-semibold">Activity</span>
        <button 
          onClick={handleClear}
          className="text-[11px] text-[var(--pm-text-muted)] hover:text-[var(--pm-status-4xx)] transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-auto py-1">
        {history.map(entry => (
          <div 
            key={entry.id}
            onClick={() => loadFromHistory(entry)}
            className="group flex flex-col px-3 py-2 hover:bg-[var(--pm-bg-hover)] cursor-pointer transition-colors border-b border-transparent hover:border-[var(--pm-border)]"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold" style={{ color: getMethodColor(entry.method) }}>
                {entry.method}
              </span>
              <span className="flex-1 text-[12px] truncate text-[var(--pm-text-primary)]">
                {entry.url}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className={`font-mono ${getStatusColor(entry.status)}`}>
                {entry.status} {entry.duration}ms
              </span>
              <span className="text-[var(--pm-text-muted)]">
                {dayjs(entry.timestamp).fromNow()}
              </span>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="p-8 text-center text-[var(--pm-text-muted)] text-[12px]">
            No recent history
          </div>
        )}
      </div>
    </div>
  );
}
