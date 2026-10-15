import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const marketplace = "https://marketplace.visualstudio.com";
const exchange = `${marketplace}/_apis/gallery/token?api-version=7.2-preview.1`;
const publisher = "SimonHo";
type Environment = Record<string, string | undefined>;
type Request = (
  url: string,
  init: RequestInit,
) => Promise<{
  statusCode: number;
  readBody: () => Promise<string>;
}>;
export type CredentialClient = (
  publisher: string,
  options: {
    environment: Environment;
    marketplaceUrl: string;
    request: Request;
  },
) => Promise<string>;

export const installedClient: CredentialClient = createRequire(import.meta.url)(
  "./node_modules/@vscode/vsce/out/oidc.js",
).getOIDCCredential;

// Exercise the installed publisher client. Do not patch its exchange protocol.
export async function checkClient(client: CredentialClient = installedClient) {
  let calls = 0;
  try {
    const credential = await client(publisher, {
      marketplaceUrl: marketplace,
      environment: {
        GITHUB_ACTIONS: "true",
        ACTIONS_ID_TOKEN_REQUEST_URL: "https://example.invalid/token?fixture=1",
        ACTIONS_ID_TOKEN_REQUEST_TOKEN: "fixture-request-token",
      },
      request: async (url, init) => {
        calls++;
        const headers = new Headers(init.headers);
        if (calls === 1) {
          assert.equal(
            url,
            "https://example.invalid/token?fixture=1&audience=marketplace.visualstudio.com",
          );
          assert.equal(init.method, "GET");
          assert.equal(
            headers.get("Authorization"),
            "Bearer fixture-request-token",
          );
          return {
            statusCode: 200,
            readBody: async () => '{"value":"fixture-jwt"}',
          };
        }
        assert.equal(calls, 2);
        assert.equal(url, exchange);
        assert.equal(init.method, "POST");
        assert.equal(
          headers.get("Authorization"),
          "FederatedToken fixture-jwt",
        );
        assert.equal(headers.get("Content-Type"), "application/json");
        assert.deepEqual(JSON.parse(String(init.body)), {
          publisherName: publisher,
        });
        return {
          statusCode: 200,
          readBody: async () => '{"credential":"fixture-credential"}',
        };
      },
    });
    assert.equal(calls, 2);
    assert.equal(credential, "fixture-credential");
  } catch {
    throw new Error(
      "Installed VSCE does not support the required Marketplace exchange protocol. Update the pinned VSCE release before running the live check.",
    );
  }
}

export async function checkAuthentication(
  environment: Environment = process.env,
  client: CredentialClient = installedClient,
  transport: typeof fetch = fetch,
): Promise<void> {
  await checkClient(client);
  if (
    environment.GITHUB_ACTIONS !== "true" ||
    !environment.ACTIONS_ID_TOKEN_REQUEST_URL ||
    !environment.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  ) {
    throw new Error("Run this check in GitHub Actions with id-token: write.");
  }
  let tokenUrl: URL;
  try {
    tokenUrl = new URL(environment.ACTIONS_ID_TOKEN_REQUEST_URL);
    if (tokenUrl.protocol !== "https:") throw new Error();
    tokenUrl.searchParams.set("audience", "marketplace.visualstudio.com");
  } catch {
    throw new Error("GitHub provided an invalid OIDC request URL.");
  }
  let calls = 0;
  let failure =
    "Marketplace authentication failed; no response body or credential was logged.";
  try {
    const credential = await client(publisher, {
      environment,
      marketplaceUrl: marketplace,
      request: async (url, init) => {
        calls++;
        if (
          (calls === 1 &&
            (url !== tokenUrl.toString() || init.method !== "GET")) ||
          (calls === 2 && (url !== exchange || init.method !== "POST")) ||
          calls > 2
        ) {
          throw new Error("Unexpected authentication request");
        }
        const response = await transport(url, {
          ...init,
          redirect: "error",
          signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) {
          failure = `${calls === 1 ? "GitHub OIDC request" : "Marketplace exchange"} failed (HTTP ${response.status}); response body omitted.`;
          throw new Error("Authentication request failed");
        }
        return { statusCode: response.status, readBody: () => response.text() };
      },
    });
    if (calls !== 2 || !credential) throw new Error("Invalid exchange result");
    // Discard the credential. This command has no publication or persistence step.
  } catch {
    throw new Error(failure);
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    if (process.argv[2] === "--check-client") await checkClient();
    else if (process.argv[2] === "--live") await checkAuthentication();
    else
      throw new Error(
        "Use --check-client (offline) or --live (GitHub Actions).",
      );
    process.stdout.write(
      "Marketplace authentication check passed" +
        (process.argv[2] === "--check-client"
          ? " (offline client protocol only).\n"
          : "; no extension was published.\n"),
    );
  } catch (error) {
    process.stderr.write(
      (error instanceof Error
        ? error.message
        : "Authentication check failed.") + "\n",
    );
    process.exitCode = 1;
  }
}
