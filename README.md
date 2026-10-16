# Copilot SDK Agents

Examples and experiments built with the [GitHub Copilot SDK](https://github.com/github/copilot-sdk) for Node.js and TypeScript.

This repository currently contains two standalone demos:

- [`copilot-demo-node/`](./copilot-demo-node/) - An interactive terminal weather assistant that demonstrates streaming responses and a custom tool.
- [`copilot-demo-foundry/`](./copilot-demo-foundry/) - A local Copilot SDK orchestrator with a provider seam for a future Microsoft Foundry deployment.

Each demo has its own `package.json`, `package-lock.json`, dependencies, and run commands. Install dependencies from the demo directory you want to use.

## Prerequisites

- Node.js 22.12 or later
- A GitHub Copilot subscription
- The GitHub Copilot CLI installed and authenticated

The Copilot SDK uses the local Copilot CLI for authentication and model access during local development. See the [Copilot CLI documentation](https://docs.github.com/en/copilot/github-copilot-in-the-cli) for installation and sign-in instructions.

## Demo: Node weather assistant

The Node demo starts an interactive Copilot session with a custom `getWeather` tool. The weather data is simulated and does not call an external weather service.

```bash
cd copilot-demo-node
npm install
npx tsx src/index.ts
```

Ask a question such as:

```text
What's the weather in Paris?
```

Type `exit` to stop the session. See [`copilot-demo-node/README.md`](./copilot-demo-node/README.md) for details.

## Demo: Foundry-ready orchestrator

The Foundry demo is currently designed for local development with the signed-in GitHub Copilot CLI. It includes a `get_weather` tool, a custom `researcher` sub-agent, and an isolated provider configuration seam for future Microsoft Foundry hosting.

```bash
cd copilot-demo-foundry
npm install
npm run typecheck
npm run dev -- "What is the weather in Paris?"
```

The local mode uses:

```text
MODEL_BACKEND=github
```

Future Foundry testing can be configured with the environment variables documented in [`copilot-demo-foundry/.env.example`](./copilot-demo-foundry/.env.example). Do not commit bearer tokens or other credentials. See [`copilot-demo-foundry/README.md`](./copilot-demo-foundry/README.md) for the current provider and hosting notes.

## Repository layout

```text
.
├── copilot-demo-node/
│   ├── package.json
│   └── src/
└── copilot-demo-foundry/
    ├── package.json
    ├── .env.example
    └── src/
```

## Development notes

The demos are intentionally independent so that each can be copied, modified, and run on its own. Changes to one demo do not require installing or building the other.

The Node demo currently has no automated test suite or build script. The Foundry demo provides `typecheck`, `build`, `dev`, and `start` scripts.

## Pushing to GitHub

From the repository root:

```bash
git init
git add README.md copilot-demo-node copilot-demo-foundry
git commit -m "Add Copilot SDK demos"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repository>.git
git push -u origin main
```

Before committing, make sure generated dependencies and local secrets are excluded:

- Do not commit `node_modules/`.
- Do not commit `.env` files or bearer tokens.
- Keep `.env.example` files limited to variable names and safe placeholder values.

If this repository does not yet have a root `.gitignore`, add one before the first commit with entries for `node_modules/`, `.env`, `.env.*` (while allowing `.env.example`), and generated build output such as `dist/`.

## License

No repository-level license has been declared yet. Add a `LICENSE` file before publishing if you want to specify how others may use or redistribute this code.
