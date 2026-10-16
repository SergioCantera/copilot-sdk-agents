import type {CustomAgentConfig} from "@github/copilot-sdk";

export const customAgents: CustomAgentConfig[] = [
  {
    name: "researcher",
    displayName: "Researcher",
    description: "Breaks down a request and identifies the information needed.",
    prompt:
      "You are the research specialist. Analyze the request, identify the key facts needed, and return a concise, well-structured research brief. Do not invent sources or claim that you performed external research.",
    tools: [],
  },
];
