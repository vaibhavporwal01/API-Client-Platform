'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useCollectionStore } from '@/store/useCollectionStore';
import * as api from '@/lib/api';

export default function SaveButton() {
  const { activeTabId, tabs, setSaved } = useWorkspaceStore();
  const fetchCollections = useCollectionStore(s => s.fetchCollections);
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTabId || !activeTab || !activeTab.requestId) return null;

  const handleSave = async () => {
    try {
      // Map state keys to JSON-serialized values for SQLite
      const payload = {
        method: activeTab.request.method,
        url: activeTab.request.url,
        headers: JSON.stringify(activeTab.request.headers),
        params: JSON.stringify(activeTab.request.params),
        body_type: activeTab.request.body_type,
        body_raw: activeTab.request.body_raw,
        body_form: JSON.stringify(activeTab.request.body_form),
        auth_type: activeTab.request.auth_type,
        auth_data: JSON.stringify(activeTab.request.auth_data),
        collection_id: activeTab.collectionId
      };

      await api.updateRequest(activeTab.requestId!, payload);
      setSaved(activeTabId);
      await fetchCollections(); // Refresh sidebar to show new method badge or name
    } catch (err: any) {
      alert('Failed to save request: ' + err.message);
    }
  };

  return (
    <button
      onClick={handleSave}
      className="h-[38px] px-4 border-y border-r border-[var(--pm-border)] bg-[var(--pm-bg-surface)] hover:bg-[var(--pm-bg-hover)] text-[12px] font-medium text-[var(--pm-text-secondary)] hover:text-white transition-colors flex items-center justify-center gap-1.5"
      title="Save Changes to Collection (Ctrl+S)"
    >
      Save
    </button>
  );
}
