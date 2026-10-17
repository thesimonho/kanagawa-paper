import assert from "node:assert/strict";
import test from "node:test";
import {
  checkAuthentication,
  checkClient,
  installedClient,
  type CredentialClient,
} from "../../scripts/ci/release/check-marketplace-auth.mts";

// Model the upstream protocol while the pinned release still uses the old one.
const compatibleClient: CredentialClient = async (publisherName, options) => {
  const url = new URL(options.environment.ACTIONS_ID_TOKEN_REQUEST_URL!);
  url.searchParams.set("audience", "marketplace.visualstudio.com");
  const oidc = await options.request(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${options.environment.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`,
    },
  });
  const { value } = JSON.parse(await oidc.readBody());
  const result = await options.request(
    `${options.marketplaceUrl}/_apis/gallery/token?api-version=7.2-preview.1`,
    {
      method: "POST",
      headers: {
        Authorization: `FederatedToken ${value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publisherName }),
    },
  );
  return JSON.parse(await result.readBody()).credential;
};
const environment = {
  GITHUB_ACTIONS: "true",
  ACTIONS_ID_TOKEN_REQUEST_URL: "https://example.invalid/token",
  ACTIONS_ID_TOKEN_REQUEST_TOKEN: "secret-request-token",
};

test("pinned VSCE 4.0.0 is blocked before any live network request", async () => {
  let calls = 0;
  await assert.rejects(
    checkAuthentication(environment, installedClient, async () => {
      calls++;
      throw new Error("must not run");
    }),
    /Update the pinned VSCE/,
  );
  assert.equal(calls, 0);
});

test("current protocol succeeds and discards the credential after two requests", async () => {
  await checkClient(compatibleClient);
  const requests: string[] = [];
  const result = await checkAuthentication(
    environment,
    compatibleClient,
    async (url, init) => {
      requests.push(String(url));
      assert.equal(init?.redirect, "error");
      assert.ok(init?.signal);
      return new Response(
        JSON.stringify(
          requests.length === 1
            ? { value: "secret-jwt" }
            : { credential: "secret-credential" },
        ),
      );
    },
  );
  assert.equal(result, undefined);
  assert.deepEqual(requests, [
    "https://example.invalid/token?audience=marketplace.visualstudio.com",
    "https://marketplace.visualstudio.com/_apis/gallery/token?api-version=7.2-preview.1",
  ]);
});

test("missing GitHub permissions and invalid request URLs fail without network", async () => {
  const forbidden: typeof fetch = async () => {
    throw new Error("network must not run");
  };
  await assert.rejects(
    checkAuthentication({}, compatibleClient, forbidden),
    /id-token: write/,
  );
  await assert.rejects(
    checkAuthentication(
      {
        ...environment,
        ACTIONS_ID_TOKEN_REQUEST_URL: "http://example.invalid/token",
      },
      compatibleClient,
      forbidden,
    ),
    /invalid OIDC request URL/,
  );
});

test("HTTP failures, transport errors and malformed bodies never expose secrets", async () => {
  for (const mode of ["github", "marketplace", "network", "body"]) {
    let calls = 0;
    await assert.rejects(
      checkAuthentication(environment, compatibleClient, async () => {
        calls++;
        if (mode === "network") throw new Error("secret-network-error");
        if (mode === "body") return new Response("secret-invalid-body");
        if (mode === "github" || calls === 2)
          return new Response("secret-response", {
            status: 403,
            statusText: "secret-status",
          });
        return new Response('{"value":"secret-jwt"}');
      }),
      (error: Error) => {
        assert.doesNotMatch(error.message, /secret/);
        assert.match(
          error.message,
          mode === "github" || mode === "marketplace"
            ? /HTTP 403/
            : /authentication failed/,
        );
        return true;
      },
    );
  }
});
