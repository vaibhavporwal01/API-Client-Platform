'use client';

import React, { useEffect, useState } from 'react';
import { useEnvironmentStore } from '@/store/useEnvironmentStore';
import { Globe, HardDrive, Settings } from 'lucide-react';
import EnvModal from './EnvModal';

export default function EnvSelector() {
  const { environments, activeEnvId, setActiveEnv, fetchEnvironments } = useEnvironmentStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  const activeEnv = environments.find(e => e.id === activeEnvId);

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--pm-bg-surface)] border border-[var(--pm-border)] rounded-sm cursor-pointer hover:border-[var(--pm-border-strong)] transition-colors min-w-[160px]">
        {activeEnv ? (
          <Globe size={14} className="text-[var(--pm-status-2xx)]" />
        ) : (
          <HardDrive size={14} className="text-[var(--pm-text-muted)]" />
        )}
        <span className="text-[12px] flex-1 truncate">
          {activeEnv ? activeEnv.name : 'No Environment'}
        </span>
        <span className="text-[10px] text-[var(--pm-text-muted)]">▼</span>
      </div>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-1 w-full bg-[var(--pm-bg-surface)] border border-[var(--pm-border-strong)] rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1 overflow-hidden">
        <button
          onClick={() => setActiveEnv(null)}
          className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[var(--pm-bg-hover)] transition-colors ${!activeEnvId ? 'text-[var(--pm-accent-orange)] font-medium' : 'text-[var(--pm-text-primary)]'}`}
        >
          No Environment
        </button>
        
        <div className="border-t border-[var(--pm-border)] my-1" />

        {environments.map(env => (
          <button
            key={env.id}
            onClick={() => setActiveEnv(env.id)}
            className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-[var(--pm-bg-hover)] transition-colors ${activeEnvId === env.id ? 'text-[var(--pm-accent-orange)] font-medium' : 'text-[var(--pm-text-primary)]'}`}
          >
            {env.name}
          </button>
        ))}

        <div className="border-t border-[var(--pm-border)] my-1" />
        
        <button 
          onClick={() => setShowModal(true)}
          className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text-primary)] hover:bg-[var(--pm-bg-hover)]"
        >
          <Settings size={14} />
          Manage Environments
        </button>
      </div>

      {showModal && <EnvModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
