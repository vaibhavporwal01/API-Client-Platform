import { create } from 'zustand';
import { Collection, SavedRequest } from '../types';
import * as api from '../lib/api';
import { useWorkspaceStore } from './useWorkspaceStore';

interface CollectionState {
    collections: Collection[];
    loading: boolean;
    
    // Actions
    fetchCollections: () => Promise<void>;
    createCollection: (name: string, description?: string) => Promise<void>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    deleteCollection: (id: string) => Promise<void>;
    
    createRequest: (payload: any) => Promise<void>;
    updateRequest: (id: string, payload: any) => Promise<void>;
    deleteRequest: (id: string) => Promise<void>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
    collections: [],
    loading: false,

    fetchCollections: async () => {
        set({ loading: true });
        try {
            const data = await api.getCollections();
            set({ collections: data });
        } finally {
            set({ loading: false });
        }
    },

    createCollection: async (name, description) => {
        await api.createCollection({ name, description });
        await get().fetchCollections();
    },

    updateCollection: async (id, updates) => {
        await api.updateCollection(id, updates);
        await get().fetchCollections();
    },

    deleteCollection: async (id) => {
        await api.deleteCollection(id);
        await get().fetchCollections();
    },

    createRequest: async (payload) => {
        await api.createRequest(payload);
        await get().fetchCollections();
    },

    updateRequest: async (id, payload) => {
        await api.updateRequest(id, payload);
        if (payload.name) {
            useWorkspaceStore.getState().renameTabByRequest(id, payload.name);
        }
        await get().fetchCollections();
    },

    deleteRequest: async (id) => {
        await api.deleteRequest(id);
        await get().fetchCollections();
    },
}));
