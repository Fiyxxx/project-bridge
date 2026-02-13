import { NextResponse } from 'next/server';

export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({
    status: 'ok',
    openaiConfigured: hasApiKey,
    timestamp: new Date().toISOString(),
  });
}
