import { NextResponse } from 'next/server';
import type {
  ReminderChannel,
  SessionReminderPayload,
} from '@/features/notification/types/notification';

const VALID_CHANNELS: ReminderChannel[] = ['push', 'email', 'sms'];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SessionReminderPayload | null;

  if (
    !body ||
    !body.clientId ||
    !body.clientName ||
    !body.scheduleDate ||
    !body.scheduleTime ||
    !Array.isArray(body.channels) ||
    body.channels.length === 0 ||
    !body.channels.every((channel) => VALID_CHANNELS.includes(channel))
  ) {
    return NextResponse.json(
      {
        success: false,
        message: '요청 본문이 올바르지 않습니다.',
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      clientId: body.clientId,
      sentAt: new Date().toISOString(),
      channels: body.channels,
    },
  });
}
