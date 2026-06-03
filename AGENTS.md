# AGENTS.md

Repository guidance for agents and contributors working on `google-health-remote-mcp`.

## Repository Purpose

This public repository is for an unofficial Remote MCP server that will let a user access their own personal Google Health API data from MCP clients such as ChatGPT and Claude.

The implementation must prioritize privacy, narrow permissions, readable code, and auditable behavior. Treat all health-related data as sensitive, even in examples.

## Hard Security Constraints

This repository must never contain:

- Production secrets.
- OAuth client secrets.
- OAuth refresh tokens or access tokens.
- Real user emails or account identifiers.
- Real deployed URLs for private services.
- Real health data.
- Logs, screenshots, recordings, fixtures, tests, or examples containing real personal data.

Use synthetic examples only. Prefer obviously fake values such as `user@example.invalid`, `https://example.invalid`, and mock health records that cannot be mistaken for real data.

Do not add `.env` files, private key files, token dumps, cloud credentials, copied console output containing secrets, or generated client-secret downloads. `.env.example` is acceptable only when it contains placeholders.

## MCP Tool Design Rules

All MCP tools must be high-level and read-only.

Allowed patterns:

- Purpose-built tools that answer narrow user questions.
- Summary or lookup tools that return minimal necessary data.
- Tools backed by explicit allowlists of supported operations.
- Mocked tools using synthetic fixtures during early phases.

Disallowed patterns:

- Raw Google Health API proxying.
- Generic HTTP passthrough tools.
- Arbitrary endpoint, method, path, query, or request-body forwarding.
- Write, update, import, sync, delete, or mutation tools.
- Broad dump/export tools that return more data than needed for the user workflow.

When in doubt, reduce scope and return less data.

## Build And Test Expectations

Before a server implementation exists, documentation-only changes should be checked for clarity, consistency, and secret hygiene.

Once code is added, every PR should document and, where practical, run the relevant checks:

- Formatting.
- Linting.
- Type checking.
- Unit tests.
- Integration tests using mocked Google Health clients only.

Tests must not require real Google accounts, real OAuth credentials, real health data, or deployed infrastructure. If a test needs external configuration, provide a mocked or fake default path.

## Development Rules

- Keep changes scoped to the current phase of the roadmap.
- Prefer simple, explicit code over framework-heavy abstractions.
- Add dependency choices deliberately and document why they are needed.
- Keep authentication, token handling, and API-client boundaries isolated and easy to review.
- Avoid logging sensitive request headers, tokens, user identifiers, or health payloads.
- Treat sample data as public forever.

## Pull Request Expectations

Each PR should include:

- A concise summary of the change.
- The roadmap phase it belongs to.
- Tests or checks run, or a clear reason they were not applicable.
- Security and privacy notes for any auth, health-data, logging, deployment, or MCP-tool changes.
- Confirmation that no production secrets, OAuth client secrets, refresh tokens, real user emails, deployed URLs, or real health data were added.

PRs that add MCP tools must explain why each tool is high-level, read-only, and not a raw Google Health API proxy.

PRs that add deployment material must use placeholders only and must not include private project IDs, service URLs, OAuth credentials, or real environment values.

## Roadmap Guardrails

Follow this order unless the roadmap is explicitly revised:

0. Development harness.
1. Remote MCP skeleton.
2. Google OAuth design.
3. Mocked Google Health API client.
4. Cloud Run deployment template.
5. Private deployment repository.

Do not implement real Google Health API access before the OAuth design and mocked client phases are complete.

## Phase 0 Guardrails

Phase 0 is the development harness. It includes:

- TypeScript project foundation.
- `package.json` scripts for build, typecheck, test, lint, format, and check.
- A test framework.
- Linting and formatting.
- GitHub Actions CI.

Phase 0 must not include:

- MCP server implementation.
- Google OAuth implementation.
- Google Health API calls.
- Production secrets or real health data.
