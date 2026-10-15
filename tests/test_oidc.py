"""Exercise the pinned publisher's credential boundary without network or tokens."""
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TrustedPublishing(unittest.TestCase):
    def test_pinned_cli_fails_closed(self):
        script = r'''
const assert = require('node:assert/strict');
const { getOIDCCredential } = require('./scripts/release/node_modules/@vscode/vsce/out/oidc.js');
(async () => {
  let calls = 0;
  const forbidden = async () => { calls++; throw Error('network must not run'); };
  await assert.rejects(getOIDCCredential('SimonHo', { environment: { VSCE_PAT: 'unused-fixture' }, request: forbidden }), /No supported OIDC provider/);
  await assert.rejects(getOIDCCredential('SimonHo', { environment: { GITHUB_ACTIONS: 'true', VSCE_PAT: 'unused-fixture' }, request: forbidden }), /id-token: write/);
  assert.equal(calls, 0);
  const environment = { GITHUB_ACTIONS: 'true', ACTIONS_ID_TOKEN_REQUEST_URL: 'https://example.invalid/token', ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'fixture' };
  const request = async (url, init) => {
    calls++;
    if (calls === 1) {
      assert.equal(new URL(url).searchParams.get('audience'), 'marketplace.visualstudio.com');
      return {statusCode: 200, readBody: async () => JSON.stringify({value:'fixture-jwt'})};
    }
    assert.equal(JSON.parse(init.body).publisherName, 'SimonHo');
    return {statusCode: 403, statusMessage: 'Denied', readBody: async () => JSON.stringify({message:'policy denied'})};
  };
  await assert.rejects(getOIDCCredential('SimonHo', { environment, request }), /403 Denied: policy denied/);
  assert.equal(calls, 2);
})().catch(error => { console.error(error); process.exitCode = 1; });
'''
        subprocess.run(["node", "-e", script], cwd=ROOT, check=True, capture_output=True)
