import puppeteer from '/opt/homebrew/lib/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import path from 'path';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const viewport = { width: parseInt(process.argv[4] || '1440'), height: parseInt(process.argv[5] || '900') };
const scrollY = parseInt(process.argv[6] || '0');

const dir = path.join(process.cwd(), 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.replace('screenshot-','').split(/[-\.]/)[0])).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = path.join(dir, filename);

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-features=CSSScrollDrivenAnimations',
    '--disable-web-animations',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--run-all-compositor-stages-before-draw',
    '--disable-gpu',
    '--disable-gpu-compositing',
    '--no-first-run',
    '--autoplay-policy=user-gesture-required',
  ],
  protocolTimeout: 120000,
});

const page = await browser.newPage();
await page.setViewport(viewport);

console.log(`Loading ${url}...`);
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

// Kill animations and pause videos via CSS + JS injection
await page.addStyleTag({ content: `
  *, *::before, *::after {
    animation: none !important;
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition: none !important;
    animation-timeline: auto !important;
  }
  .abm-grid-items-bg, [data-reveal], .portfolio-items2, .pf-hidden-content,
  .index-section-holder > *, .hero-holder > *, .aboutme-section > * {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }
` });

await page.evaluate((sy) => {
  document.querySelectorAll('video').forEach(v => {
    try { v.pause(); v.currentTime = 0; } catch(e) {}
  });
  if (sy > 0) window.scrollTo(0, sy);
}, scrollY);

// Small wait for layout to settle
await new Promise(r => setTimeout(r, 500));

console.log(`Taking screenshot ${next}...`);
await page.screenshot({ path: outPath, fullPage: false });

await browser.close();
console.log(`Saved: ${filename}`);
