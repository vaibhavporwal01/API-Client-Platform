'use client';

import { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, FolderOpen, Folder, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { useCollectionStore } from '@/store/useCollectionStore';
import { useWorkspaceStore }  from '@/store/useWorkspaceStore';
import RequestItem from './RequestItem';
import type { Collection }    from '@/types';

interface CollectionItemProps {
  collection: Collection;
  search: string;
}

export function CollectionItem({ collection, search }: CollectionItemProps) {
  const [expanded, setExpanded]     = useState(true);
  const [editing, setEditing]       = useState(false);
  const [name, setName]             = useState(collection.name);
  const [showMenu, setShowMenu]     = useState(false);

  const updateCollection = useCollectionStore((s) => s.updateCollection);
  const deleteCollection = useCollectionStore((s) => s.deleteCollection);
  const createRequest    = useCollectionStore((s) => s.createRequest);
  const openTab          = useWorkspaceStore((s) => s.openTab);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleRename = () => {
    updateCollection(collection.id, { name });
    setEditing(false);
  };

  const handleAddRequest = () => {
    createRequest({ collection_id: collection.id, name: 'New Request', method: 'GET', url: '' });
    openTab({ method: 'GET', url: '', headers: [], params: [], body_type: 'none', body_raw: '', body_form: [], auth_type: 'none', auth_data: {} }, 'New Request');
  };

  const filteredRequests = search
    ? collection.requests.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : collection.requests;

  return (
    <div className="animate-fade-in">
      {/* Collection header row */}
      <div
        className="flex items-center gap-1 px-2 py-1 group hover:bg-surface-800/60 cursor-pointer select-none"
        onClick={() => { if (!editing) setExpanded((v) => !v); }}
      >
        <span className="text-gray-500">
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
        <span className="text-brand-400 mr-1">
          {expanded ? <FolderOpen size={14} /> : <Folder size={14} />}
        </span>

        {editing ? (
          <form
            onSubmit={(e) => { e.preventDefault(); handleRename(); }}
            className="flex items-center gap-1 flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-surface-800 text-gray-100 text-[12px] rounded px-1.5 py-0.5 outline-none border border-brand-600/50"
            />
            <button type="submit" className="text-green-400 hover:text-green-300"><Check size={12} /></button>
            <button type="button" onClick={() => { setEditing(false); setName(collection.name); }} className="text-gray-500 hover:text-gray-300"><X size={12} /></button>
          </form>
        ) : (
          <span className="flex-1 text-[12px] font-medium text-gray-300 truncate">{collection.name}</span>
        )}

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleAddRequest}
            className="p-1 rounded text-gray-500 hover:text-brand-400 hover:bg-surface-700"
            title="Add Request"
          ><Plus size={12} /></button>
          <button
            onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.select(), 0); }}
            className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-surface-700"
            title="Rename"
          ><Edit2 size={12} /></button>
          <button
            onClick={() => deleteCollection(collection.id)}
            className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-surface-700"
            title="Delete"
          ><Trash2 size={12} /></button>
        </div>
      </div>

      {/* Requests (expanded) */}
      {expanded && (
        <div className="ml-4 border-l border-surface-800/60">
          {filteredRequests.length === 0 ? (
            <div className="text-[11px] text-gray-600 px-3 py-1 italic">No requests</div>
          ) : (
            filteredRequests.map((req) => (
              <RequestItem key={req.id} request={req} />
            ))
          )}
          {/* Folders */}
          {collection.folders.map((folder) => (
            <div key={folder.id} className="ml-2">
              <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-gray-500">
                <Folder size={11} /> <span>{folder.name}</span>
              </div>
              {folder.requests.map((req) => (
                <RequestItem key={req.id} request={req} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
