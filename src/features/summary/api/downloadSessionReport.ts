import { ensureAccessToken } from '@/shared/api/http-client';
import { getAccessToken } from '@/shared/api/token-store';

type ReportKind = 'txt' | 'pdf' | 'audio';

const REPORT_TYPE: Record<ReportKind, 'TXT' | 'PDF' | 'AUDIO'> = {
  txt: 'TXT',
  pdf: 'PDF',
  audio: 'AUDIO',
};

const parseFilenameFromDisposition = (contentDisposition: string | null, fallback: string) => {
  if (!contentDisposition) return fallback;

  const utf8Match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return fallback;
    }
  }

  const basicMatch = contentDisposition.match(/filename\s*=\s*\"?([^\";]+)\"?/i);
  if (basicMatch?.[1]) return basicMatch[1];
  return fallback;
};

const triggerBlobDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const downloadSessionReport = async (sessionId: number, kind: ReportKind) => {
  const hasToken = await ensureAccessToken();
  if (!hasToken) {
    throw new Error('Unauthorized');
  }

  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const fallbackFilename =
    kind === 'txt'
      ? `${sessionId}-transcript.txt`
      : kind === 'pdf'
        ? `${sessionId}-summary.pdf`
        : `${sessionId}-recording.webm`;

  const response = await fetch(
    `/api/v1/sessions/${encodeURIComponent(String(sessionId))}/reports/download?type=${encodeURIComponent(
      REPORT_TYPE[kind],
    )}`,
    {
      method: 'GET',
      credentials: 'include',
      headers,
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to download report (status: ${response.status || 'unknown'})`);
  }

  const blob = await response.blob();
  const filename = parseFilenameFromDisposition(
    response.headers.get('content-disposition'),
    fallbackFilename,
  );
  triggerBlobDownload(blob, filename);
};
