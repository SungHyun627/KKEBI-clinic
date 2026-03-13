import { NextResponse } from 'next/server';

const BACKEND_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, '') ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId } = await params;
  if (!BACKEND_BASE_URL) {
    return NextResponse.json(
      { code: 'CONFIG_ERROR', message: 'API base URL is not configured' },
      { status: 500 },
    );
  }

  try {
    const requestUrl = new URL(request.url);
    const query = requestUrl.searchParams.toString();
    const path = `/api/v1/sessions/${encodeURIComponent(sessionId)}/audio-chunk${
      query ? `?${query}` : ''
    }`;

    const headers = new Headers();
    const contentType = request.headers.get('content-type');
    const authorization = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');
    if (contentType) headers.set('content-type', contentType);
    if (authorization) headers.set('authorization', authorization);
    if (cookie) headers.set('cookie', cookie);

    // Keep multipart bytes intact for audio upload.
    const body = await request.arrayBuffer();
    const upstream = await fetch(`${BACKEND_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
    });

    const responseText = await upstream.text();
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get('content-type');
    const setCookie = upstream.headers.get('set-cookie');
    if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType);
    if (setCookie) responseHeaders.set('set-cookie', setCookie);

    return new NextResponse(responseText, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '오디오 조각 업로드 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};
