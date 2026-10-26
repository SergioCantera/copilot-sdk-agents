import type {SessionHooks} from "@github/copilot-sdk";

export const sessionHooks: SessionHooks = {
  onUserPromptSubmitted: (input) => {
    console.error(`[prompt] ${input.prompt.length} characters`);
  },
  onPreToolUse: (input) => {
    console.error(`[tool] requested ${input.toolName}`);
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
