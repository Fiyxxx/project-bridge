# AssessMate POC Design Document

**Project:** AssessMate - AI-Powered Documentation Assistant for Early Intervention Assessors
**Date:** February 13, 2026
**Author:** Pranav (NUS CCSGP Fellowship Application)
**Version:** 1.0 - POC Design

---

## Executive Summary

AssessMate is an AI-powered documentation assistant designed to help early intervention (EI) assessors working with children aged 1–6 who have developmental delays. Assessors at Early Intervention Programme for Infants and Children (EIPIC) centres currently spend a significant portion of their working hours writing detailed structured case notes after each session. This administrative burden reduces the time available for direct child assessment and contributes to longer waitlists across Singapore's EI system.

AssessMate allows assessors to input brief bullet-point observations from a session. The system then uses a locally deployed open-source large language model (LLM) to prompt for any missing required observations and auto-generates a structured case note draft following the centre's standard documentation format. The assessor retains full editorial control — the AI serves as a copilot, not a replacement. All processing occurs on a local machine with no cloud connectivity, ensuring full compliance with Singapore's PDPA requirements for children's sensitive data.

**Target Impact:** 30-50% reduction in case note writing time, enabling 2-3 additional assessments per assessor per month.

---

## 1. Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────┐
│  Next.js Frontend (React Components)           │
│  - Multi-step form wizard                      │
│  - Real-time validation                        │
│  - Editable preview                            │
└─────────────────┬───────────────────────────────┘
                  │
                  │ API Routes (HTTPS)
                  ▼
