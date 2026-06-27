'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Globe, Edit2, Check } from 'lucide-react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { EnvVar } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface EnvModalProps {
  onClose: () => void;
}

export default function EnvModal({ onClose }: EnvModalProps) {
  const { 
    environments, 
    fetchEnvironments, 
    createEnvironment, 
    deleteEnvironment, 
    updateEnvironment, 
    updateVars, 
    vars: currentVars, 
    fetchVars 
  } = useEnvironmentStore();
  
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [localVars, setLocalVars] = useState<Partial<EnvVar>[]>([]);
  const [editingEnvId, setEditingEnvId] = useState<string | null>(null);
  const [envRenameValue, setEnvRenameValue] = useState('');

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  useEffect(() => {
    if (selectedEnvId) {
      fetchVars(selectedEnvId);
    }
  }, [selectedEnvId, fetchVars]);

  useEffect(() => {
    setLocalVars(currentVars);
  }, [currentVars]);

  const handleAddVar = () => {
    setLocalVars([...localVars, { id: uuidv4(), key: '', value: '', enabled: true }]);
  };

  const handleUpdateVar = (index: number, updates: Partial<EnvVar>) => {
    const nextList = [...localVars];
    nextList[index] = { ...nextList[index], ...updates };
    setLocalVars(nextList);
  };

  const handleSave = async () => {
    if (selectedEnvId) {
        await updateVars(selectedEnvId, localVars);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--pm-bg-surface)] border border-[var(--pm-border-strong)] rounded-lg w-full max-w-3xl flex h-[500px] overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Sidebar */}
        <div className="w-[200px] border-r border-[var(--pm-border)] flex flex-col">
          <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase text-[var(--pm-text-muted)]">Environments</span>
            <button 
                onClick={() => createEnvironment('New Environment')}
                className="hover:text-[var(--pm-accent-orange)] transition-colors"
             >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {environments.map(env => {
              const isEditing = editingEnvId === env.id;
              
              return (
                <div 
                  key={env.id}
                  onClick={() => { if (!isEditing) setSelectedEnvId(env.id); }}
                  className={`px-4 py-2 flex items-center justify-between min-h-[38px] cursor-pointer group ${selectedEnvId === env.id ? 'bg-[var(--pm-bg-hover)] text-[var(--pm-accent-orange)] border-r-2 border-[var(--pm-accent-orange)] font-medium' : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-bg-hover)]'}`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1 py-0.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={envRenameValue}
                        onChange={(e) => setEnvRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateEnvironment(env.id, envRenameValue);
                            setEditingEnvId(null);
                          }
                          if (e.key === 'Escape') setEditingEnvId(null);
                        }}
                        onBlur={() => {
                          updateEnvironment(env.id, envRenameValue);
                          setEditingEnvId(null);
                        }}
                        className="flex-1 bg-[var(--pm-bg-surface)] text-[var(--pm-text-primary)] text-[12px] rounded px-1.5 py-0.5 outline-none border border-[var(--pm-accent-orange)] w-[100px]"
                      />
                    </div>
                  ) : (
                    <>
                      <span className="truncate text-[13px] flex-1">{env.name}</span>
                      <div className="hidden group-hover:flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            setEditingEnvId(env.id);
                            setEnvRenameValue(env.name);
                          }}
                          className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)]"
                          title="Rename"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete environment "${env.name}"?`)) {
                              deleteEnvironment(env.id);
                              if (selectedEnvId === env.id) setSelectedEnvId(null);
                            }
                          }}
                          className="text-[var(--pm-text-muted)] hover:text-[var(--pm-status-4xx)]"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
            <h2 className="text-[16px] font-bold">Manage Variables</h2>
            <button onClick={onClose} className="text-[var(--pm-text-muted)] hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {selectedEnvId ? (
              <div className="flex flex-col gap-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[11px] text-[var(--pm-text-muted)] uppercase text-left border-b border-[var(--pm-border)]">
                      <th className="pb-2 w-[30px]"></th>
                      <th className="pb-2">Variable</th>
                      <th className="pb-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localVars.map((v, i) => (
                      <tr key={v.id} className="border-b border-[var(--pm-border)]">
                        <td className="py-2">
                          <input 
                            type="checkbox" 
                            checked={v.enabled}
                            onChange={(e) => handleUpdateVar(i, { enabled: e.target.checked })}
                            className="accent-[var(--pm-accent-orange)]"
                          />
                        </td>
                        <td className="py-2 pr-4">
                          <input 
                            type="text" 
                            value={v.key}
                            onChange={(e) => handleUpdateVar(i, { key: e.target.value })}
                            placeholder="Variable key"
                            className="w-full bg-transparent border-none outline-none text-[13px]"
                          />
                        </td>
                        <td className="py-2">
                          <input 
                            type="text" 
                            value={v.value}
                            onChange={(e) => handleUpdateVar(i, { value: e.target.value })}
                            placeholder="Value"
                            className="w-full bg-transparent border-none outline-none text-[13px] text-[var(--pm-accent-orange)] font-mono"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  onClick={handleAddVar}
                  className="mt-2 text-[12px] text-[var(--pm-accent-orange)] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Variable
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[var(--pm-text-muted)] italic">
                <Globe size={48} className="opacity-10 mb-4" />
                Select an environment to manage its variables
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--pm-border)] flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-1.5 text-[13px] hover:bg-[var(--pm-bg-hover)] rounded transition-colors">Cancel</button>
             <button 
                onClick={handleSave} 
                disabled={!selectedEnvId}
                className="pm-btn-primary px-6 py-1.5 rounded disabled:opacity-50"
             >
                Save Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
