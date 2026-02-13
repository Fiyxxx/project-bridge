import { NextRequest, NextResponse } from 'next/server';
import { generateCaseNote } from '@/lib/openai';
import type { GenerateCaseNoteRequest, GenerateCaseNoteResponse } from '@/types/assessment';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const body: GenerateCaseNoteRequest = await request.json();

    // Validate request
    if (!body.observations || Object.keys(body.observations).length === 0) {
      return NextResponse.json(
        { error: 'Observations are required' },
        { status: 400 }
      );
    }

    if (!body.metadata || !body.metadata.childId || !body.metadata.sessionDate) {
      return NextResponse.json(
        { error: 'Metadata with childId and sessionDate is required' },
        { status: 400 }
      );
    }

    const caseNoteText = await generateCaseNote(body);
    const processingTime = (Date.now() - startTime) / 1000;

    // Parse the generated text into structured format
    // For POC, we return the full text and let the frontend handle display
    const response: GenerateCaseNoteResponse = {
      caseNote: {
        ...body.metadata,
        domains: {
          gross_motor: body.observations.gross_motor || '',
          fine_motor: body.observations.fine_motor || '',
          speech_language: body.observations.speech_language || '',
          social_emotional: body.observations.social_emotional || '',
          cognitive: body.observations.cognitive || '',
        },
        summary: caseNoteText, // Full generated text for now
        recommendations: '',
      },
      processingTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating case note:', error);
    return NextResponse.json(
      { error: 'Failed to generate case note' },
      { status: 500 }
    );
  }
}
