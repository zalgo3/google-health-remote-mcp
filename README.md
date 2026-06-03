# google-health-remote-mcp

`google-health-remote-mcp` is an unofficial Remote MCP server project for accessing personal Google Health API data from MCP clients such as ChatGPT and Claude.

The project is intentionally early-stage. This repository currently contains project guidance only; it does not implement the server yet.

## Project Goal

Build a small, auditable Remote MCP server that lets a user connect their own Google account and expose selected personal Google Health API data to MCP clients through high-level, read-only tools.

The intended shape is:

- User-authorized Google OAuth access.
- A Remote MCP interface designed for personal use.
- High-level tools that answer useful health-data questions.
- Read-only access only.
- Deployment guidance suitable for a user's private environment.

## Non-Goals

This repository will not become a raw Google Health API proxy. MCP tools must not expose arbitrary Google Health API endpoints, arbitrary path/query forwarding, generic HTTP passthrough, or broad data dumping.

This repository also does not aim to provide:

- A hosted public service.
- Multi-tenant production infrastructure.
- Clinical, diagnostic, or medical advice.
- Write access to Google Health data.
- Sync, import, delete, mutation, or background automation workflows.
- Storage of real personal health records.

## Security And Privacy Rules

This is a public repository. It must not contain:

- Production secrets.
- OAuth client secrets.
- OAuth refresh tokens.
- Access tokens.
- Real user emails.
- Deployed service URLs for private instances.
- Real health data.
- Logs, screenshots, fixtures, tests, or examples containing real personal data.

Use mock data, fake users, fake URLs, and clearly non-production examples only.

MCP tools must be high-level and read-only. Each tool should expose a narrowly scoped user workflow, not a transport-level API primitive.

## Phased Roadmap

0. **Development harness**
   - Establish the TypeScript project foundation.
   - Add `package.json` scripts for build, typecheck, test, lint, format, and check.
   - Add a test framework, linting, formatting, and GitHub Actions CI.
   - Do not implement the MCP server yet.
   - Do not implement Google OAuth yet.
   - Do not add Google Health API calls yet.
   - Do not add production secrets or real health data.

1. **Remote MCP skeleton**
   - Define the project structure, runtime, basic Remote MCP transport, health checks, local development commands, and test setup.
   - Keep tools mocked until authentication and data-access boundaries are designed.

2. **Google OAuth design**
   - Document OAuth scopes, consent flow, token storage expectations, redirect handling, and deployment-time secret management.
   - Keep production client secrets and tokens out of this repository.

3. **Mocked Google Health API client**
   - Add a fake Google Health client with synthetic fixtures.
   - Build read-only, high-level MCP tools against the mocked interface before connecting to real APIs.

4. **Cloud Run deployment template**
   - Provide infrastructure and deployment examples that use placeholders only.
   - Document how users should supply secrets through their own private Google Cloud project.

5. **Private deployment repository**
   - Move real deployment configuration, OAuth client details, environment values, private URLs, and operational notes into a separate private repository owned by the deployer.

## Current Status

Phase 0, the development harness, is in place. No server implementation exists yet. The next implementation milestone should be the Remote MCP skeleton described in the roadmap.
