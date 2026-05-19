const DEFAULT_API_BASE = 'http://127.0.0.1:8000';

export type ApiErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'NETWORK' | 'UNKNOWN';

const errorCodeByStatus: Record<number, ApiErrorCode> = {
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  422: 'VALIDATION'
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code: ApiErrorCode;
  readonly payload?: unknown;

  constructor(message: string, options: { status?: number; code: ApiErrorCode; payload?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.payload = options.payload;
  }
}

export function getApiBase(): string {
  const fromEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_BASE;
  return fromEnv && fromEnv.trim() ? fromEnv.trim() : DEFAULT_API_BASE;
}

function buildUrl(path: string): string {
  return `${getApiBase()}${path.startsWith('/') ? path : `/${path}`}`;
}

function buildHeaders(token?: string, init?: HeadersInit): Headers {
  const headers = new Headers(init);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

function extractMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'detail' in payload) {
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === 'string') {
      return detail;
    }
  }
  return `Request failed with status ${status}`;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH';
    token?: string;
    body?: unknown;
    headers?: HeadersInit;
  } = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method: options.method ?? 'GET',
      headers: buildHeaders(options.token, options.headers),
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });
  } catch {
    throw new ApiError('Network error', { code: 'NETWORK' });
  }

  const text = await response.text();
  const payload = text ? safeParse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(extractMessage(payload, response.status), {
      status: response.status,
      code: errorCodeByStatus[response.status] ?? 'UNKNOWN',
      payload
    });
  }

  return (payload as T) ?? ({} as T);
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
