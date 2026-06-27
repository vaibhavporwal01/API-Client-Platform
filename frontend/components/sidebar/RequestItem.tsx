'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useCollectionStore } from '@/store/useCollectionStore';
import { SavedRequest } from '@/types';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface RequestItemProps {
  request: SavedRequest;
}

export default function RequestItem({ request }: RequestItemProps) {
  const { openTab, tabs, setActiveTab } = useWorkspaceStore();
  const deleteRequest = useCollectionStore(s => s.deleteRequest);
  const updateRequest = useCollectionStore(s => s.updateRequest);

  const [isEditing, setIsEditing] = useState(false);
  const [renameValue, setRenameValue] = useState(request.name);

  const handleClick = () => {
    // Check if already open
    const existing = tabs.find(t => t.requestId === request.id);
    if (existing) {
      setActiveTab(existing.id);
    } else {
      openTab(request.request, request.name, request.id, request.collectionId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering tab click
    if (confirm(`Are you sure you want to delete request "${request.name}"?`)) {
      deleteRequest(request.id);
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

  const handleRenameSubmit = async () => {
    if (renameValue.trim()) {
      await updateRequest(request.id, { name: renameValue });
    }
    setIsEditing(false);
  };

  return (
    <div 
      onClick={() => { if (!isEditing) handleClick(); }}
      className="group flex items-center h-[28px] pl-8 pr-2 hover:bg-[var(--pm-bg-hover)] cursor-pointer transition-colors"
    >
      <span 
        className="text-[9px] font-bold w-[34px] flex-shrink-0" 
        style={{ color: getMethodColor(request.request.method) }}
      >
        {request.request.method}
      </span>
      
      {isEditing ? (
        <div className="flex items-center gap-1 flex-1 py-0.5" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="flex-1 bg-[var(--pm-bg-surface)] text-[var(--pm-text-primary)] text-[12px] rounded px-1.5 py-0.5 outline-none border border-[var(--pm-accent-orange)] w-[100px]"
          />
          <button onClick={handleRenameSubmit} className="text-[var(--pm-status-2xx)] hover:opacity-85">
            <Check size={12} />
          </button>
          <button onClick={() => setIsEditing(false)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)]">
            <X size={12} />
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1 text-[12px] truncate text-[var(--pm-text-secondary)] group-hover:text-[var(--pm-text-primary)]">
            {request.name}
          </span>
          
          {/* Action buttons on hover */}
          <div className="hidden group-hover:flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => {
                setIsEditing(true);
                setRenameValue(request.name);
              }}
              className="p-0.5 hover:bg-[var(--pm-border)] rounded text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)] transition-all"
              title="Rename Request"
            >
              <Edit2 size={12} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-0.5 hover:bg-[var(--pm-border)] rounded text-[var(--pm-text-muted)] hover:text-[var(--pm-status-4xx)] transition-all"
              title="Delete Request"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
