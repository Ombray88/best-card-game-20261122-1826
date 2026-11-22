// Requires playwright-core installed (e.g. in /tmp/pwtool/node_modules)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

async function main() {
  mkdirSync(join(process.cwd(), 'screenshots'), { recursive: true });

  // Start local server
  const serverProc = spawn('node', ['serve.ts', '--port', '8090'], { cwd: process.cwd(), stdio: 'inherit' });
  await new Promise(resolve => setTimeout(resolve, 1500));

  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const shots = [
    { name: '1-title.jpg', query: '?shot=title&seed=1' },
    { name: '2-play.jpg', query: '?shot=play&seed=1' },
    { name: '3-win.jpg', query: '?shot=win&seed=1' },
    { name: '4-lose.jpg', query: '?shot=lose&seed=1' }
  ];

  for (const shot of shots) {
    const url = `http://localhost:8090/${shot.query}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__shotReady === true, { timeout: 5000 }).catch(() => {});
    await page.screenshot({
      path: join('screenshots', shot.name),
      type: 'jpeg',
      quality: 80
    });
    console.log(`Captured ${shot.name}`);
  }

  await browser.close();
  serverProc.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
