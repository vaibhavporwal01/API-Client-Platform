'use client';

import React from 'react';
import KVEditor from '../shared/KVEditor';
import { KVPair } from '@/types';

interface HeadersEditorProps {
  rows: KVPair[];
  onChange: (rows: KVPair[]) => void;
}

export default function HeadersEditor({ rows, onChange }: HeadersEditorProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--pm-bg-primary)]">
      <div className="px-4 py-2 text-[11px] text-[var(--pm-text-muted)] font-semibold uppercase tracking-wider">
        HTTP Headers
      </div>
      <div className="flex-1 overflow-auto">
        <KVEditor 
          rows={rows} 
          onChange={onChange}
          placeholder={{ key: 'Header', value: 'Value' }}
        />
      </div>
    </div>
  );
}
