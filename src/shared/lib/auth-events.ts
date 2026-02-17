const AUTH_REQUIRED_EVENT = 'kkebi-auth-required';

const isClient = () => typeof window !== 'undefined';

export const emitAuthRequired = () => {
  if (!isClient()) return;
  window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
};

export const subscribeAuthRequired = (listener: () => void) => {
  if (!isClient()) return () => {};
  window.addEventListener(AUTH_REQUIRED_EVENT, listener);
  return () => {
    window.removeEventListener(AUTH_REQUIRED_EVENT, listener);
  };
};
