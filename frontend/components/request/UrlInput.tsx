'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export default function UrlInput() {
  const { activeTabId, tabs, updateTab } = useWorkspaceStore();
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTabId || !activeTab) return null;

  const url = activeTab.request.url;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTab(activeTabId, { url: e.target.value });
  };

  const renderVariableHighlighter = (text: string) => {
    const parts = text.split(/(\{\{[^{}]+\}\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return <span key={i} className="text-[var(--pm-accent-orange)] font-medium">{part}</span>;
      }
      return <span key={i} className="text-[var(--pm-text-primary)]">{part}</span>;
    });
  };

  return (
    <div className="flex-1 h-full relative group">
      <div 
        className="absolute inset-0 px-3 flex items-center pointer-events-none whitespace-nowrap text-transparent text-[14px] z-20 hidden group-focus-within:flex"
        style={{ fontFamily: 'inherit' }}
      >
        {renderVariableHighlighter(url)}
      </div>
      <input 
        type="text"
        value={url}
        onChange={handleChange}
        placeholder="Enter URL or paste text"
        spellCheck={false}
        className="w-full h-full bg-[var(--pm-bg-surface)] border-y border-r border-[var(--pm-border)] px-3 text-[14px] text-[var(--pm-text-primary)] outline-none placeholder:text-[var(--pm-text-muted)] relative z-10 focus:text-transparent"
      />
    </div>
  );
}
