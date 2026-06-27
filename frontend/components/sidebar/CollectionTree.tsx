'use client';

import React, { useEffect, useState } from 'react';
import { useCollectionStore } from '@/store/useCollectionStore';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import RequestItem from './RequestItem';

interface CollectionTreeProps {
  searchQuery?: string;
}

export default function CollectionTree({ searchQuery }: CollectionTreeProps) {
  const { collections, fetchCollections, createCollection, createRequest, updateCollection, deleteCollection } = useCollectionStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setRenameValue(name);
  };

  const handleRenameSubmit = async (id: string) => {
    if (renameValue.trim()) {
      await updateCollection(id, { name: renameValue });
    }
    setEditingId(null);
  };

  const handleDeleteCollection = async (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      await deleteCollection(id);
    }
  };

  const filteredCollections = searchQuery 
    ? collections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : collections;

  return (
    <div className="flex flex-col gap-1 py-1">
      {filteredCollections.map(col => {
        const isExpanded = expanded[col.id];
        
        return (
          <div key={col.id} className="flex flex-col">
            {/* Collection Header */}
            <div className="group flex items-center h-[30px] px-2 hover:bg-[var(--pm-bg-hover)] cursor-pointer transition-colors">
              <div 
                className="w-[20px] flex items-center justify-center text-[var(--pm-text-muted)]"
                onClick={() => toggleExpand(col.id)}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              
              {editingId === col.id ? (
                <div className="flex items-center gap-1 flex-1 py-0.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(col.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 bg-[var(--pm-bg-surface)] text-[var(--pm-text-primary)] text-[12px] rounded px-1.5 py-0.5 outline-none border border-[var(--pm-accent-orange)]"
                  />
                  <button onClick={() => handleRenameSubmit(col.id)} className="text-[var(--pm-status-2xx)] hover:opacity-85">
                    <Check size={12} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)]">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => toggleExpand(col.id)}>
                    {isExpanded ? <FolderOpen size={14} className="text-[#FCA130]" /> : <Folder size={14} className="text-[#FCA130]" />}
                    <span className="text-[12px] font-medium truncate text-[var(--pm-text-primary)]">
                        {col.name}
                    </span>
                  </div>

                  <div className="hidden group-hover:flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => createRequest({ collection_id: col.id, name: 'New Request', method: 'GET', url: '' })}
                      className="p-1 hover:bg-[var(--pm-border)] rounded text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)]"
                      title="Add Request"
                    >
                      <Plus size={14} />
                    </button>
                    <button 
                      onClick={() => handleStartRename(col.id, col.name)}
                      className="p-1 hover:bg-[var(--pm-border)] rounded text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)]"
                      title="Rename"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCollection(col.id)}
                      className="p-1 hover:bg-[var(--pm-border)] rounded text-[var(--pm-text-muted)] hover:text-[var(--pm-status-4xx)]"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Collection Contents (Requests) */}
            {isExpanded && (
              <div className="flex flex-col">
                {col.requests?.map(req => (
                  <RequestItem key={req.id} request={req} />
                ))}
                {col.requests?.length === 0 && (
                  <div className="pl-10 py-1 text-[11px] text-[var(--pm-text-muted)] italic">
                    No requests yet
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button 
        onClick={() => createCollection('New Collection')}
        className="mx-3 mt-2 py-1.5 border border-dashed border-[var(--pm-border)] rounded-sm text-[11px] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)] hover:border-[var(--pm-border-strong)] transition-all"
      >
        + New Collection
      </button>
    </div>
  );
}
