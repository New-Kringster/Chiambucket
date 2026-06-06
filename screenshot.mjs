import puppeteer from '/opt/homebrew/lib/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'temporary screenshots');
const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

// Auto-increment screenshot number
const existing = fs.readdirSync(DIR).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath  = path.join(DIR, filename);

const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Saved: temporary screenshots/${filename}`);
