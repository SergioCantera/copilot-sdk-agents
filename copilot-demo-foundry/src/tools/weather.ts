import {defineTool} from "@github/copilot-sdk";

type WeatherArgs = {
  city: string;
};

export const getWeather = defineTool<WeatherArgs>("get_weather", {
  description: "Return demo weather conditions for a city.",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "The city name.",
      },
    },
    required: ["city"],
    additionalProperties: false,
  },
  handler: async ({city}) => {
    const normalizedCity = city.trim();
    if (!normalizedCity) {
      throw new Error("city must not be empty");
    }

    return {
      city: normalizedCity,
      temperature: "72°F",
      condition: "sunny",
      source: "demo",
    };
  },
});
