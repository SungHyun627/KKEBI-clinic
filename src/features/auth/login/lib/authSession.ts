export const AUTH_SESSION_KEY = 'kkebi-auth-session';

export interface AuthSession {
  email: string;
  password: string;
  userId?: string;
  userName: string;
  challengeId?: string;
  authenticated: boolean;
}

const isClient = () => typeof window !== 'undefined';

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
};

export const setAuthSessionAuthenticated = (authenticated: boolean) => {
  const session = getAuthSession();
  if (!session) return;
  setAuthSession({ ...session, challengeId: undefined, authenticated });
};

export const clearAuthSession = () => {
  if (!isClient()) return;
  localStorage.removeItem(AUTH_SESSION_KEY);
};
