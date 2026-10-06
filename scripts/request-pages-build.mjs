import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Use the branch-based Pages API, not the artifact deployment API.
export async function requestPagesBuild({ repository, token, fetchImpl = fetch }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository || '') || !token) {
    throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required.');
  }
  const base = `https://api.github.com/repos/${repository}/pages`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'AG-Home-Pages-deployment',
  };
  async function request(url, method = 'GET') {
    const response = await fetchImpl(url, { method, headers });
    if (!response.ok) {
      // Do not print request headers, tokens or arbitrary server response bodies.
      const help = response.status === 404
        ? 'Enable Pages in repository Settings; check repository plan/visibility and Pages access.'
        : response.status === 403
          ? 'Allow pages: write for this workflow in repository/organization Actions policy.'
          : 'Inspect repository Pages settings and retry the workflow on master.';
      throw new Error(`GitHub Pages ${method} failed (HTTP ${response.status}). ${help}`);
    }
    return response.json();
  }
  const site = await request(base);
  if (site.build_type !== 'legacy' || site.source?.branch !== 'gh-pages' || site.source?.path !== '/') {
    throw new Error('Set Settings → Pages → Source: Deploy from a branch → gh-pages → /(root), then Save. Keep master as the default branch.');
  }
  const build = await request(`${base}/builds`, 'POST');
  return { status: build.status, url: site.html_url };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await requestPagesBuild({
      repository: process.env.GITHUB_REPOSITORY,
      token: process.env.GITHUB_TOKEN,
    });
    const summary = `Pages branch build requested (${result.status || 'accepted'}).\nSource: gh-pages / (root).\nWebsite: ${result.url || 'See repository Settings → Pages'}\n\nCheck GitHub's pages build and deployment run for the final publishing result.\n`;
    console.log(summary);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
