import puppeteer from '/opt/homebrew/lib/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/*
 * Enhanced screenshot helper.
 *   node shot.mjs <url> <label> [viewport] [full]
 *     viewport: "desktop" (1440x900, default) | "mobile" (390x844) | "WxH"
 *     full:     "full" to capture the full scrollable page
 *
 * Examples:
 *   node shot.mjs http://localhost:3001/project-june june desktop full
 *   node shot.mjs http://localhost:3001/project-june june mobile full
 */

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'temporary screenshots');
const url      = process.argv[2] || 'http://localhost:3001';
const label    = process.argv[3] || '';
const viewport = process.argv[4] || 'desktop';
const full     = (process.argv[5] || '') === 'full';

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const presets = {
  desktop: { width: 1440, height: 900, isMobile: false, deviceScaleFactor: 1 },
  mobile:  { width: 390,  height: 844, isMobile: true,  deviceScaleFactor: 2 },
};
let vp = presets[viewport];
if (!vp) {
  const m = viewport.match(/^(\d+)x(\d+)$/);
  vp = m ? { width: +m[1], height: +m[2], isMobile: false, deviceScaleFactor: 1 } : presets.desktop;
}

const existing = fs.readdirSync(DIR).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;

const tag = [label, viewport, full ? 'full' : ''].filter(Boolean).join('-');
const filename = tag ? `screenshot-${next}-${tag}.png` : `screenshot-${next}.png`;
const outPath  = path.join(DIR, filename);

const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();
await page.setViewport(vp);
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

// Scroll through the page so IntersectionObserver-driven [data-reveal]
// sections animate in and lazy images load, then return to the top.
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  await new Promise((resolve) => {
    let y = 0;
    const step = window.innerHeight * 0.8;
    const timer = setInterval(() => {
      window.scrollTo(0, y);
      y += step;
      if (y >= document.body.scrollHeight) { clearInterval(timer); resolve(); }
    }, 120);
  });
});
await new Promise(r => setTimeout(r, 600));
const scrollY = parseInt(process.env.SCROLLY || '0', 10);
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
// let entrance/reveal animations settle
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: outPath, fullPage: full });
await browser.close();

console.log(`Saved: temporary screenshots/${filename}`);
