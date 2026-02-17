import { clearAccessToken, getAccessToken, setAccessToken } from './token-store';
import { emitAuthRequired } from '@/shared/lib/auth-events';

export interface ApiErrorShape {
  status: number;
  code?: string;
  message?: string;
  errorCode?: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  errorCode?: string;
  details?: unknown;

  constructor(payload: ApiErrorShape) {
    super(payload.message || 'Request failed');
    this.name = 'ApiError';
    this.status = payload.status;
    this.code = payload.code;
    this.errorCode = payload.errorCode;
    this.details = payload.details;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: HeadersInit;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
let refreshPromise: Promise<boolean> | null = null;

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath.startsWith('/api/')) return normalizedPath;
  return `${API_BASE_URL}${normalizedPath}`;
}

interface ApiEnvelope<TData = unknown> {
  code?: string;
  message?: string;
  data?: TData;
}

async function requestTokenRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl('/api/v1/counselor/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        clearAccessToken();
        emitAuthRequired();
        return false;
      }

      const payload = (await parseResponse<ApiEnvelope<Record<string, unknown>>>(response)) ?? {};
      const token = payload?.data?.accessToken;
      if (typeof token === 'string' && token) {
        setAccessToken(token);
        return true;
      }

      clearAccessToken();
      emitAuthRequired();
      return false;
    } catch {
      clearAccessToken();
      emitAuthRequired();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return (await response.text()) as T;
}

function toApiError(status: number, payload: unknown) {
  if (payload && typeof payload === 'object') {
    const json = payload as Record<string, unknown>;
    return new ApiError({
      status,
      code: typeof json.code === 'string' ? json.code : undefined,
      errorCode: typeof json.errorCode === 'string' ? json.errorCode : undefined,
      message: typeof json.message === 'string' ? json.message : undefined,
      details: json,
    });
  }
  return new ApiError({
    status,
    message: typeof payload === 'string' ? payload : 'Request failed',
  });
}

export async function request<T = unknown>(path: string, options: RequestOptions = {}) {
  const { body, headers, skipAuth, skipRefresh, ...rest } = options;

  const requestHeaders = new Headers(headers);
  const hasBody = typeof body !== 'undefined';
  if (hasBody && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    credentials: 'include',
    headers: requestHeaders,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const refreshed = await requestTokenRefresh();
    if (refreshed) {
      return request<T>(path, {
        ...options,
        skipRefresh: true,
      });
    }
  }

  const parsed = await parseResponse<unknown>(response);
  if (!response.ok) {
    throw toApiError(response.status, parsed);
  }
  return parsed as T;
}

export const httpClient = {
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
