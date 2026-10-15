import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  getOIDCCredential,
} = require("../../scripts/ci/release/node_modules/@vscode/vsce/out/oidc.js");
test("pinned VSCE OIDC credentials fail closed without PAT fallback", async () => {
  let calls = 0;
  const forbidden = async () => {
    calls++;
    throw Error("network must not run");
  };
  await assert.rejects(
    getOIDCCredential("SimonHo", {
      environment: { VSCE_PAT: "unused-fixture" },
      request: forbidden,
    }),
    /No supported OIDC provider/,
  );
  await assert.rejects(
    getOIDCCredential("SimonHo", {
      environment: { GITHUB_ACTIONS: "true", VSCE_PAT: "unused-fixture" },
      request: forbidden,
    }),
    /id-token: write/,
  );
  assert.equal(calls, 0);
  const environment = {
    GITHUB_ACTIONS: "true",
    ACTIONS_ID_TOKEN_REQUEST_URL: "https://example.invalid/token",
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: "fixture",
  };
  const request = async (url: string, init: { body: string }) => {
    calls++;
    if (calls === 1) {
      assert.equal(
        new URL(url).searchParams.get("audience"),
        "marketplace.visualstudio.com",
      );
      return {
        statusCode: 200,
        readBody: async () => JSON.stringify({ value: "fixture-jwt" }),
      };
    }
    assert.equal(JSON.parse(init.body).publisherName, "SimonHo");
    return {
      statusCode: 403,
      statusMessage: "Denied",
      readBody: async () => JSON.stringify({ message: "policy denied" }),
    };
  };
  await assert.rejects(
    getOIDCCredential("SimonHo", { environment, request }),
    /403 Denied: policy denied/,
  );
  assert.equal(calls, 2);
});
