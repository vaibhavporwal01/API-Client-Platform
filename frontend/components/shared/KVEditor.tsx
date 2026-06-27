'use client';

import React, { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface KVRow {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

interface KVEditorProps {
  rows: KVRow[];
  onChange: (rows: KVRow[]) => void;
  placeholder?: { key: string; value: string };
  showDescription?: boolean;
}

/**
 * KVEditor — A high-fidelity Key-Value pair editor similar to Postman's.
 * Features:
 * - Auto-expanding rows (empty row always at the bottom).
 * - Variable visualization ({{...}} highlighting).
 * - Enable/Disable toggles.
 * - Tab-friendly input flow.
 */
export default function KVEditor({
  rows,
  onChange,
  placeholder = { key: 'Key', value: 'Value' },
  showDescription = false,
}: KVEditorProps) {
  
  const handleRowChange = useCallback((id: string, field: keyof KVRow, value: any) => {
    const isNewRow = !rows.find(r => r.id === id);
    let newRows = [...rows];

    if (isNewRow) {
      // If we are typing in the phantom row, create a new actual row
      const newEntry: KVRow = {
        id,
        key: '',
        value: '',
        enabled: true,
        [field]: value
      };
      newRows.push(newEntry);
    } else {
      newRows = newRows.map(r => r.id === id ? { ...r, [field]: value } : r);
    }

    onChange(newRows);
  }, [rows, onChange]);

  const handleRemoveRow = (id: string) => {
    onChange(rows.filter(r => r.id === id ? false : true));
  };

  /**
   * Helper to highlight {{variables}} in a string
   */
  const renderVariableHighlighter = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\{\{[^{}]+\}\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return (
          <span key={i} style={{ color: 'var(--pm-accent-orange)', fontWeight: 500 }}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // We append one "phantom" empty row at the bottom
  const phantomId = useRef(uuidv4()).current;

  return (
    <div className="w-full border-b border-[var(--pm-border)]">
      {/* Table Header */}
      <div className="flex border-t border-b border-[var(--pm-border)] bg-[var(--pm-bg-sidebar)] h-[32px] items-center text-[var(--pm-text-muted)] text-[11px] font-semibold uppercase tracking-wider">
        <div className="w-[32px] border-r border-[var(--pm-border)] h-full flex items-center justify-center"></div>
        <div className="flex-1 px-3 border-r border-[var(--pm-border)] h-full flex items-center">{placeholder.key}</div>
        <div className="flex-1 px-3 border-r border-[var(--pm-border)] h-full flex items-center">{placeholder.value}</div>
        {showDescription && <div className="flex-1 px-3 border-r border-[var(--pm-border)] h-full flex items-center">Description</div>}
        <div className="w-[32px] h-full"></div>
      </div>

      {/* Row List */}
      {[...rows, { id: phantomId, key: '', value: '', enabled: true }].map((row, idx) => {
        const isPhantom = idx === rows.length;
        
        return (
          <div 
            key={row.id}
            className={`group flex items-center border-b border-[var(--pm-border)] h-[32px] hover:bg-[var(--pm-bg-hover)] transition-colors ${!row.enabled ? 'opacity-40' : ''}`}
          >
            {/* Enabled Checkbox */}
            <div className="w-[32px] border-r border-[var(--pm-border)] h-full flex items-center justify-center">
              {!isPhantom && (
                <input 
                  type="checkbox"
                  checked={row.enabled}
                  onChange={(e) => handleRowChange(row.id, 'enabled', e.target.checked)}
                  className="cursor-pointer accent-[var(--pm-accent-orange)]"
                />
              )}
            </div>

            {/* Key Input */}
            <div className="flex-1 h-full border-r border-[var(--pm-border)]">
              <input 
                type="text"
                value={row.key}
                placeholder={isPhantom ? placeholder.key : ''}
                onChange={(e) => handleRowChange(row.id, 'key', e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none px-3 text-[var(--pm-text-primary)] placeholder:text-[var(--pm-text-muted)]"
              />
            </div>

            {/* Value Input (with highlight overlay) */}
            <div className="flex-1 h-full border-r border-[var(--pm-border)] relative overflow-hidden">
              {/* This mimics the text for the highlight overlay */}
              <div 
                className="absolute inset-0 px-3 flex items-center pointer-events-none whitespace-nowrap text-transparent"
                style={{ lineHeight: '32px' }}
              >
                {renderVariableHighlighter(row.value)}
              </div>
              <input 
                type="text"
                value={row.value}
                placeholder={isPhantom ? placeholder.value : ''}
                onChange={(e) => handleRowChange(row.id, 'value', e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none px-3 relative z-10 text-[var(--pm-text-primary)] placeholder:text-[var(--pm-text-muted)] focus:text-transparent selection:bg-[rgba(239,159,39,0.3)]"
                title={row.value}
              />
            </div>

            {/* Description (Optional) */}
            {showDescription && (
              <div className="flex-1 h-full border-r border-[var(--pm-border)]">
                <input 
                  type="text"
                  value={row.description || ''}
                  placeholder="Description"
                  onChange={(e) => handleRowChange(row.id, 'description', e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none px-3 text-[var(--pm-text-muted)]"
                />
              </div>
            )}

            {/* Actions (Delete) */}
            <div className="w-[32px] h-full flex items-center justify-center">
              {!isPhantom && (
                <button 
                  onClick={() => handleRemoveRow(row.id)}
                  className="hidden group-hover:flex items-center justify-center text-[var(--pm-text-muted)] hover:text-[var(--pm-status-4xx)] transition-colors w-[20px] h-[20px]"
                >
                  <span className="text-[18px]">×</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
