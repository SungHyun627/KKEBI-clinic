import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const BASE_URL = process.env.LH_BASE_URL ?? 'http://127.0.0.1:4100';
const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, '.next', 'server', 'app-paths-manifest.json');
const OUTPUT_DIR = path.join(ROOT, '.lighthouse', 'en-pages-auth');
const SUMMARY_JSON_PATH = path.join(ROOT, '.lighthouse', 'en-pages-auth-summary.json');
const SUMMARY_MD_PATH = path.join(ROOT, '.lighthouse', 'en-pages-auth-summary.md');
const AUTH_PROFILE_DIR = path.join(ROOT, '.lighthouse', '.auth-profile');
const DEBUG_PORT = Number(process.env.LH_DEBUG_PORT ?? 9222);

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

const parseLighthouseResult = (report) => {
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

const prepareAuthenticatedSession = async (context) => {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/en/login`, { waitUntil: 'domcontentloaded' });

  const loginInfo = await page.evaluate(async () => {
    const unique = Date.now();
    const email = `lh-${unique}@example.com`;
    const payload = {
      name: `LH Tester ${unique}`,
      email,
      language: 'en',
    };

    const response = await fetch('/api/v1/counselor/test/register-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const body = await response.json().catch(() => null);
    const data =
      body && typeof body === 'object' && 'data' in body
        ? body.data
        : null;

    const loginEmail =
      data && typeof data === 'object' && 'loginEmail' in data && typeof data.loginEmail === 'string'
        ? data.loginEmail
        : email;
    const generatedPassword =
      data &&
      typeof data === 'object' &&
      'generatedPassword' in data &&
      typeof data.generatedPassword === 'string'
        ? data.generatedPassword
        : 'Password123!';

    localStorage.setItem(
      'kkebi-auth-session',
      JSON.stringify({
        email: loginEmail,
        password: generatedPassword,
        userName: loginEmail.split('@')[0] || 'Counselor',
        authenticated: true,
      }),
    );

    const refreshResponse = await fetch('/api/v1/counselor/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null);

    return {
      registerLoginOk: response.ok,
      refreshOk: Boolean(refreshResponse?.ok),
      refreshStatus: refreshResponse?.status ?? null,
      loginEmail,
    };
  });

  await page.close();
  return loginInfo;
};

const writeSummary = (results, authInfo) => {
  fs.mkdirSync(path.dirname(SUMMARY_JSON_PATH), { recursive: true });
  fs.writeFileSync(SUMMARY_JSON_PATH, JSON.stringify({ authInfo, results }, null, 2));

  const lines = [];
  lines.push('# EN Pages Lighthouse Summary (Authenticated)');
  lines.push('');
  lines.push(`- Base URL: ${BASE_URL}`);
  lines.push(`- Measured At: ${new Date().toISOString()}`);
  lines.push(
    `- Auth Prepared: ${authInfo.registerLoginOk && authInfo.refreshOk ? 'yes' : 'failed'}`,
  );
  lines.push(`- Login Email: ${authInfo.loginEmail}`);
  lines.push(`- register-login OK: ${String(authInfo.registerLoginOk)}`);
  lines.push(`- refresh OK: ${String(authInfo.refreshOk)} (status: ${String(authInfo.refreshStatus)})`);
  lines.push('');
  lines.push('| Route | Perf | A11y | BP | SEO | LCP | TBT | CLS | Final URL | Status |');
  lines.push('|---|---:|---:|---:|---:|---|---|---|---|---|');

  for (const item of results) {
    if (!item.success) {
      lines.push(`| \`${item.route}\` | - | - | - | - | - | - | - | - | FAIL |`);
      continue;
    }

    const redirected = item.finalUrl && !item.finalUrl.endsWith(item.route);
    lines.push(
      `| \`${item.route}\` | ${item.performance} | ${item.accessibility} | ${item.bestPractices} | ${item.seo} | ${item.lcp} | ${item.tbt} | ${item.cls} | \`${item.finalUrl}\` | ${redirected ? 'REDIRECTED' : 'OK'} |`,
    );
  }

  fs.writeFileSync(SUMMARY_MD_PATH, `${lines.join('\n')}\n`);
};

const main = async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const routes = readRoutes();
  fs.rmSync(AUTH_PROFILE_DIR, { recursive: true, force: true });
  const context = await chromium.launchPersistentContext(AUTH_PROFILE_DIR, {
    headless: true,
    args: [`--remote-debugging-port=${DEBUG_PORT}`],
  });

  try {
    const authInfo = await prepareAuthenticatedSession(context);

    const results = [];
    for (const route of routes) {
      const targetUrl = `${BASE_URL}${route}`;
      const outputPath = path.join(OUTPUT_DIR, `${toSafeFileName(route)}.json`);
      try {
        const runner = await lighthouse(targetUrl, {
          port: DEBUG_PORT,
          output: 'json',
          logLevel: 'error',
          disableStorageReset: true,
        });

        if (!runner?.report) {
          results.push({
            route,
            success: false,
            error: 'No report returned by lighthouse',
          });
          continue;
        }

        const report =
          typeof runner.report === 'string' ? JSON.parse(runner.report) : runner.report;
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        results.push({
          route,
          success: true,
          ...parseLighthouseResult(report),
        });
      } catch (error) {
        results.push({
          route,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    writeSummary(results, authInfo);
    const successCount = results.filter((item) => item.success).length;
    const failCount = results.length - successCount;
    console.log(
      `[lighthouse-en-pages-auth] completed: total=${results.length}, success=${successCount}, failed=${failCount}`,
    );
    console.log(
      `[lighthouse-en-pages-auth] summary: ${path.relative(ROOT, SUMMARY_MD_PATH)}`,
    );
  } finally {
    await context.close();
    fs.rmSync(AUTH_PROFILE_DIR, { recursive: true, force: true });
  }
};

void main();
