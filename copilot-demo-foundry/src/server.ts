import {createServer, type IncomingMessage, type ServerResponse} from "node:http";
import {CopilotClient} from "@github/copilot-sdk";
import {Orchestrator} from "./orchestrator.js";

const port = Number(process.env.PORT ?? 8080);
const maxBodyBytes = Number(process.env.MAX_REQUEST_BYTES ?? 1_048_576);

type InvocationRequest = {
  message: string;
  sessionId?: string;
};

function writeJson(
  response: ServerResponse,
  status: number,
  body: Record<string, unknown>,
): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  response.end(payload);
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBodyBytes) {
      throw new Error("request body is too large");
    }
    chunks.push(buffer);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function parseInvocation(value: unknown): InvocationRequest {
  if (!value || typeof value !== "object") {
    throw new Error("request body must be a JSON object");
  }

  const body = value as Record<string, unknown>;
  if (typeof body.message !== "string" || !body.message.trim()) {
    throw new Error("message must be a non-empty string");
  }

  if (
    body.sessionId !== undefined &&
    (typeof body.sessionId !== "string" || !body.sessionId.trim())
  ) {
    throw new Error("sessionId must be a non-empty string when provided");
  }

  return {
    message: body.message,
    sessionId: body.sessionId as string | undefined,
  };
}

function openApiDocument() {
  return {
    openapi: "3.0.3",
    info: {
      title: "Copilot Foundry Orchestrator",
      version: "0.1.0",
    },
    paths: {
      "/invocations": {
        post: {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["message"],
                  properties: {
                    message: {type: "string"},
                    sessionId: {type: "string"},
                  },
                },
              },
            },
          },
          responses: {"200": {description: "Agent response"}},
        },
      },
    },
  };
}

export async function startServer(): Promise<{
  close: () => Promise<void>;
  port: number;
}> {
  const client = new CopilotClient();
  await client.start();
  const orchestrator = new Orchestrator(client);

  const server = createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        writeJson(response, 200, {status: "ok"});
        return;
      }

      if (request.method === "GET" && request.url === "/ready") {
        writeJson(response, 200, {status: "ready"});
        return;
      }

      if (request.method === "GET" && request.url === "/openapi.json") {
        writeJson(response, 200, openApiDocument());
        return;
      }

      if (request.method === "POST" && request.url === "/invocations") {
        const invocation = parseInvocation(await readJson(request));
        const result = await orchestrator.invoke(
          invocation.message,
          invocation.sessionId,
        );
        writeJson(response, 200, result);
        return;
      }

      writeJson(response, 404, {error: "not found"});
    } catch (error) {
      const message = error instanceof Error ? error.message : "request failed";
      const status = message.includes("request body") || message.includes("message") ||
        message.includes("sessionId") || message.includes("too large")
        ? 400
        : 500;
      writeJson(response, status, {error: message});
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "0.0.0.0", resolve);
  });

  return {
    port,
    close: async () => {
      await orchestrator.close();
      await client.stop();
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}
