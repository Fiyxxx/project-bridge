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
