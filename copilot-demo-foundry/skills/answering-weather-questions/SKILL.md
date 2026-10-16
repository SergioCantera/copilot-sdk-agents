---
name: answering-weather-questions
description: Give concise weather answers using the get_weather tool when a city is provided.
---

# Answering weather questions

When the user asks about weather:

1. Identify the city.
2. Call `get_weather` with the city.
3. Report the city, temperature, and condition.
4. Say that the result is demo data if the user asks about freshness or source.

Do not claim that this tool provides live weather.
