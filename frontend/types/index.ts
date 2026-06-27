// ─────────────────────────────────────────────────────────────────────────────
// API Client Platform — TypeScript Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ─── HTTP Primitives ──────────────────────────────────────────────────────────
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type BodyType =
  | 'none'
  | 'json'
  | 'form-data'
  | 'x-www-form-urlencoded'
  | 'raw'
  | 'binary';

export type AuthType =
  | 'none'
  | 'bearer'
  | 'basic'
  | 'api-key'
  | 'oauth2';

// ─── Key-Value Pair ───────────────────────────────────────────────────────────
export interface KVPair {
  id:          string;
  key:         string;
  value:       string;
  enabled:     boolean;
  description?: string;
}

// ─── Auth Data ────────────────────────────────────────────────────────────────
export interface AuthDataBearer {
  token: string;
}

export interface AuthDataBasic {
  username: string;
  password: string;
}

export interface AuthDataApiKey {
  key:   string;
  value: string;
  in:    'header' | 'query';
}

export interface AuthDataOAuth2 {
  accessToken:  string;
  tokenType:    string;
  refreshToken?: string;
}

export type AuthData =
  | AuthDataBearer
  | AuthDataBasic
  | AuthDataApiKey
  | AuthDataOAuth2
  | Record<string, never>;

// ─── Request State ────────────────────────────────────────────────────────────
/**
 * RequestState holds all user-editable fields for a single HTTP request.
 * This is the core mutable state stored per workspace tab.
 */
export interface RequestState {
  method:     HttpMethod;
  url:        string;
  headers:    KVPair[];
  params:     KVPair[];

  // Body
  body_type:  BodyType;
  body_raw:   string;               // JSON / raw text / XML
  body_form:  KVPair[];             // form-data and x-www-form-urlencoded rows

  // Auth
  auth_type:  AuthType;
  auth_data:  AuthData;
}

/** Factory: fresh default RequestState */
export function defaultRequestState(): RequestState {
  return {
    method:    'GET',
    url:       '',
    headers:   [],
    params:    [],
    body_type: 'none',
    body_raw:  '',
    body_form: [],
    auth_type: 'none',
    auth_data: {},
  };
}

// ─── Response State ───────────────────────────────────────────────────────────
/**
 * ResponseState captures everything returned from a completed HTTP request.
 */
export interface ResponseState {
  status_code:       number;
  status_text:       string;
  response_headers:  Record<string, string>;
  response_body:     string;
  response_size_bytes: number;
  response_time_ms:  number;

  /** Set when a network-level error occurs (not an HTTP error status) */
  error_message?:    string;
}

// ─── Workspace Tab ────────────────────────────────────────────────────────────
/**
 * Tab represents one open request editor tab in the workspace.
 */
export interface Tab {
  id:        string;
  name:      string;
  isDirty:   boolean;
  request:   RequestState;
  response?: ResponseState;
  isLoading: boolean;

  /** If saved to a collection, these link back to the source */
  collectionId?: string;
  requestId?:    string;
}

// ─── Collection ───────────────────────────────────────────────────────────────
export interface CollectionFolder {
  id:       string;
  name:     string;
  requests: SavedRequest[];
  folders?: CollectionFolder[];
}

export interface Collection {
  id:          string;
  name:        string;
  description?: string;
  requests:    SavedRequest[];
  folders:     CollectionFolder[];
  createdAt:   string;   // ISO 8601
  updatedAt:   string;
}

// ─── Saved Request ────────────────────────────────────────────────────────────
/**
 * SavedRequest is a persisted snapshot of a RequestState stored inside a Collection.
 */
export interface SavedRequest {
  id:            string;
  name:          string;
  collectionId:  string;
  folderId?:     string;
  request:       RequestState;
  createdAt:     string;
  updatedAt:     string;
}

// ─── Environment ──────────────────────────────────────────────────────────────
export interface EnvVar {
  id:      string;
  key:     string;
  value:   string;
  enabled: boolean;
  secret?: boolean;     // mask value in the UI
}

export interface Environment {
  id:        string;
  name:      string;
  variables: EnvVar[];
  is_active?: number;
  createdAt: string;
  updatedAt: string;
}

/** Resolved flat map of enabled environment variables */
export type ResolvedEnv = Record<string, string>;

// ─── History Entry ────────────────────────────────────────────────────────────
export interface HistoryEntry {
  id:        string;
  method:    HttpMethod;
  url:       string;
  status:    number;
  duration:  number;         // ms
  timestamp: string;         // ISO 8601
  request:   RequestState;
  response?: ResponseState;
}

// ─── Runner Payload ───────────────────────────────────────────────────────────
/** Shape sent to the FastAPI backend /runner/send endpoint */
export interface SendRequestPayload {
  method:   HttpMethod;
  url:      string;
  headers?: Record<string, string>;
  params?:  Record<string, string>;
  body?:    string | null;
  auth?:    {
    type:     AuthType;
    [key: string]: unknown;
  };
}

/** Shape returned from the FastAPI backend /runner/send endpoint */
export interface SendRequestResponse {
  status:      number;
  status_text: string;
  duration:    number;
  size:        number;
  headers:     Record<string, string>;
  body:        string;
}

// ─── Code Snippet Language ────────────────────────────────────────────────────
export type SnippetLanguage = 'curl' | 'javascript' | 'python' | 'go';

export interface RunRequest {
  method:     HttpMethod;
  url:        string;
  headers:    KVPair[];
  params:     KVPair[];
  body_type:  BodyType;
  body_raw:   string;
  body_form:  KVPair[];
  auth_type:  AuthType;
  auth_data:  AuthData;
}

export interface RunResponse {
  status_code:         number;
  status_text:         string;
  response_headers:    Record<string, string>;
  response_body:       string;
  response_size_bytes: number;
  response_time_ms:    number;
  error_message?:      string;
  history_id?:         string;
}
