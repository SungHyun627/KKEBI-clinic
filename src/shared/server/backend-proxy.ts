import { NextResponse } from 'next/server';

const BACKEND_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, '') ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

interface ProxyOptions {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export async function proxyToBackend(request: Request, options: ProxyOptions) {
  if (!BACKEND_BASE_URL) {
    return NextResponse.json(
      { code: 'CONFIG_ERROR', message: 'API base URL is not configured' },
      { status: 500 },
    );
  }

  const upstreamUrl = `${BACKEND_BASE_URL}${options.path}`;
  const requestHeaders = new Headers();
  const contentType = request.headers.get('content-type');
  const authorization = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');

  if (contentType) requestHeaders.set('content-type', contentType);
  if (authorization) requestHeaders.set('authorization', authorization);
  if (cookie) requestHeaders.set('cookie', cookie);

  const body =
    options.method === 'GET' || options.method === 'DELETE' ? undefined : await request.text();

  const upstreamResponse = await fetch(upstreamUrl, {
    method: options.method,
    headers: requestHeaders,
    body,
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get('content-type');
  const setCookie = upstreamResponse.headers.get('set-cookie');

  if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType);
  if (setCookie) responseHeaders.set('set-cookie', setCookie);

  const responseBody = await upstreamResponse.text();
  return new NextResponse(responseBody, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
