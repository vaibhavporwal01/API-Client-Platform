'use client';

import React, { useState } from 'react';
import { Search, Clock, Folder } from 'lucide-react';
import CollectionTree from '../sidebar/CollectionTree';
import HistoryList from '../sidebar/HistoryList';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<'collections' | 'history'>('collections');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-full bg-[var(--pm-bg-sidebar)]">
      
      {/* Sidebar Tabs */}
      <div className="flex h-[40px] px-2 border-b border-[var(--pm-border)]">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 flex items-center justify-center gap-2 text-[12px] font-medium transition-colors border-b-2 ${activeTab === 'collections' ? 'text-[var(--pm-accent-orange)] border-[var(--pm-accent-orange)]' : 'text-[var(--pm-text-muted)] border-transparent hover:text-[var(--pm-text-secondary)]'}`}
        >
          <Folder size={14} />
          Collections
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 text-[12px] font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'text-[var(--pm-accent-orange)] border-[var(--pm-accent-orange)]' : 'text-[var(--pm-text-muted)] border-transparent hover:text-[var(--pm-text-secondary)]'}`}
        >
          <Clock size={14} />
          History
        </button>
      </div>

      {/* Search Bar (only for collections) */}
      {activeTab === 'collections' && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--pm-text-muted)]" size={14} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections"
              className="w-full bg-[var(--pm-bg-surface)] border border-[var(--pm-border)] rounded-sm pl-8 pr-3 py-1.5 text-[12px] text-[var(--pm-text-primary)] outline-none focus:border-[var(--pm-border-strong)] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'collections' ? (
          <CollectionTree searchQuery={searchQuery} />
        ) : (
          <HistoryList />
        )}
      </div>
    </div>
  );
}
