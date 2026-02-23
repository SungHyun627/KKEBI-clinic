import { NextResponse } from 'next/server';

interface BookmarkRequestBody {
  transcriptId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as BookmarkRequestBody | null;
  if (!body?.transcriptId) {
    return NextResponse.json(
      { success: false, message: 'transcriptId is required' },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      transcriptId: body.transcriptId,
      bookmarked: true,
    },
  });
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as BookmarkRequestBody | null;
  if (!body?.transcriptId) {
    return NextResponse.json(
      { success: false, message: 'transcriptId is required' },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      transcriptId: body.transcriptId,
      bookmarked: false,
    },
  });
}
