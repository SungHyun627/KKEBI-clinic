export const AUTH_SESSION_KEY = 'kkebi-auth-session';
const AUTH_SESSION_CHANGED_EVENT = 'kkebi-auth-session-changed';

export interface AuthSession {
  email: string;
  password: string;
  userId?: string;
  userName: string;
  challengeId?: string;
  authenticated: boolean;
}

const isClient = () => typeof window !== 'undefined';
const emitAuthSessionChanged = () => {
  if (!isClient()) return;
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
};

export const getAuthSession = (): AuthSession | null => {
  if (!isClient()) return null;
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.email || !parsed.password || !parsed.userName) return null;

    return {
      email: parsed.email,
      password: parsed.password,
      userId: parsed.userId,
      userName: parsed.userName,
      challengeId: parsed.challengeId,
      authenticated: Boolean(parsed.authenticated),
    };
  } catch {
    return null;
  }
};

export const setAuthSession = (session: AuthSession) => {
  if (!isClient()) return;
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  emitAuthSessionChanged();
};

export const setAuthSessionAuthenticated = (authenticated: boolean) => {
  const session = getAuthSession();
  if (!session) return;
  setAuthSession({ ...session, challengeId: undefined, authenticated });
};

export const clearAuthSession = () => {
  if (!isClient()) return;
  localStorage.removeItem(AUTH_SESSION_KEY);
  emitAuthSessionChanged();
};

export const subscribeAuthSession = (listener: () => void) => {
  if (!isClient()) return () => {};
  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, listener);
  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, listener);
  };
};
