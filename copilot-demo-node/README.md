# Copilot Demo Node

A minimal interactive example of using the [GitHub Copilot SDK](https://github.com/github/copilot-sdk) from Node.js and TypeScript.

The demo starts a Copilot session with a custom `getWeather` tool. Ask the assistant about the weather in a city and it will call the tool to return simulated conditions and a temperature.

## Prerequisites

- Node.js 18 or later
- A GitHub Copilot subscription
- The GitHub Copilot CLI installed and authenticated

The Copilot SDK uses the local Copilot CLI session for authentication and model access. Follow the [Copilot CLI documentation](https://docs.github.com/en/copilot/github-copilot-in-the-cli) if you need to install or sign in to the CLI.

## Getting started

From this directory, install the dependencies:

```bash
npm install
```

Start the assistant with `tsx`:

```bash
npx tsx src/index.ts
```

You should see a prompt similar to:

```text
🌤️  Weather Assistant (type 'exit' to quit)
   Try: 'What's the weather in Paris?'
```

Enter a question, for example:

```text
You: What's the weather in Paris?
```

Type `exit` to stop the session.

## How it works

[`src/index.ts`](./src/index.ts) performs the following steps:

1. Defines a `getWeather` tool with a city string parameter.
2. Creates a `CopilotClient` and starts a streaming session.
3. Registers the tool with the session so Copilot can invoke it.
4. Writes streamed response deltas directly to the terminal.
5. Reads prompts from standard input until the user types `exit`.

The weather response is intentionally simulated. Temperatures and conditions are randomly generated; the demo does not call a weather API.

## Project structure

```text
.
├── package.json
├── package-lock.json
└── src/
    ├── index.ts
    └── agent/
        ├── copilot-instructions.md
        └── skills/
```

The additional agent instructions and skills are included as project content for experimentation with Copilot SDK agent workflows.

## Development notes

The session currently uses `approveAll` for permission requests:

```ts
onPermissionRequest: approveAll
```

This keeps the demo simple for local experimentation. Review and replace this behavior with explicit permission handling before using the pattern in a production application.

There are no automated tests or build scripts configured yet. The TypeScript entry point can be run directly with `npx tsx src/index.ts`.

## License

This demo does not currently declare a project-specific license. Review the repository's licensing requirements before redistributing it.
