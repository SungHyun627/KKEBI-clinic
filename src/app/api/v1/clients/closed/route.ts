import { NextResponse } from 'next/server';
import { getClosedClients } from '@/shared/mock/client-lifecycle-store';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: getClosedClients(),
  });
}
