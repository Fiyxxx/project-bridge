import OpenAI from 'openai';
import { ANALYSIS_SYSTEM_PROMPT, GENERATION_SYSTEM_PROMPT } from './prompts';
import type {
  AnalyzeObservationsRequest,
  AnalyzeObservationsResponse,
  GenerateCaseNoteRequest,
  GenerateCaseNoteResponse,
  GapAnalysis,
} from '@/types/assessment';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeObservations(
  observations: string
): Promise<GapAnalysis> {
  if (!observations || observations.trim().length === 0) {
    throw new Error('Observations cannot be empty');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: observations },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    return parsed as GapAnalysis;
  } catch (error) {
    console.error('Error analyzing observations:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to analyze observations: ${error.message}`
        : 'Failed to analyze observations'
    );
  }
}

export async function generateCaseNote(
  request: GenerateCaseNoteRequest
): Promise<string> {
  if (!request.observations || Object.keys(request.observations).length === 0) {
    throw new Error('Observations are required');
  }

  if (!request.metadata?.childId || !request.metadata?.sessionDate) {
    throw new Error('Metadata with childId and sessionDate is required');
  }

  try {
    const { observations, metadata } = request;

    const userMessage = `
Metadata:
${JSON.stringify(metadata, null, 2)}

Observations by Domain:
${JSON.stringify(observations, null, 2)}

Please generate a professional case note following the specified format.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return content;
  } catch (error) {
    console.error('Error generating case note:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate case note: ${error.message}`
        : 'Failed to generate case note'
    );
  }
}

// Error handling wrapper
export function isOpenAIError(error: unknown): error is { status?: number; message?: string } {
  return typeof error === 'object' && error !== null;
}

export function getErrorMessage(error: unknown): string {
  if (isOpenAIError(error)) {
    if (error.status === 401) {
      return 'Invalid API key. Please check your OPENAI_API_KEY environment variable.';
    }
    if (error.status === 429) {
      return 'Rate limit exceeded. Please try again in a moment.';
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
