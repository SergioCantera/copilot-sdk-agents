import {CopilotClient, type CopilotSession} from "@github/copilot-sdk";
import {createSessionConfig} from "./copilot.js";

type SessionEntry = {
  session: CopilotSession;
  queue: Promise<unknown>;
};

export class Orchestrator {
  private readonly sessions = new Map<string, SessionEntry>();

  constructor(private readonly client: CopilotClient) {}

  async invoke(message: string, requestedSessionId?: string) {
    const entry = await this.getSession(requestedSessionId);
    const result = entry.queue.then(async () => {
      const response = await entry.session.sendAndWait({prompt: message});
      return {
        sessionId: entry.session.sessionId,
        message: response?.data.content ?? "",
      };
    });
    entry.queue = result.catch(() => undefined);
    return result;
  }

  async close(): Promise<void> {
    await Promise.all(
      [...this.sessions.values()].map(({session}) => session.disconnect()),
    );
    this.sessions.clear();
  }

  private async getSession(requestedSessionId?: string): Promise<SessionEntry> {
    if (requestedSessionId) {
      const existing = this.sessions.get(requestedSessionId);
      if (existing) {
        return existing;
      }
    }

    const session = await this.client.createSession(createSessionConfig());
    const entry: SessionEntry = {session, queue: Promise.resolve()};
    this.sessions.set(session.sessionId, entry);
    return entry;
  }
}
