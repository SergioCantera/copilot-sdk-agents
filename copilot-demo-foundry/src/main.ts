import {createLocalAgent} from "./copilot.js";

const prompt = process.argv.slice(2).join(" ").trim();
if (!prompt) {
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
