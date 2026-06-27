'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { runRequest } from '@/lib/api';

export default function SendButton() {
  const { activeTabId, tabs, setResponse, setLoading, fetchHistory } = useWorkspaceStore();
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTabId || !activeTab) return null;

  const handleSend = async () => {
    setLoading(activeTabId, true);
    try {
      // Map frontend state to backends RunRequest schema
      const payload = {
        method: activeTab.request.method,
        url: activeTab.request.url,
        headers: activeTab.request.headers,
        params: activeTab.request.params,
        body_type: activeTab.request.body_type,
        body_raw: activeTab.request.body_raw,
        body_form: activeTab.request.body_form,
        auth_type: activeTab.request.auth_type,
        auth_data: activeTab.request.auth_data
      };
      
      const response = await runRequest(payload);
      setResponse(activeTabId, response);
      await fetchHistory();
    } catch (err: any) {
      setResponse(activeTabId, {
        status_code: 0,
        status_text: 'Error',
        response_headers: {},
        response_body: '',
        response_size_bytes: 0,
        response_time_ms: 0,
        error_message: err.message
      });
    } finally {
      setLoading(activeTabId, false);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={activeTab.isLoading}
      className="pm-btn-primary min-w-[90px] rounded-r-md px-6 py-2 flex items-center justify-center gap-2"
    >
      {activeTab.isLoading ? (
        <>
          <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
          Cancel
        </>
      ) : (
        'Send'
      )}
    </button>
  );
}
