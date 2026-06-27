import { create } from 'zustand';
import { Environment, EnvVar } from '../types';
import * as api from '../lib/api';

interface EnvironmentState {
    environments: Environment[];
    activeEnvId: string | null;
    vars: EnvVar[];
    
    // Actions
    fetchEnvironments: () => Promise<void>;
    setActiveEnv: (id: string | null) => Promise<void>;
    fetchVars: (envId: string) => Promise<void>;
    updateVars: (envId: string, vars: Partial<EnvVar>[]) => Promise<void>;
    createEnvironment: (name: string) => Promise<void>;
    deleteEnvironment: (id: string) => Promise<void>;
    updateEnvironment: (id: string, name: string) => Promise<void>;
}

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
    environments: [],
    activeEnvId: null,
    vars: [],

    fetchEnvironments: async () => {
        const data = await api.getEnvironments();
        const active = data.find((e: Environment) => e.is_active === 1);
        set({ environments: data, activeEnvId: active ? active.id : null });
        if (active) {
            await get().fetchVars(active.id);
        }
    },

    setActiveEnv: async (id) => {
        if (id) {
            await api.updateEnvironment(id, { is_active: 1 });
        } else {
            // Logic to clear active status if needed
        }
        await get().fetchEnvironments();
    },

    fetchVars: async (envId) => {
        const data = await api.getEnvVars(envId);
        set({ vars: data });
    },

    updateVars: async (envId, vars) => {
        await api.updateEnvVars(envId, vars);
        await get().fetchEnvironments();
    },

    createEnvironment: async (name) => {
        await api.createEnvironment({ name });
        await get().fetchEnvironments();
    },

    deleteEnvironment: async (id) => {
        await api.deleteEnvironment(id);
        await get().fetchEnvironments();
    },

    updateEnvironment: async (id, name) => {
        await api.updateEnvironment(id, { name });
        await get().fetchEnvironments();
    }
}));
