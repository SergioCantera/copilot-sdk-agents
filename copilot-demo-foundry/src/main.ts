import {createLocalAgent} from "./copilot.js";
import {startServer} from "./server.js";

const prompt = process.argv.slice(2).join(" ").trim();
if (process.env.SERVE === "true") {
  const running = await startServer();
  console.log(`Foundry Invocations adapter listening on port ${running.port}`);

  const shutdown = async () => {
    await running.close();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
} else if (!prompt) {
  console.error("Usage: npm run dev -- \"Ask the orchestrator a question\"");
  process.exitCode = 1;
} else {
  const {client, session} = await createLocalAgent();

  try {
    session.on("assistant.message_delta", (event) => {
      process.stdout.write(event.data.deltaContent);
    });

    await session.sendAndWait({prompt});
    process.stdout.write("\n");
  } finally {
    await session.disconnect();
    await client.stop();
  }
}
