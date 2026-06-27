import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../lib/api';
import { 
    Tab, 
    RequestState, 
    ResponseState, 
    HistoryEntry, 
    SavedRequest,
    defaultRequestState 
} from '../types';

interface WorkspaceState {
    tabs: Tab[];
    activeTabId: string | null;
    history: HistoryEntry[];
    
    // Actions
    openTab: (partialRequest?: Partial<RequestState>, name?: string, requestId?: string, collectionId?: string) => void;
    closeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    updateTab: (id: string, updates: Partial<RequestState>) => void;
    setResponse: (tabId: string, response?: ResponseState) => void;
    setLoading: (tabId: string, loading: boolean) => void;
    loadFromHistory: (entry: HistoryEntry) => void;
    loadFromSaved: (req: SavedRequest) => void;
    setSaved: (tabId: string) => void;
    fetchHistory: () => Promise<void>;
    clearHistory: () => Promise<void>;
    renameTabByRequest: (requestId: string, newName: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    persist(
        (set, get) => ({
            tabs: [],
            activeTabId: null,
            history: [],

            openTab: (partialRequest, name = 'New Request', requestId, collectionId) => {
                const id = uuidv4();
                const newTab: Tab = {
                    id,
                    name,
                    isDirty: false,
                    isLoading: false,
                    request: {
                        ...defaultRequestState(),
                        ...partialRequest
                    },
                    requestId,
                    collectionId
                };

                set((state) => ({
                    tabs: [...state.tabs, newTab],
                    activeTabId: id,
                }));
            },

            closeTab: (id) => {
                const { tabs, activeTabId } = get();
                const newTabs = tabs.filter((t) => t.id !== id);
                let newActiveId = activeTabId;

                if (activeTabId === id) {
                    const closedIdx = tabs.findIndex((t) => t.id === id);
                    if (newTabs.length > 0) {
                        newActiveId = newTabs[Math.max(0, closedIdx - 1)].id;
                    } else {
                        newActiveId = null;
                    }
                }

                set({ tabs: newTabs, activeTabId: newActiveId });
            },

            setActiveTab: (id) => set({ activeTabId: id }),

            updateTab: (id, updates) => {
                set((state) => ({
                    tabs: state.tabs.map((t) => 
                        t.id === id 
                            ? { ...t, isDirty: true, request: { ...t.request, ...updates } } 
                            : t
                    )
                }));
            },

            setResponse: (tabId, response) => {
                set((state) => ({
                    tabs: state.tabs.map((t) => 
                        t.id === tabId ? { ...t, response, isLoading: false } : t
                    )
                }));
            },

            setLoading: (tabId, loading) => {
                set((state) => ({
                    tabs: state.tabs.map((t) => 
                        t.id === tabId ? { ...t, isLoading: loading } : t
                    )
                }));
            },

            loadFromHistory: (entry) => {
                const { openTab } = get();
                openTab(entry.request, `${entry.method} ${entry.url}`);
            },

            loadFromSaved: (req) => {
                const { openTab } = get();
                openTab(req.request, req.name, req.id, req.collectionId);
            },

            setSaved: (tabId) => {
                set((state) => ({
                    tabs: state.tabs.map((t) => 
                        t.id === tabId ? { ...t, isDirty: false } : t
                    )
                }));
            },

            fetchHistory: async () => {
                const data = await api.getHistory();
                set({ history: data });
            },

            clearHistory: async () => {
                await api.clearHistory();
                set({ history: [] });
            },

            renameTabByRequest: (requestId, newName) => {
                set((state) => ({
                    tabs: state.tabs.map((t) => 
                        t.requestId === requestId ? { ...t, name: newName } : t
                    )
                }));
            },
        }),
        {
            name: 'workspace-storage', // localStorage key
        }
    )
);
