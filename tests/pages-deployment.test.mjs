import test from 'node:test';
import assert from 'node:assert/strict';
import { requestPagesBuild } from '../scripts/request-pages-build.mjs';

const repository = 'AG-Alien-Gamerz/AG-Home';
const token = 'test-only-token';
const site = { build_type: 'legacy', source: { branch: 'gh-pages', path: '/' }, html_url: 'https://ag-alien-gamerz.github.io/AG-Home/' };
function api(responses) {
  const calls = [];
  return { calls, fetchImpl: async (url, options) => {
    calls.push({ url, ...options });
    const response = responses.shift();
    assert.ok(response, 'Unexpected API call');
    return { ok: response.status < 400, status: response.status, json: async () => response.body };
  } };
}

test('requests a build of the configured gh-pages root without changing settings', async () => {
  const mock = api([{ status: 200, body: site }, { status: 201, body: { status: 'queued' } }]);
  const result = await requestPagesBuild({ repository, token, fetchImpl: mock.fetchImpl });
  assert.deepEqual(result, { status: 'queued', url: site.html_url });
  assert.deepEqual(mock.calls.map(({ url, method }) => [url, method]), [
    [`https://api.github.com/repos/${repository}/pages`, 'GET'],
    [`https://api.github.com/repos/${repository}/pages/builds`, 'POST'],
  ]);
  assert.equal(mock.calls[1].headers.Authorization, `Bearer ${token}`);
});

for (const wrongSite of [
  { ...site, build_type: 'workflow' },
  { ...site, source: { branch: 'master', path: '/' } },
  { ...site, source: { branch: 'gh-pages', path: '/docs' } },
]) {
  test(`rejects incompatible Pages settings ${JSON.stringify(wrongSite.source)} / ${wrongSite.build_type}`, async () => {
    const mock = api([{ status: 200, body: wrongSite }]);
    await assert.rejects(requestPagesBuild({ repository, token, fetchImpl: mock.fetchImpl }), /Deploy from a branch/);
    assert.equal(mock.calls.length, 1);
  });
}

for (const status of [403, 404, 422, 500]) {
  test(`reports API ${status} without leaking credentials`, async () => {
    const mock = api([{ status, body: { message: token } }]);
    await assert.rejects(requestPagesBuild({ repository, token, fetchImpl: mock.fetchImpl }), error => {
      assert.match(error.message, new RegExp(`HTTP ${status}`));
      assert.ok(!error.message.includes(token));
      return true;
    });
    assert.equal(mock.calls.length, 1);
  });
}

test('a rejected Pages build request fails instead of claiming deployment success', async () => {
  const mock = api([{ status: 200, body: site }, { status: 403 }]);
  await assert.rejects(requestPagesBuild({ repository, token, fetchImpl: mock.fetchImpl }), /POST failed/);
});

test('missing credentials and malformed repository never call the API', async () => {
  const mock = api([]);
  for (const input of [{ repository, token: '' }, { repository: '../wrong/path', token }]) {
    await assert.rejects(requestPagesBuild({ ...input, fetchImpl: mock.fetchImpl }), /required/);
  }
  assert.equal(mock.calls.length, 0);
});
