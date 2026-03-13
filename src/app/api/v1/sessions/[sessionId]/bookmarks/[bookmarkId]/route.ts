import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string; bookmarkId: string }> },
) => {
  const { sessionId, bookmarkId } = await params;

  try {
    return await proxyToBackend(request, {
      method: 'DELETE',
      path: `/api/v1/sessions/${encodeURIComponent(sessionId)}/bookmarks/${encodeURIComponent(
        bookmarkId,
      )}`,
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '북마크 삭제 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};
