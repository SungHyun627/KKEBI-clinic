import { NextResponse } from 'next/server';

export async function POST() {
  // mock: always succeed after short delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return NextResponse.json({ success: true });
}
