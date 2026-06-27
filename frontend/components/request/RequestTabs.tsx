'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export default function RequestTabs() {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab } = useWorkspaceStore();

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

  return (
    <div className="flex items-center h-[36px] bg-[var(--pm-bg-topbar)] border-b border-[var(--pm-border)] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const displayName = tab.name || tab.request.url || 'Untitled Request';

        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 h-full px-3 min-w-[120px] max-w-[200px] border-r border-[var(--pm-border)] cursor-pointer transition-colors group
              ${isActive ? 'bg-[var(--pm-bg-primary)] border-b-2 border-b-[var(--pm-accent-orange)]' : 'bg-[var(--pm-bg-sidebar)] hover:bg-[var(--pm-bg-hover)]'}
            `}
          >
            <span 
              className="text-[9px] font-bold" 
              style={{ color: getMethodColor(tab.request.method) }}
            >
              {tab.request.method}
            </span>
            <span className="flex-1 truncate text-[12px] text-[var(--pm-text-secondary)]">
              {displayName}
            </span>
            
            <div className="flex items-center gap-1">
              {tab.isDirty && (
                <div className="w-[6px] h-[6px] rounded-full bg-[var(--pm-accent-orange)]" />
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-[16px] h-[16px] rounded-sm hover:bg-[var(--pm-border)] text-[var(--pm-text-muted)]"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}

      <button 
        onClick={() => openTab()}
        className="h-full px-4 text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)] hover:bg-[var(--pm-bg-hover)] border-r border-[var(--pm-border)]"
      >
        +
      </button>
    </div>
  );
}
