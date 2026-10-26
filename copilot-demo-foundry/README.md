# Copilot Demo Foundry

This is a TypeScript Copilot SDK orchestrator prepared for Microsoft Foundry
hosted-agent deployment. The application owns only the Copilot agent loop and
the Foundry Invocations adapter. Domain-specific tools, skills, and specialist
agents are intentionally not embedded in this repository; they can be managed
as separate Foundry resources and exposed to the orchestrator through approved
external integrations.

## Prerequisites

- Node.js 22.12 or later
- GitHub Copilot CLI installed and authenticated for local development

## Run locally

```bash
npm install
npm run typecheck
npm run dev -- "What is the weather in Paris?"
```

Local development defaults to `MODEL_BACKEND=github` and therefore uses the
normal Copilot subscription associated with the local Copilot CLI. This mode
is only a development adapter; it is not the Foundry deployment configuration.

## Current capabilities

- Copilot SDK agent loop
- Optional external HTTP MCP server configuration through `MCP_SERVER_URL`
- Session hooks for prompt logging, external tool calls, failures, and session lifecycle
- Provider configuration isolated in `src/copilot.ts`
- Non-interactive, single-request CLI entry point suitable for later hosting

The session configuration does not register application tools, local skills, or
custom sub-agents. External resources should be connected and governed outside
the application. For example, an Azure Functions hosted skill can expose
domain-specific reasoning and MCP tools as a separate resource:
<https://learn.microsoft.com/en-us/azure/azure-functions/functions-hosted-skills>.

When an external resource is exposed through an HTTP MCP endpoint for local
testing, set `MCP_SERVER_URL` in the environment. The endpoint is not bundled
with this project and its tools are not defined in TypeScript.

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

## Container build

The container listens on port `8088`, which is the default port used by the
Foundry hosted-agent deployment workflow:

```bash
docker build -t copilot-demo-foundry:local .
docker run --rm -p 8088:8088 \
  -e MODEL_BACKEND=foundry \
  -e FOUNDRY_MODEL_NAME=<deployment-name> \
  -e FOUNDRY_MODEL_URL=<Foundry-model-endpoint> \
  -e FOUNDRY_BEARER_TOKEN=<short-lived-token> \
  copilot-demo-foundry:local
```

For local Docker testing, the container requires non-interactive authentication
for the selected provider. Do not copy a developer's local Copilot credentials
or bearer token into the image. The `azure.yaml` service is prepared for remote
ACR builds, but Azure provisioning and deployment require a selected Foundry
project and are not performed by this local phase.

## Foundry provider seam

The Foundry provider is selected explicitly with:

```text
MODEL_BACKEND=foundry
FOUNDRY_MODEL_NAME=<deployment-name>
FOUNDRY_MODEL_URL=<Foundry-model-endpoint>
FOUNDRY_BEARER_TOKEN=<short-lived-token>
```

The bearer token is an environment input for local or transitional testing
only. A hosted deployment should replace it with a managed-identity
`bearerTokenProvider` and should not use a developer's Copilot credentials.

## Resource boundaries

This project is the orchestrator runtime:

- The Copilot SDK owns the model interaction loop.
- The HTTP adapter implements the Foundry Invocations contract.
- `MCP_SERVER_URL` is only an optional local integration seam.
- Foundry owns the lifecycle and governance of external skills, tools, and
  agents.

The orchestrator does not automatically discover arbitrary Foundry resources.
Those resources must be exposed through an integration supported by the
deployment architecture, such as a configured MCP endpoint, and the resulting
connection must be supplied to the hosted runtime.
