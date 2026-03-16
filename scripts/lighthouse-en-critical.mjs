import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const BASE_URL = process.env.LH_BASE_URL ?? 'http://127.0.0.1:4100';
const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, '.lighthouse', 'en-critical');
const SUMMARY_JSON_PATH = path.join(ROOT, '.lighthouse', 'en-critical-summary.json');
const SUMMARY_MD_PATH = path.join(ROOT, '.lighthouse', 'en-critical-summary.md');
const RUN_COUNT = Number(process.env.LH_RUN_COUNT ?? 3);
const ROUTES = (process.env.LH_CRITICAL_ROUTES
  ? process.env.LH_CRITICAL_ROUTES.split(',').map((value) => value.trim())
  : ['/en/login', '/en', '/en/clients', '/en/sessions', '/en/session/1/summary']
).filter(Boolean);

const toSafeFileName = (routePath) => {
  if (routePath === '/en') return 'en-root';
  return routePath
    .replace(/^\/+/, '')
    .replace(/\//g, '__')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
};

const median = (numbers) => {
  if (numbers.length === 0) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
};

const formatLcp = (value) => {
  if (value === null || Number.isNaN(value)) return 'N/A';
  return `${(value / 1000).toFixed(1)}s`;
};

const formatTbt = (value) => {
  if (value === null || Number.isNaN(value)) return 'N/A';
  return `${Math.round(value)}ms`;
};

const formatCls = (value) => {
  if (value === null || Number.isNaN(value)) return 'N/A';
  return value.toFixed(3);
};

const runLighthouse = (routePath, index) => {
  const url = `${BASE_URL}${routePath}`;
  const outPath = path.join(OUTPUT_DIR, `${toSafeFileName(routePath)}-run${index + 1}.json`);
  const cmd = [
    'exec',
    'lighthouse',
    url,
    '--quiet',
    '--chrome-flags=--headless',
    '--max-wait-for-load=45000',
    '--output=json',
    `--output-path=${outPath}`,
  ];

  const result = spawnSync('pnpm', cmd, {
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 75_000,
  });
  if (result.status !== 0) {
    return {
      route: routePath,
      run: index + 1,
      success: false,
      error: result.stderr || result.stdout || 'Unknown lighthouse failure',
    };
  }

  const report = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  return {
    route: routePath,
    run: index + 1,
    success: true,
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalDisplayedUrl ?? report.finalUrl ?? report.requestedUrl,
    performance: Math.round((report.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((report.categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((report.categories['best-practices']?.score ?? 0) * 100),
    seo: Math.round((report.categories.seo?.score ?? 0) * 100),
    lcpValue: report.audits['largest-contentful-paint']?.numericValue ?? null,
    tbtValue: report.audits['total-blocking-time']?.numericValue ?? null,
    clsValue: report.audits['cumulative-layout-shift']?.numericValue ?? null,
  };
};

const summarizeRoute = (route, runs) => {
  const successRuns = runs.filter((run) => run.success);
  if (successRuns.length === 0) {
    return {
      route,
      success: false,
      runCount: runs.length,
      successCount: 0,
      runs,
    };
  }

  const perfMedian = median(successRuns.map((run) => run.performance));
  const lcpMedian = median(successRuns.map((run) => run.lcpValue).filter((v) => typeof v === 'number'));
  const tbtMedian = median(successRuns.map((run) => run.tbtValue).filter((v) => typeof v === 'number'));
  const clsMedian = median(successRuns.map((run) => run.clsValue).filter((v) => typeof v === 'number'));
  const finalUrls = [...new Set(successRuns.map((run) => run.finalUrl))];

  return {
    route,
    success: true,
    runCount: runs.length,
    successCount: successRuns.length,
    performanceMedian: perfMedian,
    lcpMedianMs: lcpMedian,
    tbtMedianMs: tbtMedian,
    clsMedian,
    finalUrls,
    runs,
  };
};

const writeSummary = (summary) => {
  fs.mkdirSync(path.dirname(SUMMARY_JSON_PATH), { recursive: true });
  fs.writeFileSync(SUMMARY_JSON_PATH, JSON.stringify(summary, null, 2));

  const lines = [];
  lines.push('# EN Critical Routes Lighthouse Summary');
  lines.push('');
  lines.push(`- Base URL: ${BASE_URL}`);
  lines.push(`- Run Count: ${RUN_COUNT}`);
  lines.push(`- Measured At: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Route | Perf (median) | LCP (median) | TBT (median) | CLS (median) | Final URLs | Status |');
  lines.push('|---|---:|---|---|---|---|---|');

  for (const routeSummary of summary.routes) {
    if (!routeSummary.success) {
      lines.push(`| \`${routeSummary.route}\` | - | - | - | - | - | FAIL |`);
      continue;
    }

    const finalUrlText = routeSummary.finalUrls.map((url) => `\`${url}\``).join('<br/>');
    lines.push(
      `| \`${routeSummary.route}\` | ${routeSummary.performanceMedian} | ${formatLcp(routeSummary.lcpMedianMs)} | ${formatTbt(routeSummary.tbtMedianMs)} | ${formatCls(routeSummary.clsMedian)} | ${finalUrlText} | OK |`,
    );
  }

  fs.writeFileSync(SUMMARY_MD_PATH, `${lines.join('\n')}\n`);
};

const main = () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const routeRuns = ROUTES.map((route) =>
    Array.from({ length: RUN_COUNT }, (_, index) => runLighthouse(route, index)),
  );
  const routeSummaries = ROUTES.map((route, index) => summarizeRoute(route, routeRuns[index]));

  const summary = {
    baseUrl: BASE_URL,
    runCount: RUN_COUNT,
    measuredAt: new Date().toISOString(),
    routes: routeSummaries,
  };

  writeSummary(summary);

  const successCount = routeSummaries.filter((route) => route.success).length;
  console.log(
    `[lighthouse-en-critical] completed: routes=${routeSummaries.length}, success=${successCount}, failed=${routeSummaries.length - successCount}`,
  );
  console.log(`[lighthouse-en-critical] summary: ${path.relative(ROOT, SUMMARY_MD_PATH)}`);
};

main();
