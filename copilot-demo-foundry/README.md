# Copilot Demo Foundry

Phase 1 is a local TypeScript Copilot SDK orchestrator. It uses the signed-in
GitHub Copilot CLI by default, while keeping a provider seam for a later
Microsoft Foundry deployment.

## Prerequisites

- Node.js 22.12 or later
- GitHub Copilot CLI installed and authenticated for local development

## Run locally

```bash
npm install
npm run typecheck
npm run dev -- "What is the weather in Paris?"
```

The local mode uses `MODEL_BACKEND=github` and therefore uses the normal
Copilot subscription associated with the local Copilot CLI.

## Phase 1 capabilities

- Copilot SDK agent loop
- One demo `get_weather` tool
- One `researcher` custom sub-agent
- Provider configuration isolated in `src/copilot.ts`
- Non-interactive, single-request CLI entry point suitable for later hosting

## Foundry provider seam

The application does not use Foundry during local development. The future
Foundry mode is selected explicitly with:

```text
MODEL_BACKEND=foundry
FOUNDRY_MODEL_NAME=<deployment-name>
FOUNDRY_MODEL_URL=<Foundry-model-endpoint>
FOUNDRY_BEARER_TOKEN=<short-lived-token>
```

The bearer token is intentionally an environment input for this phase. The
hosted deployment should replace it with a managed-identity
`bearerTokenProvider` and should not use a developer's Copilot credentials.
