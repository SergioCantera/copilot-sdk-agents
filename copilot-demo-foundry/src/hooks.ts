import type {SessionHooks} from "@github/copilot-sdk";

const allowedTools = new Set(["get_weather"]);

export const sessionHooks: SessionHooks = {
  onUserPromptSubmitted: (input) => {
    console.error(`[prompt] ${input.prompt.length} characters`);
  },
  onPreToolUse: (input) => {
    console.error(`[tool] requested ${input.toolName}`);
    if (
      !allowedTools.has(input.toolName) &&
      input.toolName !== "task" &&
      input.toolName !== "agent"
    ) {
      return {
        permissionDecision: "deny",
        permissionDecisionReason:
          `Tool '${input.toolName}' is not in the local allowlist.`,
      };
    }

    return {permissionDecision: "allow"};
  },
  onPreMcpToolCall: (input) => {
    console.error(`[mcp] ${input.serverName}/${input.toolName}`);
  },
  onPostToolUse: (input) => {
    console.error(`[tool] ${input.toolName} completed`);
  },
  onPostToolUseFailure: (input) => {
    console.error(`[tool] ${input.toolName} failed: ${input.error}`);
  },
  onErrorOccurred: (input) => {
    console.error(`[agent-error] ${input.errorContext}: ${input.error}`);
  },
  onSessionEnd: (input) => {
    console.error(`[session] ended: ${input.reason}`);
  },
};
