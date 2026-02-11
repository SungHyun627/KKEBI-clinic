export interface InitialLoginInfo {
  saveLoginInfo: boolean;
  email: string;
  password: string;
}

export const getInitialLoginInfo = (): InitialLoginInfo => {
  if (typeof window === 'undefined') {
    return { saveLoginInfo: false, email: '', password: '' };
  }
  const saved = localStorage.getItem('kkebi-login-info');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        saveLoginInfo: !!parsed.saveLoginInfo,
        email: parsed.email || '',
        password: parsed.password || '',
      };
    } catch {}
  }
  return { saveLoginInfo: false, email: '', password: '' };
};
