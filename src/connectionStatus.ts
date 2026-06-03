export interface ConnectionStatus {
  googleOAuthConfigured: false;
  googleHealthApiConfigured: false;
  mcpServerReady: true;
  phase: "remote-mcp-skeleton";
}

export function getConnectionStatus(): ConnectionStatus {
  return {
    googleOAuthConfigured: false,
    googleHealthApiConfigured: false,
    mcpServerReady: true,
    phase: "remote-mcp-skeleton"
  };
}
