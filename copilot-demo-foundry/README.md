# Copilot Demo Foundry

This is a local TypeScript Copilot SDK orchestrator. It uses the signed-in
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

## Current capabilities

- Copilot SDK agent loop
- One demo `get_weather` tool
- `researcher` and `weather-specialist` custom sub-agents
- Repository skill in `skills/answering-weather-questions`
- Optional HTTP/SSE MCP server configuration through `MCP_SERVER_URL`
- Session hooks for prompt logging, tool allowlisting, MCP calls, failures, and session lifecycle
- Provider configuration isolated in `src/copilot.ts`
- Non-interactive, single-request CLI entry point suitable for later hosting

## Local Invocations adapter

Phase 3 adds a local HTTP adapter using the Foundry Invocations contract owned
by this project:

```bash
npm run serve
```

The server listens on `0.0.0.0:8080` by default and exposes:

- `GET /health`
- `GET /ready`
- `GET /openapi.json`
- `POST /invocations`

Invoke it from another terminal:

```bash
curl -sS http://localhost:8080/invocations \
  -H 'content-type: application/json' \
  -d '{"message":"What is the weather in Paris?"}'
```

The response includes a `sessionId`. Send that value in a later request to
reuse the same Copilot session:

```json
{
  "message": "Now summarize the result.",
  "sessionId": "<session-id>"
}
```

The Invocations protocol is bytes-in/bytes-out; this project defines the JSON
contract above and publishes it at `/openapi.json`.

The local hook allowlist currently permits only `get_weather` as an application
tool. MCP tools are configured separately and should be explicitly reviewed
before being enabled.

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
