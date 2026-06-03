import { pathToFileURL } from "node:url";

import { startServer } from "./server.js";

export { getConnectionStatus, type ConnectionStatus } from "./connectionStatus.js";
export { handleMcpRequest, type JsonRpcRequest, type JsonRpcResponse } from "./mcp.js";
export {
  createHttpServer,
  handleHttpRequest,
  startServer,
  type HttpRequestInput,
  type HttpResponseOutput
} from "./server.js";

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
