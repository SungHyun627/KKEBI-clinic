import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const BASE_URL = process.env.LH_BASE_URL ?? 'http://127.0.0.1:4100';
const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, '.next', 'server', 'app-paths-manifest.json');
const OUTPUT_DIR = path.join(ROOT, '.lighthouse', 'en-pages');
const SUMMARY_JSON_PATH = path.join(ROOT, '.lighthouse', 'en-pages-summary.json');
const SUMMARY_MD_PATH = path.join(ROOT, '.lighthouse', 'en-pages-summary.md');

const toRuntimePath = (routeKey) => {
  const withoutLocale = routeKey.replace('/[locale]', '/en');
  const withoutGroups = withoutLocale.replace(/\/\([^)]+\)/g, '');
  const withoutPageSuffix = withoutGroups.replace(/\/page$/, '');
  const withSampleParams = withoutPageSuffix.replace(/\[[^\]]+\]/g, '1');
  return withSampleParams || '/en';
};

const toSafeFileName = (routePath) => {
  if (routePath === '/en') return 'en-root';
  return routePath
    .replace(/^\/+/, '')
    .replace(/\//g, '__')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
};

const readRoutes = () => {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found: ${MANIFEST_PATH}. Run pnpm build first.`);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const routes = Object.keys(manifest)
    .filter((key) => key.startsWith('/[locale]/') && key.endsWith('/page'))
    .map(toRuntimePath);

  return [...new Set(routes)].sort((a, b) => a.localeCompare(b));
};

const parseResult = (jsonPath) => {
  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const { categories, audits } = report;
  return {
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalDisplayedUrl ?? report.finalUrl ?? report.requestedUrl,
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    lcp: audits['largest-contentful-paint']?.displayValue ?? 'N/A',
    tbt: audits['total-blocking-time']?.displayValue ?? 'N/A',
    cls: audits['cumulative-layout-shift']?.displayValue ?? 'N/A',
    inp: audits['interaction-to-next-paint']?.displayValue ?? 'N/A',
  };
};

const runLighthouseForRoute = (routePath) => {
  const url = `${BASE_URL}${routePath}`;
  const outPath = path.join(OUTPUT_DIR, `${toSafeFileName(routePath)}.json`);
  const cmd = [
    'exec',
    'lighthouse',
    url,
    '--quiet',
    '--chrome-flags=--headless',
    '--output=json',
    `--output-path=${outPath}`,
  ];

  const result = spawnSync('pnpm', cmd, { stdio: 'pipe', encoding: 'utf8' });
  if (result.status !== 0) {
    return {
      route: routePath,
      url,
      success: false,
      error: result.stderr || result.stdout || 'Unknown lighthouse failure',
    };
  }

  return {
    route: routePath,
    url,
    success: true,
    ...parseResult(outPath),
  };
};

const writeSummary = (results) => {
  fs.mkdirSync(path.dirname(SUMMARY_JSON_PATH), { recursive: true });
  fs.writeFileSync(SUMMARY_JSON_PATH, JSON.stringify(results, null, 2));

  const lines = [];
  lines.push('# EN Pages Lighthouse Summary');
  lines.push('');
  lines.push(`- Base URL: ${BASE_URL}`);
  lines.push(`- Measured At: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(
    '| Route | Perf | A11y | BP | SEO | LCP | TBT | CLS | Final URL | Status |',
  );
  lines.push('|---|---:|---:|---:|---:|---|---|---|---|---|');

  for (const item of results) {
    if (!item.success) {
      lines.push(
        `| \`${item.route}\` | - | - | - | - | - | - | - | - | FAIL |`,
      );
      continue;
    }

    const redirected = item.finalUrl && !item.finalUrl.endsWith(item.route);
    lines.push(
      `| \`${item.route}\` | ${item.performance} | ${item.accessibility} | ${item.bestPractices} | ${item.seo} | ${item.lcp} | ${item.tbt} | ${item.cls} | \`${item.finalUrl}\` | ${redirected ? 'REDIRECTED' : 'OK'} |`,
    );
  }

  fs.writeFileSync(SUMMARY_MD_PATH, `${lines.join('\n')}\n`);
};

const main = () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const routes = readRoutes();
  const results = routes.map(runLighthouseForRoute);
  writeSummary(results);

  const successCount = results.filter((item) => item.success).length;
  const failCount = results.length - successCount;
  console.log(
    `[lighthouse-en-pages] completed: total=${results.length}, success=${successCount}, failed=${failCount}`,
  );
  console.log(`[lighthouse-en-pages] summary: ${path.relative(ROOT, SUMMARY_MD_PATH)}`);
};

main();
