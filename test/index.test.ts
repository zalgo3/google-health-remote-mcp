import { describe, expect, it } from "vitest";

import { getProjectStatus } from "../src/index.js";

describe("project harness", () => {
  it("exposes the current non-server project status", () => {
    expect(getProjectStatus()).toBe("development-harness-only");
  });
});
