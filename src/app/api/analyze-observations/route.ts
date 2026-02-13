import { NextRequest, NextResponse } from 'next/server';
import { analyzeObservations } from '@/lib/openai';
import type { AnalyzeObservationsRequest, AnalyzeObservationsResponse } from '@/types/assessment';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const body: AnalyzeObservationsRequest = await request.json();

    if (!body.observations || body.observations.trim().length === 0) {
      return NextResponse.json(
        { error: 'Observations are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeObservations(body.observations);
    const processingTime = (Date.now() - startTime) / 1000;

    const response: AnalyzeObservationsResponse = {
      analysis,
      processingTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing observations:', error);
    return NextResponse.json(
      { error: 'Failed to analyze observations' },
      { status: 500 }
    );
  }
}
