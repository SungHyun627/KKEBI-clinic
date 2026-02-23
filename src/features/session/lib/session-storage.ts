export function getSessionAutoRecordStorageKey(sessionId: string) {
  return `kkebi:session-auto-record:${sessionId}`;
}

export function getSessionSummaryStorageKey(sessionId: string) {
  return `kkebi:session-summary:${sessionId}`;
}
