const previewUrlBySessionId = new Map<string, string>();

export const setSessionAudioPreviewUrl = (sessionId: string, url: string) => {
  const prev = previewUrlBySessionId.get(sessionId);
  if (prev && prev !== url) {
    URL.revokeObjectURL(prev);
  }
  previewUrlBySessionId.set(sessionId, url);
};

export const getSessionAudioPreviewUrl = (sessionId: string) =>
  previewUrlBySessionId.get(sessionId) ?? null;

export const clearSessionAudioPreviewUrl = (sessionId: string) => {
  const prev = previewUrlBySessionId.get(sessionId);
  if (prev) {
    URL.revokeObjectURL(prev);
  }
  previewUrlBySessionId.delete(sessionId);
};
