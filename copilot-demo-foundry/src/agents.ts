import type {CustomAgentConfig} from "@github/copilot-sdk";

export const customAgents: CustomAgentConfig[] = [
  {
    name: "researcher",
    displayName: "Researcher",
    description: "Breaks down a request and identifies the information needed.",
    prompt:
      "You are the research specialist. Analyze the request, identify the key facts needed, and return a concise, well-structured research brief. Do not invent sources or claim that you performed external research.",
    tools: ["get_weather"],
  },
  {
    name: "weather-specialist",
    displayName: "Weather Specialist",
    description: "Answers weather questions using the weather tool.",
    prompt:
      "You are the weather specialist. Use get_weather when a city is provided. Clearly label the result as demo data and do not claim it is live.",
    tools: ["get_weather"],
  },
];
