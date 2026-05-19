import type { LoginResponse } from '../api/types';

const SESSION_KEY = 'petcare.session';

export type Session = {
  token: string;
  username: string;
  role: LoginResponse['user']['role'];
};

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setSession(payload: LoginResponse): void {
  const session: Session = {
    token: payload.token,
    username: payload.user.username,
    role: payload.user.role
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
