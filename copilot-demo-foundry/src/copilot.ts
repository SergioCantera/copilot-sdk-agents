import {
  CopilotClient,
  approveAll,
  type ProviderConfig,
  type SessionConfig,
} from "@github/copilot-sdk";
import {customAgents} from "./agents.js";
import {getWeather} from "./tools/weather.js";

function createProvider(): ProviderConfig | undefined {
  if ((process.env.MODEL_BACKEND ?? "github").toLowerCase() === "github") {
    return undefined;
  }

  if (process.env.MODEL_BACKEND !== "foundry") {
    throw new Error("MODEL_BACKEND must be either 'github' or 'foundry'");
  }

  const baseUrl = process.env.FOUNDRY_MODEL_URL;
  const bearerToken = process.env.FOUNDRY_BEARER_TOKEN;
  if (!baseUrl || !bearerToken) {
    throw new Error(
      "FOUNDRY_MODEL_URL and FOUNDRY_BEARER_TOKEN are required when MODEL_BACKEND=foundry",
    );
  }

  return {
    type: "azure",
    baseUrl,
    bearerToken,
    wireApi: "responses",
  };
}

export function createSessionConfig(): SessionConfig {
  const modelBackend = (process.env.MODEL_BACKEND ?? "github").toLowerCase();
  const model =
    modelBackend === "github"
      ? "auto"
      : process.env.FOUNDRY_MODEL_NAME;

  if (!model) {
    throw new Error(
      "FOUNDRY_MODEL_NAME is required when MODEL_BACKEND=foundry",
    );
  }

  return {
    model,
    streaming: true,
    provider: createProvider(),
    tools: [getWeather],
    customAgents,
    ...(modelBackend === "github"
      ? {onPermissionRequest: approveAll}
      : {}),
  };
}

export async function createLocalAgent(): Promise<{
  client: CopilotClient;
  session: Awaited<ReturnType<CopilotClient["createSession"]>>;
}> {
  const client = new CopilotClient();
  await client.start();

  try {
    const session = await client.createSession(createSessionConfig());
    return {client, session};
  } catch (error) {
    await client.stop();
    throw error;
  }
}
