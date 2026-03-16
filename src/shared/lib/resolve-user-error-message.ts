interface UserErrorMessages {
  defaultMessage: string;
  sessionExpiredMessage: string;
  temporaryUnavailableMessage: string;
}

const hasAny = (value: string, patterns: string[]) =>
  patterns.some((pattern) => value.includes(pattern));

export const resolveUserErrorMessage = (
  rawMessage: string | undefined,
  { defaultMessage, sessionExpiredMessage, temporaryUnavailableMessage }: UserErrorMessages,
) => {
  if (!rawMessage) return defaultMessage;

  const normalized = rawMessage.toLowerCase();

  if (
    hasAny(normalized, [
      'unauthorized',
      'forbidden',
      'invalid_refresh',
      'session expired',
      'token expired',
      'login required',
      '401',
      '403',
    ])
  ) {
    return sessionExpiredMessage;
  }

  if (
    hasAny(normalized, [
      'auth refresh temporarily unavailable',
      'auth_refresh_temporarily_unavailable',
      'temporarily unavailable',
      'network error',
      'timeout',
      'failed to fetch',
      '503',
    ])
  ) {
    return temporaryUnavailableMessage;
  }

  return defaultMessage;
};
