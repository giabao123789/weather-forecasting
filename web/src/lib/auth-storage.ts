import type { AuthUser } from '@/types';

const TOKEN_STORAGE_KEY = 'weather-scope-token';
const USER_STORAGE_KEY = 'weather-scope-user';
const AUTH_CHANGE_EVENT = 'weather-auth-change';

type AuthSnapshot = {
  token: string | null;
  user: AuthUser | null;
};

const EMPTY_AUTH_SNAPSHOT: AuthSnapshot = {
  token: null,
  user: null,
};

let cachedSnapshot: AuthSnapshot = EMPTY_AUTH_SNAPSHOT;
let cachedToken: string | null = null;
let cachedUserRaw: string | null = null;

function canUseBrowserStorage() {
  return typeof window !== 'undefined';
}

function notifyAuthChange() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getStoredToken() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

function getRawStoredUser() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  return window.localStorage.getItem(USER_STORAGE_KEY);
}

export function saveAuth(token: string, user: AuthUser) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function saveStoredUser(user: AuthUser) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function clearStoredAuth() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
  notifyAuthChange();
}

export function getAuthSnapshot(): AuthSnapshot {
  const nextToken = getStoredToken();
  const nextUserRaw = getRawStoredUser();

  if (nextToken === cachedToken && nextUserRaw === cachedUserRaw) {
    return cachedSnapshot;
  }

  cachedToken = nextToken;
  cachedUserRaw = nextUserRaw;
  cachedSnapshot = {
    token: nextToken,
    user: nextUserRaw ? getStoredUser() : null,
  };

  return cachedSnapshot;
}

export function getAuthServerSnapshot(): AuthSnapshot {
  return EMPTY_AUTH_SNAPSHOT;
}

export function subscribeToAuthStorage(onStoreChange: () => void) {
  if (!canUseBrowserStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener('storage', handleChange);
  window.addEventListener(AUTH_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, handleChange);
  };
}