┌─────────────────────────────────────────────────┐
│  Next.js API Routes (/api/*)                   │
│  - /api/analyze-observations                   │
│  - /api/generate-case-note                     │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Server-side calls
                  ▼
┌─────────────────────────────────────────────────┐
│  LLM Inference Engine                          │
│  POC: OpenAI API (GPT-4)                       │
│  Production: Local Ollama + Llama 3.1 8B      │
└─────────────────────────────────────────────────┘
```

### Privacy-First Design Principles

1. **POC (Fellowship Demo):** Uses OpenAI API for rapid development, clearly labeled as "POC architecture"
2. **Production:** Designed for 100% local deployment with Ollama/llama.cpp
3. **No Persistence:** Zero database, zero session storage - all data in React state only
4. **Session Ephemeral:** Data cleared immediately after export
5. **PDPA Compliance:** Architecture supports on-premises deployment with no internet connectivity

---

## 2. User Workflow Design

### The 5-Step Guided Workflow

**Step 1: Initial Observations Entry**
- Assessor enters free-form or bullet-point observations from the session
- Example input: "Child walked independently for 3 meters. Struggled with stacking blocks. Made eye contact during play."
- No structure required at this stage
- Large textarea with helpful placeholder examples

**Step 2: AI Analysis & Gap Detection** ⭐ Key Differentiator
- System analyzes observations against ECDA developmental domains
- Identifies covered domains: ✅ Gross Motor, Fine Motor, Social-Emotional
- Identifies missing domains: ❌ Speech/Language, Cognitive
- For each missing domain, generates specific prompts:
  - "Did the child vocalize or use any words during the session?"
  - "Did you observe problem-solving behaviors?"
- Assessor can add observations or skip if not applicable

**Step 3: Guided Completion**
- Tabbed interface showing all five ECDA domains
- Original observations displayed (read-only)
- Input fields for additional observations per domain
- Domain-specific guidance tooltips
- Clear indicator of completeness

**Step 4: Case Note Generation**
- Loading state with progress animations
- LLM generates structured case note following ECDA template
- Sections: Child Information, Developmental Observations (5 domains), Summary, Recommendations
- Professional clinical language with age-appropriate milestone references

**Step 5: Edit & Export**
- Full case note displayed in editable rich text area
- Assessor can modify any section freely
- Export options: Copy to clipboard, Download DOCX
- Privacy banner: "🔒 Session data will be cleared after export"
- "Start New Assessment" resets entire workflow

---

## 3. ECDA Developmental Domains Framework

The system is built around Singapore's ECDA developmental assessment framework for children aged 1-6:

1. **Gross Motor Development**
   - Walking, running, climbing, jumping, balance
   - Age-appropriate milestones (e.g., independent walking by 18 months)

2. **Fine Motor Development**
   - Grasping, manipulating objects, drawing, stacking
   - Hand-eye coordination, precision tasks

3. **Speech & Language Development**
   - Vocalization, babbling, words, phrases, sentences
   - Receptive and expressive communication
   - Understanding of instructions

4. **Social-Emotional Development**
   - Eye contact, joint attention, sharing
   - Emotional regulation, separation anxiety
   - Peer interaction, play behaviors

5. **Cognitive Development**
   - Problem-solving, cause-and-effect understanding
   - Object permanence, imitation, symbolic play
   - Memory and attention span

---

## 4. Technical Implementation

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Framework** | Next.js 14 (App Router) | Full-stack, API routes, TypeScript support, fast development |
| **Language** | TypeScript | Type safety for complex data structures |
| **Styling** | Tailwind CSS | Rapid UI development, consistent design system |
| **LLM (POC)** | OpenAI API (GPT-4) | High-quality outputs, fast iteration |
| **LLM (Prod)** | Ollama + Llama 3.1 8B | Local deployment, PDPA compliant, zero API costs |
| **Export** | docx library | Generate DOCX files for clinical workflows |
| **Deployment** | Vercel (POC) / On-premises (Prod) | Easy demo sharing / Privacy compliance |

### File Structure

```
project-bridge/
├── .env                          # OPENAI_API_KEY (gitignored)
├── .env.example                  # Template
├── package.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── assessment/
│   │   │   └── page.tsx          # Main workflow
│   │   └── api/
│   │       ├── analyze-observations/
│   │       │   └── route.ts      # Gap detection endpoint
│   │       └── generate-case-note/
│   │           └── route.ts      # Note generation endpoint
│   ├── components/
│   │   ├── AssessmentWizard.tsx  # Multi-step container
│   │   ├── Step1_ObservationInput.tsx
│   │   ├── Step2_GapAnalysis.tsx
│   │   ├── Step3_GuidedCompletion.tsx
│   │   ├── Step4_NoteGeneration.tsx
│   │   ├── Step5_EditExport.tsx
│   │   └── PrivacyBanner.tsx     # Privacy indicator
│   ├── lib/
│   │   ├── openai.ts             # OpenAI client
│   │   ├── prompts.ts            # System prompts
│   │   └── export.ts             # DOCX export
│   └── types/
│       └── assessment.ts         # TypeScript types
└── docs/
    └── plans/
        └── 2026-02-13-assessmate-poc-design.md  # This document
```

### Core Data Types

```typescript
interface Observation {
  id: string;
  content: string;
  domain?: DevelopmentalDomain;
}

type DevelopmentalDomain =
  | 'gross_motor'
  | 'fine_motor'
  | 'speech_language'
  | 'social_emotional'
  | 'cognitive';

interface GapAnalysis {
  coveredDomains: DevelopmentalDomain[];
  missingDomains: DevelopmentalDomain[];
  suggestedPrompts: {
    domain: DevelopmentalDomain;
    prompt: string;
  }[];
}

interface CaseNote {
  childId: string;           // Anonymized (e.g., "Child A")
  sessionDate: string;
  sessionDuration?: string;
  assessorName?: string;
  domains: {
    [key in DevelopmentalDomain]: string;  // Generated narrative
  };
  summary: string;
  recommendations: string;
}
```

---

## 5. API Endpoints Design

### POST /api/analyze-observations

**Purpose:** Analyze initial observations and identify missing developmental domains.

**Request:**
```json
{
  "observations": "Child walked independently for 3 meters. Struggled with stacking blocks. Made eye contact during play."
}
```

**Response:**
```json
{
  "analysis": {
    "coveredDomains": ["gross_motor", "fine_motor", "social_emotional"],
    "missingDomains": ["speech_language", "cognitive"],
    "suggestedPrompts": [
      {
        "domain": "speech_language",
        "prompt": "Did the child vocalize, babble, or use any words during the session?"
      },
      {
        "domain": "cognitive",
        "prompt": "Did you observe problem-solving behaviors or imitation?"
      }
    ]
  },
  "processingTime": 1.2
}
```

**System Prompt Strategy:**
- Instructs LLM to act as ECDA-familiar assessment expert
- Provides clear definitions of all 5 developmental domains
- Requests structured JSON output
- Temperature: 0.3 (consistent, analytical)

---

### POST /api/generate-case-note

**Purpose:** Generate structured professional case note from complete observations.

**Request:**
```json
{
  "observations": {
    "gross_motor": "Child walked independently...",
    "fine_motor": "Attempted to stack blocks...",
    "speech_language": "Vocalized 'mama' and 'ball'...",
    "social_emotional": "Made eye contact...",
    "cognitive": "Demonstrated understanding of cause-effect..."
  },
  "metadata": {
    "childId": "Child A",
    "sessionDate": "2026-02-13",
    "assessorName": "Ms. Tan"
  }
}
```

**Response:**
```json
{
  "caseNote": {
    "childId": "Child A",
    "sessionDate": "2026-02-13",
    "sessionDuration": "45 minutes (estimated)",
    "assessorName": "Ms. Tan",
    "domains": {
      "gross_motor": "Child demonstrated age-appropriate gross motor skills...",
      "fine_motor": "Fine motor development shows emerging skills...",
      // ... (full narratives for each domain)
    },
    "summary": "Overall, Child A demonstrates strengths in gross motor and social-emotional domains...",
    "recommendations": "Continue monitoring fine motor development. Consider additional activities for..."
  },
  "processingTime": 3.5
}
```

**System Prompt Strategy:**
- Instructs LLM to write in professional clinical documentation style
- Provides exact case note template structure
- Emphasizes objective, observable language
- References age-appropriate milestones
- Temperature: 0.7 (more natural narrative)

---

## 6. UI/UX Design Specifications

### Design Principles

1. **Clean & Uncluttered:** Healthcare professionals value efficiency
2. **Progressive Disclosure:** Show complexity gradually
3. **Clear Visual Hierarchy:** Obvious CTAs at each step
4. **Trust Indicators:** Privacy messaging throughout
5. **Escape Hatches:** Can go back, skip, or start over anytime

### Color Palette

- **Primary Blue:** `#3B82F6` (trust, professionalism)
- **Success Green:** `#10B981` (completed domains)
- **Warning Amber:** `#F59E0B` (missing domains)
- **Privacy Purple:** `#8B5CF6` (security indicators)
- **Neutral Gray:** `#6B7280` (secondary text)

### Key UI Components

**Progress Stepper**
- Always visible at top
- Shows: Step 1/5, 2/5, 3/5, 4/5, 5/5
- Current step highlighted
- Completed steps with checkmarks

**Privacy Banner**
```
┌──────────────────────────────────────────────────┐
│ 🔒 Privacy-First Design                         │
│ • All processing on secure server (POC)         │
│ • Production: 100% local deployment             │
│ • No data stored after session                  │
│ • PDPA compliant architecture                   │
└──────────────────────────────────────────────────┘
```

**Gap Analysis Display** (Step 2)
```
✅ Domains Covered:
  • Gross Motor Development
  • Fine Motor Development
  • Social-Emotional Development

❓ Missing Domains:

⚠️ Speech & Language Development
   💡 Suggested: "Did the child vocalize or use any words?"
   [Add observation] or [Skip this domain]

⚠️ Cognitive Development
   💡 Suggested: "Did you observe problem-solving behaviors?"
   [Add observation] or [Skip this domain]
```

**Editable Preview** (Step 5)
- Textarea with formatted content
- Edit indicators: "Click to edit any section"
- Word count display
- Clear export buttons

---

## 7. Export Functionality

### DOCX Export

Uses `docx` npm package to generate Microsoft Word files compatible with clinical workflows.

**Document Structure:**
1. Header: "EARLY INTERVENTION CASE NOTE" (centered, bold)
2. Child Information section (metadata)
3. Developmental Observations (5 domain sections with headings)
4. Summary section
5. Recommendations section
6. Footer: Assessor signature line + AI disclaimer

**Filename Convention:**
```
case-note-{childId}-{sessionDate}.docx
Example: case-note-ChildA-2026-02-13.docx
```

**AI Disclaimer Text:**
> "Note: This draft was generated with AI assistance and reviewed by the assessor."

### Alternative Export (Copy to Clipboard)

For immediate use in existing systems, simple copy-paste functionality provided.

---

## 8. Security & Privacy

### POC Security Measures

1. **Environment Variables:** API keys in `.env`, never committed
2. **HTTPS Only:** Vercel provides automatic SSL
3. **No Session Storage:** All data in React component state (ephemeral)
4. **No Database:** Zero persistence layer
5. **No Logging:** No server-side logging of observation content

### Production Security Measures

1. **Air-Gapped Deployment:** No internet connectivity during inference
2. **Local LLM:** Ollama running on-premises, no external API calls
3. **Encrypted Temp Storage:** OS temp files with auto-cleanup
4. **Audit Logging:** Local encrypted logs for quality assurance only
5. **Access Controls:** OS-level authentication for assessor workstation

### PDPA Compliance Strategy

- **Data Minimization:** No unnecessary data collection
- **Purpose Limitation:** Used only for case note generation
- **Consent:** Assessors informed of AI assistance in workflow
- **No Children's PII:** System processes observations, not patient records
- **Session Ephemeral:** Auto-purge after export
- **Local Processing:** Production deployment has zero external data transmission

---

## 9. Testing Plan

### Pre-Demo Testing Checklist

- [ ] Full workflow test (Step 1 → Step 5)
- [ ] Test with complete initial observations (all domains covered)
- [ ] Test with incomplete observations (missing 2-3 domains)
- [ ] Verify gap analysis correctly identifies missing domains
- [ ] Verify suggested prompts are relevant and specific
- [ ] Check generated case note quality and structure
- [ ] Verify DOCX export downloads correctly and opens in Word
- [ ] Test error handling (empty input, API failure, invalid data)
- [ ] Mobile responsive check (basic tablet support)
- [ ] Privacy banner visible on all steps
- [ ] "Start New Assessment" properly resets state

### Demo Scenarios

**Scenario 1: Complete Observations**
- Input covers all 5 domains
- Gap analysis shows all green checkmarks
- Proceed directly to generation

**Scenario 2: Incomplete Observations** (Primary demo)
- Input covers only 2-3 domains
- Gap analysis identifies missing domains
- Shows intelligent prompting
- Assessor adds observations
- Generates complete case note

**Scenario 3: Export**
- Generate case note
- Edit a section
- Download DOCX
- Verify formatting and content

---

## 10. Deployment Strategy

### POC Deployment (Vercel)

```bash
# Install dependencies
npm install

# Set environment variable
echo "OPENAI_API_KEY=sk-proj-..." > .env

# Deploy to Vercel
npx vercel

# Set env vars in Vercel dashboard
# OPENAI_API_KEY=sk-proj-...
```

**Vercel URL:** `https://assessmate-poc.vercel.app` (or similar)

**Advantages:**
- Free tier sufficient for demo
- Automatic HTTPS
- Easy to share with fellowship reviewers
- Instant global CDN

**Messaging for Fellowship:**
> "POC deployed on Vercel for demonstration purposes. Production architecture designed for on-premises deployment with local LLM (Ollama + Llama 3.1 8B) to ensure 100% PDPA compliance with no external data transmission."

---

### Production Deployment (On-Premises)

**Hardware Requirements:**
- Workstation with NVIDIA RTX 4090 (24GB) or Mac M2/M3 Ultra (64GB+)
- Minimum 32GB RAM, 50GB storage
- Ubuntu 22.04 or macOS Sonoma+

**Software Stack:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Llama 3.1 8B model
ollama pull llama3.1:8b

# Install Node.js and dependencies
npm install

# Update OpenAI client to local endpoint
# In src/lib/openai.ts:
# Replace OpenAI API base URL with http://localhost:11434
```

**Deployment Steps:**
1. Install on EI centre workstation
2. Configure Ollama with Llama 3.1 8B (4-bit quantized)
3. Update API endpoints to local Ollama
4. Test full workflow with local inference
5. Train 2 assessors on usage
6. Monitor performance and gather feedback

---

## 11. Development Timeline

### Day 1 (6-8 hours)

**Morning (3-4 hours):**
- [ ] Next.js project setup with TypeScript
- [ ] Tailwind CSS configuration
- [ ] Basic layout and routing structure
- [ ] Type definitions (assessment.ts)
- [ ] API route scaffolding

**Afternoon (3-4 hours):**
- [ ] OpenAI client setup and prompt engineering
- [ ] Implement `/api/analyze-observations` endpoint
- [ ] Implement `/api/generate-case-note` endpoint
- [ ] Test API endpoints with Postman/Insomnia
- [ ] Build Step 1 component (Observation Input)
- [ ] Build Step 2 component (Gap Analysis)

---

### Day 2 (4-6 hours)

**Morning (2-3 hours):**
- [ ] Build Step 3 component (Guided Completion)
- [ ] Build Step 4 component (Note Generation loading state)
- [ ] Build Step 5 component (Edit & Export)
- [ ] Integrate AssessmentWizard state management

**Afternoon (2-3 hours):**
- [ ] Implement DOCX export functionality
- [ ] Add Privacy Banner component
- [ ] Polish UI/UX (spacing, colors, responsive)
- [ ] Full workflow testing
- [ ] Deploy to Vercel
- [ ] Documentation and README

**Total Estimated Time:** 10-14 hours over 1-2 days

---

## 12. Success Metrics (For Fellowship Application)

### Technical Success

- [ ] POC successfully demonstrates all 5 workflow steps
- [ ] Gap analysis correctly identifies missing domains (>90% accuracy on test cases)
- [ ] Generated case notes follow ECDA structure
- [ ] DOCX export produces professional, usable documents
- [ ] No crashes or critical errors during demo

### User Experience Success

- [ ] Workflow is intuitive (minimal instruction needed)
- [ ] Loading states provide clear feedback
- [ ] Privacy messaging is prominent and clear
- [ ] Generated content is editable without friction

### Fellowship Application Success

- [ ] Demonstrates technical feasibility of concept
- [ ] Shows AI intelligence (gap detection, not just generation)
- [ ] Clear privacy/PDPA compliance messaging
- [ ] Professional, polished demo worthy of CCSGP standards
- [ ] Shareable URL for reviewers to test

---

## 13. Future Enhancements (Post-POC)

### Phase 2: RAG Integration

- Build retrieval corpus from anonymized templates
- Integrate LlamaIndex or LangChain
- Add ECDA framework documents as context
- Improve generation quality with domain-specific knowledge

### Phase 3: Local LLM Migration

- Deploy Ollama on workstation
- Quantize Llama 3.1 8B to 4-bit (GGUF)
- Replace OpenAI API calls with local endpoint
- Performance testing and optimization

### Phase 4: Multi-Centre Pilot

- Deploy at partner EIPIC centre
- User study with 5-8 assessors over 4 weeks
- Collect metrics: time savings, completeness, satisfaction
- Iterate based on feedback

### Phase 5: Open Source Release

- Clean up codebase
- Write comprehensive documentation
- Choose license (MIT or Apache 2.0)
- Publish to GitHub with setup guide
- Enable other EI centres to self-deploy

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **OpenAI API costs exceed budget** | Medium | Low | Use GPT-3.5-turbo for POC; set API rate limits; emphasize this is POC only |
| **Generated notes have clinical errors** | Medium | High | Add disclaimer; assessor always reviews; clear "AI suggestion" labeling |
| **Gap analysis misses domains** | Low | Medium | Test extensively; adjust prompts; provide manual domain selection override |
| **Export format incompatible with workflows** | Low | Medium | Test DOCX export in Microsoft Word; provide plain text fallback |
| **Fellowship reviewers concerned about privacy** | Low | High | Prominent privacy messaging; emphasize POC vs production architecture; show local LLM roadmap |
| **Build takes longer than estimated** | Medium | Medium | Prioritize core workflow (Steps 1-4); Step 5 export can be simplified to copy-paste if needed |

---

## 15. Conclusion

AssessMate POC is designed to demonstrate the technical feasibility and user value of an AI-powered case note assistant for early intervention assessors. By showcasing intelligent gap detection (not just text generation), maintaining privacy-first messaging throughout, and delivering a polished 5-step workflow, this POC will serve as a compelling proof-of-concept for the CCSGP Public Service Fellowship application.

The architecture is intentionally designed to support migration from cloud-based POC to fully local production deployment, addressing Singapore's PDPA requirements for children's sensitive data. The development timeline (1-2 days) is realistic and achievable, with clear priorities to ensure the core value proposition is demonstrated even if time constraints require simplification of secondary features.

**Next Steps:**
1. Set up Next.js project and dependencies
2. Implement API endpoints and prompt engineering
3. Build React components for 5-step workflow
4. Test thoroughly with realistic scenarios
5. Deploy to Vercel for demo
6. Create implementation plan for development execution

---

**Document Version History:**
- v1.0 (2026-02-13): Initial design approved, ready for implementation planning
