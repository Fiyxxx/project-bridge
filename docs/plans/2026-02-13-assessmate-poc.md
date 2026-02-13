# AssessMate POC Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js web application that demonstrates AI-powered case note generation for early intervention assessors with a 5-step guided workflow.

**Architecture:** Next.js 14 (App Router) with TypeScript, Tailwind CSS for styling, OpenAI API for LLM inference (POC), API routes for backend logic, client-side state management with React hooks, DOCX export for clinical workflows.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, OpenAI SDK, docx library, React Hook Form (optional)

---

## Task 1: Project Setup & Dependencies

**Files:**
- Create: `package.json` (via npm init)
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `README.md`

**Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Answer prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: Yes (@/*)

**Step 2: Install dependencies**

```bash
npm install openai docx file-saver
npm install -D @types/node @types/react @types/file-saver
```

**Step 3: Create .env.example**

Create file: `.env.example`

```env
# OpenAI API Key (for POC only - production uses local LLM)
OPENAI_API_KEY=sk-proj-your-key-here
```

**Step 4: Create .env and add API key**

```bash
cp .env.example .env
```

Update `.env` with actual OpenAI API key (user must provide).

**Step 5: Update .gitignore**

Ensure `.gitignore` includes:

```
.env
.env.local
*.docx
*.pdf
.vercel
```

**Step 6: Verify setup**

```bash
npm run dev
```

Expected: Dev server starts at http://localhost:3000

**Step 7: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `src/types/assessment.ts`

**Step 1: Create type definitions file**

Create file: `src/types/assessment.ts`

```typescript
// Core domain types for AssessMate

export type DevelopmentalDomain =
  | 'gross_motor'
  | 'fine_motor'
  | 'speech_language'
  | 'social_emotional'
  | 'cognitive';

export interface Observation {
  id: string;
  content: string;
  domain?: DevelopmentalDomain;
}

export interface GapAnalysis {
  coveredDomains: DevelopmentalDomain[];
  missingDomains: DevelopmentalDomain[];
  suggestedPrompts: SuggestedPrompt[];
}

export interface SuggestedPrompt {
  domain: DevelopmentalDomain;
  prompt: string;
}

export interface DomainObservations {
  gross_motor: string;
  fine_motor: string;
  speech_language: string;
  social_emotional: string;
  cognitive: string;
}

export interface CaseNoteMetadata {
  childId: string;
  sessionDate: string;
  sessionDuration?: string;
  assessorName?: string;
}

export interface CaseNote {
  childId: string;
  sessionDate: string;
  sessionDuration?: string;
  assessorName?: string;
  domains: DomainObservations;
  summary: string;
  recommendations: string;
}

export interface AnalyzeObservationsRequest {
  observations: string;
}

export interface AnalyzeObservationsResponse {
  analysis: GapAnalysis;
  processingTime: number;
}

export interface GenerateCaseNoteRequest {
  observations: Partial<DomainObservations>;
  metadata: CaseNoteMetadata;
}

export interface GenerateCaseNoteResponse {
  caseNote: CaseNote;
  processingTime: number;
}

// Domain display names and descriptions
export const DOMAIN_INFO: Record<DevelopmentalDomain, { name: string; description: string }> = {
  gross_motor: {
    name: 'Gross Motor Development',
    description: 'Walking, running, climbing, balance, coordination'
  },
  fine_motor: {
    name: 'Fine Motor Development',
    description: 'Grasping, manipulating objects, drawing, stacking'
  },
  speech_language: {
    name: 'Speech & Language Development',
    description: 'Vocalization, words, communication, comprehension'
  },
  social_emotional: {
    name: 'Social-Emotional Development',
    description: 'Eye contact, sharing, emotional regulation, interaction'
  },
  cognitive: {
    name: 'Cognitive Development',
    description: 'Problem-solving, cause-effect, imitation, memory'
  }
};
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/types/assessment.ts
git commit -m "feat: add core type definitions for assessment workflow"
```

---

## Task 3: OpenAI Client & Prompt Engineering

**Files:**
- Create: `src/lib/openai.ts`
- Create: `src/lib/prompts.ts`

**Step 1: Create prompts file**

Create file: `src/lib/prompts.ts`

```typescript
export const ANALYSIS_SYSTEM_PROMPT = `You are an expert early childhood assessment assistant familiar with Singapore's ECDA (Early Childhood Development Agency) developmental frameworks for children aged 1-6.

ECDA Developmental Domains:
1. **Gross Motor**: Walking, running, climbing, jumping, balance, coordination
2. **Fine Motor**: Grasping, manipulating objects, drawing, stacking, hand-eye coordination
3. **Speech & Language**: Vocalization, babbling, words, phrases, sentences, receptive and expressive communication
4. **Social-Emotional**: Eye contact, joint attention, sharing, emotional regulation, peer interaction, play behaviors
5. **Cognitive**: Problem-solving, cause-and-effect understanding, object permanence, imitation, symbolic play, memory

Your task is to analyze the assessor's observations and:
1. Identify which developmental domains are addressed in the observations
2. Identify which domains are missing or insufficiently covered
3. For each missing domain, suggest 1-2 specific, actionable questions the assessor should consider

Respond in JSON format with this exact structure:
{
  "coveredDomains": ["domain_key", ...],
  "missingDomains": ["domain_key", ...],
  "suggestedPrompts": [
    {
      "domain": "domain_key",
      "prompt": "Specific question for the assessor"
    }
  ]
}

Domain keys must be: "gross_motor", "fine_motor", "speech_language", "social_emotional", "cognitive"

Be thorough and specific in your suggested prompts. Focus on observable behaviors.`;

export const GENERATION_SYSTEM_PROMPT = `You are an expert early childhood assessor writing a professional case note for an EIPIC (Early Intervention Programme for Infants and Children) centre in Singapore.

Generate a structured case note following this exact format:

**CHILD INFORMATION**
Child ID: [from metadata]
Session Date: [from metadata]
Session Duration: [estimate based on observation detail, typically 30-60 minutes]

**DEVELOPMENTAL OBSERVATIONS**

*Gross Motor Development*
[Professional narrative based on observations. Reference age-appropriate milestones where relevant. Use objective, observable language. If observations are limited, note this briefly.]

*Fine Motor Development*
[Professional narrative following same guidelines]

*Speech & Language Development*
[Professional narrative following same guidelines]

*Social-Emotional Development*
[Professional narrative following same guidelines]

*Cognitive Development*
[Professional narrative following same guidelines]

**SUMMARY**
[Brief 2-3 sentence summary of overall developmental progress. Highlight notable strengths and any areas of concern.]

**RECOMMENDATIONS**
[Specific, actionable recommendations for intervention strategies, further assessment needs, or areas to monitor. Be concrete and practical.]

---
**Assessor:** [from metadata or "________________" if not provided]
**Note:** This draft was generated with AI assistance and reviewed by the assessor.

Guidelines:
- Use professional clinical documentation language
- Reference age-appropriate developmental milestones where relevant (e.g., "typical for 18-24 months")
- Be specific and observable (avoid vague terms like "good" or "poor")
- Maintain objective tone throughout
- If a domain has very limited observations, acknowledge this briefly (e.g., "Limited observation of speech behaviors during this session")
- Keep each domain section to 3-5 sentences
- Ensure recommendations are actionable and specific

Return ONLY the formatted case note text, no JSON wrapping.`;
```

**Step 2: Create OpenAI client**

Create file: `src/lib/openai.ts`

```typescript
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
```

**Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors (OpenAI SDK types should be recognized)

**Step 4: Commit**

```bash
git add src/lib/openai.ts src/lib/prompts.ts
git commit -m "feat: add OpenAI client and prompt engineering"
```

---

## Task 4: API Route - Analyze Observations

**Files:**
- Create: `src/app/api/analyze-observations/route.ts`

**Step 1: Create API route**

Create file: `src/app/api/analyze-observations/route.ts`

```typescript
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
```

**Step 2: Test API route manually**

Start dev server:
```bash
npm run dev
```

Test with curl (replace with actual observations):
```bash
curl -X POST http://localhost:3000/api/analyze-observations \
  -H "Content-Type: application/json" \
  -d '{"observations": "Child walked independently for 3 meters. Struggled with stacking blocks. Made eye contact during play."}'
```

Expected: JSON response with `analysis` and `processingTime` fields

**Step 3: Commit**

```bash
git add src/app/api/analyze-observations/route.ts
git commit -m "feat: add analyze-observations API endpoint"
```

---

## Task 5: API Route - Generate Case Note

**Files:**
- Create: `src/app/api/generate-case-note/route.ts`

**Step 1: Create API route**

Create file: `src/app/api/generate-case-note/route.ts`

```typescript
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
```

**Step 2: Test API route manually**

```bash
curl -X POST http://localhost:3000/api/generate-case-note \
  -H "Content-Type: application/json" \
  -d '{
    "observations": {
      "gross_motor": "Child walked independently",
      "fine_motor": "Struggled with stacking blocks"
    },
    "metadata": {
      "childId": "Child A",
      "sessionDate": "2026-02-13",
      "assessorName": "Ms. Tan"
    }
  }'
```

Expected: JSON response with `caseNote` and `processingTime` fields

**Step 3: Commit**

```bash
git add src/app/api/generate-case-note/route.ts
git commit -m "feat: add generate-case-note API endpoint"
```

---

## Task 6: Layout & Privacy Banner Component

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/PrivacyBanner.tsx`

**Step 1: Create Privacy Banner component**

Create file: `src/components/PrivacyBanner.tsx`

```typescript
import React from 'react';

export default function PrivacyBanner() {
  return (
    <div className="bg-purple-50 border-b border-purple-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <div className="text-purple-600 text-xl mt-0.5">🔒</div>
        <div className="flex-1">
          <h3 className="text-purple-900 font-semibold text-sm mb-1">
            Privacy-First Design
          </h3>
          <ul className="text-purple-700 text-xs space-y-0.5">
            <li>• All processing on secure server (POC architecture)</li>
            <li>• Production: 100% local deployment with no cloud connectivity</li>
            <li>• No data stored after session ends</li>
            <li>• PDPA compliant architecture</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Update root layout**

Modify file: `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PrivacyBanner from '@/components/PrivacyBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssessMate - AI Case Note Assistant',
  description: 'AI-powered documentation assistant for early intervention assessors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivacyBanner />
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Verify in browser**

```bash
npm run dev
```

Visit http://localhost:3000

Expected: Purple privacy banner visible at top of page

**Step 4: Commit**

```bash
git add src/components/PrivacyBanner.tsx src/app/layout.tsx
git commit -m "feat: add privacy banner and update root layout"
```

---

## Task 7: Step 1 Component - Observation Input

**Files:**
- Create: `src/components/Step1_ObservationInput.tsx`

**Step 1: Create component**

Create file: `src/components/Step1_ObservationInput.tsx`

```typescript
import React from 'react';

interface Step1Props {
  observations: string;
  onObservationsChange: (value: string) => void;
  onNext: () => void;
}

export default function Step1_ObservationInput({
  observations,
  onObservationsChange,
  onNext,
}: Step1Props) {
  const canProceed = observations.trim().length > 20;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Enter Your Observations
        </h2>
        <p className="text-gray-600">
          Enter your observations from the assessment session. You can use bullet points or
          free-form text. Don't worry about structure yet — we'll help organize it.
        </p>
      </div>

      <div>
        <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
          Session Observations
        </label>
        <textarea
          id="observations"
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
          placeholder="Example:&#10;• Child walked independently for 3 meters&#10;• Struggled with stacking 3 blocks&#10;• Made eye contact during play&#10;• Vocalized 'mama' and 'ball'&#10;• Showed interest in cause-effect toys"
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ resize: 'vertical' }}
        />
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {observations.length} characters
          </p>
          {!canProceed && observations.length > 0 && (
            <p className="text-sm text-amber-600">
              Please enter at least 20 characters
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use bullet points for clarity</li>
          <li>• Include specific behaviors you observed</li>
          <li>• Note what the child did, not what they couldn't do</li>
          <li>• Don't worry about covering all domains yet</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Observations →
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Step1_ObservationInput.tsx
git commit -m "feat: add Step 1 observation input component"
```

---

## Task 8: Step 2 Component - Gap Analysis

**Files:**
- Create: `src/components/Step2_GapAnalysis.tsx`

**Step 1: Create component**

Create file: `src/components/Step2_GapAnalysis.tsx`

```typescript
import React from 'react';
import type { GapAnalysis, DevelopmentalDomain } from '@/types/assessment';
import { DOMAIN_INFO } from '@/types/assessment';

interface Step2Props {
  analysis: GapAnalysis | null;
  loading: boolean;
  error: string | null;
  additionalObservations: Record<DevelopmentalDomain, string>;
  onAdditionalObservationChange: (domain: DevelopmentalDomain, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2_GapAnalysis({
  analysis,
  loading,
  error,
  additionalObservations,
  onAdditionalObservationChange,
  onNext,
  onBack,
}: Step2Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Analyzing your observations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-900 font-semibold mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const hasAllDomains = analysis.missingDomains.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Gap Analysis
        </h2>
        <p className="text-gray-600">
          We've analyzed your observations against the ECDA developmental domains.
        </p>
      </div>

      {/* Covered Domains */}
      {analysis.coveredDomains.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-900 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Domains Covered
          </h3>
          <ul className="space-y-2">
            {analysis.coveredDomains.map((domain) => (
              <li key={domain} className="text-green-800">
                • {DOMAIN_INFO[domain].name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Domains */}
      {analysis.missingDomains.length > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-amber-900 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">❓</span>
            Missing Domains
          </h3>
          <p className="text-amber-800 text-sm mb-4">
            The following domains weren't addressed in your initial observations. Consider adding observations if applicable.
          </p>

          <div className="space-y-4">
            {analysis.suggestedPrompts.map((prompt, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-amber-600">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900">
                      {DOMAIN_INFO[prompt.domain].name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {DOMAIN_INFO[prompt.domain].description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-900 mb-2">
                    💡 <span className="font-medium">Suggested:</span> {prompt.prompt}
                  </p>
                </div>

                <textarea
                  value={additionalObservations[prompt.domain] || ''}
                  onChange={(e) => onAdditionalObservationChange(prompt.domain, e.target.value)}
                  placeholder="Add observations (or leave blank if not applicable)"
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✅ Great! Your observations cover all five ECDA developmental domains.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Step2_GapAnalysis.tsx
git commit -m "feat: add Step 2 gap analysis component"
```

---

## Task 9: Step 3 Component - Guided Completion

**Files:**
- Create: `src/components/Step3_GuidedCompletion.tsx`

**Step 1: Create component**

Create file: `src/components/Step3_GuidedCompletion.tsx`

```typescript
import React, { useState } from 'react';
import type { DevelopmentalDomain, DomainObservations } from '@/types/assessment';
import { DOMAIN_INFO } from '@/types/assessment';

interface Step3Props {
  allObservations: Partial<DomainObservations>;
  onObservationsChange: (observations: Partial<DomainObservations>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DOMAINS: DevelopmentalDomain[] = [
  'gross_motor',
  'fine_motor',
  'speech_language',
  'social_emotional',
  'cognitive',
];

export default function Step3_GuidedCompletion({
  allObservations,
  onObservationsChange,
  onNext,
  onBack,
}: Step3Props) {
  const [activeTab, setActiveTab] = useState<DevelopmentalDomain>('gross_motor');

  const handleObservationChange = (domain: DevelopmentalDomain, value: string) => {
    onObservationsChange({
      ...allObservations,
      [domain]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 3: Review & Complete Observations
        </h2>
        <p className="text-gray-600">
          Review and refine your observations for each developmental domain before generating the case note.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => {
            const hasContent = allObservations[domain] && allObservations[domain]!.trim().length > 0;
            return (
              <button
                key={domain}
                onClick={() => setActiveTab(domain)}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                  activeTab === domain
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {DOMAIN_INFO[domain].name}
                {hasContent && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {DOMAIN_INFO[activeTab].name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {DOMAIN_INFO[activeTab].description}
          </p>
        </div>

        <textarea
          value={allObservations[activeTab] || ''}
          onChange={(e) => handleObservationChange(activeTab, e.target.value)}
          placeholder={`Enter observations for ${DOMAIN_INFO[activeTab].name.toLowerCase()}...`}
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          style={{ resize: 'vertical' }}
        />

        <div className="mt-2 text-sm text-gray-500">
          {allObservations[activeTab]?.length || 0} characters
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Completeness Check:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {DOMAINS.map((domain) => {
            const hasContent = allObservations[domain] && allObservations[domain]!.trim().length > 0;
            return (
              <div key={domain} className="flex items-center gap-2">
                <span>{hasContent ? '✅' : '⚪'}</span>
                <span className={hasContent ? 'text-blue-900' : 'text-blue-700'}>
                  {DOMAIN_INFO[domain].name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Generate Case Note →
        </button>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Step3_GuidedCompletion.tsx
git commit -m "feat: add Step 3 guided completion component"
```

---

## Task 10: Step 4 Component - Note Generation

**Files:**
- Create: `src/components/Step4_NoteGeneration.tsx`

**Step 1: Create component**

Create file: `src/components/Step4_NoteGeneration.tsx`

```typescript
import React from 'react';

interface Step4Props {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function Step4_NoteGeneration({ loading, error, onRetry }: Step4Props) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-900 font-semibold mb-2 text-center">
            Generation Failed
          </h3>
          <p className="text-red-700 text-center mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>

          <div className="space-y-2">
            <p className="text-gray-900 font-semibold text-lg">
              Generating Your Case Note
            </p>
            <p className="text-gray-600 text-sm">
              This may take 10-30 seconds...
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <span>🤖</span>
              <span>Analyzing observations...</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✍️</span>
              <span>Drafting case note sections...</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📋</span>
              <span>Formatting to ECDA standards...</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-green-900 font-semibold mb-2">
          Case Note Ready!
        </h3>
        <p className="text-green-700">
          Your case note has been generated and is ready for review.
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Step4_NoteGeneration.tsx
git commit -m "feat: add Step 4 note generation loading component"
```

---

## Task 11: Step 5 Component - Edit & Export

**Files:**
- Create: `src/components/Step5_EditExport.tsx`
- Create: `src/lib/export.ts`

**Step 1: Create export utility**

Create file: `src/lib/export.ts`

```typescript
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';

export async function exportCaseNoteToDocx(caseNoteText: string, filename: string) {
  // Split the case note into sections for better formatting
  const sections = caseNoteText.split('\n\n').filter(s => s.trim());

  const paragraphs: Paragraph[] = [];

  sections.forEach((section) => {
    const lines = section.split('\n');
    lines.forEach((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Heading
        const text = line.replace(/\*\*/g, '');
        paragraphs.push(
          new Paragraph({
            text: text,
            heading: text.includes('CHILD') || text.includes('DEVELOPMENTAL') || text.includes('SUMMARY') || text.includes('RECOMMENDATIONS')
              ? HeadingLevel.HEADING_2
              : HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        // Subheading
        const text = line.replace(/\*/g, '');
        paragraphs.push(
          new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (line.trim().startsWith('---')) {
        // Separator
        paragraphs.push(
          new Paragraph({
            text: '___________________________________________________________________________',
            spacing: { before: 200, after: 200 },
          })
        );
      } else if (line.trim()) {
        // Regular text
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(line)],
            spacing: { after: 120 },
          })
        );
      }
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
```

**Step 2: Create Step 5 component**

Create file: `src/components/Step5_EditExport.tsx`

```typescript
import React, { useState } from 'react';
import { exportCaseNoteToDocx } from '@/lib/export';

interface Step5Props {
  caseNoteText: string;
  metadata: {
    childId: string;
    sessionDate: string;
  };
  onStartNew: () => void;
  onBack: () => void;
}

export default function Step5_EditExport({
  caseNoteText,
  metadata,
  onStartNew,
  onBack,
}: Step5Props) {
  const [editedText, setEditedText] = useState(caseNoteText);
  const [exporting, setExporting] = useState(false);

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      const filename = `case-note-${metadata.childId}-${metadata.sessionDate}.docx`;
      await exportCaseNoteToDocx(editedText, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export document. Please try copying the text instead.');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedText);
    alert('Case note copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 5: Review & Export
        </h2>
        <p className="text-gray-600">
          Review the generated case note. You can edit any section before exporting.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-purple-900 font-semibold mb-1">
          <span>🔒</span>
          <span>Privacy Notice</span>
        </div>
        <p className="text-sm text-purple-700">
          Session data will be cleared when you start a new assessment or close this page.
          No data is stored on our servers.
        </p>
      </div>

      {/* Editable Text Area */}
      <div>
        <label htmlFor="caseNote" className="block text-sm font-medium text-gray-700 mb-2">
          Case Note (Editable)
        </label>
        <textarea
          id="caseNote"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono text-sm"
          style={{ resize: 'vertical' }}
        />
        <div className="mt-2 text-sm text-gray-500">
          {editedText.length} characters
        </div>
      </div>

      {/* Export Options */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopyToClipboard}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          📋 Copy to Clipboard
        </button>

        <button
          onClick={handleExportDocx}
          disabled={exporting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {exporting ? 'Exporting...' : '📄 Download DOCX'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onStartNew}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}
```

**Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit**

```bash
git add src/components/Step5_EditExport.tsx src/lib/export.ts
git commit -m "feat: add Step 5 edit and export component with DOCX support"
```

---

## Task 12: Assessment Wizard (Main Container)

**Files:**
- Create: `src/components/AssessmentWizard.tsx`
- Modify: `src/app/assessment/page.tsx` (create if doesn't exist)

**Step 1: Create Assessment Wizard**

Create file: `src/components/AssessmentWizard.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import type { GapAnalysis, DomainObservations, DevelopmentalDomain } from '@/types/assessment';
import Step1_ObservationInput from './Step1_ObservationInput';
import Step2_GapAnalysis from './Step2_GapAnalysis';
import Step3_GuidedCompletion from './Step3_GuidedCompletion';
import Step4_NoteGeneration from './Step4_NoteGeneration';
import Step5_EditExport from './Step5_EditExport';

type Step = 1 | 2 | 3 | 4 | 5;

export default function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 state
  const [initialObservations, setInitialObservations] = useState('');

  // Step 2 state
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [additionalObservations, setAdditionalObservations] = useState<Record<DevelopmentalDomain, string>>({
    gross_motor: '',
    fine_motor: '',
    speech_language: '',
    social_emotional: '',
    cognitive: '',
  });

  // Step 3 state
  const [allObservations, setAllObservations] = useState<Partial<DomainObservations>>({});

  // Step 4/5 state
  const [caseNoteText, setCaseNoteText] = useState('');
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [metadata] = useState({
    childId: 'Child A',
    sessionDate: new Date().toISOString().split('T')[0],
    assessorName: '',
  });

  // Step 1 -> Step 2: Analyze observations
  const handleStep1Next = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observations: initialObservations }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze observations');
      }

      const data = await response.json();
      setGapAnalysis(data.analysis);

      // Initialize allObservations with initial observations mapped to covered domains
      const initial: Partial<DomainObservations> = {};
      data.analysis.coveredDomains.forEach((domain: DevelopmentalDomain) => {
        initial[domain] = initialObservations; // Simplified - in production would parse better
      });
      setAllObservations(initial);

      setCurrentStep(2);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Step 2 -> Step 3: Merge additional observations
  const handleStep2Next = () => {
    const merged = { ...allObservations };
    Object.entries(additionalObservations).forEach(([domain, text]) => {
      if (text.trim()) {
        merged[domain as DevelopmentalDomain] = text;
      }
    });
    setAllObservations(merged);
    setCurrentStep(3);
  };

  // Step 3 -> Step 4: Generate case note
  const handleStep3Next = async () => {
    setCurrentStep(4);
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-case-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observations: allObservations,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate case note');
      }

      const data = await response.json();
      setCaseNoteText(data.caseNote.summary); // Using summary field which contains full text

      // Auto-advance to Step 5 after generation
      setTimeout(() => {
        setCurrentStep(5);
      }, 1000);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setGenerationLoading(false);
    }
  };

  // Reset wizard
  const handleStartNew = () => {
    setCurrentStep(1);
    setInitialObservations('');
    setGapAnalysis(null);
    setAdditionalObservations({
      gross_motor: '',
      fine_motor: '',
      speech_language: '',
      social_emotional: '',
      cognitive: '',
    });
    setAllObservations({});
    setCaseNoteText('');
    setAnalysisError(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Step {currentStep} of 5
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {currentStep === 1 && (
          <Step1_ObservationInput
            observations={initialObservations}
            onObservationsChange={setInitialObservations}
            onNext={handleStep1Next}
          />
        )}

        {currentStep === 2 && (
          <Step2_GapAnalysis
            analysis={gapAnalysis}
            loading={analysisLoading}
            error={analysisError}
            additionalObservations={additionalObservations}
            onAdditionalObservationChange={(domain, value) => {
              setAdditionalObservations(prev => ({ ...prev, [domain]: value }));
            }}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3_GuidedCompletion
            allObservations={allObservations}
            onObservationsChange={setAllObservations}
            onNext={handleStep3Next}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4_NoteGeneration
            loading={generationLoading}
            error={generationError}
            onRetry={handleStep3Next}
          />
        )}

        {currentStep === 5 && (
          <Step5_EditExport
            caseNoteText={caseNoteText}
            metadata={metadata}
            onStartNew={handleStartNew}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create assessment page**

Create file: `src/app/assessment/page.tsx`

```typescript
import AssessmentWizard from '@/components/AssessmentWizard';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AssessMate</h1>
        <p className="text-gray-600">
          AI-powered case note assistant for early intervention assessors
        </p>
      </div>
      <AssessmentWizard />
    </div>
  );
}
```

**Step 3: Update home page to redirect**

Modify file: `src/app/page.tsx`

```typescript
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AssessMate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered documentation assistant for early intervention assessors working with
          children aged 1–6 with developmental delays.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What AssessMate Does
          </h2>
          <ul className="text-left space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span>You enter brief bullet-point observations from your session</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span>AI analyzes which ECDA developmental domains you've covered</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span>System prompts for any missing observations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Generates a structured, professional case note draft</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">5.</span>
              <span>You review, edit, and export to DOCX</span>
            </li>
          </ul>
        </div>

        <Link
          href="/assessment"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start New Assessment →
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          POC for CCSGP Fellowship Application • February 2026
        </p>
      </div>
    </div>
  );
}
```

**Step 4: Test full workflow**

```bash
npm run dev
```

Visit http://localhost:3000 → Click "Start New Assessment" → Test Steps 1-5

Expected: Full workflow completes without errors

**Step 5: Commit**

```bash
git add src/components/AssessmentWizard.tsx src/app/assessment/page.tsx src/app/page.tsx
git commit -m "feat: add assessment wizard and main pages"
```

---

## Task 13: Polish & Error Handling

**Files:**
- Modify: `src/lib/openai.ts`
- Create: `src/app/api/health/route.ts`

**Step 1: Add better error handling to OpenAI client**

Modify file: `src/lib/openai.ts`

Add after existing functions:

```typescript
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
```

**Step 2: Create health check endpoint**

Create file: `src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({
    status: 'ok',
    openaiConfigured: hasApiKey,
    timestamp: new Date().toISOString(),
  });
}
```

**Step 3: Test health check**

```bash
curl http://localhost:3000/api/health
```

Expected: JSON response with `openaiConfigured: true`

**Step 4: Commit**

```bash
git add src/lib/openai.ts src/app/api/health/route.ts
git commit -m "feat: add error handling and health check endpoint"
```

---

## Task 14: README Documentation

**Files:**
- Modify: `README.md`

**Step 1: Write comprehensive README**

Modify file: `README.md`

```markdown
# AssessMate - AI Case Note Assistant

**AssessMate** is an AI-powered documentation assistant designed to help early intervention (EI) assessors working with children aged 1–6 who have developmental delays. This POC demonstrates how LLM technology can reduce documentation burden and free up assessor time for direct child assessment.

## Features

- **5-Step Guided Workflow**: Intuitive process from raw observations to professional case notes
- **Intelligent Gap Detection**: AI analyzes which ECDA developmental domains are covered and prompts for missing observations
- **Structured Case Note Generation**: Produces professional documentation following Singapore's ECDA frameworks
- **Privacy-First Architecture**: Designed for local deployment with no data persistence
- **DOCX Export**: Generate Word documents compatible with clinical workflows

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **LLM**: OpenAI API (POC) → Ollama + Llama 3.1 8B (Production)
- **Export**: docx library for Word document generation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for POC)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-bridge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-proj-your-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Start Assessment**: Navigate to /assessment or click "Start New Assessment" from home
2. **Enter Observations**: Input your session observations (bullet points or free-form)
3. **Review Gap Analysis**: AI identifies missing developmental domains and suggests prompts
4. **Complete Observations**: Add observations for missing domains or review existing ones
5. **Generate & Export**: AI generates structured case note, edit as needed, export to DOCX

## Project Structure

```
project-bridge/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── assessment/       # Assessment workflow page
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   ├── lib/                  # Utilities (OpenAI client, prompts, export)
│   └── types/                # TypeScript type definitions
├── docs/
│   └── plans/                # Design and implementation docs
└── public/                   # Static assets
```

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Deployment

### Vercel (POC Demo)

```bash
npx vercel
```

Set environment variable in Vercel dashboard: `OPENAI_API_KEY`

### Production (Local Deployment)

For PDPA-compliant production deployment:

1. Install Ollama: https://ollama.ai
2. Pull Llama 3.1 8B model: `ollama pull llama3.1:8b`
3. Update `src/lib/openai.ts` to use local endpoint
4. Deploy on on-premises workstation with no internet connectivity

## Privacy & Compliance

- **POC**: Uses OpenAI API for rapid development (data sent to OpenAI)
- **Production**: Designed for 100% local deployment (zero external data transmission)
- **No Persistence**: No database, all data in client-side state
- **Session Ephemeral**: Data cleared after export or page close
- **PDPA Compliant**: Architecture supports Singapore's data protection requirements

## License

MIT

## Contact

For questions about this POC, contact: [Your contact information]

## Acknowledgements

Built for NUS CCSGP Public Service Fellowship Application, February 2026
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README"
```

---

## Task 15: Final Testing & Deployment

**Files:**
- N/A (testing only)

**Step 1: Full workflow test**

Test the complete workflow:

1. Start dev server: `npm run dev`
2. Visit http://localhost:3000
3. Click "Start New Assessment"
4. **Step 1**: Enter observations (mix of domains)
5. **Step 2**: Verify gap analysis identifies missing domains correctly
6. **Step 3**: Add observations for missing domains
7. **Step 4**: Wait for generation to complete
8. **Step 5**: Edit case note, test copy and DOCX export
9. **Reset**: Click "Start New Assessment" and verify state clears

**Step 2: Test edge cases**

- Empty observations in Step 1 (should prevent advancing)
- Very long observations (>5000 characters)
- All domains covered in Step 1 (no missing domains)
- API failure simulation (disconnect internet briefly)

**Step 3: Build production bundle**

```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 4: Test production build locally**

```bash
npm start
```

Visit http://localhost:3000 and verify workflow works

**Step 5: Deploy to Vercel**

```bash
npx vercel
```

Follow prompts, set OPENAI_API_KEY in Vercel dashboard

**Step 6: Test deployed version**

Visit deployed URL and complete full workflow

**Step 7: Final commit**

```bash
git add .
git commit -m "chore: final polish and testing complete"
git push origin main
```

---

## Success Criteria

✅ **Technical**
- All 5 workflow steps functional
- API routes return correct data
- Gap analysis correctly identifies missing domains
- Case note generation produces structured output
- DOCX export downloads valid Word document

✅ **UX**
- Privacy banner visible on all pages
- Progress indicator shows current step
- Loading states provide feedback
- Error handling shows helpful messages
- Navigation (back/next) works intuitively

✅ **Demo Ready**
- Deployed URL accessible
- README documentation complete
- No critical bugs in happy path
- Shareable for fellowship application

---

## Post-POC Enhancements

After POC is complete and fellowship application submitted:

1. **RAG Integration**: Build retrieval corpus with ECDA frameworks
2. **Local LLM Migration**: Replace OpenAI with Ollama
3. **User Testing**: Pilot with actual assessors
4. **Advanced Features**: Session history, child profiles, template customization
5. **Open Source**: Clean up code, comprehensive docs, publish to GitHub

---

**Total Estimated Time**: 10-14 hours over 1-2 days

**Priority Tasks**: 1-12 are essential for POC, 13-14 are polish, 15 is testing/deployment
