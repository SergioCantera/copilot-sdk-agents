import type {MCPServerConfig} from "@github/copilot-sdk";

export function createMcpServers(): Record<string, MCPServerConfig> | undefined {
  const url = process.env.MCP_SERVER_URL?.trim();
  if (!url) {
    return undefined;
  }

  return {
    project: {
      type: "http",
      url,
      tools: ["*"],
      timeout: 10_000,
    },
  };
}
