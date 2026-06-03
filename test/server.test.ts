import { describe, expect, it } from "vitest";

import { handleHttpRequest } from "../src/index.js";

describe("http server routing", () => {
  it("returns health status", () => {
    expect(
      handleHttpRequest({
        method: "GET",
        path: "/health"
      })
    ).toEqual({
      statusCode: 200,
      body: {
        status: "ok",
        service: "google-health-remote-mcp"
      }
    });
  });

  it("exposes get_connection_status through MCP tools/call", () => {
    expect(
      handleHttpRequest({
        method: "POST",
        path: "/mcp",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name: "get_connection_status",
            arguments: {}
          }
        })
      })
    ).toEqual({
      statusCode: 200,
      body: {
        jsonrpc: "2.0",
        id: 1,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                googleOAuthConfigured: false,
                googleHealthApiConfigured: false,
                mcpServerReady: true,
                phase: "remote-mcp-skeleton"
              })
            }
          ],
          structuredContent: {
            googleOAuthConfigured: false,
            googleHealthApiConfigured: false,
            mcpServerReady: true,
            phase: "remote-mcp-skeleton"
          },
          isError: false
        }
      }
    });
  });
});
