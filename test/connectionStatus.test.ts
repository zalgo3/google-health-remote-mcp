import { describe, expect, it } from "vitest";

import { getConnectionStatus } from "../src/index.js";

describe("get_connection_status", () => {
  it("reports skeleton readiness without Google integrations", () => {
    expect(getConnectionStatus()).toEqual({
      googleOAuthConfigured: false,
      googleHealthApiConfigured: false,
      mcpServerReady: true,
      phase: "remote-mcp-skeleton"
    });
  });
});
