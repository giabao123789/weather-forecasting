import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  SearchHistoryItem,
  WeatherData,
} from '@/types';

type ApiErrorPayload = {
  error?: string;
  message?: string | string[];
  statusCode?: number;
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured.');
  }

  return apiBaseUrl;
}

function getApiErrorMessage(payload: ApiErrorPayload | null) {
  if (!payload) {
    return 'Unexpected server response.';
  }

  if (Array.isArray(payload.message)) {
    return payload.message[0] ?? 'Unexpected server response.';
  }

  return payload.message ?? payload.error ?? 'Unexpected server response.';
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}/api/${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type');
  const payload =
    contentType?.includes('application/json') === true
      ? ((await response.json()) as unknown)
      : null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload as ApiErrorPayload | null));
  }

  return payload as T;
}

export function registerUser(payload: RegisterPayload) {
  return apiFetch<AuthResponse>('auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return apiFetch<AuthResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getProfile(token: string) {
  return apiFetch<AuthUser>('users/profile', { method: 'GET' }, token);
}

export function getSearchHistory(token: string) {
  return apiFetch<SearchHistoryItem[]>('users/history', { method: 'GET' }, token);
}

export function getWeatherByCity(city: string, token?: string) {
  const params = new URLSearchParams({ city });

  return apiFetch<WeatherData>(`weather?${params.toString()}`, { method: 'GET' }, token);
}

export function getWeatherByCoordinates(
  lat: number,
  lon: number,
  token?: string,
) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
  });

  return apiFetch<WeatherData>(`weather?${params.toString()}`, { method: 'GET' }, token);
}
