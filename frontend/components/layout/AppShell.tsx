'use client';

import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings, Zap } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useCollectionStore } from '@/store/useCollectionStore';
import * as api from '@/lib/api';

// Components
import Sidebar from './Sidebar';
import RequestTabs from '../request/RequestTabs';
import MethodSelector from '../request/MethodSelector';
import UrlInput from '../request/UrlInput';
import SendButton from '../request/SendButton';
import SaveButton from '../request/SaveButton';
import ResponsePanel from '../response/ResponsePanel';

// Editors
import ParamsEditor from '../request/ParamsEditor';
import HeadersEditor from '../request/HeadersEditor';
import BodyEditor from '../request/BodyEditor';
import AuthEditor from '../request/AuthEditor';

// Selectors
import EnvSelector from '../environment/EnvSelector';
import EnvModal from '../environment/EnvModal';

export function AppShell() {
  const { activeTabId, tabs, updateTab, setSaved } = useWorkspaceStore();
  const [activeSubTab, setActiveSubTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');
  const [showEnvModal, setShowEnvModal] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId);
  const fetchCollections = useCollectionStore(s => s.fetchCollections);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab && activeTab.requestId) {
          try {
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
            await api.updateRequest(activeTab.requestId, payload);
            setSaved(activeTab.id);
            await fetchCollections();
          } catch (err) {
            console.error('Ctrl+S save failed:', err);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, setSaved, fetchCollections]);

  return (
    <div className="flex flex-col h-screen bg-[var(--pm-bg-primary)] text-[var(--pm-text-primary)]">
      
      {/* ─── Top Bar (44px) ─── */}
      <header className="h-[44px] bg-[var(--pm-bg-topbar)] border-b border-[var(--pm-border)] flex items-center px-4 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[var(--pm-accent-orange)] p-1 rounded-md">
            <Zap size={16} color="#1A1A18" fill="#1A1A18" />
          </div>
          <span className="font-bold text-[14px] tracking-tight">API Client Platform</span>
        </div>
        
        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <EnvSelector />
          <button 
            onClick={() => setShowEnvModal(true)}
            className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] p-1.5 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ─── Main Body ─── */}
      <main className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          
          {/* Sidebar Panel */}
          <Panel defaultSize={18} minSize={14} maxSize={28} className="flex flex-col bg-[var(--pm-bg-sidebar)]">
            <Sidebar />
          </Panel>

          <PanelResizeHandle className="w-[4px] bg-[var(--pm-border)] hover:bg-[var(--pm-border-strong)] transition-colors cursor-col-resize" />

          {/* Editor/Response Panel */}
          <Panel defaultSize={82} className="flex flex-col">
            <PanelGroup direction="vertical">
              
              {/* Request Panel */}
              <Panel defaultSize={55} minSize={30} className="flex flex-col overflow-hidden">
                {activeTab ? (
                  <>
                    <RequestTabs />
                    
                    {/* URL Bar */}
                    <div className="flex items-center p-[10px_14px] border-b border-[var(--pm-border)] gap-0">
                      <MethodSelector 
                        value={activeTab.request.method}
                        onChange={(method) => updateTab(activeTab.id, { method })}
                      />
                      <UrlInput />
                      <SaveButton />
                      <SendButton />
                    </div>

                    {/* Sub-tabs Area */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                       <div className="flex px-4 border-b border-[var(--pm-border)] h-[36px] items-center gap-6">
                        {(['params', 'auth', 'headers', 'body'] as const).map(tab => (
                             <button
                                key={tab}
                                onClick={() => setActiveSubTab(tab)}
                                className={`h-full text-[12px] font-medium transition-colors border-b-2 capitalize ${activeSubTab === tab ? 'text-[var(--pm-accent-orange)] border-[var(--pm-accent-orange)]' : 'text-[var(--pm-text-muted)] border-transparent hover:text-[var(--pm-text-secondary)]'}`}
                            >
                                {tab}
                            </button>
                        ))}
                       </div>

                       {/* Editor Content */}
                       <div className="flex-1 overflow-auto bg-[var(--pm-bg-primary)]">
                          {activeSubTab === 'params' && (
                            <ParamsEditor 
                                rows={activeTab.request.params}
                                onChange={(params) => updateTab(activeTab.id, { params })}
                            />
                          )}
                          {activeSubTab === 'auth' && <AuthEditor />}
                          {activeSubTab === 'headers' && (
                            <HeadersEditor 
                                rows={activeTab.request.headers}
                                onChange={(headers) => updateTab(activeTab.id, { headers })}
                            />
                          )}
                          {activeSubTab === 'body' && <BodyEditor />}
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[var(--pm-text-muted)]">
                    Pick a request from the sidebar or open a new tab
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="h-[4px] bg-[var(--pm-border)] hover:bg-[var(--pm-border-strong)] transition-colors cursor-row-resize" />

              {/* Response Panel */}
              <Panel defaultSize={45} minSize={20} className="bg-[var(--pm-bg-surface)]">
                 <ResponsePanel />
              </Panel>

            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>
      {showEnvModal && <EnvModal onClose={() => setShowEnvModal(false)} />}
    </div>
  );
}
