import { getConnectionStatus } from "./connectionStatus.js";

const protocolVersion = "2025-06-18";

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: unknown;
}

export interface JsonRpcSuccess {
  jsonrpc: "2.0";
  id: string | number | null;
  result: unknown;
}

export interface JsonRpcFailure {
  jsonrpc: "2.0";
  id: string | number | null;
  error: {
    code: number;
    message: string;
  };
}

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcFailure;

export function handleMcpRequest(request: unknown): JsonRpcResponse {
  if (!isJsonRpcRequest(request)) {
    return createError(null, -32600, "Invalid Request");
  }

  switch (request.method) {
    case "initialize":
      return createResult(request.id ?? null, {
        protocolVersion,
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "google-health-remote-mcp",
          version: "0.1.0"
        }
      });

    case "tools/list":
      return createResult(request.id ?? null, {
        tools: [
          {
            name: "get_connection_status",
            description:
              "Returns whether this skeleton server is running and whether Google integrations are configured.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false
            }
          }
        ]
      });

    case "tools/call":
      return handleToolCall(request);

    default:
      return createError(request.id ?? null, -32601, "Method not found");
  }
}

function handleToolCall(request: JsonRpcRequest): JsonRpcResponse {
  const params = request.params;

  if (!isToolCallParams(params)) {
    return createError(request.id ?? null, -32602, "Invalid params");
  }

  if (params.name !== "get_connection_status") {
    return createError(request.id ?? null, -32602, "Unknown tool");
  }

  return createResult(request.id ?? null, {
    content: [
      {
        type: "text",
        text: JSON.stringify(getConnectionStatus())
      }
    ],
    structuredContent: getConnectionStatus(),
    isError: false
  });
}

function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  if (!isRecord(value)) {
    return false;
  }

  const id = value.id;

  return (
    value.jsonrpc === "2.0" &&
    typeof value.method === "string" &&
    (id === undefined || id === null || typeof id === "string" || typeof id === "number")
  );
}

function isToolCallParams(value: unknown): value is { name: string; arguments?: unknown } {
  return isRecord(value) && typeof value.name === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createResult(id: string | number | null, result: unknown): JsonRpcSuccess {
  return {
    jsonrpc: "2.0",
    id,
    result
  };
}

function createError(id: string | number | null, code: number, message: string): JsonRpcFailure {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message
    }
  };
}
