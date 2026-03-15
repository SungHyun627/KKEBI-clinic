import type { SummaryTranscriptItem } from '@/entities/summary/model/types';

function triggerDownload(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildTranscriptText(transcriptItems: SummaryTranscriptItem[]) {
  return transcriptItems
    .map((item) => `[${item.timestamp ?? '--:--:--'}] ${item.speaker}: ${item.text ?? ''}`)
    .join('\n');
}

export function downloadSessionTranscriptTxt(params: {
  sessionId: number;
  transcriptItems: SummaryTranscriptItem[];
  locale: string;
}) {
  const { sessionId, transcriptItems, locale } = params;
  const content = buildTranscriptText(transcriptItems);

  triggerDownload(
    `${sessionId}-transcript.txt`,
    content || (locale === 'en' ? 'No transcript.' : '전사 내용이 없습니다.'),
  );
}

export function downloadSessionRecordingFile(params: {
  sessionId: number;
  transcriptItems: SummaryTranscriptItem[];
  locale: string;
  audioUrl?: string;
}) {
  const { sessionId, transcriptItems, locale, audioUrl } = params;

  if (audioUrl) {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${sessionId}-recording`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    return;
  }

  const content = transcriptItems
    .map((item) => `${item.timestamp ?? '--:--:--'} ${item.speaker}: ${item.text ?? ''}`)
    .join('\n');

  triggerDownload(
    `${sessionId}-recording.webm`,
    content || (locale === 'en' ? 'No recording data.' : '녹음 데이터가 없습니다.'),
    'audio/webm',
  );
}

export function printSessionSummaryPdf() {
  window.print();
}
