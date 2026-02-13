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
