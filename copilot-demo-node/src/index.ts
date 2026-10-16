import {CopilotClient, defineTool, approveAll} from "@github/copilot-sdk";
import * as readLine from "readline";

//Define a tool that Copilot can call
const getWeather = defineTool("getWeather",{
  description: "Get the current weather for a city",
  parameters: {
    type: "object",
    properties: {
      city: {type: "string", description: "The city name"}
    },
    required: ["city"]
  },
  handler: async (args: {city:string}) => {
    const {city} = args;
    const conditions = ["sunny", "cloudy", "rainy", "stormy"];
    const temp = Math.floor(Math.random() * 30) + 50;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return {city, temperature: `${temp}ºF`, condition};
  }
})

const client = new CopilotClient();
const session = await client.createSession({
  model: "auto",
  streaming: true,
  tools: [getWeather],
  onPermissionRequest: approveAll,
});

// Listen for the response chunks
session.on("assistant.message_delta", (event) => {
  process.stdout.write(event.data.deltaContent);
});
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log("🌤️  Weather Assistant (type 'exit' to quit)");
console.log("   Try: 'What's the weather in Paris?'\n");

const prompt = () => {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      await client.stop();
      rl.close();
      return;
    }

    process.stdout.write("Assistant: ");
    await session.sendAndWait({ prompt: input});
    console.log("\n");
    prompt();
  })
};
prompt();