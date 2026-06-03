import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import { handleMcpRequest } from "./mcp.js";

const defaultPort = 3000;
const maxRequestBytes = 1_000_000;

export interface HttpRequestInput {
  method: string;
  path: string;
  body?: string | null;
}

export interface HttpResponseOutput {
  statusCode: number;
  body: unknown;
}

export function createHttpServer(): Server {
  return createServer((request, response) => {
    void routeRequest(request, response);
  });
}

export function startServer(port = readPortFromEnvironment()): Server {
  const server = createHttpServer();

  server.listen(port, () => {
    const address = server.address();
    const resolvedPort = typeof address === "object" && address !== null ? address.port : port;
    console.log(`google-health-remote-mcp listening on port ${String(resolvedPort)}`);
  });

  return server;
}

async function routeRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const method = request.method ?? "GET";
  const path = getPath(request);
  const body = method === "POST" ? await readBody(request) : undefined;
  const result = handleHttpRequest({ method, path, body });

  writeJson(response, result.statusCode, result.body);
}

export function handleHttpRequest(request: HttpRequestInput): HttpResponseOutput {
  if (request.method === "GET" && request.path === "/health") {
    return {
      statusCode: 200,
      body: {
        status: "ok",
        service: "google-health-remote-mcp"
      }
    };
  }

  if (request.method === "POST" && request.path === "/mcp") {
    return handleMcpHttpRequest(request.body);
  }

  return {
    statusCode: 404,
    body: {
      error: "not_found"
    }
  };
}

function handleMcpHttpRequest(body: string | null | undefined): HttpResponseOutput {
  if (body === null) {
    return {
      statusCode: 413,
      body: {
        error: "request_too_large"
      }
    };
  }

  const parsedBody = parseJson(body ?? "");

  if (!parsedBody.ok) {
    return {
      statusCode: 400,
      body: {
        error: "invalid_json"
      }
    };
  }

  return {
    statusCode: 200,
    body: handleMcpRequest(parsedBody.value)
  };
}

function getPath(request: IncomingMessage): string {
  const host = request.headers.host ?? "localhost";
  const url = new URL(request.url ?? "/", `http://${host}`);

  return url.pathname;
}

function readBody(request: IncomingMessage): Promise<string | null> {
  return new Promise((resolve, reject) => {
    let body = "";

    request.setEncoding("utf8");

    request.on("data", (chunk: string) => {
      body += chunk;

      if (body.length > maxRequestBytes) {
        request.destroy();
        resolve(null);
      }
    });

    request.on("end", () => {
      resolve(body);
    });

    request.on("error", reject);
  });
}

function parseJson(value: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return {
      ok: true,
      value: JSON.parse(value) as unknown
    };
  } catch {
    return {
      ok: false
    };
  }
}

function writeJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function readPortFromEnvironment(): number {
  const rawPort = process.env.PORT;

  if (rawPort === undefined) {
    return defaultPort;
  }

  const port = Number.parseInt(rawPort, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer from 1 to 65535");
  }

  return port;
}
