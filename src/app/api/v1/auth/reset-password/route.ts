import { NextResponse } from 'next/server';

async function passwordResetHandler() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return NextResponse.json({ success: true });
}

export { passwordResetHandler as POST };
