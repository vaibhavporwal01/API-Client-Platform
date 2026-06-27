import { 
  Collection, 
  SavedRequest, 
  Environment, 
  EnvVar, 
  HistoryEntry, 
  RunRequest, 
  RunResponse,
  KVPair,
  AuthData,
  CollectionFolder
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api`
  : '/api';

// Helper to safely parse JSON strings from SQLite
function safeJsonParse<T>(str: string | any, fallback: T): T {
  if (typeof str !== 'string') return str || fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// Map backend flat request to frontend structured SavedRequest
function mapBackendRequest(raw: any): SavedRequest {
  return {
    id: raw.id,
    name: raw.name,
    collectionId: raw.collection_id || raw.collectionId,
    folderId: raw.folder_id || raw.folderId,
    request: {
      method: raw.method,
      url: raw.url,
      headers: safeJsonParse<KVPair[]>(raw.headers, []),
      params: safeJsonParse<KVPair[]>(raw.params, []),
      body_type: raw.body_type || 'none',
      body_raw: raw.body_raw || '',
      body_form: safeJsonParse<KVPair[]>(raw.body_form, []),
      auth_type: raw.auth_type || 'none',
      auth_data: safeJsonParse<AuthData>(raw.auth_data, {}),
    },
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
}

function mapCollection(c: any): Collection {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    requests: (c.requests || []).map(mapBackendRequest),
    folders: (c.children || c.folders || []).map(mapFolder),
    createdAt: c.created_at || c.createdAt,
    updatedAt: c.updated_at || c.updatedAt,
  };
}

function mapFolder(f: any): CollectionFolder {
  return {
    id: f.id,
    name: f.name,
    requests: (f.requests || []).map(mapBackendRequest),
    folders: (f.children || f.folders || []).map(mapFolder),
  };
}

function mapHistoryEntry(raw: any): HistoryEntry {
  return {
    id: raw.id,
    method: raw.method,
    url: raw.url,
    status: raw.status_code,
    duration: raw.response_time_ms,
    timestamp: raw.created_at,
    request: {
      method: raw.method,
      url: raw.url,
      headers: safeJsonParse<KVPair[]>(raw.headers, []),
      params: safeJsonParse<KVPair[]>(raw.params, []),
      body_type: raw.body_type || 'none',
      body_raw: raw.body_raw || '',
      body_form: [],
      auth_type: raw.auth_type || 'none',
      auth_data: safeJsonParse<AuthData>(raw.auth_data, {}),
    },
    response: raw.status_code ? {
      status_code: raw.status_code,
      status_text: raw.status_text || '',
      response_headers: safeJsonParse<Record<string, string>>(raw.response_headers, {}),
      response_body: raw.response_body || '',
      response_size_bytes: raw.response_size_bytes || 0,
      response_time_ms: raw.response_time_ms || 0,
      error_message: raw.error_message,
    } : undefined,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'API request failed');
  }

  return res.json();
}

// --- Collections ---
export const getCollections = async () => {
  const data = await request<any[]>('/collections');
  return data.map(mapCollection);
};
export const createCollection = (data: any) => request<Collection>('/collections', { method: 'POST', body: JSON.stringify(data) });
export const updateCollection = (id: string, data: any) => request<Collection>(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCollection = (id: string) => request<void>(`/collections/${id}`, { method: 'DELETE' });

// --- Requests ---
export const getRequests = (collectionId: string) => request<SavedRequest[]>(`/requests?collection_id=${collectionId}`);
export const createRequest = (data: any) => request<SavedRequest>('/requests', { method: 'POST', body: JSON.stringify(data) });
export const updateRequest = (id: string, data: any) => request<SavedRequest>(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteRequest = (id: string) => request<void>(`/requests/${id}`, { method: 'DELETE' });

// --- Environments ---
export const getEnvironments = () => request<Environment[]>('/environments');
export const createEnvironment = (data: any) => request<Environment>('/environments', { method: 'POST', body: JSON.stringify(data) });
export const updateEnvironment = (id: string, data: any) => request<Environment>(`/environments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEnvironment = (id: string) => request<void>(`/environments/${id}`, { method: 'DELETE' });

export const getEnvVars = async (envId: string) => {
  const data = await request<any[]>(`/environments/${envId}/vars`);
  return data.map(raw => ({
    id: raw.id,
    key: raw.key,
    value: raw.value || '',
    enabled: raw.enabled === 1 || raw.enabled === true
  }));
};
export const updateEnvVars = (envId: string, vars: any[]) => request<void>(`/environments/${envId}/vars`, { method: 'PUT', body: JSON.stringify(vars) });

// --- Runner ---
export const runRequest = (payload: RunRequest) => request<RunResponse>('/run', { method: 'POST', body: JSON.stringify(payload) });

// --- History ---
export const getHistory = async () => {
  const data = await request<any[]>('/history');
  return data.map(mapHistoryEntry);
};
export const deleteHistoryItem = (id: string) => request<void>(`/history/${id}`, { method: 'DELETE' });
export const clearHistory = () => request<void>('/history', { method: 'DELETE' });
