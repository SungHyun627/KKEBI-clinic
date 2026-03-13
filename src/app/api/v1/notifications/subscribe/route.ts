import { NextResponse } from 'next/server';

const BACKEND_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, '') ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export const dynamic = 'force-dynamic';

export const GET = async (request: Request) => {
  const locale = request.headers.get('accept-language')?.toLowerCase().startsWith('en')
    ? 'en'
    : 'ko';

  if (!BACKEND_BASE_URL) {
    return NextResponse.json(
      { code: 'CONFIG_ERROR', message: 'API base URL is not configured' },
      { status: 500 },
    );
  }

  try {
    const headers = new Headers();
    const requestUrl = new URL(request.url);
    const accessToken = requestUrl.searchParams.get('accessToken');
    const authorization = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');

    if (authorization) {
      headers.set('authorization', authorization);
    } else if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }

    if (cookie) headers.set('cookie', cookie);
    headers.set('accept', 'text/event-stream');

    const upstream = await fetch(`${BACKEND_BASE_URL}/api/v1/notifications/subscribe`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!upstream.ok || !upstream.body) {
      const body = await upstream.text();
      return new NextResponse(body || 'Failed to connect notification SSE stream', {
        status: upstream.status || 500,
        headers: {
          'content-type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
        },
      });
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message:
          locale === 'en'
            ? 'An error occurred while subscribing to realtime notifications.'
            : '실시간 알림 구독 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};
