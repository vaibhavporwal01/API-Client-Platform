'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import KVEditor from '../shared/KVEditor';
import { BodyType } from '@/types';

export default function BodyEditor() {
  const { activeTabId, tabs, updateTab } = useWorkspaceStore();
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTabId || !activeTab) return null;

  const { body_type, body_raw, body_form } = activeTab.request;

  const setMode = (mode: BodyType) => updateTab(activeTabId, { body_type: mode });

  const modes: BodyType[] = ['none', 'form-data', 'x-www-form-urlencoded', 'raw'];

  return (
    <div className="flex flex-col h-full bg-[var(--pm-bg-primary)]">
      {/* Mode Selectors */}
      <div className="flex gap-4 px-4 border-b border-[var(--pm-border)] h-[32px] items-center">
        {modes.map(mode => (
          <button
            key={mode}
            onClick={() => setMode(mode)}
            className={`text-[11px] font-medium transition-colors ${body_type === mode ? 'text-[var(--pm-accent-orange)]' : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        {body_type === 'none' && (
          <div className="flex items-center justify-center h-full text-[var(--pm-text-muted)] text-[12px]">
            This request does not have a body.
          </div>
        )}

        {body_type === 'raw' && (
          <div className="flex flex-col h-full">
            <div className="h-full bg-[var(--pm-bg-surface)] p-2">
              <textarea
                value={body_raw || ''}
                onChange={(e) => updateTab(activeTabId, { body_raw: e.target.value })}
                placeholder='{"example": "json"}'
                className="w-full h-full bg-transparent outline-none border-none text-[var(--pm-text-primary)] font-mono text-[13px] resize-none"
              />
            </div>
          </div>
        )}

        {(body_type === 'form-data' || body_type === 'x-www-form-urlencoded') && (
          <KVEditor 
            rows={body_form}
            onChange={(rows) => updateTab(activeTabId, { body_form: rows })}
          />
        )}
      </div>
    </div>
  );
}
