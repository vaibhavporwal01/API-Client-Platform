'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import StatusBar from './StatusBar';
import ResponseBody from './ResponseBody';
import ResponseHeaders from './ResponseHeaders';

type ResponseTab = 'pretty' | 'raw' | 'headers';

export default function ResponsePanel() {
  const { activeTabId, tabs } = useWorkspaceStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  const [currentTab, setCurrentTab] = useState<ResponseTab>('pretty');

  if (!activeTabId || !activeTab) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-[var(--pm-text-muted)] bg-[var(--pm-bg-primary)]">
        <div className="text-[48px] opacity-20">⚡</div>
        <div className="mt-4">Enter a URL and click Send to see a response</div>
      </div>
    );
  }

  if (activeTab.isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-[var(--pm-text-muted)] bg-[var(--pm-bg-primary)]">
        <div className="w-10 h-10 border-4 border-[var(--pm-accent-orange)] border-t-transparent rounded-full animate-spin" />
        <div className="mt-4">Sending request...</div>
      </div>
    );
  }

  const { response } = activeTab;

  if (!response) {
    return (
       <div className="flex flex-col h-full items-center justify-center text-[var(--pm-text-muted)] bg-[var(--pm-bg-primary)]">
          <div className="text-[48px] opacity-20">🔍</div>
          <div className="mt-4">Response pane</div>
       </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--pm-bg-primary)] overflow-hidden">
      {/* 1. Status Bar */}
      <StatusBar 
        status={response.status_code}
        statusText={response.status_text}
        time={response.response_time_ms}
        size={response.response_size_bytes}
      />

      {/* 2. Error Display (If applicable) */}
      {response.error_message && (
        <div className="p-4 m-4 bg-[rgba(249,62,62,0.1)] border border-[var(--pm-status-4xx)] rounded-md text-[var(--pm-status-4xx)]">
          <div className="font-bold flex items-center gap-2">
            <span>⚠️</span> Request Error
          </div>
          <div className="mt-1 text-[13px] font-mono whitespace-pre-wrap">
            {response.error_message}
          </div>
        </div>
      )}

      {/* 3. Panel Header / Tab Bar */}
      {!response.error_message && (
        <>
          <div className="flex items-center px-4 border-b border-[var(--pm-border)] h-[36px] gap-6">
            {(['pretty', 'raw', 'headers'] as ResponseTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`h-full text-[12px] font-medium transition-colors border-b-2 capitalize ${currentTab === tab ? 'text-[var(--pm-accent-orange)] border-[var(--pm-accent-orange)]' : 'text-[var(--pm-text-muted)] border-transparent hover:text-[var(--pm-text-secondary)]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 4. Content Area */}
          <div className="flex-1 overflow-auto bg-[var(--pm-bg-surface)]">
            {currentTab === 'pretty' && (
              <ResponseBody 
                body={response.response_body} 
                isPretty={true}
              />
            )}
            {currentTab === 'raw' && (
              <ResponseBody 
                body={response.response_body} 
                isPretty={false}
              />
            )}
            {currentTab === 'headers' && (
              <ResponseHeaders 
                headers={response.response_headers}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
