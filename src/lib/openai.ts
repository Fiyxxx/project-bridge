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
  const startTime = Date.now();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: observations },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3, // Lower temperature for consistent analysis
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content);
  return parsed as GapAnalysis;
}

export async function generateCaseNote(
  request: GenerateCaseNoteRequest
): Promise<string> {
  const { observations, metadata } = request;

  // Format the request for the LLM
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
    temperature: 0.7, // Higher temperature for more natural narrative
    max_tokens: 2000,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return content;
}
